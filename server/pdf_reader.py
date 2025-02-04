import ollama_parse as op
import PyPDF2
import re
from flask_socketio import emit

def scrape_text(pdf_file):
    try:
        reader = PyPDF2.PdfReader(pdf_file)
    except Exception as e:
        emit("error", {"error": f"PDF file cannot be read: {str(e)}"})

    text_list = []

    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text_list.append(page_text)

    full_text = "\n".join(text_list)
    return full_text

def scrape_kb_id(text):
    if not text:
        return None
    
    match = re.search(r"KB-[0-9]*", text)
    if not match:
        return "KB-????"
    else:
        return match.group()

def generate(pdf, filename, model_idx):
    text = scrape_text(pdf)

    kb_id = scrape_kb_id(text)
    title = filename

    emit("metadata", {"kb_id": kb_id, "title": title})
    op.generate(text, model_idx)
