import groq_parse as gp
import PyPDF2
import re

def scrape_title_and_text(pdf_file, filename=None):
    if filename:
        title = filename.split('.')[0]
    else:
        title = "Untitled"
    
    reader = PyPDF2.PdfReader(pdf_file)
    text_list = []

    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text_list.append(page_text)

    full_text = "\n".join(text_list)
    return title, full_text

def scrape_kb_id(text):
    if not text:
        return None
    
    match = re.search(r"KB-[0-9]*", text)
    if not match:
        return "KB-????"
    else:
        return match.group()

def generate(pdf, filename):
    title, text = scrape_title_and_text(pdf, filename)
    kb_id = scrape_kb_id(text)
    return kb_id, title, gp.generate_script(text)


# pdf_file = "How to use the cvm_shutdown script to shutdown or restart a CVM.pdf"
# with open(pdf_file, 'rb') as f:
#     kb_id, title, text = generate(f, pdf_file)

# print('Script:', text)
# print("Title:", title)
# print("KB ID", kb_id)