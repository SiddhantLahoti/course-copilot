from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

class DocumentProcessor:
    @staticmethod
    def process_pdf(file_path: str):
        # Using PyPDFLoader for high-accuracy text extraction
        loader = PyPDFLoader(file_path)
        pages = loader.load()

        # Split into chunks of 1000 characters with 10% overlap 
        # to ensure the AI doesn't lose context between chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=100
        )
        chunks = text_splitter.split_documents(pages)
        
        return chunks