from flask import Flask, request, jsonify
from flask_cors import CORS
from scraper import scrape
from urllib.parse import urlparse

app = Flask(__name__)
CORS(app)

def is_valid_url(url):
    """Basic URL validation"""
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except ValueError:
        return False

@app.route("/api/extract-text", methods=["POST"])
def extract_text_endpoint():
    """
    POST /api/extract-text
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
    print(url)
    if not is_valid_url(url):
        return jsonify({
            "success": False,
            "error": "Invalid URL provided"
        }), 400

    try:
        kb_id, title, result = scrape(url)
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

if __name__ == "__main__":
    # Run the Flask development server (not for production use)
    app.run(debug=True, port=5000)
