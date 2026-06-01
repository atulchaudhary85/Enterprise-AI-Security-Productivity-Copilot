'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoggedIn, logout, loadFromStorage } = useAuthStore()

  useEffect(() => {
    loadFromStorage()
    if (!isLoggedIn && typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token')
      if (!token) {
        router.push('/login')
      }
    }
  }, [])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Enterprise AI Copilot</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-300">{user.name}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gray-800 border border-gray-700">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-2">Documents</h3>
              <p className="text-4xl font-bold text-blue-400">0</p>
            </div>
          </Card>

          <Card className="bg-gray-800 border border-gray-700">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-2">Code Reviews</h3>
              <p className="text-4xl font-bold text-blue-400">0</p>
            </div>
          </Card>

          <Card className="bg-gray-800 border border-gray-700">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-2">Tasks</h3>
              <p className="text-4xl font-bold text-blue-400">0</p>
            </div>
          </Card>
        </div>

        <Card className="bg-gray-800 border border-gray-700 mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button className="w-full">Upload Document</Button>
            <Button className="w-full" variant="outline">Create Workspace</Button>
            <Button className="w-full" variant="outline">Review Code</Button>
            <Button className="w-full" variant="outline">Analyze Meeting</Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
