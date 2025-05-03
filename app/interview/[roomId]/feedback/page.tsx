// app/interview/[roomId]/feedback/page.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { useParams }               from 'next/navigation'
import { createClient }            from '@/utils/supabase/client'

// --- A tiny Circular Progress component ---
function CircularProgress({
  label,
  value,
}: {
  label: string
  value: number
}) {
  const radius = 36
  const stroke = 6
  const normalizedRadius = radius - stroke * 2
  const circumference = normalizedRadius * 2 * Math.PI
  const dashOffset = circumference - (value / 10) * circumference

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg height={radius * 2} width={radius * 2}>
          {/* background circle */}
          <circle
            stroke="currentColor"
            className="text-gray-200 dark:text-gray-700"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* foreground progress */}
          <circle
            stroke="currentColor"
            className="text-indigo-500"
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={dashOffset}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        {/* center number */}
        <div className="absolute inset-0 flex items-center justify-center font-mono text-lg">
          {value}
        </div>
      </div>
      <div className="mt-2 text-sm text-center capitalize">{label}</div>
    </div>
  )
}

export default function FeedbackPage() {
  const { roomId } = useParams()
  const [feedback, setFeedback] = useState<{
    ratings: Record<string, number>
    improvements: string
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from('interview_feedback')
        .select('ratings,improvements')
        .eq('interview_id', roomId)
        .single()

      if (error) {
        console.error('Error fetching feedback:', error)
      } else {
        setFeedback(data)
      }
      setLoading(false)
    })()
  }, [roomId])

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">Loading feedback…</div>
    )
  }

  if (!feedback) {
    return (
      <div className="p-6 text-center text-red-600">
        No feedback found.
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold animate-fadeIn">
        Interview Feedback
      </h1>

      {/* Ratings grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {Object.entries(feedback.ratings).map(([key, val]) => (
          <div
            key={key}
            className="
              bg-white dark:bg-gray-800
              border border-gray-200 dark:border-gray-700
              rounded-lg p-4
              shadow-lg
              animate-fadeIn
            "
          >
            <CircularProgress label={key} value={val} />
          </div>
        ))}
      </div>

      {/* Suggestions / Improvements */}
      <div
        className="
          bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
          rounded-lg p-6
          shadow-lg
          animate-fadeIn
        "
      >
        <h2 className="text-2xl font-semibold mb-2">
          Suggestions
        </h2>
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
          {feedback.improvements}
        </p>
      </div>
    </div>
  )
}
