from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class DocumentUploadResponse(BaseModel):
    id: int
    file_name: str
    file_type: str
    file_size: int
    processing_status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class DocumentResponse(BaseModel):
    id: int
    file_name: str
    file_type: str
    file_size: int
    processing_status: str
    embedding_status: str
    total_pages: Optional[int]
    created_at: datetime
    
    class Config:
        from_attributes = True

class DocumentChatRequest(BaseModel):
    document_id: int
    question: str

class DocumentChatResponse(BaseModel):
    id: int
    question: str
    answer: str
    sources: Optional[str]
    confidence_score: Optional[int]
    created_at: datetime
    
    class Config:
        from_attributes = True

class DocumentListResponse(BaseModel):
    documents: List[DocumentResponse]
    total: int
