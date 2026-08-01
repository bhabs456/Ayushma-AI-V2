# Standalone script to ingest PDF into FAISS
from app.services.vector_store import create_vector_store

if __name__ == "__main__":
    print("🚀 Starting Medical PDF Ingestion Pipeline...")
    create_vector_store()
    print("🎉 Ingestion Complete! Vector store is ready for RAG queries.")