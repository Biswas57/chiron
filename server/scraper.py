from playwright.sync_api import sync_playwright
import ollama_parse as op
import time

def scrape_text(url):
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
            return content
        except Exception as e:
            print(f"Error scraping: {e}")
            return None
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

def scrape(url):
    text = scrape_text(url)
    parsed_text = parse(text)
    return op.generate_script(parsed_text)
