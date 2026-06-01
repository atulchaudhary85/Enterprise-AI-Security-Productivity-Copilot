'use client'

import { useState } from 'react'
import { documentService } from '@/services/document'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useDocumentStore } from '@/store/document'

export default function DocumentUploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { addDocument } = useDocumentStore()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
      setError('')
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const doc = await documentService.uploadDocument(file, 1)
      addDocument(doc)
      setSuccess(`Document "${doc.file_name}" uploaded successfully!`)
      setFile(null)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Upload Document</h1>

        <Card className="bg-gray-800 border border-gray-700 p-8">
          {error && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-500/20 border border-green-500 rounded text-green-400 text-sm">
              {success}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-4">
              Select Document (PDF, TXT, MD)
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.txt,.md,.docx"
              className="block w-full text-sm text-gray-400 border border-gray-600 rounded p-3"
            />
          </div>

          {file && (
            <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500 rounded">
              <p className="text-blue-400">
                Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={!file || loading}
            className="w-full"
          >
            {loading ? 'Uploading...' : 'Upload Document'}
          </Button>
        </Card>
      </div>
    </div>
  )
}
