import sys
import os
import time

# Change working directory to the backend root directory so paths are relative to backend/
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(backend_dir)
sys.path.append(backend_dir)

from app.services.rag_chain import ask_ayushman_ai

# 30 Diverse questions spanning the 6 indexed medical categories
TEST_QUESTIONS = [
    # Category 1: First Aid
    {"question": "How do you treat a minor burn under first aid?", "book": "First Aid"},
    {"question": "What is the primary action for severe bleeding first aid?", "book": "First Aid"},
    {"question": "How do you perform CPR chest compressions?", "book": "First Aid"},
    {"question": "What is the first aid for choking in an adult?", "book": "First Aid"},
    {"question": "How should a venomous snakebite be managed immediately?", "book": "First Aid"},
    
    # Category 2: Pharmacology
    {"question": "What is the mechanism of action of metformin?", "book": "Pharmacology"},
    {"question": "How do beta-blockers decrease heart rate and contractility?", "book": "Pharmacology"},
    {"question": "What are the common adverse effects of ACE inhibitors?", "book": "Pharmacology"},
    {"question": "How does aspirin inhibit platelet aggregation?", "book": "Pharmacology"},
    {"question": "What is the therapeutic indication for statins?", "book": "Pharmacology"},
    
    # Category 3: General Medicine
    {"question": "What is the diagnostic threshold for HbA1c in diabetes?", "book": "General Medicine"},
    {"question": "What are the classic symptoms of pneumonia?", "book": "General Medicine"},
    {"question": "What is the clinical presentation of infective endocarditis?", "book": "General Medicine"},
    {"question": "How is stage 1 hypertension defined?", "book": "General Medicine"},
    {"question": "What are the main clinical markers of rheumatoid arthritis?", "book": "General Medicine"},
    
    # Category 4: Emergency Medicine
    {"question": "What are the diagnostic signs of acute myocardial infarction?", "book": "Emergency Medicine"},
    {"question": "How do you identify symptoms of anaphylactic shock?", "book": "Emergency Medicine"},
    {"question": "What are the immediate interventions for severe asthma exacerbation?", "book": "Emergency Medicine"},
    {"question": "What are the clinical indicators of a stroke?", "book": "Emergency Medicine"},
    {"question": "How is a tension pneumothorax clinically diagnosed?", "book": "Emergency Medicine"},
    
    # Category 5: Laboratory Medicine
    {"question": "What does a high serum creatinine indicate?", "book": "Laboratory Medicine"},
    {"question": "How do you interpret a high neutrophil count in a CBC?", "book": "Laboratory Medicine"},
    {"question": "What are the normal reference ranges for blood glucose?", "book": "Laboratory Medicine"},
    {"question": "What does elevated ALT and AST levels in liver panel suggest?", "book": "Laboratory Medicine"},
    {"question": "What is the significance of microalbuminuria in urine tests?", "book": "Laboratory Medicine"},
    
    # Category 6: Clinical Guidelines (NICE)
    {"question": "What is the recommended first-line drug for hypertension under guidelines?", "book": "Clinical Guidelines"},
    {"question": "How is chronic kidney disease staged based on eGFR?", "book": "Clinical Guidelines"},
    {"question": "What is the target blood pressure for patients under 65?", "book": "Clinical Guidelines"},
    {"question": "What is the first-line medication for type 2 diabetes?", "book": "Clinical Guidelines"},
    {"question": "What is the recommended action for suspected acute coronary syndrome?", "book": "Clinical Guidelines"}
]

def run_knowledge_benchmark():
    print("🧪 Starting Knowledge Retrieval Test Suite (30 Queries)...")
    print("=" * 70)
    
    success_count = 0
    total_count = len(TEST_QUESTIONS)
    
    for idx, item in enumerate(TEST_QUESTIONS, 1):
        q = item["question"]
        book = item["book"]
        
        print(f"[{idx}/{total_count}] Testing [{book}] Query...")
        print(f"❓ Question: {q}")
        
        start_time = time.time()
        try:
            result = ask_ayushman_ai(q)
            latency = time.time() - start_time
            response_text = result.get("response", "")
            citations = result.get("citations", [])
            
            # Evaluate success criteria:
            # 1. Returned non-empty string response
            # 2. Retrieved valid context citations (meaning RAG successfully matched PDF chunks)
            # 3. Did not fallback to "don't have enough information" string
            has_citations = len(citations) > 0
            has_answer = "don't have enough info" not in response_text.lower() and "do not have enough info" not in response_text.lower()
            
            is_successful = has_citations and has_answer
            
            if is_successful:
                success_count += 1
                status = "✅ SUCCESS (Retrieved & Grounded)"
            elif has_citations:
                status = "⚠️ PARTIAL (Found context, but lacks specific details)"
            else:
                status = "❌ FAILED (No matching chunks found in database)"
                
            print(f"⏱️  Latency: {latency:.2f}s | Chunks matched: {len(citations)}")
            print(f"📢 Response: {response_text[:120]}...")
            print(f"📊 Status: {status}")
            
        except Exception as e:
            print(f"💥 Exception raised during test: {e}")
            
        print("-" * 70)
        
    success_percentage = (success_count / total_count) * 100
    print("\n" + "=" * 70)
    print("🏆 KNOWLEDGE TEST RUN COMPLETED")
    print("=" * 70)
    print(f"📊 Total Questions Run:  {total_count}")
    print(f"✅ Successful Queries:  {success_count}")
    print(f"❌ Failed/Unresolved:   {total_count - success_count}")
    print(f"🎯 Overall Success Rate: {success_percentage:.1f}%")
    print("=" * 70)

if __name__ == "__main__":
    run_knowledge_benchmark()
