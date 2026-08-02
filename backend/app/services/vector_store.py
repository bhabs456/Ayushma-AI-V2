# MiniLM HuggingFace embeddings & FAISS indexing
import os
import json
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from app.config import settings
from app.services.pdf_loader import load_and_split_pdf

def get_embeddings():
    """
    Downloads/loads the HuggingFace sentence-transformer embeddings model.
    """
    return HuggingFaceEmbeddings(model_name=settings.EMBEDDINGS_MODEL)

def get_pdf_files_state(data_dir: str):
    """
    Scans the data directory recursively for PDF files and records their relative paths and modification timestamps.
    """
    state = {}
    if not os.path.exists(data_dir):
        return state
    for root, _, files in os.walk(data_dir):
        for file in files:
            if file.endswith(".pdf"):
                path = os.path.join(root, file)
                rel_path = os.path.relpath(path, start=data_dir)
                state[rel_path] = os.path.getmtime(path)
    return state

def load_indexed_metadata():
    """
    Loads the registry of already-indexed files.
    """
    path = os.path.join(settings.VECTOR_STORE_DIR, "indexed_files.json")
    if os.path.exists(path):
        try:
            with open(path, "r") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}

def save_indexed_metadata(metadata: dict):
    """
    Saves the registry of indexed files to disk.
    """
    os.makedirs(settings.VECTOR_STORE_DIR, exist_ok=True)
    path = os.path.join(settings.VECTOR_STORE_DIR, "indexed_files.json")
    with open(path, "w") as f:
        json.dump(metadata, f, indent=2)

def create_vector_store():
    """
    Incrementally updates or rebuilds the vector store based on file changes.
    """
    data_dir = os.path.dirname(settings.DATASET_PATH) or "data"
    current_state = get_pdf_files_state(data_dir)
    indexed_metadata = load_indexed_metadata()
    
    faiss_index_exists = os.path.exists(os.path.join(settings.VECTOR_STORE_DIR, "index.faiss"))
    
    rebuild_needed = not faiss_index_exists
    
    if not faiss_index_exists:
        print("⚠️ Vector store index file not found. Rebuilding everything...")
    else:
        # Check if any indexed file was deleted or modified
        for f, mtime in indexed_metadata.items():
            if f not in current_state:
                print(f"🗑️ File '{f}' was deleted. Rebuilding vector store to remove outdated data...")
                rebuild_needed = True
                break
            elif current_state[f] != mtime:
                print(f"🔄 File '{f}' was modified. Rebuilding vector store...")
                rebuild_needed = True
                break

    if rebuild_needed:
        # Perform a complete rebuild of the database
        print("🏗️ Rebuilding vector store from scratch...")
        embeddings = get_embeddings()
        all_chunks = []
        for f in current_state:
            path = os.path.join(data_dir, f)
            chunks = load_and_split_pdf(path)
            all_chunks.extend(chunks)
            
        if not all_chunks:
            print("⚠️ No medical text chunks extracted from any PDF. Vector store not created.")
            return None
            
        vector_store = FAISS.from_documents(all_chunks, embeddings)
        os.makedirs(settings.VECTOR_STORE_DIR, exist_ok=True)
        vector_store.save_local(settings.VECTOR_STORE_DIR)
        save_indexed_metadata(current_state)
        print("🎉 Successfully rebuilt and saved vector store index.")
        return vector_store
        
    # If no rebuild was needed, check for any newly added files
    new_files = [f for f in current_state if f not in indexed_metadata]
    
    if not new_files:
        print("✅ Vector store is already up-to-date. No changes detected.")
        return load_vector_store()
        
    print(f"➕ Found new files to index: {new_files}")
    vector_store = load_vector_store()
    
    for f in new_files:
        path = os.path.join(data_dir, f)
        print(f"📄 Processing new file: {f}")
        chunks = load_and_split_pdf(path)
        if chunks:
            vector_store.add_documents(chunks)
            
    vector_store.save_local(settings.VECTOR_STORE_DIR)
    # Save the updated files mapping state to metadata registry
    save_indexed_metadata(current_state)
    print("🎉 Successfully updated vector store with new files.")
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

def get_indexed_files():
    """
    Returns a list of filenames that are currently indexed.
    """
    metadata = load_indexed_metadata()
    return list(metadata.keys())