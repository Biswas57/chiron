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

@socketio.on("file_generate")
def handle_file_generate(data):
    app.logger.debug(f"Client #{request.sid} FILE GENERATE")

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
    
# @app.route("/api/url-generate", methods=["POST"])
# def extract_text_endpoint():
#     """
#     POST /api/url-generate
#     Expects JSON body like: { "url": "https://example.com" }
#     Returns JSON with the extracted text data.
#     """
#     data = request.get_json()
#     if not data or "url" not in data:
#         return jsonify({
#             "success": False,
#             "error": "Missing 'url' in request body"
#         }), 400

#     url = data["url"]
#     if not is_valid_url(url):
#         return jsonify({
#             "success": False,
#             "error": "Invalid URL provided"
#         }), 400

#     try:
#         kb_id, title, result = us.generate(url)
#         if not result:
#             return jsonify({
#                 "success": False,
#                 "error": "Failed to extract content from URL"
#             }), 404
            
#         return jsonify({
#             "success": True,
#             "kb_id": kb_id,
#             "title": title,
#             "data": result
#         }), 200
        
#     except Exception as e:
#         print("extract_text_endpoint(): exception thrown: " + str(e))
#         return jsonify({
#             "success": False,
#             "error": str(e)
#         }), 500
    
# @socketio.on("/api/pdf-generate")
# def extract_pdf_endpoint():
#     """
#     POST /api/pdf-generate
#     Expects JSON body like: { "file": <file object> }
#     Returns JSON with the extracted text data.
#     """
#     if 'file' not in request.files:
#         return jsonify({"error": "No file key in request body"}), 400

#     file = request.files['file']

#     if file.filename == '':
#         return jsonify({"error": "No uploaded file"}), 400

#     try:
#         file.stream.seek(0)
#         pr.begin_tokens_stream(file.stream, file.filename)
        
#     except Exception as e:
#         print("extract_pdf_endpoint(): exception thrown: " + str(e))
#         emit("error", {"success": False, "error": str(e)})

if __name__ == "__main__":
    # Run the Flask development server (not for production use)
    socketio.run(app, debug=True, host='0.0.0.0', port=6969)
