import time
from langchain_google_genai import ChatGoogleGenerativeAI
from app.config import settings
from app.services.vector_store import load_vector_store

MODELS = [
    "gemini-flash-latest",
    "gemini-flash-lite-latest",
    "gemini-3.6-flash",
    "gemini-3.5-flash",
    "gemini-3.1-flash-lite"
]

TEST_QUERY = "What are the first aid steps for severe burns?"

def run_benchmark():
    print(f"🔬 Benchmarking Models for Query: '{TEST_QUERY}'\n" + "="*65)
    
    vector_store = load_vector_store()
    docs = vector_store.similarity_search(TEST_QUERY, k=3)
    context = "\n\n".join([d.page_content for d in docs])

    system_prompt = f"Answer using ONLY the context. Max 3 sentences.\nContext:\n{context}"

    results = []

    for model_name in MODELS:
        print(f"\n🏃 Testing [{model_name}]...")
        start = time.time()
        try:
            llm = ChatGoogleGenerativeAI(
                model=model_name,
                temperature=0.3,
                google_api_key=settings.GEMINI_API_KEY
            )
            res = llm.invoke([("system", system_prompt), ("human", TEST_QUERY)])
            elapsed = round(time.time() - start, 3)

            text = res.content[0].get("text", "") if isinstance(res.content, list) else str(res.content)
            word_count = len(text.split())

            results.append((model_name, "SUCCESS", f"{elapsed}s", f"{word_count} words"))
            print(f"✅ Speed: {elapsed}s | Words: {word_count}")
            print(f"   Response: {text[:130]}...")

        except Exception as e:
            elapsed = round(time.time() - start, 3)
            err_msg = str(e).split('\n')[0][:70]
            results.append((model_name, "FAILED", f"{elapsed}s", "N/A"))
            print(f"❌ Failed: {err_msg}")

    print("\n" + "="*65 + "\n📊 BENCHMARK RESULTS SUMMARY\n" + "="*65)
    print(f"{'MODEL NAME':<28} | {'STATUS':<7} | {'TIME':<7} | {'WORDS':<8}")
    print("-" * 65)
    for model, status, speed, words in results:
        print(f"{model:<28} | {status:<7} | {speed:<7} | {words:<8}")

if __name__ == "__main__":
    run_benchmark()