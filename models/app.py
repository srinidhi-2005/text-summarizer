from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import uvicorn
import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Summarization Model (facebook/bart-base) ---
summary_model_path = os.getenv("SUMMARY_MODEL_PATH")
summary_tokenizer = AutoTokenizer.from_pretrained("facebook/bart-base")
summary_model = AutoModelForSeq2SeqLM.from_pretrained("facebook/bart-base")
summary_model.load_state_dict(torch.load(summary_model_path, map_location="cpu"))
summary_model.eval()

@app.post("/summarize")
async def summarize(file: UploadFile = File(...)):
    content = await file.read()
    text = content.decode("utf-8")
    # Simple legal-domain check before summarization
    legal_keywords = [
        "law", "legal", "contract", "agreement", "court", "rights", "obligation", "liability", "statute", "regulation", "compliance", "intellectual property", "license", "dispute", "evidence", "witness", "testimony", "case", "plaintiff", "defendant", "judge", "attorney", "counsel", "jurisdiction", "damages", "settlement", "arbitration", "litigation", "clause", "breach", "terms", "conditions", "policy", "privacy", "confidentiality", "indemnity", "warranty", "guarantee", "appeal", "verdict", "sentence", "prosecution", "defense", "trial", "hearing", "summons", "subpoena", "evidence", "testament", "will", "trust", "estate", "property", "ownership", "lease", "tenant", "landlord", "employment", "employee", "employer", "labor", "union", "discrimination", "harassment", "divorce", "custody", "alimony", "child support", "immigration", "citizenship", "visa", "asylum", "deportation", "bankruptcy", "insolvency", "tax", "audit", "patent", "copyright", "trademark", "merger", "acquisition", "shareholder", "stock", "securities", "fraud", "antitrust", "competition", "monopoly", "consumer", "protection", "product liability", "recall", "environmental", "pollution", "hazardous", "safety", "compliance", "insurance", "claim", "premium", "coverage", "beneficiary", "pension", "retirement", "social security", "disability", "compensation", "criminal", "civil", "tort", "negligence", "malpractice", "damages", "injunction", "restraining order", "probation", "parole", "sentence", "conviction", "acquittal", "plea", "bail", "bond", "arrest", "detention", "incarceration", "parole", "probation", "warrant", "indictment", "arraignment", "plea bargain", "testify", "testimony", "evidence", "exhibit", "cross-examination", "verdict", "sentence", "appeal", "restitution", "expungement", "pardon", "clemency", "commutation", "extradition", "habeas corpus", "injunction", "mandamus", "certiorari", "subpoena", "deposition", "affidavit", "notary", "oath", "affirmation", "perjury", "contempt", "sanction", "fine", "penalty", "forfeiture", "seizure", "confiscation", "garnishment", "lien", "levy", "foreclosure", "repossession", "eviction", "partition", "quiet title", "easement", "encroachment", "zoning", "eminent domain", "condemnation", "inverse condemnation", "nuisance", "trespass", "conversion", "replevin", "detinue", "bailment", "chattel", "fixture", "intestate", "testate", "probate", "executor", "administrator", "guardian", "conservator", "ward", "trustee", "beneficiary", "fiduciary", "power of attorney", "living will", "advance directive", "health care proxy", "do not resuscitate", "organ donation", "autopsy", "coroner", "medical examiner", "mortgage", "deed", "title", "escrow", "closing", "settlement", "abstract", "survey", "appraisal", "real estate", "broker", "agent", "listing", "offer", "acceptance", "counteroffer", "earnest money", "contingency", "disclosure", "inspection", "walk-through", "possession", "move-in", "move-out", "rent", "security deposit", "utilities", "maintenance", "repair", "improvement", "alteration", "addition", "remodel", "renovation", "restoration", "preservation", "conservation", "demolition"]
    if not any(keyword in text.lower() for keyword in legal_keywords):
        return {"summary": "This is not a legal file. Please upload a legal document."}
    # Preprocess and chunk if needed (for long docs)
    inputs = summary_tokenizer([text], max_length=1024, truncation=True, return_tensors="pt")
    with torch.no_grad():
        summary_ids = summary_model.generate(
            inputs["input_ids"],
            attention_mask=inputs["attention_mask"],
            max_length=128,
            num_beams=4,
            early_stopping=True
        )
    summary = summary_tokenizer.decode(summary_ids[0], skip_special_tokens=True)
    return {"summary": summary}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)