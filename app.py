
from flask import Flask, render_template, request, jsonify
from deep_translator import GoogleTranslator
from deep_translator.exceptions import TooManyRequests
import time

app = Flask(__name__)

last_request_time = 0

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/translate", methods=["POST"])
def translate():
    global last_request_time

    try:
        # Get frontend data
        data = request.get_json()

        if not data:
            return jsonify({
                "error": "Invalid request data"
            }), 400

        text = data.get("text", "").strip()
        source = data.get("source", "auto")
        target = data.get("target", "en")

        # Validate input
        if not text:
            return jsonify({
                "error": "Please enter text to translate"
            }), 400

        if len(text) > 5000:
            return jsonify({
                "error": "Text must not exceed 5000 characters"
            }), 400

        if not source or not target:
            return jsonify({
                "error": "Please select source and target languages"
            }), 400

        # Same language - no translation needed
        if source == target:
            return jsonify({
                "translatedText": text
            })

        # Prevent rapid repeated requests
        current_time = time.time()

        if current_time - last_request_time < 2:
            return jsonify({
                "error": "Please wait 2 seconds before translating again"
            }), 429

        last_request_time = current_time

        # Translate text
        translated = GoogleTranslator(
            source=source,
            target=target
        ).translate(text)

        return jsonify({
            "translatedText": translated
        })

    except TooManyRequests:
        return jsonify({
            "error": "Google Translate is temporarily limiting requests. Please try again later."
        }), 429

    except Exception as e:
        print("Translation Error:", str(e))

        return jsonify({
            "error": "Translation failed. Please check your internet connection and language selection."
        }), 500


@app.errorhandler(404)
def page_not_found(error):
    return jsonify({
        "error": "Page not found"
    }), 404


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )
