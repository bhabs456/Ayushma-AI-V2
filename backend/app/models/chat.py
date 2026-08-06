# Chat request & response schemas
from pydantic import BaseModel
from typing import List, Optional

class CitationItem(BaseModel):
    page: int
    snippet: str
    sourceDoc: Optional[str] = "Unknown Document"

class HistoryItem(BaseModel):
    sender: str  # "user" or "ai"
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[HistoryItem]] = None

class ChatResponse(BaseModel):
    response: str
    citations: List[CitationItem]