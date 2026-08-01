from langchain_google_genai import ChatGoogleGenerativeAI
from app.config import settings

# Test gemini-2.0-flash-lite and gemini-flash-latest
for model_name in ["gemini-2.0-flash-lite", "gemini-flash-latest", "gemini-2.5-flash"]:
    try:
        print(f"Testing model: '{model_name}'...")
        llm = ChatGoogleGenerativeAI(model=model_name, google_api_key=settings.GEMINI_API_KEY)
        res = llm.invoke("Hi! Reply with 'Ayushman AI Backend Operational'.")
        print(f"🎉 SUCCESS! Response from {model_name}: {res.content}\n")
        break
    except Exception as e:
        print(f"❌ Failed '{model_name}': {e}\n")