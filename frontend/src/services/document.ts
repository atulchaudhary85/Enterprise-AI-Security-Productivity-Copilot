import apiClient from '@/lib/api-client'

export const documentService = {
  async uploadDocument(file: File, workspaceId: number) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('workspace_id', workspaceId.toString())
    
    const response = await apiClient.post(
      '/documents/upload',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    )
    return response.data
  },

  async listDocuments(workspaceId: number) {
    const response = await apiClient.get(`/documents?workspace_id=${workspaceId}`)
    return response.data
  },

  async getDocument(documentId: number) {
    const response = await apiClient.get(`/documents/${documentId}`)
    return response.data
  },

  async askQuestion(documentId: number, question: string, workspaceId: number) {
    const response = await apiClient.post(
      `/documents/${documentId}/chat?workspace_id=${workspaceId}`,
      { document_id: documentId, question }
    )
    return response.data
  },

  async deleteDocument(documentId: number) {
    await apiClient.delete(`/documents/${documentId}`)
  },
}
