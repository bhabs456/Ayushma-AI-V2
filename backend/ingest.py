# Standalone script to ingest PDF into FAISS
import sys
from app.services.vector_store import create_vector_store, get_indexed_files

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] in ["--status", "--list", "-s", "-l"]:
        print("🔍 Currently Indexed Medical Documents:")
        files = get_indexed_files()
        if not files:
            print("⚠️ No documents indexed yet.")
        else:
            for idx, file in enumerate(files, 1):
                print(f"  {idx}. {file}")
    else:
        print("🚀 Starting Medical PDF Ingestion Pipeline...")
        create_vector_store()
        print("🎉 Ingestion Complete! Vector store is ready for RAG queries.")