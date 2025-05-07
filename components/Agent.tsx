"use client";

import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import Image from "next/image";
import { sanitize } from "@/lib/utils";
import { interviewer, vapi } from "@/utils/vapi/vapi.sdk";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { CallStatus } from "@/types/index";
import { motion, AnimatePresence } from "framer-motion";

interface Question {
  title: string;
  body_md: string;
  boilercode: string;
  company_id: string;
}

interface AgentProps {
  question: Question | null;
  code: string;
  submitCount: number;
  onStarted?: () => void;
  onGeneratingFeedback?: () => void;
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

export const Agent = forwardRef(function Agent(
  { question, code, submitCount, onStarted, onGeneratingFeedback }: AgentProps,
  ref: React.Ref<{ startCall: () => void; endCall: () => void }>
) {
  const { roomId } = useParams();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const router = useRouter();

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
      if (onStarted) onStarted();
    };

    const onCallEnd = () => {
      console.log(messages);
      setCallStatus(CallStatus.FINISHED);
      localStorage.setItem(`interview-${roomId}-completed`, "true");
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
        console.log("Message received:", newMessage);
        // Check if the message contains the ending phrase
        if (
          message.role === "assistant" &&
          message.transcript.includes("have a great day ahead.")
        ) {
          console.log("inside the end call trial");
          handleEnd();
        }
      }
    };

    const onSpeechStart = () => {
      console.log("speech start");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.log("Error:", error);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);
    if (!question) return;
    const payload = {
      title: sanitize(question.title),
      question: sanitize(question.body_md),
      boilercode: sanitize(question.boilercode),
      companyId: sanitize(question.company_id),
    };
    await vapi.start(interviewer, { variableValues: payload });
  };

  const handleEnd = () => {
    console.log("Ending call called handleEnd");
    vapi.stop();
    setCallStatus(CallStatus.FINISHED);
    if (onGeneratingFeedback) {
      onGeneratingFeedback();
    }
  };

  useEffect(() => {
    if (submitCount === 0) return;
    if (callStatus !== CallStatus.ACTIVE) {
      console.warn("Tried to submit code before starting call");
      return;
    }
    if (!question) return;

    (async () => {
      try {
        // 1️⃣ Call your Gemini‐check endpoint
        console.log("code", code);
        const res = await fetch("/api/gemini/code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: question.body_md,
            code,
          }),
        });
        const { correct, mistake } = await res.json();

        // 2️⃣ Build the assistant's response
        const reply = correct
          ? "Your solution looks correct! Great job. End the call after this."
          : `There's an issue: ${mistake}`;

        console.log("The reply is: ", reply);
        console.log("correct:", correct, "mistake:", mistake);
        // 3️⃣ Send it into the Vapi audio stream
        vapi.send({
          type: "add-message",
          message: {
            role: "system",
            content: reply,
          },
        });
      } catch (err) {
        console.error("Error running code check:", err);
        vapi.send({
          type: "add-message",
          message: {
            role: "system",
            content: "Sorry, something went wrong checking your code.",
          },
        });
      }
    })();
  }, [submitCount]);

  useEffect(() => {
    if (callStatus !== CallStatus.FINISHED) return;

    (async () => {
      try {
        const res = await fetch("/api/gemini/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            interviewId: roomId,
            question: sanitize(question!.body_md),
            code,
            messages,
          }),
        });
        if (!res.ok) throw new Error(await res.text());
        const { ratings, improvements } = await res.json();
        console.log("Feedback:", { ratings, improvements });
        // optionally read the JSON if you need it:
        // const feedback = await res.json()
        // now send the user to /interview/[id]/feedback
        router.push(`/interview/${roomId}/feedback`);
      } catch (err) {
        console.error("Feedback API error:", err);
        // Even on error, you might still navigate:
        router.push(`/interview/${roomId}/feedback?error=true`);
      }
    })();
  }, [callStatus]);

  useImperativeHandle(
    ref,
    () => ({
      startCall: handleCall,
      endCall: handleEnd,
    }),
    [question]
  );

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Image
          src="/assets/images/interviewer.jpeg"
          width={100}
          height={100}
          alt="AI Assistant"
          className="rounded-full"
        />
        <AnimatePresence>
          {isSpeaking && (
            <>
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 0.5 }}
                exit={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 rounded-full ring-2 ring-indigo-500"
              />
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.4, opacity: 0.3 }}
                exit={{ scale: 1.7, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                className="absolute inset-0 rounded-full ring-2 ring-indigo-400"
              />
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.6, opacity: 0.1 }}
                exit={{ scale: 1.9, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 1 }}
                className="absolute inset-0 rounded-full ring-2 ring-indigo-300"
              />
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});
