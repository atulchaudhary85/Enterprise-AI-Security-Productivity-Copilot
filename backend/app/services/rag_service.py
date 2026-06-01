from typing import List, Tuple
from app.services.embedding_service import embedding_service
from app.services.vector_store import vector_store

class RAGService:
    """Retrieval Augmented Generation for document Q&A"""
    
    @staticmethod
    def retrieve_context(query: str, document_id: int = None, top_k: int = 3) -> Tuple[List[str], List[float]]:
        """Retrieve relevant chunks based on query"""
        query_embedding = embedding_service.get_embedding(query)
        results = vector_store.search(query_embedding, document_id, top_k)
        
        contexts = []
        scores = []
        for context, score in results:
            contexts.append(context)
            scores.append(score)
        
        return contexts, scores
    
    @staticmethod
    def generate_answer(query: str, contexts: List[str]) -> str:
        """Generate answer based on retrieved context (mock)"""
        if not contexts:
            return "No relevant information found in documents."
        
        context_text = "\n\n".join(contexts)
        answer = f"Based on the document, regarding '{query}':\n\n{context_text[:500]}..."
        return answer
    
    @staticmethod
    def answer_question(query: str, document_id: int = None) -> Tuple[str, List[str], float]:
        """Complete RAG pipeline: retrieve and generate"""
        contexts, scores = RAGService.retrieve_context(query, document_id)
        answer = RAGService.generate_answer(query, contexts)
        avg_score = sum(scores) / len(scores) if scores else 0
        
        return answer, contexts, int(avg_score * 100)
