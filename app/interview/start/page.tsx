// app/interview/start/page.tsx
'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input }  from '@/components/ui/input'
import { Label }  from '@/components/ui/label'
import { companies } from '@/lib/companies'

export default function StartInterviewPage() {
  const router = useRouter()
  const [companyId, setCompanyId]   = useState<string>('')
  const [experience, setExperience] = useState<string>('')
  const [loading, setLoading]       = useState<boolean>(false)

  const handleStart = async () => {
    if (!companyId || !experience) return
    setLoading(true)
    try {
      const { data } = await axios.post('/api/interview/start', {
        companyId,
        experience,
      })
      const { interviewId } = data
      router.push(`/interview/${interviewId}`)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow">
        <h2 className="text-2xl font-semibold">Start Interview</h2>

        <div className="space-y-1">
          <Label htmlFor="company">Company</Label>
          <select
            id="company"
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="" disabled>
              Select a company
            </option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="experience">Experience</Label>
          <Input
            id="experience"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            placeholder="e.g. 3 years"
          />
        </div>

        <Button
          onClick={handleStart}
          disabled={!companyId || !experience || loading}
          className="w-full"
        >
          {loading ? 'Starting…' : 'Start Interview'}
        </Button>
      </div>
    </div>
  )
}
