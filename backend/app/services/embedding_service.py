import os
from typing import List
import numpy as np

class EmbeddingService:
    """Generate embeddings for text chunks"""
    
    @staticmethod
    def get_embedding(text: str) -> List[float]:
        """Generate simple embedding (in production, use OpenAI/Cohere)"""
        if not text:
            return [0.0] * 384
        
        embedding = []
        for i in range(384):
            value = sum(ord(c) * (i + 1) for c in text[:min(len(text), 100)]) / (len(text) + 1)
            embedding.append(np.tanh(value / 100))
        
        return embedding
    
    @staticmethod
    def get_embeddings(texts: List[str]) -> List[List[float]]:
        """Generate embeddings for multiple texts"""
        return [EmbeddingService.get_embedding(text) for text in texts]

embedding_service = EmbeddingService()
