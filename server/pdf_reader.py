import groq_parse as gp
import PyPDF2
import re

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

def generate(pdf, filename):
    text = scrape_text(pdf)
    kb_id = scrape_kb_id(text)
    return kb_id, filename, gp.generate_script(text)
