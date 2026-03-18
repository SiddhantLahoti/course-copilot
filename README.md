# Course Copilot AI: Intelligent Student Learning Assistant

Course Copilot AI is a high-performance, RAG-driven academic assistant designed to help students master course material through interactive AI engagement. By leveraging the **Gemini 2.5 Flash** model and **ChromaDB**, the platform allows students to upload complex course documents, ask context-aware questions, and generate automated assessment quizzes in real-time.

---

## 🛠️ Technical Architecture

### **AI-Driven Backend (Python & LangChain)**
* **API Framework**: **FastAPI** provides an asynchronous, high-concurrency interface for file uploads and chat interactions.
* **RAG Engine**: Built with **LangChain**, utilizing **Google Generative AI Embeddings** (`gemini-embedding-001`) and **Gemini 2.5 Flash** for sophisticated semantic search and response generation.
* **Vector Database**: **ChromaDB** serves as the persistent vector store, managing document embeddings and enabling rapid retrieval of relevant context.
* **Document Intelligence**: High-accuracy text extraction and chunking via **PyPDFLoader** and **RecursiveCharacterTextSplitter** (1000 character chunks with 10% overlap) to maintain semantic continuity.

### **Strategic Frontend (React & Modern UI)**
* **UI Framework**: **React 19** utilizing functional components and hooks for a responsive user experience.
* **Styling & Motion**: Powered by **Tailwind CSS 4** for utility-first design and **Framer Motion** for fluid, high-quality UI transitions.
* **Communication**: **Axios** is used for efficient multipart/form-data uploads and asynchronous state updates between the client and AI server.

---

## 🌟 Strategic Features & Implementation

### **1. Advanced Retrieval-Augmented Generation (RAG)**
The system implements a full RAG pipeline that bridges the gap between static documents and dynamic AI reasoning. It ensures that the AI answers student questions based **only** on provided course context, significantly reducing hallucinations and providing pinpoint accuracy for academic support.

### **2. High-Accuracy Knowledge Ingestion**
To ensure complex academic PDFs are processed correctly, the `DocumentProcessor` utilizes a recursive splitting strategy. This maintains the structural integrity of the text and ensures that the AI has access to overlapping context, preventing the loss of information across chunk boundaries.

### **3. Automated Academic Assessment**
The engine features a specialized `get_quiz` functionality that dynamically extracts key concepts from the vector store to generate relevant Multiple Choice Questions (MCQs). This creates an instant feedback loop for students, allowing them to test their understanding immediately after reading.

---

## 📂 Project Directory Structure

```text
course-copilot/
├── backend/
│   ├── main.py            # FastAPI Entry point & route definitions
│   ├── rag_engine.py      # LangChain RAG logic & Gemini integration
│   ├── document_loader.py # PDF processing & chunking logic
│   ├── chromadb_storage/  # Persistent vector database
│   └── requirements.txt   # Python dependency manifest
└── frontend/
    ├── src/
    │   ├── components/    # Reusable UI (ChatBox, QuizCard)
    │   ├── api.ts         # Centralized API service layer
    │   └── assets/        # Visual branding & hero images
    └── package.json       # Frontend project metadata
```

---

## 🚀 Deployment & Configuration

### **Backend (AI Server) Setup**
1.  **Install Dependencies**: 
    ```bash
    cd backend && pip install -r requirements.txt
    ```
2.  **Environment Variables**: Create a `.env` file in the `backend/` directory:
    ```env
    GOOGLE_API_KEY=your_gemini_api_key
    ```
3.  **Launch API**: 
    ```bash
    python main.py
    ```

### **Frontend (Client) Setup**
1.  **Install Dependencies**: 
    ```bash
    cd frontend && npm install
    ```
2.  **Launch Dashboard**: 
    ```bash
    npm run dev
    ```

---

## 📈 Key API Specifications

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/upload` | Public | Ingests PDF, chunks text, and populates vector store. |
| **POST** | `/chat` | Public | Processes student queries using the RAG pipeline. |
| **GET** | `/quiz` | Public | Generates a 3-question MCQ quiz based on uploaded docs. |
