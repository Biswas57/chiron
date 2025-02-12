#!/usr/bin/env python3
from flask_socketio import emit
from flask import current_app as app
import ollama
import tiktoken
import math
from client_queue_mgmt import dequeue

# The models that we have available. This is queried when the app boots to download
# the models if they haven't been already.
models = [
    {
        "display_name": "Llama-3.1-8B-Instruct (FP16)",
        "note": "Decent Quality Script | Fast",
        "ollama_name": "llama3.1:8b-instruct-fp16",
        "context_length": 131072,
    },
    {
        "display_name": "Llama-3.3-70B-Instruct (FP16)",
        "note": "High Quality Script | Slow",
        "ollama_name": "llama3.3:70b-instruct-fp16",
        "context_length": 131072,
    },
    {
        "display_name": "Llama 3.2 1B Q4 Debug ",
        "note": "Dev use only!",
        "ollama_name": "llama3.2:1b",
        "context_length": 131072,
    },
]

def generate_prompt(content):
    """
    Build the text prompt you want to send to Ollama.
    """
    prompt = """
### INSTRUCTION:
The following text is a Knowledge Base or Confluence article for a Nutanix product. This article is to be converted to a video to assist users of the product run the steps outlined in the article themselves. Your task is to generate a script for this video, based on the article contents.
Where multiple options or scenarios are presented in the article, choose the most common path to be presented in the video.
Your script will be converted to speech using TTS, and someone will manually generate the visuals based on your script, you should account for this in the pacing of the script. For pauses, add “...” on a new line, however, do not include any additional annotation or direction (i.e. do NOT include annotations such as [Intro music plays]), just the script. Do not include any preamble, only generate the script that is to be fed directly to an AI TTS (i.e. do NOT include something like “here is your script”).
### REQUIREMENTS:
- Format commands, code snippets, or terminal inputs using Markdown-style formatting (e.g., wrap inline commands in single backtick: `command` and command code blocks in triple backticks: ```bash command```).
- Use ellipses ("...") on a new line to indicate pauses for better pacing.
- Do not include preambles, explanations, or annotations (e.g., [Intro music plays]).
- The script should be written as it will be read by AI TTS, without extra instructions.
### NO PREAMBLE. SCRIPT ONLY
### KB ARTICLE CONTENT:
"""
    return prompt + "\n\n" + content

def write_script(prompt, model_idx):
    """
    Pass the prompt to Ollama via subprocess.
    Capture the model's response from stdout.
    """

    # Count tokens using OpenAI's tokenizer.
    # The Llama tokenizer can't be used as access must be granted by the model author.
    enc = tiktoken.get_encoding("gpt2")
    tokens = enc.encode(prompt)
    token_count = len(tokens)
    app.logger.debug(f"Token count is {token_count} and model is {models[model_idx]['display_name']}")

    if token_count > models[model_idx]["context_length"]:
        app.logger.debug(f"Token count exceeds context size")
        emit("error", {"error": f"Your article's tokens count exceeds the context window limit of the selected model {token_count} > {models[model_idx]['context_length']}. Note: a token is usually 3/4 of a word."})
        return

    # Now send the request to the Ollama service
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
    app.logger.debug(f"Done! Sending complete event")
    emit("complete", {})

    # Inform queueing client AI is ready for next job
    # This is done after completion event to avoid race conditions on the queue.
    dequeue()

def generate(content, model_idx):
    """
    High-level function that builds the prompt,
    calls Ollama, and returns the AI's completion.
    """
    prompt = generate_prompt(content)
    write_script(prompt, model_idx)
