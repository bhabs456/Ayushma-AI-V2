# Environment settings (GEMINI_API_KEY)
import os

# Fix macOS OpenMP / PyTorch multi-threading conflicts with FAISS
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"
os.environ["TOKENIZERS_PARALLELISM"] = "false"
os.environ["OMP_NUM_THREADS"] = "1"

from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings:
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    ENABLE_GEMINI: bool = os.getenv("ENABLE_GEMINI", "True").lower() == "true"
    DATASET_PATH: str = os.getenv("DATASET_PATH", "data/dataset.pdf")
    VECTOR_STORE_DIR: str = os.getenv("VECTOR_STORE_DIR", "vector_store")
    EMBEDDINGS_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"
    CHUNK_SIZE: int = 500
    CHUNK_OVERLAP: int = 20
    
    # Security Configurations
    ALLOW_DANGEROUS_DESERIALIZATION: bool = os.getenv("ALLOW_DANGEROUS_DESERIALIZATION", "True").lower() == "true"
    ALLOWED_ORIGINS: list[str] = [
        origin.strip() 
        for origin in os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",") 
        if origin.strip()
    ]

settings = Settings()