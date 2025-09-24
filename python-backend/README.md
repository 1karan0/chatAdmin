# Botpress-like Knowledge Processing Backend

This Python backend handles knowledge base processing for the chatbot application, similar to how Botpress processes training data.

## Features

- **URL Crawling**: Extract text content from websites
- **File Processing**: Support for PDF, DOCX, TXT, CSV, and JSON files
- **Text Chunking**: Intelligent text splitting with overlap for better context
- **Vector Processing**: Simulated vector data generation (ready for real embeddings)
- **Error Handling**: Comprehensive error handling and logging

## Installation

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Server

```bash
python main.py
```

The server will start on `http://localhost:8000`

## API Endpoints

### POST /process-knowledge
Process a knowledge base item and extract text content.

**Request Body:**
```json
{
  "id": "knowledge-item-id",
  "type": "URL|TEXT|PDF|DOCX|TXT|CSV|JSON",
  "content": "content or URL",
  "sourceUrl": "optional-source-url",
  "filePath": "optional-file-path",
  "botId": "bot-id"
}
```

**Response:**
```json
{
  "success": true,
  "vectorData": "simulated_vector_data",
  "chunks": [
    {
      "text": "chunk text",
      "start": 0,
      "end": 1000,
      "length": 1000,
      "chunk_id": "abc123"
    }
  ],
  "processingTime": 1.23
}
```

### GET /health
Health check endpoint.

### GET /
API information and available endpoints.

## Integration with Frontend

The frontend sends knowledge processing requests to this backend, which:

1. Extracts text from various sources (URLs, files)
2. Chunks the text for better processing
3. Simulates vector generation (ready for real embeddings)
4. Returns processed data to be stored in the database

## Future Enhancements

- Real vector embeddings using sentence-transformers
- Vector database integration (Pinecone, Weaviate, Chroma)
- Advanced text preprocessing
- Support for more file formats
- Batch processing capabilities
- Caching mechanisms