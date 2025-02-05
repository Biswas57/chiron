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
        try:
            os.system(f"ollama pull {model['ollama_name']}")
        except Exception as e:
            print(f"{str(e)}")


app = Flask(__name__)
CORS(app)

app.config['ALLOWED_EXTENSIONS'] = {'pdf'}

socketio = SocketIO(app, cors_allowed_origins="*")

API_PATH = '/web_sock_api'

# Set up signal handling to ensure subprocesses such as Ollama also exit
def handle_exit(signum, frame):
    print("\nGracefully shutting down...")
    # Perform any additional cleanup if required
    sys.exit(0)

signal.signal(signal.SIGINT, handle_exit)  # Handle Ctrl+C
signal.signal(signal.SIGTERM, handle_exit)  # Handle termination signals

@socketio.on('connect')
def handle_connect():
    # Step 0 of protocol: handshake with the server and create a session.
    app.logger.debug(f'Client #{request.sid} CONNECTED')

@socketio.on('disconnect')
def handle_disconnect():
    app.logger.debug(f'Client #{request.sid} DISCONNECTED')

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

@socketio.on("url_generate")
def handle_url_generate(data):
    # Step 1 of protocol: request a URL to be scraped and AI'ed.
    app.logger.debug(f"Client #{request.sid} URL GENERATE")
    app.logger.debug(data)

    try:
        if "url" not in data:
            emit("error", {"error": "Payload missing URL key."})
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
            pdf_buffer = io.BytesIO(pdf_bytes)
            pr.generate(pdf_buffer, data["filename"], data["modelIdx"])
    except Exception as e:
        emit("error", {"error": f"An internal server error occured: {str(e)}"})

if __name__ == "__main__":
    # Run the Flask development server (not for production use)
    socketio.run(app, debug=True, host='0.0.0.0', port=6969)
