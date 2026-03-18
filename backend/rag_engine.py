import os
import json
from dotenv import load_dotenv

# Core Modern Imports
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

load_dotenv()

class RAGEngine:
    def __init__(self):
        # UPDATED FOR MARCH 2026: Use 'models/gemini-embedding-001'
        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="models/gemini-embedding-001",
            task_type="retrieval_document"
        )
        # Using Gemini 2.0 Flash for blazing fast responses
        self.llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash")
        self.persist_dir = "./chromadb_storage"
        self.vector_db = None

        if os.path.exists(self.persist_dir) and os.listdir(self.persist_dir):
            self.vector_db = Chroma(
                persist_directory=self.persist_dir,
                embedding_function=self.embeddings
            )

    def ingest_documents(self, chunks):
        """Converts PDF chunks into vectors and stores them in ChromaDB"""
        self.vector_db = Chroma.from_documents(
            documents=chunks,
            embedding=self.embeddings,
            persist_directory=self.persist_dir
        )
        return "Knowledge base updated successfully."

    def ask_question(self, query: str):
        if not self.vector_db:
            return "Please upload a course document first."

        template = """You are the Community Course Copilot for Digikendr. 
        Answer the student's question based ONLY on the provided context.
        If the answer isn't in the context, say you don't have that info.

        Context: {context}
        Question: {question}
        """
        prompt = ChatPromptTemplate.from_template(template)
        
        # In 2026, we specify task_type="retrieval_query" for the question part
        retriever = self.vector_db.as_retriever(
            search_kwargs={"k": 5} # Fetch top 5 most relevant chunks
        )

        chain = (
            {"context": retriever, "question": RunnablePassthrough()}
            | prompt
            | self.llm
            | StrOutputParser()
        )
        
        return chain.invoke(query)

    def generate_quiz(self):
        if not self.vector_db: return json.dumps([])
        res = self.vector_db.get(limit=5)
        docs = res.get("documents", [])
        context_text = " ".join(docs)
        
        quiz_prompt = f"""
        Generate 3 MCQs in JSON format based on: {context_text}. 
        Format: [ {{"question": "...", "options": ["A", "B", "C", "D"], "answer": "correct_option"}} ]
        Only return the JSON array.
        """
        response = self.llm.invoke(quiz_prompt)
        content = response.content.replace('```json', '').replace('```', '').strip()
        return content