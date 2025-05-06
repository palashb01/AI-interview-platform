"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Agent } from "@/components/Agent";
import { sanitize } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";
import { TopBar } from "@/components/interview/TopBar";
import { QuestionCard } from "@/components/interview/QuestionCard";
import { CodeEditorCard } from "@/components/interview/CodeEditorCard";
import { CameraCard } from "@/components/interview/CameraCard";
import { StartCallOverlay } from "@/components/interview/StartCallOverlay";
import { LoadingOverlay } from "@/components/interview/LoadingOverlay";

interface Question {
  title: string;
  body_md: string;
  boilercode: string;
  company_id: string;
}

export default function InterviewRoomPage() {
  const { roomId } = useParams()!;
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [interviewActive, setInterviewActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const { theme } = useTheme();
  const agentRef = useRef<{
    startCall: () => void;
    endCall: () => void;
  }>(null);
  const router = useRouter();

  // --- Status check ---
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("/api/interview/status", {
          params: { roomId },
        });
        if (data.finished) {
          router.replace(`/interview/${roomId}/feedback`);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [roomId, router]);

  // --- Fetch question ---
  useEffect(() => {
    axios
      .get<Question>(`/api/interview/${roomId}`)
      .then((r) => setQuestion(r.data))
      .catch((e) => {
        console.error("Failed to load question:", e);
        setError("Could not load question.");
      })
      .finally(() => setLoading(false));
  }, [roomId]);

  // --- Camera setup ---
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        if (!mounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.muted = true;
          videoRef.current.playsInline = true;
          videoRef.current.addEventListener(
            "loadedmetadata",
            () => {
              videoRef.current!.play().catch(() => {
                videoRef.current!.muted = true;
                videoRef.current!.play().catch(console.error);
              });
            },
            { once: true }
          );
        }
      } catch (e) {
        console.error("Error accessing camera:", e);
      }
    })();

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, []);

  // --- Timer ---
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!interviewActive) return;
    setSeconds(0);

    const id = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(id);
  }, [interviewActive]);

  useEffect(() => {
    if (seconds >= 2400 && interviewActive) {
      agentRef.current?.endCall();
    }
  }, [seconds, interviewActive]);

  const timer = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  // --- Editor state ---
  const [editorContent, setEditorContent] = useState<string>(question?.boilercode || "");
  const [submitCount, setSubmitCount] = useState(0);

  useEffect(() => {
    if (question) {
      setEditorContent(question.boilercode);
    }
  }, [question]);

  const handleStartCall = async () => {
    setIsConnecting(true);
    try {
      await agentRef.current?.startCall();
    } finally {
      setIsConnecting(false);
    }
  };

  const handleEndCall = async () => {
    setIsGeneratingFeedback(true);
    try {
      await agentRef.current?.endCall();
    } catch (error) {
      console.error("Error ending call:", error);
      setIsGeneratingFeedback(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <LoadingOverlay
        message={
          isConnecting ? "Connecting to AI Interviewer..." : "Generating Interview Feedback..."
        }
        isVisible={isConnecting || isGeneratingFeedback}
      />

      <TopBar
        companyId={question?.company_id || ""}
        timer={timer}
        interviewActive={interviewActive}
        onEndCall={handleEndCall}
        isGeneratingFeedback={isGeneratingFeedback}
      />

      <div className="flex flex-1 gap-6 p-6 overflow-hidden">
        <div className="relative flex flex-col flex-1 gap-4 min-h-0">
          {!interviewActive && (
            <StartCallOverlay onStartCall={handleStartCall} isLoading={isConnecting} />
          )}

          <QuestionCard loading={loading} error={error} question={question} />

          <CodeEditorCard
            loading={loading}
            error={error}
            question={question}
            editorContent={editorContent}
            onEditorChange={(v) => setEditorContent(v || "")}
            onSubmit={() => setSubmitCount((c) => c + 1)}
            theme={theme}
          />
        </div>

        <div className="w-1/4 flex flex-col gap-4 min-h-0">
          <CameraCard videoRef={videoRef} />

          <div className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 overflow-auto content-center">
            <Agent
              ref={agentRef}
              question={question}
              code={sanitize(editorContent)}
              submitCount={submitCount}
              onStarted={() => setInterviewActive(true)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
