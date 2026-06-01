from typing import List
import numpy as np

class VectorStore:
    """Vector database interface for embeddings"""
    
    def __init__(self):
        self.vectors = {}
        self.documents = {}
    
    def add_chunks(self, document_id: int, chunks: List[str], embeddings: List[List[float]]):
        """Store document chunks and their embeddings"""
        self.vectors[document_id] = embeddings
        self.documents[document_id] = chunks
    
    def search(self, query_embedding: List[float], document_id: int = None, top_k: int = 3) -> List[tuple]:
        """Search for similar chunks using cosine similarity"""
        results = []
        
        if document_id and document_id in self.vectors:
            vectors = self.vectors[document_id]
            docs = self.documents[document_id]
        else:
            vectors = []
            docs = []
            for doc_id, doc_vectors in self.vectors.items():
                vectors.extend(doc_vectors)
                docs.extend(self.documents[doc_id])
        
        if not vectors:
            return []
        
        # Calculate cosine similarity
        query_embedding = np.array(query_embedding)
        for i, vec in enumerate(vectors):
            vec = np.array(vec)
            similarity = np.dot(query_embedding, vec) / (np.linalg.norm(query_embedding) * np.linalg.norm(vec) + 1e-10)
            results.append((docs[i], float(similarity)))
        
        # Sort by similarity and return top_k
        results.sort(key=lambda x: x[1], reverse=True)
        return results[:top_k]

vector_store = VectorStore()
