// app/page.tsx

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl w-full text-center space-y-8">
        <h1 className="text-5xl font-extrabold leading-tight">
          AI Voice & Video Coding Interviews
        </h1>
        <p className="text-lg text-gray-600">
          Practice your coding skills with live voice/video and get instant AI-driven feedback on your approach and code.
        </p>
        <Button asChild className="px-8 py-4 text-lg">
          <Link href="/interview/start">🛫 Start Interview</Link>
        </Button>
      </div>
    </div>
  )
}
