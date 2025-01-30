#!/usr/bin/env python3

import subprocess

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
    # Command and model name you'd like to run
    model_cmd = ["ollama", "run", "llama3.1:8b"]

    # Run the command, sending `prompt` to its stdin
    # `capture_output=True` captures the response
    result = subprocess.run(
        model_cmd,
        input=prompt,
        capture_output=True,
        text=True
    )

    # Ollama’s output comes from stdout
    return result.stdout

def generate_script(content):
    """
    High-level function that builds the prompt,
    calls Ollama, and returns the AI's completion.
    """
    prompt = generate_prompt(content)
    completion_text = write_script(prompt)
    return completion_text

# Example usage:
def generate(content):
    script_result = generate_script(content)
    return script_result