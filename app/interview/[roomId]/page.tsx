'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import MonacoEditor from '@monaco-editor/react'
import QuestionDisplay from '@/components/QuestionDisplay'
import Agent from '@/components/Agent'
import { Button } from '@/components/ui/button'
import { sanitize } from '@/lib/utils'

interface Question {
  title:     string
  body_md:   string
  boilercode:string
  company_id:   string
}

export default function InterviewRoomPage() {
  const { roomId } = useParams()!
  const [question, setQuestion] = useState<Question | null>(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)

  // --- Fetch question once ---
  useEffect(() => {
    axios.get<Question>(`/api/interview/${roomId}`)
      .then(r => setQuestion(r.data))
      .catch((e) => {
        console.error('Failed to load question:', e)
        setError('Could not load question.')
      })
      .finally(() => setLoading(false))
  }, [roomId])

  // --- Local camera setup ---
  const videoRef  = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      // stop any prior stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop())
        streamRef.current = null
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' }, audio: false
        })
        if (!mounted) {
          stream.getTracks().forEach(t => t.stop())
          return
        }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.muted = true
          videoRef.current.playsInline = true
          // attempt playback once ready
          videoRef.current.addEventListener(
            'loadedmetadata',
            () => {
              videoRef.current!
                .play()
                .catch(() => {
                  videoRef.current!.muted = true
                  videoRef.current!.play().catch(console.error)
                })
            },
            { once: true }
          )
        }
      } catch (e) {
        console.error('Error accessing camera:', e)
      }
    })()

    return () => {
      mounted = false
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop())
        streamRef.current = null
      }
    }
  }, [])

  // --- Timer (mm:ss) ---
  const [seconds, setSeconds] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [])
  const mins = String(Math.floor(seconds / 60)).padStart(2, '0')
  const secs = String(seconds % 60).padStart(2, '0')
  const timer = `${mins}:${secs}`

  // --- Editor ---
  const [editorContent, setEditorContent] = useState<string>(question?.boilercode || '')
  const [submitCount, setSubmitCount]     = useState(0)

  // reset editor default once question arrives
  useEffect(() => {
    if (question) {
      setEditorContent(question.boilercode)
    }
  }, [question])

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="rounded-t-lg bg-white shadow flex items-center justify-between px-6 py-3 m-3 mb-0 text-black">
        <h1 className="text-xl font-semibold">{question?.company_id?.toUpperCase()} – Interview</h1>
        <div className="text-lg font-mono">{timer}</div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden gap-6 p-6">
        {/* Left Panel */}
        <div className="flex flex-col flex-1 overflow-hidden gap-4">
          {/* Question Card */}
          <div className="bg-white text-black rounded-lg shadow p-4 h-1/3 overflow-auto">
            {loading ? (
              <p>Loading question…</p>
            ) : error ? (
              <p className="text-red-600">{error}</p>
            ) : (
              <QuestionDisplay markdown={question!.body_md} />
            )}
          </div>
          {/* Code Editor Card */}
          <div className="bg-white rounded-lg shadow p-4 flex-1 overflow-auto flex flex-col">
            {!loading && !error && (
              <MonacoEditor
                height="100%"
                defaultLanguage="cpp"
                defaultValue={question!.boilercode}
                value={editorContent}
                onChange={(v) => setEditorContent(v || '')}
                options={{
                  automaticLayout: true,
                  minimap: { enabled: false },
                }}
                theme="vs-dark"
              />
            )}
            <div className="mt-4 text-right">
              <Button onClick={() => {
                    // bump the counter to let Agent know we submitted
                    setSubmitCount((c) => c + 1)
                  }}>
                Submit Code
              </Button>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-1/4 flex flex-col overflow-hidden gap-4">
          {/* Candidate Camera Card */}
          <div className="bg-white rounded-lg shadow flex-1 overflow-hidden flex items-center justify-center p-4">
            <video
              ref={videoRef}
              className="w-full h-full object-cover rounded-lg"
              autoPlay
              muted
              playsInline
            />
          </div>
          {/* AI Assistant Card */}
          <div className="bg-white rounded-lg shadow p-4 flex-1 overflow-auto content-center">
            <Agent question={question} code={sanitize(editorContent)} submitCount={submitCount}/>
          </div>
        </div>
      </div>
    </div>
  )
}
