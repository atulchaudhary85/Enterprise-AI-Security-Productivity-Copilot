import { create } from 'zustand'

interface Document {
  id: number
  file_name: string
  file_type: string
  file_size: number
  processing_status: string
  created_at: string
}

interface DocumentStore {
  documents: Document[]
  setDocuments: (docs: Document[]) => void
  addDocument: (doc: Document) => void
  removeDocument: (id: number) => void
}

export const useDocumentStore = create<DocumentStore>((set) => ({
  documents: [],
  setDocuments: (documents) => set({ documents }),
  addDocument: (document) => set((state) => ({ documents: [...state.documents, document] })),
  removeDocument: (id) => set((state) => ({
    documents: state.documents.filter((doc) => doc.id !== id),
  })),
}))
