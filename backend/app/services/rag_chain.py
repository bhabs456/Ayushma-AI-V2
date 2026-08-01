from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from app.config import settings
from app.services.vector_store import load_vector_store

# 1. Initialize Gemini LLM with working model
llm = ChatGoogleGenerativeAI(
    model="gemini-flash-lite-latest",
    temperature=0.3,
    google_api_key=settings.GEMINI_API_KEY
)

# 2. System Prompt definition
SYSTEM_PROMPT_TEMPLATE = (
    "You are Ayushman AI, a helpful, friendly, and factual healthcare assistant.\n"
    "Your goal is to answer the user's medical question using ONLY the provided medical context below.\n\n"
    "STRICT RULES:\n"
    "1. Keep your answer clear, accurate, and simple—maximum 3 sentences.\n"
    "2. Avoid complex medical jargon unless necessary.\n"
    "3. If the answer is not present in the medical context, state clearly that you don't have enough information.\n"
    "4. Always conclude your answer with a reassuring remark or a suggested next step.\n\n"
    "Medical Context:\n"
    "{context}"
)

prompt = ChatPromptTemplate.from_messages(
    [("system", SYSTEM_PROMPT_TEMPLATE), ("human", "{question}")]
)


def ask_ayushman_ai(user_question: str):
    """
    RAG Pipeline Function:
    1. Searches FAISS for top 3 matching medical context chunks.
    2. Passes retrieved context + user question to Gemini (gemini-flash-lite-latest).
    3. Returns response string + source citations list.
    """
    vector_store = load_vector_store()
    retrieved_docs = vector_store.similarity_search(user_question, k=3)

    context_text = "\n\n".join([doc.page_content for doc in retrieved_docs])

    citations = []
    for doc in retrieved_docs:
        page_num = doc.metadata.get("page", 0) + 1
        citations.append({"page": page_num, "snippet": doc.page_content[:150] + "..."})

    formatted_prompt = prompt.format_messages(
        context=context_text, question=user_question
    )

    ai_response = llm.invoke(formatted_prompt)
    # Clean text extraction logic
    if isinstance(ai_response.content, list) and len(ai_response.content) > 0:
        clean_response = ai_response.content[0].get("text", str(ai_response.content))
    elif isinstance(ai_response.content, str):
        clean_response = ai_response.content
    else:
        clean_response = str(ai_response.content)

    return {"response": clean_response, "citations": citations}
