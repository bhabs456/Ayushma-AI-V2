# Chat request & response schemas
from pydantic import BaseModel
from typing import List, Optional

class CitationItem(BaseModel):
    page: int
    snippet: str

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    citations: List[CitationItem]