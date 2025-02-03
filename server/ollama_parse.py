#!/usr/bin/env python3

import subprocess
from flask_socketio import emit
from flask import current_app as app
from ollama import chat

def generate_prompt(content):
    """
    Build the text prompt you want to send to Ollama.
    """
    prompt = """
### INSTRUCTION: 
The following text is a Knowledge Base article for a Nutanix product. This article is to be converted to a video to assist users of the product run the steps outlined in the article themselves. Your task is to generate a script for this video, based on the article contents. 

Where multiple options or scenarios are presented in the article, choose the most common path to be presented in the video.

Your script will be converted to speech using TTS, and someone will manually generate the visuals based on your script, you should account for this in the pacing of the script. For pauses, add “...” on a new line, however, do not include any additional annotation or direction (i.e. do NOT include annotations such as [Intro music plays]), just the script. Do not include any preamble, only generate the script that is to be fed directly to an AI TTS (i.e. do NOT include something like “here is your script”).

### KB ARTICLE CONTENT:
"""
    return prompt + "\n\n" + content

def write_script(prompt):
    """
    Pass the prompt to Ollama via subprocess.
    Capture the model's response from stdout.
    """
    # # Command and model name you'd like to run
    # model_cmd = ["ollama", "run", "llama3.1:8b"]

    # # Run the command, sending `prompt` to its stdin
    # # `capture_output=True` captures the response
    # process = subprocess.Popen(
    #     model_cmd,
    #     stdout=subprocess.PIPE,
    #     stderr=subprocess.PIPE,
    #     stdin=subprocess.PIPE,
    #     text=True,
    #     bufsize=1  # Line-buffered output
    # )

    # try:
    #     process.stdin.write(prompt + "\n")
    #     process.stdin.flush()
    #     process.stdin.close()

    #     for line in process.stdout:
    #         app.logger.debug(line)
    #         
    #     emit("complete", {})

    # except:
    #     emit("error", {"error": "Internal server error"})

    # finally:
    #     process.wait()

    stream = chat(
        model='llama3.1:8b',
        messages=[{'role': 'user', 'content': prompt}],
        stream=True,
    )

    for chunk in stream:
        emit("tokens", {"tokens": chunk['message']['content']})
    emit("complete", {})

def generate(content):
    """
    High-level function that builds the prompt,
    calls Ollama, and returns the AI's completion.
    """
    prompt = generate_prompt(content)
    write_script(prompt)
