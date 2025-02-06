#!/usr/bin/env python3
from flask_socketio import emit
from flask import current_app as app
import ollama
import tiktoken
import math

models = [
    {
        "display_name": "Llama-3.1-8B",
        "note": "Low quality script | Fast",
        "ollama_name": "llama3.1:8b",
    },
    {
        "display_name": "Llama-3.3-70B-Instruct",
        "note": "High quality script | Very slow",
        "ollama_name": "llama3.3",
    },
    {
        "display_name": "DeepSeek-R1-Distill-Llama-70B",
        "note": "Experimental | Slow",
        "ollama_name": "deepseek-r1:70b",
    }
]

def generate_prompt(content):
    """
    Build the text prompt you want to send to Ollama.
    """
    prompt = """
### INSTRUCTION:
The following text is a Knowledge Base or Confluence article for a Nutanix product. This article will be converted into a video script that guides users through the content explained in the article. Your task is to generate a video script based solely on the article's content. When multiple options or scenarios are presented, choose the most common path for the video.
Your script will be fed into an AI text-to-speech engine, and visuals will be manually created based on your script. For natural pacing, include pauses by placing an ellipsis (`...`) on a new line where appropriate. Do not include any annotations, directions, or extra commentary (for example, do not include annotations like `[Intro music plays]`).
### REQUIREMENTS:
- The script should be plain text intended for TTS output, with ellipses (`...`) on separate lines to indicate pauses.
- Do not include any introductory or concluding remarks, explanations, or extra annotations.
- Format any commands, code snippets, or terminal inputs using Markdown formatting:
  - Use triple backticks with a language specifier for code blocks (e.g.:
    ```bash
    <command>
    ```
  - Use single backticks for inline commands (e.g. `<command>`).
### NO PREAMBLE. SCRIPT FORMAT ONLY.
### KB ARTICLE CONTENT:
"""
    return prompt + "\n\n" + content

def write_script(prompt, model_idx):
    """
    Pass the prompt to Ollama via subprocess.
    Capture the model's response from stdout.
    """

    # Count tokens using OpenAI's tokenizer
    # The Llama tokenizer can't be used as access must be granted by the model author.
    enc = tiktoken.get_encoding("gpt2")
    tokens = enc.encode(prompt)
    token_count = len(tokens)
    app.logger.debug(f"Token count is {token_count} and model is {models[model_idx]['display_name']}")

    resp = ollama.generate(
        model=models[model_idx]["ollama_name"],
        prompt=prompt,
        stream=True,
        options={
            "num_ctx": math.floor(token_count * 1.2) # Over-estimate the required tokens needed because the OpenAI tokenizer is different
        },
    )

    for chunk in resp:
        # Step 3 of protocol: stream back tokens as they are generated.
        emit("tokens", {"tokens": chunk["response"]})

    # Step 4 of protocol: send a completion event.
    emit("complete", {})

def generate(content, model_idx):
    """
    High-level function that builds the prompt,
    calls Ollama, and returns the AI's completion.
    """
    prompt = generate_prompt(content)
    write_script(prompt, model_idx)
