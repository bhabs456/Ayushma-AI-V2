from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from app.config import settings
from app.services.vector_store import load_vector_store

# 1. Initialize Gemini LLMs (low temperature for condensation, standard for answering)
llm = ChatGoogleGenerativeAI(
    model="gemini-flash-lite-latest",
    temperature=0.3,
    google_api_key=settings.GEMINI_API_KEY
)

condensation_llm = ChatGoogleGenerativeAI(
    model="gemini-flash-lite-latest",
    temperature=0.1,
    google_api_key=settings.GEMINI_API_KEY
)

# 2. System Prompts definition
SYSTEM_PROMPT_TEMPLATE = (
    "You are Ayushman AI, a factual, RAG-grounded healthcare reference assistant.\n\n"
    
    "INTENT RULES:\n"
    "1. GREETINGS & GENERAL CHAT: If the user says hello, asks how you are, asks for your name/identity, "
    "or engages in general polite conversation, respond warmly, politely, and naturally. Introduce yourself "
    "briefly as 'Ayushman AI' and explain that you can resolve clinical reference queries. Keep the entire response "
    "concise (strictly 1 to 2 lines maximum).\n"
    
    "2. MEDICAL QUESTIONS: If the user asks a health or medical question, you must answer using ONLY "
    "the provided Medical Context below.\n"
    "   - NEVER introduce yourself or use conversational filler/greetings (do NOT say 'Hello', 'I am Ayushman AI', "
    "     'Based on the provided context...', or 'Here are the criteria...').\n"
    "   - START YOUR RESPONSE DIRECTLY WITH A MAIN HEADING (using a triple `###` tag) formulated according to the "
    "     technical question (e.g. `### DIAGNOSTIC CRITERIA FOR DIABETES MELLITUS` or `### DOSAGE GUIDELINES`). No text should precede this heading.\n"
    "   - Do NOT use any subheadings, secondary section titles, or nested headers below this main heading; present pure structured information directly.\n"
    "   - Focus strictly on the question's importance and answer directly using bullet points and paragraphs where required.\n"
    "   - Expand details and increase the number of points according to the scope and depth of the question asked.\n"
    "   - If the answer to a medical question is not present in the provided context, state clearly and concisely "
    "     that you do not have enough verified information in your database.\n\n"
    
    "3. EMERGENCIES: If the user describes emergency symptoms (e.g., severe chest pain, difficulty breathing, "
    "uncontrolled bleeding), immediately advise them to seek emergency medical services (like calling 911 or "
    "going to the nearest ER).\n\n"
    
    "FORMATTING RULES (IMPORTANT):\n"
    "- **Headings**: Start directly with exactly ONE main heading (using `### [Heading Name]`). You must NOT use any other headings, subheadings, or secondary section titles (do NOT use `#` or `##`).\n"
    "- **Lists**: Format items in clean, indented bullet points with bold lead-ins. Align bullet items accurately.\n"
    "- **Tables**: If presenting comparative data, drug dosages, staging criteria, reference ranges, or drug schedules, "
    "  you MUST format the information in a standard Markdown table (using | headers and hyphens) for high readability.\n"
    "- **Highlights**: Automatically bold (`**`) important drug names, medical conditions, and key metrics in your responses.\n"
    "- **Clinical Notes**: Format critical warnings, contraindications, or warnings in Markdown blockquotes starting with "
    "  `> **Clinical Note:**` or `> **Clinical Warning:**` whenever clinically important.\n"
    "- **Inline Citations**: Place citation tags (like `[1]`, `[2]`) in the body text matching the indices of the matched chunks in the Medical Context below.\n\n"
    
    "Medical Context:\n"
    "{context}"
)

CONDENSE_QUESTION_TEMPLATE = (
    "Given the following conversation history and a follow-up question, "
    "rephrase the follow-up question to be a STANDALONE question, "
    "incorporating necessary context from the conversation history.\n\n"
    "RULES:\n"
    "1. Do NOT answer the question. Only output the standalone rephrased question.\n"
    "2. If the follow-up question is already a standalone question or introduces a new topic, "
    "   return it exactly as it is.\n\n"
    "Chat History:\n"
    "{chat_history}\n\n"
    "Follow-Up Input: {question}\n"
    "Standalone Question:"
)

condense_prompt = ChatPromptTemplate.from_messages(
    [("human", CONDENSE_QUESTION_TEMPLATE)]
)


def extract_clean_text(content):
    """
    Safely extracts string text from LangChain message content regardless of if it
    is returned as a string or as a list of content blocks.
    """
    if isinstance(content, list) and len(content) > 0:
        return content[0].get("text", str(content))
    elif isinstance(content, str):
        return content
    else:
        return str(content)


def ask_ayushman_ai(user_question: str, history: list = None):
    """
    RAG Pipeline Function:
    1. Rephrases follow-up questions to standalone queries using chat history.
    2. Searches FAISS for matching medical context chunks (k=5 depth).
    3. Generates responses using history context + current query.
    4. Returns response string + source citations list.
    """
    if not settings.ENABLE_GEMINI:
        return {
            "response": "### SYSTEM OFFLINE\nThe Gemini API service is currently disabled. Please check your configuration or try again later.",
            "citations": []
        }

    # Step 1: Condense follow-up query if history exists
    condensed_query = user_question
    if settings.ENABLE_GEMINI and history and len(history) > 0:
        history_text = ""
        for item in history:
            role = "User" if getattr(item, "sender", "user") == "user" else "Assistant"
            content = getattr(item, "content", "")
            history_text += f"{role}: {content}\n"
            
        try:
            condense_input = condense_prompt.format_messages(
                chat_history=history_text, question=user_question
            )
            condense_response = condensation_llm.invoke(condense_input)
            response_content = extract_clean_text(condense_response.content).strip()
            if response_content:
                condensed_query = response_content
                print(f"🔄 Condensed Query: '{condensed_query}' (Original: '{user_question}')")
        except Exception as e:
            print(f"⚠️ Query condensation failed, falling back to original: {e}")

    # Step 2: Vector Search using condensed query (increased depth to k=5)
    vector_store = load_vector_store()
    retrieved_docs = vector_store.similarity_search(condensed_query, k=5)

    context_parts = []
    for idx, doc in enumerate(retrieved_docs, 1):
        context_parts.append(f"Source [{idx}]:\n{doc.page_content}")
    context_text = "\n\n".join(context_parts)

    citations = []
    for doc in retrieved_docs:
        page_num = doc.metadata.get("page", 1)
        citations.append({
            "page": page_num, 
            "snippet": doc.page_content,
            "sourceDoc": doc.metadata.get("document", "Unknown Document")
        })

    # Step 3: Construct prompt with history for context-aware generation
    messages = [("system", SYSTEM_PROMPT_TEMPLATE.replace("{context}", context_text))]
    if history:
        for item in history:
            role = "human" if getattr(item, "sender", "user") == "user" else "ai"
            messages.append((role, getattr(item, "content", "")))
    messages.append(("human", "{question}"))
    
    final_prompt = ChatPromptTemplate.from_messages(messages)
    formatted_final_prompt = final_prompt.format_messages(question=user_question)

    ai_response = llm.invoke(formatted_final_prompt)
    
    clean_response = extract_clean_text(ai_response.content)

    return {"response": clean_response, "citations": citations}
