import os
import tempfile
import uuid
from typing import List

import cloudinary
import cloudinary.uploader
import fitz  # PyMuPDF
from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline

load_dotenv()
app = FastAPI()

_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
_origins = [o.strip() for o in _origins if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_cloud = os.getenv("CLOUDINARY_CLOUD_NAME")
_key = os.getenv("CLOUDINARY_API_KEY")
_secret = os.getenv("CLOUDINARY_API_SECRET")
if _cloud and _key and _secret:
    cloudinary.config(cloud_name=_cloud, api_key=_key, api_secret=_secret)

_summarizer = None


def get_summarizer():
    global _summarizer
    if _summarizer is None:
        _summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
    return _summarizer


def chunk_text(text: str, max_chunk_size: int = 900) -> List[str]:
    """Split text into chunks suitable for the summarizer model."""
    paragraphs = text.split("\n")
    chunks = []
    current_chunk = ""
    for para in paragraphs:
        if len(current_chunk) + len(para) < max_chunk_size:
            current_chunk += para + " "
        else:
            chunks.append(current_chunk.strip())
            current_chunk = para + " "
    if current_chunk:
        chunks.append(current_chunk.strip())
    return [c for c in chunks if c]


@app.get("/")
def read_root():
    return {"message": "Nyaysathi Backend is running."}


@app.post("/summarize/")
async def summarize(file: UploadFile = File(...)):
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Please upload a PDF file.")

    if not (_cloud and _key and _secret):
        raise HTTPException(
            status_code=503,
            detail="Cloudinary is not configured. Set CLOUDINARY_* environment variables.",
        )

    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Empty file.")

    tmp_path = None
    try:
        fd, tmp_path = tempfile.mkstemp(suffix=".pdf", prefix=f"nyaysathi_{uuid.uuid4().hex}_")
        os.close(fd)
        with open(tmp_path, "wb") as f:
            f.write(contents)

        upload_result = cloudinary.uploader.upload(tmp_path, resource_type="raw")
        file_url = upload_result.get("secure_url")

        doc = fitz.open(tmp_path)
        try:
            text = "".join(page.get_text() for page in doc)
        finally:
            doc.close()

        if not text.strip():
            raise HTTPException(
                status_code=422,
                detail="No extractable text found in this PDF (it may be scanned or image-only).",
            )

        chunks = chunk_text(text)
        summarizer = get_summarizer()
        markdown_summaries = []
        for chunk in chunks:
            prompt = (
                "Summarize the following document section in detail. "
                "Include: Purpose, Requirements, Step-by-step Instructions, and Next Steps. "
                "Format the summary as Markdown with headings and bullet points.\n\n"
                f"{chunk}"
            )
            summary = summarizer(
                prompt, max_length=300, min_length=80, do_sample=False
            )[0]["summary_text"]
            markdown_summaries.append(summary)

        full_markdown_summary = "\n\n---\n\n".join(markdown_summaries)
        return {"summary": full_markdown_summary, "file_url": file_url}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Summarization failed: {e!s}") from e
    finally:
        if tmp_path and os.path.isfile(tmp_path):
            try:
                os.remove(tmp_path)
            except OSError:
                pass
