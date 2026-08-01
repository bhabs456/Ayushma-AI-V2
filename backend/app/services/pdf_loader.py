# Extracts dataset.pdf & splits into 500-char chunks
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.config import settings

def load_and_split_pdf(pdf_path: str = None):
    """
    Loads the PDF medical document and splits it into small semantic chunks.
    """
    path = pdf_path or settings.DATASET_PATH
    print(f"📄 Loading PDF from: {path}")

    # 1. Load document using PyPDFLoader
    loader = PyPDFLoader(path)
    documents = loader.load()
    print(f"✅ Successfully loaded {len(documents)} pages from PDF.")

    # 2. Split document into overlapping character chunks
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.CHUNK_SIZE,       # 500 characters
        chunk_overlap=settings.CHUNK_OVERLAP   # 20 characters overlap for continuity
    )
    chunks = text_splitter.split_documents(documents)
    print(f"✂️ Created {len(chunks)} text chunks for vector indexing.")

    return chunks