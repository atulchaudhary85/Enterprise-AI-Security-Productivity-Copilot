export interface Document {
  id: number
  file_name: string
  file_type: string
  file_size: number
  processing_status: string
  embedding_status: string
  total_pages?: number
  created_at: string
}

export interface DocumentChatResponse {
  id: number
  question: string
  answer: string
  sources?: string
  confidence_score?: number
  created_at: string
}
