from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def scrape_text(url):
    return "Try Now hehe cat"

    PATH = "chromedriver-mac-x64/chromedriver"
    service = Service(PATH)

    options = Options()
    options.add_argument("--headless") # Run browser in headless mode (no browser)
    driver = webdriver.Chrome(service=service, options=options)

    try:
        driver.get(url) 
        last_height = driver.execute_script("return document.body.scrollHeight")

        while True:
            time.sleep(1)
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            
            new_height = driver.execute_script("return document.body.scrollHeight")
            if new_height == last_height: #checking if scrolling further doesnt make a difference 
                break
            last_height = new_height

        page_title = driver.title
        content = driver.find_element(By.TAG_NAME, "body").text

        return content
    except:
        print('Womp Womp')
    finally:
        driver.quit()


def parse(text):
    res = text.split("Try Now")[1]
    return res.strip()

def scrape(url):
    # url = "https://portal.nutanix.com/page/documents/kbs/details?targetId=kA0VO0000004een0AA"
    # url = "https://portal.nutanix.com/page/documents/kbs/details?targetId=kA0320000004H2NCAU"

    text = scrape_text(url)
    res = parse(text)
    return res
