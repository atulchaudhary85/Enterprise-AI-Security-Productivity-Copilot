'use client'

import { useState, useEffect } from 'react'
import { documentService } from '@/services/document'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function DocumentChatPage() {
  const [documents, setDocuments] = useState<any[]>([])
  const [selectedDoc, setSelectedDoc] = useState<number | null>(null)
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [chat, setChat] = useState<any>(null)

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const data = await documentService.listDocuments(1)
        setDocuments(data.documents)
      } catch (err: any) {
        setError('Failed to load documents')
      }
    }
    loadDocuments()
  }, [])

  const handleAsk = async () => {
    if (!selectedDoc || !question.trim()) {
      setError('Please select a document and enter a question')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await documentService.askQuestion(selectedDoc, question, 1)
      setChat(response)
      setQuestion('')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to process question')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Ask Questions About Documents</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 bg-gray-800 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-4">Documents</h2>
            <div className="space-y-2">
              {documents.length === 0 ? (
                <p className="text-gray-400 text-sm">No documents uploaded</p>
              ) : (
                documents.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc.id)}
                    className={`w-full text-left p-3 rounded border transition-colors ${
                      selectedDoc === doc.id
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <div className="font-medium truncate">{doc.file_name}</div>
                    <div className="text-xs mt-1">
                      {doc.processing_status === 'completed' ? (
                        <span className="text-green-400">✓ Ready</span>
                      ) : (
                        <span className="text-yellow-400">Processing...</span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </Card>

          <Card className="lg:col-span-2 bg-gray-800 border border-gray-700">
            {error && (
              <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded text-red-400 text-sm">
                {error}
              </div>
            )}

            {!selectedDoc ? (
              <div className="text-center py-12">
                <p className="text-gray-400">Select a document to ask questions</p>
              </div>
            ) : (
              <>
                <div className="mb-6 space-y-4 max-h-96 overflow-y-auto">
                  {chat && (
                    <>
                      <div className="bg-blue-600/20 border border-blue-500 rounded p-4">
                        <p className="text-sm text-gray-300 mb-2">Q: {chat.question}</p>
                      </div>
                      <div className="bg-green-600/20 border border-green-500 rounded p-4">
                        <p className="text-sm text-gray-300">{chat.answer}</p>
                        {chat.confidence_score && (
                          <p className="text-xs text-gray-400 mt-2">
                            Confidence: {chat.confidence_score}%
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-3">
                  <Input
                    type="text"
                    placeholder="Ask a question about the document..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  <Button onClick={handleAsk} disabled={loading} className="w-full">
                    {loading ? 'Processing...' : 'Ask Question'}
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
