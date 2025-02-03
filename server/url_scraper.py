from playwright.sync_api import sync_playwright
import groq_parse as gp
import time
import re
import platform

def is_login_page(page_content):
    if "Log in with your Email" in page_content:
        return True
    return False

def scrape_title_and_text(url):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto(url)
            
            # Auto-scroll to load dynamic content
            last_height = page.evaluate('document.body.scrollHeight')
            while True:
                time.sleep(1)
                new_height = page.evaluate('document.body.scrollHeight')
                if new_height == last_height:
                    break
                last_height = new_height
                
            content = page.evaluate('document.body.innerText')

            if is_login_page(content):
                raise ValueError("This KB Article is not available for Public Access. Try uploading a PDF.")
            
            return page.title(), content
        except Exception as e:
            print(f"Error scraping: {e}")
            raise
        finally:
            browser.close()

def parse(text):
    if not text:
        return None
    try:
        res = text.split("Try Now")[1].strip()
    except IndexError:
        res = text
    return res

def scrape_kb_id(text):
    if not text:
        return None
    
    match = re.search(r"KB-[0-9]*", text)
    if not match:
        return "KB-????"
    else:
        return match.group()

def generate(url):
    title, text = scrape_title_and_text(url)
    parsed_text = parse(text)
    kb_id = scrape_kb_id(parsed_text)
    return kb_id, title, gp.generate_script(parsed_text)
