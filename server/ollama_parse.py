from groq import Groq

client = Groq(
  api_key="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"
)

def generate_prompt(content):
    prompt = """
###INSTRUCTION: 
"Write a demonstration video script based on a Knowledge Base (KB) article. Include:

Intro: Brief title and purpose of the video.
Steps: Highlight key processes and commands with corresponding visuals and timestamps.
Usage: Show common examples and scenarios with clear explanations.
Notes: Include key considerations, caveats, or advanced options.
Outro: Summarize, thank viewers, and include a call to action.

### NO PREAMBLE, ONLY GENERATE THE SCRIPT THAT IS TO BE FED DIRECTLY TO AN AI VOICE
### DO NOT HALLUCINATE
Keep the script simple and professional ensuring clarity and pacing. Below is the KB article content"

### SCRAPED KB ARTICLE CONTENT:

"""

    return prompt + '\n' + content

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
