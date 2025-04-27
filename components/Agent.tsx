// import React, { useEffect, useState } from 'react'
// import { interviewer, vapi } from '@/utils/vapi/vapi.sdk'
// import Image from 'next/image'
// import { cn, sanitize } from '@/lib/utils'

// enum CallStatus {
//     INACTIVE = "INACTIVE",
//     CONNECTING = "CONNECTING",
//     ACTIVE = "ACTIVE",
//     FINISHED = "FINISHED",
// }

// interface SavedMessage {
//     role: "user" | "system" | "assistant";
//     content: string;
// }

// interface Question {
//     title:     string
//     body_md:   string
//     boilercode:string
// }

// const Agent = ({question}:{question:Question}) => {
//   const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
//   const [messages, setMessages] = useState<SavedMessage[]>([]);
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const [lastMessage, setLastMessage] = useState<string>("");

//   useEffect(()=>{
//     const onCallStart = () => {
//         setCallStatus(CallStatus.ACTIVE);
//     };
  
//     const onCallEnd = () => {
//         setCallStatus(CallStatus.FINISHED);
//     };

//     const onMessage = (message: Message) => {
//         if (message.type === "transcript" && message.transcriptType === "final") {
//           const newMessage = { role: message.role, content: message.transcript };
//           setMessages((prev) => [...prev, newMessage]);
//         }
//       };
  
//       const onSpeechStart = () => {
//         console.log("speech start");
//         setIsSpeaking(true);
//       };
  
//       const onSpeechEnd = () => {
//         console.log("speech end");
//         setIsSpeaking(false);
//       };
  
//       const onError = (error: Error) => {
//         console.log("Error:", error);
//       };
  
//       vapi.on("call-start", onCallStart);
//       vapi.on("call-end", onCallEnd);
//       vapi.on("message", onMessage);
//       vapi.on("speech-start", onSpeechStart);
//       vapi.on("speech-end", onSpeechEnd);
//       vapi.on("error", onError);
  
//       return () => {
//         vapi.off("call-start", onCallStart);
//         vapi.off("call-end", onCallEnd);
//         vapi.off("message", onMessage);
//         vapi.off("speech-start", onSpeechStart);
//         vapi.off("speech-end", onSpeechEnd);
//         vapi.off("error", onError);
//       };
//     }, []);

//     useEffect(()=>{
//         if(messages.length>0){
//             setLastMessage(messages[(messages.length-1)].content);
//         }

//         if(callStatus===CallStatus.FINISHED){
//             console.log({"The messages":messages});
//             console.log("The call has been ended");
//         }
//     },[messages,callStatus])

//     const handleDisconnect = () => {
//         setCallStatus(CallStatus.FINISHED);
//         vapi.stop();
//     };

//     const handleCall = async () => {
//       console.log(question);
//       setCallStatus(CallStatus.CONNECTING)
  
//       const cleanQuestion   = sanitize(question.body_md)
//       const cleanBoilerCode = sanitize(question.boilercode)
//       console.log("cleanQuestion", cleanQuestion)
//       console.log("cleanBoilerCode", cleanBoilerCode)
//       if(question){
//         await vapi.start(interviewer, {
//           variableValues: {
//             title:      question.title,
//             question:   cleanQuestion,
//             boilercode: cleanBoilerCode,
//           },
//         })
//       }
//     }

//     return (
//         <>
//           <div className="call-view">
//             {/* AI Interviewer Card */}
//             <div className="card-interviewer">
//               <div className="avatar">
//                 <Image
//                   src="https://picsum.photos/200"
//                   alt="AI Avatar"
//                   width={65}
//                   height={65}
//                   className="object-cover rounded-full"
//                 />
//                 {isSpeaking && <span className="animate-speak" />}
//               </div>
//               <h3>AI Interviewer</h3>
//             </div>
    
