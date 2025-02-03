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
    
def conf_check(filename):
    title_pattern = r"^([\w\s]+)_[a-f0-9]{32}-\d{6}-\d{4}-\d{5}\.pdf$"
    id_pattern = r"^(\d+)_([a-f0-9]{32})-(\d{6})-(\d{4})-(\d{5})\.pdf$"

    if re.fullmatch(id_pattern, filename):
        return True, False
    elif re.fullmatch(title_pattern, filename):
        return True, True
    else:
        return False, False
     

def kb_check(page_content):
    kb_match = re.search(r"KB-[0-9]*", page_content)
    if kb_match:
        return True
    return False


def generate(pdf, filename):
    text = scrape_text(pdf)

    is_conf, title_in_filename = conf_check(filename)
    if is_conf:
        id = 'Confluence'
        print(title_in_filename)
        if title_in_filename:
            title = filename.split('_')[0]
        else:
            content_lines = text.split('\n')
            title = content_lines[0]
    elif kb_check(text):
        id = scrape_kb_id(text)
        title = filename.split('.')[0]
    else:
        raise Exception('PDF must be a KB or Confluence Article.')
    
    return id, title, gp.generate_script(text)
