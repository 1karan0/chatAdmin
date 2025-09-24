from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import requests
from bs4 import BeautifulSoup
import PyPDF2
import docx
import json
import csv
import io
import os
from datetime import datetime
import hashlib
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Botpress-like Knowledge Processing API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class KnowledgeItem(BaseModel):
    id: str
    type: str
    content: str
    sourceUrl: Optional[str] = None
    filePath: Optional[str] = None
    botId: str

class ProcessingResult(BaseModel):
    success: bool
    vectorData: Optional[str] = None
    chunks: List[Dict[str, Any]] = []
    processingTime: float = 0
    error: Optional[str] = None

def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 200) -> List[Dict[str, Any]]:
    """Split text into overlapping chunks for better context preservation."""
    chunks = []
    start = 0
    
    while start < len(text):
        end = start + chunk_size
        chunk_text = text[start:end]
        
        # Try to break at sentence boundaries
        if end < len(text):
            last_period = chunk_text.rfind('.')
            last_newline = chunk_text.rfind('\n')
            break_point = max(last_period, last_newline)
            
            if break_point > start + chunk_size // 2:
                end = start + break_point + 1
                chunk_text = text[start:end]
        
        chunks.append({
            "text": chunk_text.strip(),
            "start": start,
            "end": end,
            "length": len(chunk_text.strip()),
            "chunk_id": hashlib.md5(chunk_text.encode()).hexdigest()[:8]
        })
        
        start = end - overlap
        if start >= len(text):
            break
    
    return chunks

def extract_text_from_url(url: str) -> str:
    """Extract text content from a webpage."""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Remove script and style elements
        for script in soup(["script", "style"]):
            script.decompose()
        
        # Get text content
        text = soup.get_text()
        
        # Clean up text
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text = ' '.join(chunk for chunk in chunks if chunk)
        
        return text
    except Exception as e:
        logger.error(f"Error extracting text from URL {url}: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Failed to extract text from URL: {str(e)}")

def extract_text_from_pdf(file_path: str) -> str:
    """Extract text from PDF file."""
    try:
        text = ""
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
        return text
    except Exception as e:
        logger.error(f"Error extracting text from PDF {file_path}: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Failed to extract text from PDF: {str(e)}")

def extract_text_from_docx(file_path: str) -> str:
    """Extract text from DOCX file."""
    try:
        doc = docx.Document(file_path)
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        return text
    except Exception as e:
        logger.error(f"Error extracting text from DOCX {file_path}: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Failed to extract text from DOCX: {str(e)}")

def extract_text_from_txt(file_path: str) -> str:
    """Extract text from TXT file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
    except Exception as e:
        logger.error(f"Error extracting text from TXT {file_path}: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Failed to extract text from TXT: {str(e)}")

def extract_text_from_csv(file_path: str) -> str:
    """Extract text from CSV file."""
    try:
        text = ""
        with open(file_path, 'r', encoding='utf-8') as file:
            csv_reader = csv.reader(file)
            headers = next(csv_reader, None)
            if headers:
                text += "Headers: " + ", ".join(headers) + "\n\n"
            
            for row_num, row in enumerate(csv_reader, 1):
                text += f"Row {row_num}: " + ", ".join(row) + "\n"
                if row_num > 1000:  # Limit to first 1000 rows
                    text += "... (truncated)\n"
                    break
        return text
    except Exception as e:
        logger.error(f"Error extracting text from CSV {file_path}: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Failed to extract text from CSV: {str(e)}")

def extract_text_from_json(file_path: str) -> str:
    """Extract text from JSON file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
            return json.dumps(data, indent=2, ensure_ascii=False)
    except Exception as e:
        logger.error(f"Error extracting text from JSON {file_path}: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Failed to extract text from JSON: {str(e)}")

@app.post("/process-knowledge", response_model=ProcessingResult)
async def process_knowledge(item: KnowledgeItem):
    """Process knowledge base item and extract text content."""
    start_time = datetime.now()
    
    try:
        logger.info(f"Processing knowledge item {item.id} of type {item.type}")
        
        extracted_text = ""
        
        if item.type.upper() == "URL":
            extracted_text = extract_text_from_url(item.sourceUrl or item.content)
        elif item.type.upper() == "TEXT":
            extracted_text = item.content
        elif item.type.upper() == "PDF" and item.filePath:
            # In production, you'd get the file from your storage
            file_path = item.filePath.replace('/uploads/', './uploads/')
            extracted_text = extract_text_from_pdf(file_path)
        elif item.type.upper() == "DOCX" and item.filePath:
            file_path = item.filePath.replace('/uploads/', './uploads/')
            extracted_text = extract_text_from_docx(file_path)
        elif item.type.upper() == "TXT" and item.filePath:
            file_path = item.filePath.replace('/uploads/', './uploads/')
            extracted_text = extract_text_from_txt(file_path)
        elif item.type.upper() == "CSV" and item.filePath:
            file_path = item.filePath.replace('/uploads/', './uploads/')
            extracted_text = extract_text_from_csv(file_path)
        elif item.type.upper() == "JSON" and item.filePath:
            file_path = item.filePath.replace('/uploads/', './uploads/')
            extracted_text = extract_text_from_json(file_path)
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported content type: {item.type}")
        
        if not extracted_text.strip():
            raise HTTPException(status_code=400, detail="No text content could be extracted")
        
        # Create text chunks
        chunks = chunk_text(extracted_text)
        
        # In a real implementation, you would:
        # 1. Generate embeddings for each chunk using a model like sentence-transformers
        # 2. Store embeddings in a vector database like Pinecone, Weaviate, or Chroma
        # 3. Create a searchable index
        
        # For now, we'll simulate vector data
        vector_data = f"simulated_vector_data_{item.id}"
        
        processing_time = (datetime.now() - start_time).total_seconds()
        
        logger.info(f"Successfully processed knowledge item {item.id} in {processing_time:.2f}s")
        
        return ProcessingResult(
            success=True,
            vectorData=vector_data,
            chunks=chunks,
            processingTime=processing_time
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing knowledge item {item.id}: {str(e)}")
        processing_time = (datetime.now() - start_time).total_seconds()
        return ProcessingResult(
            success=False,
            error=str(e),
            processingTime=processing_time
        )

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "Botpress-like Knowledge Processing API",
        "version": "1.0.0",
        "endpoints": {
            "process": "/process-knowledge",
            "health": "/health"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)