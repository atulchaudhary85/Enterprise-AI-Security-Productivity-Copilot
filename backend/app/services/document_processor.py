import os
import pypdf
from pathlib import Path
from typing import List, Tuple

class DocumentProcessor:
    """Process and extract text from documents"""
    
    CHUNK_SIZE = 500
    CHUNK_OVERLAP = 50
    
    @staticmethod
    def extract_pdf_text(file_path: str) -> Tuple[str, int]:
        """Extract text from PDF file"""
        try:
            text = ""
            with open(file_path, 'rb') as pdf_file:
                pdf_reader = pypdf.PdfReader(pdf_file)
                total_pages = len(pdf_reader.pages)
                
                for page_num, page in enumerate(pdf_reader.pages):
                    text += f"\n--- Page {page_num + 1} ---\n"
                    text += page.extract_text()
            
            return text, total_pages
        except Exception as e:
            raise Exception(f"PDF extraction failed: {str(e)}")
    
    @staticmethod
    def extract_text_file(file_path: str) -> Tuple[str, int]:
        """Extract text from plain text file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                text = f.read()
            pages = len(text.split('\n')) // 50 + 1
            return text, pages
        except Exception as e:
            raise Exception(f"Text extraction failed: {str(e)}")
    
    @staticmethod
    def chunk_text(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> List[str]:
        """Split text into overlapping chunks"""
        chunks = []
        start = 0
        
        while start < len(text):
            end = min(start + chunk_size, len(text))
            chunks.append(text[start:end].strip())
            start = end - overlap
        
        return [chunk for chunk in chunks if chunk]
    
    @staticmethod
    def process_document(file_path: str, file_type: str) -> Tuple[str, List[str], int]:
        """Process document and return text and chunks"""
        if file_type.lower() == 'pdf':
            text, pages = DocumentProcessor.extract_pdf_text(file_path)
        elif file_type.lower() in ['txt', 'md']:
            text, pages = DocumentProcessor.extract_text_file(file_path)
        else:
            raise ValueError(f"Unsupported file type: {file_type}")
        
        chunks = DocumentProcessor.chunk_text(text)
        return text, chunks, pages
