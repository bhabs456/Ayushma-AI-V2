import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.config import settings

def load_and_split_pdf(target_path: str = "data"):
    """
    Loads one or more PDFs from target_path (can be a directory or a single PDF file),
    attaches rich domain metadata from subdirectories, and splits them into chunks.
    """
    all_chunks = []
    
    # 1. Determine data base directory for relative path mapping
    data_dir = os.path.dirname(settings.DATASET_PATH) or "data"
    
    # 2. Determine if target_path is a directory or a single file
    pdf_files = []
    if os.path.isdir(target_path):
        for root, _, files in os.walk(target_path):
            for file in files:
                if file.endswith(".pdf"):
                    pdf_files.append(os.path.join(root, file))
    elif os.path.isfile(target_path) and target_path.endswith(".pdf"):
        pdf_files = [target_path]
    else:
        print(f"⚠️ Target path is neither a valid directory nor a PDF file: {target_path}")
        return []
    
    if not pdf_files:
        print(f"⚠️ No PDF files found for: {target_path}")
        return []

    print(f"📄 Found {len(pdf_files)} PDF(s) to load.")

    # 3. Splitter settings
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.CHUNK_SIZE,       # 500 characters
        chunk_overlap=settings.CHUNK_OVERLAP   # 20 characters
    )

    # 4. Load each PDF file, split content, and apply rich metadata
    for pdf_path in pdf_files:
        print(f"📖 Loading: {pdf_path}")
        try:
            loader = PyPDFLoader(pdf_path)
            pages = loader.load()
            doc_chunks = text_splitter.split_documents(pages)
            
            # Parse subfolder structure relative to data_dir for metadata mapping
            rel_path = os.path.relpath(pdf_path, start=data_dir)
            parts = rel_path.split(os.sep)
            
            if len(parts) > 1:
                domain = parts[0]
                specialization = parts[1] if len(parts) > 2 else "General"
            else:
                domain = "General"
                specialization = "General"
                
            doc_name = os.path.splitext(os.path.basename(pdf_path))[0]
            
            for idx, chunk in enumerate(doc_chunks):
                page_num = chunk.metadata.get("page", 0) + 1
                
                # Enrich chunk metadata dictionary
                chunk.metadata = {
                    "domain": domain,
                    "specialization": specialization,
                    "document": doc_name,
                    "page": page_num,
                    "chunk_id": f"{domain.lower()}_{specialization.lower()}_{page_num}_{idx}",
                    "language": "English",
                    "publisher": "Unknown",
                    "edition": "1st",
                    "year": 2026,
                    "topic": specialization
                }
                all_chunks.append(chunk)
                
        except Exception as e:
            print(f"❌ Error loading {pdf_path}: {e}")
        
    print(f"✅ Successfully loaded total {len(all_chunks)} chunks.")
    return all_chunks