from flask import Flask, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import url_scraper as us 
import pdf_reader as pr
from urllib.parse import urlparse
import signal
import sys
from ollama_parse import models as ollama_models_dict
import base64
import io
import ollama
import os
from client_queue import client_queue, refresh_queue_to_all

# Before we do anything, make sure all the models are downloaded
print("BOOTING UP")

print("*** Downloaded models:")
models = [model.model for model in ollama.list().models]
print(models)

print("*** Needed models:")
print([model_dict['ollama_name'] for model_dict in ollama_models_dict])

for model in ollama_models_dict:
    print(f"Checking status of {model['ollama_name']}...", end="")
    found = False
    for full_model_name in models:
        if model['ollama_name'] in full_model_name:
            print(f"downloaded!")
            found = True
            break

    if not found:
        print(f"haven't been downloaded...downloading:")
        shcmd = f"ollama pull {model['ollama_name']}"
        print(f"executing shell command: {shcmd}")
        try:
            if os.system(shcmd) != 0:
                sys.exit(1)
        except Exception as e:
            print(f"{str(e)}")

print("ALL MODELS OK...CONTINUING BOOT")

# Initialise the server
app = Flask(__name__)
CORS(app)

app.config['ALLOWED_EXTENSIONS'] = {'pdf'}

socketio = SocketIO(app, cors_allowed_origins="*")

def handle_exit(signum, frame):
    print("\nGracefully shutting down...")
    sys.exit(0)

signal.signal(signal.SIGINT, handle_exit)  # Handle Ctrl+C
signal.signal(signal.SIGTERM, handle_exit)  # Handle termination signals

# Event handlers on the websocket
@socketio.on('connect')
def handle_connect():
    # Step 0 of protocol: handshake with the server and create a session.
    app.logger.debug(f'Client #{request.sid} CONNECTED')

@socketio.on('disconnect')
def handle_disconnect():
    app.logger.debug(f'Client #{request.sid} DISCONNECTED')
    for i, client_state in enumerate(client_queue):
        if client_state["sid"] == request.sid:
            del client_queue[i]
            refresh_queue_to_all()

def is_valid_url(url):
    """Basic URL validation"""
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except ValueError:
        return False

@socketio.on("get_models")
def handle_get_models():
    app.logger.debug(f"Client #{request.sid} REQUESTED_MODEL_LIST")
    emit("get_models_return", ollama_models_dict)

# Queue calls
@socketio.on("enqueue")
def enqueue(data):
    client_queue.append({"sid": request.sid})
    app.logger.debug(f"Client #{request.sid} QUEUE POS {len(client_queue)}")
    emit("queue", {"queue_pos": len(client_queue)})

@socketio.on("url_generate")
def handle_url_generate(data):
    # Step 1 of protocol: request a URL to be scraped and AI'ed.
    app.logger.debug(f"Client #{request.sid} URL GENERATE")
    app.logger.debug(data)

    try:
        if "url" not in data:
            emit("error", {"error": "Payload missing URL key."})
        elif len(data["url"]) > 2048:
            emit("error", {"error": "URL longer than 2048 characters."})
        elif "modelIdx" not in data:
            emit("error", {"error": "Payload missing model index key."})
        elif not is_valid_url(data["url"]):
            emit("error", {"error": "Malformed URL."})
        elif int(data["modelIdx"]) > len(ollama_models_dict):
            emit("error", {"error": "Model index out of bound"})
        else:
            app.logger.debug(f'Client #{request.sid} generating URL {data["url"]} with model {data["modelIdx"]}')

            # The URL scraper will further return events for the frontend.
            us.generate(data["url"], data["modelIdx"])
    except Exception as e:
        emit("error", {"error": f"An internal server error occured: {str(e)}"})

@socketio.on("file_generate")
def handle_file_generate(data):
    app.logger.debug(f"Client #{request.sid} FILE GENERATE")

    try:
        if "filename" not in data:
            emit("error", {"error": "Payload missing filename key."})
        elif "data" not in data:
            emit("error", {"error": "Payload missing data key."})
        elif "modelIdx" not in data:
            emit("error", {"error": "Payload missing model index key."})
        elif int(data["modelIdx"]) > len(ollama_models_dict):
            emit("error", {"error": "Model index out of bound"})
        else:
            app.logger.debug(f'Client #{request.sid} generating PDF {data["filename"]} with model {data["modelIdx"]}')
            pdf_bytes = base64.b64decode(data["data"])
            if len(pdf_bytes) > 16777216:
                emit("error", {"error": "PDF over 16 megabytes!"})
                return

            pdf_buffer = io.BytesIO(pdf_bytes)
            pr.generate(pdf_buffer, data["filename"], data["modelIdx"])
    except Exception as e:
        emit("error", {"error": f"An internal server error occured: {str(e)}"})

if __name__ == "__main__":
    # Run the Flask development server (not for production use)
    socketio.run(app, debug=True, host='0.0.0.0', port=4242, allow_unsafe_werkzeug=True)
