from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import url_scraper as us 
import pdf_reader as pr
from urllib.parse import urlparse
import base64

app = Flask(__name__)
CORS(app)

app.config['ALLOWED_EXTENSIONS'] = {'pdf'}

socketio = SocketIO(app, cors_allowed_origins="*")

API_PATH = '/web_sock_api'

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

@socketio.on("url_generate")
def handle_url_generate(data):
    # Step 1 of protocol: request a URL to be scraped and AI'ed.
    app.logger.debug(data)

    if "url" not in data:
        emit("error", {"error": "Payload missing URL key."})
    elif not is_valid_url(data["url"]):
        emit("error", {"error": "Malformed URL."})
    else:
        app.logger.debug(f'Client #{request.sid} generating URL {data["url"]}')

        # The URL scraper will further return events for the frontend.
        us.generate(data["url"])


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
    socketio.run(app, debug=True, host='0.0.0.0', port=4200)
