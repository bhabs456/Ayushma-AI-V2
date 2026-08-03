import os
import pypdf
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.config import settings

# Keywords indicating book metadata, prefaces, index registries, or legal disclosures
NOISE_KEYWORDS = [
    # Book Metadata & Front Matter
    "table of contents", "preface", "index", "bibliography", 
    "references", "about the author", "copyright", "contributors",
    "dedicated to", "all rights reserved", "supplementary material",
    "acknowledgements", "foreword", "dedication", "errata",
    "list of tables", "list of figures", "further reading",
    "selected readings", "suggested reading", "sources cited",
    "author biography", "disclaimer", "terms of use", "legal notice",
    "isbn", "cataloging-in-publication", "subject index", "author index",
    "preliminary matter", "publication data", "list of abbreviations",
    
    # Review Questions & Quizzes
    "review questions", "multiple choice", "answer key", "self-assessment", 
    "study questions", "practice questions", "test bank", "chapter questions",
    
    # Legal & Disclaimers
    "disclaimer of warranties", "not responsible for errors", "liability disclaimer",
    "medical advice disclaimer", "without warranty", "no liability"
]

def is_noise_page(text: str) -> bool:
    """
    Checks if a page contains keywords that suggest it is non-technical noise.
    """
    text_lower = text.lower().strip()
    
    # 1. Skip pages with very little text (e.g. cover pages, titles, or blank pages)
    if len(text_lower.split()) < 30:
        return True
        
    # 2. Check for noise keywords in the first 400 characters of the page
    snippet = text_lower[:400]
    for keyword in NOISE_KEYWORDS:
        if keyword in snippet:
            return True
            
    return False

def load_and_split_pdf(target_path: str = "data"):
    """
    Loads one or more PDFs from target_path (can be a directory or a single PDF file),
    filters out non-technical noise pages, attaches rich domain metadata, and splits them into chunks.
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

    # 4. Load each PDF file, filter pages, split content, and apply rich metadata
    for pdf_path in pdf_files:
        print(f"📖 Loading: {pdf_path}")
        try:
            # Direct pypdf.PdfReader bypasses LangChain's buggy PageLabel resolver
            reader = pypdf.PdfReader(pdf_path)
            pages = []
            
            for page_idx, page in enumerate(reader.pages):
                try:
                    text = page.extract_text() or ""
                    # Create a standard LangChain document object manually
                    pages.append(Document(page_content=text, metadata={"page": page_idx}))
                except Exception as page_err:
                    print(f"⚠️ Error reading page {page_idx + 1} of {pdf_path}: {page_err}")
            
            # Filter out front matter, indexes, copyright pages, etc.
            filtered_pages = [page for page in pages if not is_noise_page(page.page_content)]
            skipped_count = len(pages) - len(filtered_pages)
            if skipped_count > 0:
                print(f"🧹 Filtered out {skipped_count} non-technical/noise pages.")
                
            doc_chunks = text_splitter.split_documents(filtered_pages)
            
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