//             {/* User Profile Card */}
//             <div className="card-border">
//               <div className="card-content">
//                 <Image
//                   src="https://picsum.photos/200"
//                   alt="User Avatar"
//                   width={120}
//                   height={120}
//                   className="object-cover rounded-full"
//                 />
//                 <h3>You</h3>
//               </div>
//             </div>
//           </div>
    
//           {/* Transcript Preview */}
//           {messages.length > 0 && (
//             <div className="transcript-border">
//               <div className="transcript">
//                 <p
//                   key={lastMessage}
//                   className={cn(
//                     'transition-opacity duration-500 opacity-0',
//                     'animate-fadeIn opacity-100'
//                   )}
//                 >
//                   {lastMessage}
//                 </p>
//               </div>
//             </div>
//           )}
    
//           {/* Call / End Button */}
//           <div className="w-full flex justify-center mt-6">
//             {callStatus !== CallStatus.ACTIVE ? (
//               <button className="relative btn-call" onClick={handleCall}>
//                 <span
//                   className={cn(
//                     'absolute animate-ping rounded-full opacity-75',
//                     callStatus !== CallStatus.CONNECTING && 'hidden'
//                   )}
//                 />
//                 <span className="relative">
//                   {callStatus === CallStatus.INACTIVE ||
//                   callStatus === CallStatus.FINISHED
//                     ? 'Call'
//                     : 'Connecting...'}
//                 </span>
//               </button>
//             ) : (
//               <button className="btn-disconnect" onClick={handleDisconnect}>
//                 End
//               </button>
//             )}
//           </div>
//         </>
//       )
// }

// export default Agent

// components/Agent.tsx
'use client'

import React, { useEffect, useState } from 'react'
import Image            from 'next/image'
import { Button }       from '@/components/ui/button'
import { cn, sanitize } from '@/lib/utils'
import { interviewer, vapi } from '@/utils/vapi/vapi.sdk'

enum CallStatus {
  INACTIVE   = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE     = 'ACTIVE',
  FINISHED   = 'FINISHED',
}

interface Question {
  title:     string
  body_md:   string
  boilercode:string
}

interface AgentProps {
  question: Question
}

export default function Agent({ question }: AgentProps) {
  const [callStatus, setCallStatus]   = useState<CallStatus>(CallStatus.INACTIVE)
  const [isSpeaking, setIsSpeaking]   = useState(false)

  useEffect(() => {
    vapi.on('call-start',   () => setCallStatus(CallStatus.ACTIVE))
    vapi.on('call-end',     () => setCallStatus(CallStatus.FINISHED))
    vapi.on('speech-start', () => setIsSpeaking(true))
    vapi.on('speech-end',   () => setIsSpeaking(false))
    return () => vapi.stop()
  }, [])

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING)
    const payload = {
      title:      sanitize(question.title),
      question:   sanitize(question.body_md),
      boilercode: sanitize(question.boilercode),
    }
    await vapi.start(interviewer, { variableValues: payload })
  }

  const handleEnd = () => {
    vapi.stop()
    setCallStatus(CallStatus.FINISHED)
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Image
          src="https://picsum.photos/seed/ai/200"
          width={100}
          height={100}
          alt="AI Assistant"
          className="rounded-full"
          unoptimized
        />
        {isSpeaking && (
          <span
            className={cn(
              'absolute inset-0 rounded-full ring-2 ring-blue-400 animate-ping'
            )}
          />
        )}
      </div>
      <Button
        variant={callStatus === CallStatus.ACTIVE ? 'destructive' : 'outline'}
        onClick={
          callStatus === CallStatus.ACTIVE ? handleEnd : handleCall
        }
        disabled={callStatus === CallStatus.CONNECTING}
      >
        {callStatus === CallStatus.CONNECTING
          ? 'Connecting…'
          : callStatus === CallStatus.ACTIVE
          ? 'End'
          : 'Call'}
      </Button>
    </div>
  )
}
