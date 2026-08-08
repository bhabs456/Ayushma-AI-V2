from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.db.schema.user import UserOutput
from app.models.chat import ChatRequest, ChatResponse
from app.routers.auth import authRouter
from app.services.rag_chain import ask_ayushman_ai
from app.services.vector_store import get_indexed_files
from app.util.init_db import create_tables
from app.util.protectRoute import get_current_user


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Intialize Db at start
    create_tables()
    yield #seperation point


app = FastAPI(
    title="Ayushman-AI RAG Medical API",
    description="Factual, RAG-grounded Medical Knowledge REST API.",
    version="2.0.0",
    lifespan=lifespan
)

app.include_router(authRouter, prefix="/auth", tags=["Authentication"])
# /auth/login
# /auth/signup

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health_check():
    return {
        "status": "healthy",
        "service": "Ayushman-AI RAG API",
        "model": "gemini-flash-lite-latest",
    }

@app.get("/protected")
def read_protected(user: UserOutput = Depends(get_current_user)):
    return {
        "data": user
    }


@app.get("/api/documents")
def get_documents_endpoint():
    try:
        files = get_indexed_files()
        return {"status": "success", "count": len(files), "documents": files}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch documents: {str(e)}"
        )


@app.post("/api/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest):
    # 1. Validation check
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    try:
        result = ask_ayushman_ai(request.message, request.history)
        return ChatResponse(response=result["response"], citations=result["citations"])
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Server Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"RAG Error: {str(e)}")
