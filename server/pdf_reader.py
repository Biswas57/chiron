import ollama_parse as op
import PyPDF2
import re
from flask_socketio import emit
from ollama_parse import models as ollama_models_dict

def scrape_text(pdf_file):
    try:
        reader = PyPDF2.PdfReader(pdf_file)
    except Exception as e:
        emit("error", {"error": f"PDF file cannot be read: {str(e)}"})
        return None

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

def kb_check(page_content):
    kb_match = re.search(r"KB-[0-9]*", page_content)
    if kb_match:
        return True
    return False


def generate(pdf, filename, model_idx):
    text = scrape_text(pdf)
    if text is None:
        return

    kb_id = scrape_kb_id(text)
    title = filename.split(".pdf")[0]

    emit("metadata", {"kb_id": kb_id, "title": title, "model": ollama_models_dict[model_idx]['display_name']})
    op.generate(text, model_idx)
