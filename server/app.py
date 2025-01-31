from flask import Flask, request, jsonify
from flask_cors import CORS
import url_scraper as us 
import pdf_reader as pr
from urllib.parse import urlparse

app = Flask(__name__)
CORS(app)

app.config['ALLOWED_EXTENSIONS'] = {'pdf'}


def is_valid_url(url):
    """Basic URL validation"""
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except ValueError:
        return False

@app.route("/api/url-generate", methods=["POST"])
def extract_text_endpoint():
    """
    POST /api/url-generate
    Expects JSON body like: { "url": "https://example.com" }
    Returns JSON with the extracted text data.
    """
    data = request.get_json()
    if not data or "url" not in data:
        return jsonify({
            "success": False,
            "error": "Missing 'url' in request body"
        }), 400

    url = data["url"]
    if not is_valid_url(url):
        return jsonify({
            "success": False,
            "error": "Invalid URL provided"
        }), 400

    try:
        kb_id, title, result = us.generate(url)
        if not result:
            return jsonify({
                "success": False,
                "error": "Failed to extract content from URL"
            }), 404
            
        return jsonify({
            "success": True,
            "kb_id": kb_id,
            "title": title,
            "data": result
        }), 200
        
    except Exception as e:
        print("extract_text_endpoint(): exception thrown: " + str(e))
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
    
@app.route("/api/pdf-generate", methods=["POST"])
def extract_pdf_endpoint():
    """
    POST /api/pdf-generate
    Expects JSON body like: { "file": <file object> }
    Returns JSON with the extracted text data.
    """
    if 'file' not in request.files:
        return jsonify({"error": "No file key in request body"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No uploaded file"}), 400

    try:
        file.stream.seek(0)
        kb_id, title, text = pr.generate(file.stream, file.filename)

        return jsonify({
            "success": True,
            "kb_id": kb_id,
            "title": title,
            "data": text
        }), 200
        
    except Exception as e:
        print("extract_pdf_endpoint(): exception thrown: " + str(e))
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

if __name__ == "__main__":
    # Run the Flask development server (not for production use)
    app.run(debug=True, port=5000)
