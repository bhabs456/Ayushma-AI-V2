# MiniLM HuggingFace embeddings & FAISS indexing
import os
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from app.config import settings
from app.services.pdf_loader import load_and_split_pdf

def get_embeddings():
    """
    Downloads/loads the HuggingFace sentence-transformer embeddings model.
    """
    return HuggingFaceEmbeddings(model_name=settings.EMBEDDINGS_MODEL)

def create_vector_store():
    """
    Processes the PDF, generates vector embeddings, and saves FAISS index to disk.
    """
    chunks = load_and_split_pdf()
    embeddings = get_embeddings()

    print("🧠 Generating vector embeddings & indexing in FAISS (this may take a minute)...")
    vector_store = FAISS.from_documents(chunks, embeddings)

    # Save vector index locally so ingestion runs only once
    os.makedirs(settings.VECTOR_STORE_DIR, exist_ok=True)
    vector_store.save_local(settings.VECTOR_STORE_DIR)
    print(f"💾 Vector store successfully saved to '{settings.VECTOR_STORE_DIR}/'")
    return vector_store

def load_vector_store():
    """
    Loads an existing FAISS index from disk.
    """
    embeddings = get_embeddings()
    if not os.path.exists(settings.VECTOR_STORE_DIR):
        print("⚠️ Vector store not found on disk. Creating a new one...")
        return create_vector_store()
    
    print(f"⚡ Loading FAISS vector store from '{settings.VECTOR_STORE_DIR}/'...")
    return FAISS.load_local(
        settings.VECTOR_STORE_DIR, 
        embeddings, 
        allow_dangerous_deserialization=settings.ALLOW_DANGEROUS_DESERIALIZATION
    )