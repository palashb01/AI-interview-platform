'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import MonacoEditor from '@monaco-editor/react'
import QuestionDisplay from '@/components/QuestionDisplay'
import {Agent} from '@/components/Agent'
import { Button } from '@/components/ui/button'
import { sanitize } from '@/lib/utils'
import { useTheme } from '@/components/ThemeProvider'
import { ThemeToggle } from '@/components/ThemeToggle'

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
  const { theme, toggleTheme } = useTheme()
  const agentRef = useRef<{
    startCall: () => void
    endCall: () => void
  }>(null)
  const router     = useRouter()

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get('/api/interview/status', {
          params: { roomId },
        })
        if (data.finished) {
          // replace so Back button doesn’t return here
          router.replace(`/interview/${roomId}/feedback`)
        }
      } catch (err) {
        console.error(err)
        // if error, just let them in or redirect to 404
      } finally {
        setLoading(false)
      }
    })()
  }, [roomId, router])

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
    const id = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(id)
  }, [])
  const timer = `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`
  // --- Editor ---
  const [editorContent, setEditorContent] = useState<string>(question?.boilercode || '')
  const [submitCount, setSubmitCount]     = useState(0)

  // reset editor default once question arrives
  useEffect(() => {
    if (question) {
      setEditorContent(question.boilercode)
    }
  }, [question])

  const [interviewActive, setInterviewActive] = useState(false)

  return (
    <div className="flex flex-col h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      {/* TopBar */}
      <div className="
        m-3 mb-0 flex items-center justify-between
        bg-white dark:bg-gray-800
        border border-gray-200 dark:border-gray-700
        rounded-t-lg px-6 py-3
      ">
        {/* ← Left: Company – Interview */}
        <h1 className="text-xl font-semibold tracking-wide">
          {question?.company_id.toUpperCase() || ''} – Interview
        </h1>

        {/* → Right: Theme, Timer, End Call */}
        <div className="flex items-center gap-4">
          {/* theme toggle */}
          <ThemeToggle/>
          {/* timer */}
          <div className="text-lg font-mono">{timer}</div>

          {/* end call */}
          {interviewActive && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => agentRef.current?.endCall()}
            >
              End Call
            </Button>
          )}
        </div>
      </div>


      {/* Main Content */}
      <div className="flex flex-1 gap-6 p-6 overflow-hidden">
        {/* ───────── Left Panel ───────── */}
        <div className="relative flex flex-col flex-1 gap-4 min-h-0">
          
          {/* Overlay until interviewActive */}
          {!interviewActive && (
            <div className="
            absolute inset-0 z-20
            bg-white/100 dark:bg-gray-900/100
            flex flex-col items-center justify-center
            rounded-lg
          ">
              <p className="mb-4 text-lg font-medium text-gray-700 dark:text-gray-300">
                Start the AI call to unlock the question & editor
              </p>
              <Button onClick={() => agentRef.current?.startCall()}>
                Start Call
              </Button>
            </div>
          )}

          {/* Question Card */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 h-1/3 overflow-auto">
          {loading ? (
              <p className="text-gray-500 dark:text-gray-400">Loading question…</p>
            ) : error ? (
              <p className="text-red-600 dark:text-red-400">{error}</p>
            ) : (
              <QuestionDisplay markdown={question?.body_md} />
            )}
          </div>

          {/* Code Editor Card */}
          <div className="flex flex-col flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 overflow-hidden min-h-0">
            {!loading && !error && question && (
              <MonacoEditor
                height="100%"
                defaultLanguage="cpp"
                defaultValue={question.boilercode}
                value={editorContent}
                onChange={v => setEditorContent(v || '')}
                options={{ automaticLayout: true, minimap: { enabled: false } }}
                theme={theme === 'light' ? 'light' : 'vs-dark'}
              />
            )}
            <div className="mt-4 flex justify-end">
              <Button onClick={() => setSubmitCount(c => c+1)}>
                Submit Code
              </Button>
            </div>
          </div>
        </div>

        {/* ───────── Right Panel ───────── */}
        <div className="w-1/4 flex flex-col gap-4 min-h-0">
          {/* Camera Card */}
          <div className="
              flex-1 flex items-center justify-center
              bg-white dark:bg-gray-800
              border border-gray-200 dark:border-gray-700
              rounded-lg p-2
            ">
            <video
              ref={videoRef}
              className="
                w-full h-full object-cover rounded-md
                border border-gray-300 dark:border-gray-600
              "
              autoPlay muted playsInline
            />
          </div>

          {/* AI Assistant Card */}
          <div className="
              flex-1
              bg-white dark:bg-gray-800
              border border-gray-200 dark:border-gray-700
              rounded-lg p-4 overflow-auto
              content-center
            ">
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
  )
}
