from playwright.sync_api import sync_playwright
import ollama_parse as op
import time
import re
from flask_socketio import emit

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
            return page.title(), content
        except Exception as e:
            print(f"Error scraping: {e}")
            return None, None
        finally:
            browser.close()

def parse(text):
    if not text:
        return None
    try:
        res = text.split("Try Now")[1]
        return res.strip()
    except:
        return text  # Return full text if "Try Now" not found

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

    # Step 2 of protocol: return metadata for creating local storage on frontend
    emit("metadata", {"kb_id": kb_id, "title": title})

    # Step 3 of protocol: stream back tokens as they are generated.
    script = op.generate(parsed_text)
