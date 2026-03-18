from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from document_loader import DocumentProcessor
from rag_engine import RAGEngine
import os
import shutil

app = FastAPI()
engine = RAGEngine()

# CORS is vital so your React app can talk to Python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    try:
        chunks = DocumentProcessor.process_pdf(temp_path)
        msg = engine.ingest_documents(chunks)
        return {"message": msg}
    finally:
        if os.path.exists(temp_path): os.remove(temp_path)

@app.post("/chat")
async def chat(data: dict):
    answer = engine.ask_question(data["question"])
    return {"answer": answer}

@app.get("/quiz")
async def get_quiz():
    return {"quiz": engine.generate_quiz()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)