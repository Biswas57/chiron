import ollama_parse as op
import PyPDF2
import re
from flask_socketio import emit

def scrape_text(pdf_file):    
    reader = PyPDF2.PdfReader(pdf_file)
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

def begin_tokens_stream(pdf, filename):
    text = scrape_text(pdf)

    kb_id = scrape_kb_id(text)
    title = filename

    # first response returned is the kb_id and title before the first tokens
    # the double newline is the "delimiter" between events
    emit("response", {"kb_id": kb_id, "title": title})
    
    # then send back tokens as a series of responses
    op.generate(text)

    # finally send the completion response
    emit("response", {"success": True, "error": ""})