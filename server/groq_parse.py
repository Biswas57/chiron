from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path=".env")
client = Groq(
  api_key=os.getenv('GROQ_API_KEY')
)

def generate_prompt(content):
    prompt = """
### INSTRUCTION: 
The following text is a Knowledge Base article for a Nutanix product. This article is to be converted to a video to assist users of the product run the steps outlined in the article themselves. Your task is to generate a script for this video, based on the article contents. 

Where multiple options or scenarios are presented in the article, choose the most common path to be presented in the video.

Your script will be converted to speech using TTS, and someone will manually generate the visuals based on your script, you should account for this in the pacing of the script. For pauses, add “...” on a new line, however, do not include any additional annotation or direction (i.e. do NOT include annotations such as [Intro music plays]), just the script. Do not include any preamble, only generate the script that is to be fed directly to an AI TTS (i.e. do NOT include something like “here is your script”).

### KB ARTICLE CONTENT:
"""

    return prompt + '\n\n' + content

def write_script(prompt):
    completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        model="llama-3.3-70b-versatile",
        stream=False,
    )

    return completion.choices[0].message.content


def generate_script(content):
    prompt = generate_prompt(content)
    return write_script(prompt)
