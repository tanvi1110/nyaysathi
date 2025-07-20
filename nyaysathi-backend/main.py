from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import cloudinary
import cloudinary.uploader
import fitz  # PyMuPDF
from transformers import pipeline
from typing import List
import os
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()

# CORS (Allow Next.js frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cloudinary config (replace with your values)
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

def chunk_text(text: str, max_chunk_size: int = 900) -> List[str]:
    """Split text into chunks suitable for the summarizer model."""
    paragraphs = text.split('\n')
    chunks = []
    current_chunk = ""
    for para in paragraphs:
        if len(current_chunk) + len(para) < max_chunk_size:
            current_chunk += (para + " ")
        else:
            chunks.append(current_chunk.strip())
            current_chunk = para + " "
    if current_chunk:
        chunks.append(current_chunk.strip())
    return chunks

@app.get("/")
def read_root():
    return {"message": "Nyaysathi Backend is running."}

@app.post("/summarize/")
async def summarize(file: UploadFile = File(...)):
    contents = await file.read()

    # Save the file locally
    with open("temp.pdf", "wb") as f:
        f.write(contents)

    # Upload to Cloudinary
    upload_result = cloudinary.uploader.upload("temp.pdf", resource_type="raw")
    file_url = upload_result["secure_url"]

    # Extract text using PyMuPDF
    doc = fitz.open("temp.pdf")
    text = ""
    for page in doc:
        text += page.get_text()

    # Chunk the text for long documents
    chunks = chunk_text(text)
    markdown_summaries = []
    for chunk in chunks:
        prompt = (
            "Summarize the following document section in detail. "
            "Include: Purpose, Requirements, Step-by-step Instructions, and Next Steps. "
            "Format the summary as Markdown with headings and bullet points.\n\n"
            f"{chunk}"
        )
        summary = summarizer(prompt, max_length=300, min_length=80, do_sample=False)[0]["summary_text"]
        markdown_summaries.append(summary)

    # Combine all chunk summaries into one Markdown string
    full_markdown_summary = "\n\n---\n\n".join(markdown_summaries)

    return {"summary": full_markdown_summary, "file_url": file_url}
