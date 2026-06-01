from fastapi import APIRouter, HTTPException, status, Depends, UploadFile, File
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List
import os
import shutil

from app.database import get_db
from app.models.document import Document, DocumentChunk, DocumentChat
from app.schemas.document import DocumentUploadResponse, DocumentResponse, DocumentChatRequest, DocumentChatResponse, DocumentListResponse
from app.services.document_processor import DocumentProcessor
from app.services.embedding_service import embedding_service
from app.services.vector_store import vector_store
from app.services.rag_service import RAGService

router = APIRouter(prefix="/documents", tags=["documents"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload", response_model=DocumentUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(...),
    workspace_id: int = 1,
    db: Session = Depends(get_db)
):
    """Upload and process document"""
    try:
        file_ext = file.filename.split('.')[-1].lower()
        if file_ext not in ['pdf', 'txt', 'md', 'docx']:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported file type")
        
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
            file_size = len(content)
        
        document = Document(
            workspace_id=workspace_id,
            uploaded_by=1,
            file_name=file.filename,
            file_type=file_ext,
            file_size=file_size,
            storage_path=file_path,
            processing_status="processing",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.add(document)
        db.commit()
        db.refresh(document)
        
        try:
            text, chunks, pages = DocumentProcessor.process_document(file_path, file_ext)
            document.total_pages = pages
            document.processing_status = "completed"
            
            embeddings = embedding_service.get_embeddings(chunks)
            vector_store.add_chunks(document.id, chunks, embeddings)
            
            for idx, chunk in enumerate(chunks):
                chunk_record = DocumentChunk(
                    document_id=document.id,
                    chunk_index=idx,
                    content=chunk,
                    created_at=datetime.utcnow()
                )
                db.add(chunk_record)
            
            document.embedding_status = "completed"
            db.commit()
            db.refresh(document)
        except Exception as e:
            document.processing_status = "failed"
            db.commit()
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Processing failed: {str(e)}")
        
        return DocumentUploadResponse.model_validate(document)
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Upload failed: {str(e)}")

@router.get("", response_model=DocumentListResponse)
def list_documents(workspace_id: int = 1, db: Session = Depends(get_db)):
    """List all documents in workspace"""
    documents = db.query(Document).filter(Document.workspace_id == workspace_id).all()
    return DocumentListResponse(
        documents=[DocumentResponse.model_validate(doc) for doc in documents],
        total=len(documents)
    )

@router.get("/{document_id}", response_model=DocumentResponse)
def get_document(document_id: int, db: Session = Depends(get_db)):
    """Get document details"""
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    return DocumentResponse.model_validate(document)

@router.post("/{document_id}/chat", response_model=DocumentChatResponse, status_code=status.HTTP_201_CREATED)
def chat_with_document(
    document_id: int,
    request: DocumentChatRequest,
    workspace_id: int = 1,
    db: Session = Depends(get_db)
):
    """Ask question about document (RAG)"""
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    
    if document.processing_status != "completed":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Document still processing")
    
    try:
        answer, contexts, confidence = RAGService.answer_question(request.question, document_id)
        
        chat = DocumentChat(
            workspace_id=workspace_id,
            document_id=document_id,
            user_id=1,
            question=request.question,
            answer=answer,
            sources=" | ".join(contexts[:2]),
            confidence_score=confidence,
            created_at=datetime.utcnow()
        )
        db.add(chat)
        db.commit()
        db.refresh(chat)
        
        return DocumentChatResponse.model_validate(chat)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Chat failed: {str(e)}")

@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_document(document_id: int, db: Session = Depends(get_db)):
    """Delete document"""
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    
    if os.path.exists(document.storage_path):
        os.remove(document.storage_path)
    
    db.delete(document)
    db.commit()
    
    return None
