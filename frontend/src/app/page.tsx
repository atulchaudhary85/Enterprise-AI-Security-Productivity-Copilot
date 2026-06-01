'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Enterprise AI Copilot</h1>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h2 className="text-5xl font-bold text-white mb-6">
          AI-Powered Enterprise Solutions
        </h2>
        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
          Upload documents, review code, analyze meetings, and manage tasks with AI intelligence
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/signup">
            <Button className="text-lg px-8 py-6">Get Started</Button>
          </Link>
          <Button variant="outline" className="text-lg px-8 py-6">Learn More</Button>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { title: 'Document Intelligence', desc: 'Upload & analyze with RAG' },
          { title: 'Code Security', desc: 'Detect vulnerabilities' },
          { title: 'Meeting Analysis', desc: 'Extract actionable items' },
          { title: 'Task Management', desc: 'Track team productivity' },
        ].map((feature, idx) => (
          <Card key={idx} className="bg-gray-800 border border-gray-700 text-center">
            <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
            <p className="text-gray-400">{feature.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
