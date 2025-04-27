// // app/interview/[roomId]/page.tsx
// 'use client'

// import React, { useEffect, useState } from 'react'
// import { useParams, useSearchParams } from 'next/navigation'
// import axios from 'axios'
// import ReactMarkdown from 'react-markdown'
// import MonacoEditor from '@monaco-editor/react'
// import { Button } from '@/components/ui/button'
// import QuestionDisplay from '@/components/QuestionDisplay'
// import Agent from '@/components/Agent'

// interface Question {
//   title:     string
//   body_md:   string
//   boilercode:string
// }

// export default function InterviewRoomPage() {
//   const { roomId }        = useParams()!
//   const questionId        = useSearchParams().get('questionId')!
//   const [question, setQuestion] = useState<Question | null>(null)
//   const [loading, setLoading]   = useState<boolean>(true)

//   useEffect(() => {
//     async function loadQuestion() {
//       try {
//         const { data } = await axios.get<Question>(`/api/interview/${roomId}`)
//         setQuestion(data)
//       } catch (err) {
//         console.error(err)
//       } finally {
//         setLoading(false)
//       }
//     }
//     loadQuestion()
//   }, [roomId])

//   if (loading) return <p className="p-4">Loading question…</p>
//   if (!question) return <p className="p-4 text-red-600">Question not found.</p>

//   return (
//     <div className="flex flex-col h-screen">
//       <header className="p-4 border-b bg-white">
//         <h1 className="text-2xl font-bold">{question.title}</h1>
//       </header>
//       <main className="flex-1 overflow-auto p-6 space-y-6 bg-gray-50">
//         <div className="prose max-w-none">
//           <QuestionDisplay markdown={question.body_md}/>
//         </div>
//         <div>
//           <MonacoEditor
//             height="300px"
//             defaultLanguage="cpp"
//             defaultValue={question.boilercode}
//             options={{ automaticLayout: true }}
//           />
//         </div>
//         <div className="text-right">
//           <Button onClick={() => alert('Submit handler coming next!')}>
//             Submit Code
//           </Button>
//         </div>
//       </main>
//       <Agent question={question}/>
//     </div>
//   )
// }
// app/interview/[roomId]/page.tsx
'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import MonacoEditor from '@monaco-editor/react'
import Agent from '@/components/Agent'

interface Question {
  title:     string
  body_md:   string
  boilercode:string
}

export default function InterviewRoomPage() {
  const { roomId }        = useParams()!
  const questionId        = useSearchParams().get('questionId')!
  const [question, setQuestion] = useState<Question | null>(null)
  const [loading, setLoading]   = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Load question
  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await axios.get<Question>(`/api/interview/${roomId}`)
        setQuestion(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    })()
  }, [roomId])

  // Start local camera preview
  useEffect(() => {
    let stream: MediaStream | null = null

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user' },
          audio: false 
        })
        streamRef.current = stream
        
        const video = videoRef.current
        if (video) {
          video.srcObject = stream
          await video.play()
        }
      } catch (error) {
        console.error('Error accessing camera:', error)
      }
    }

    startCamera()

    // Cleanup function
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  if (loading) return <div className="p-6">Loading…</div>
  if (!question) return <div className="p-6 text-red-600">Question not found.</div>

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left: Question & Editor (75%) */}
      <div className="w-3/4 flex flex-col divide-y divide-gray-200 overflow-hidden">
        {/* Question Preview */}
        <div className="flex-1 overflow-auto bg-white p-6">
          <h2 className="text-xl font-semibold mb-4">Question</h2>
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown>{question.body_md}</ReactMarkdown>
          </div>
        </div>
        {/* Code Editor */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white p-6">
          <h2 className="text-xl font-semibold mb-4">Solution</h2>
          <div className="flex-1">
            <MonacoEditor
              height="100%"
              defaultLanguage="cpp"
              defaultValue={question.boilercode}
              options={{ automaticLayout: true, minimap: { enabled: false } }}
              theme='vs-dark'
            />
          </div>
        </div>
      </div>

      {/* Right: Video & AI Assistant (25%) */}
      <div className="w-1/4 flex flex-col divide-y divide-gray-200 overflow-hidden">
        {/* User Video */}
        <div className="flex-1 bg-black">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-full h-full object-cover"
          />
        </div>
        {/* AI Assistant */}
        <div className="flex-1 bg-white p-6">
          <Agent question={question} />
        </div>
      </div>
    </div>
  )
}
