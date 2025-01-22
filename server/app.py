from flask import Flask, request, jsonify
from flask_cors import CORS
from scraper import scrape

app = Flask(__name__)
CORS(app) # GPT says -> to Enable Cross-Origin Resource Sharing so React can call this API

@app.route("/api/extract-text", methods=["POST"])
def extract_text_endpoint():
    """
    POST /api/extract-text
    Expects JSON body like: { "url": "https://example.com" }
    Returns JSON with the extracted text data.
    """

    data = request.get_json() # basically get request from React app
    if not data or "url" not in data:
        return jsonify({"error": "Missing 'url' in request body"}), 400

    url = data["url"]
    try:
        result = scrape(url)
        return jsonify({"success": True, "data": result}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    
if __name__ == "__main__":
    # Run the Flask development server (not for production use)
    app.run(debug=True, port=5000)

