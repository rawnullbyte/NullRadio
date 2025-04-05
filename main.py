from flask import Flask, send_from_directory, jsonify
import os
import uvicorn
from flask import Flask

app = Flask(__name__)

# Path to the assets directory where waifu images are stored
ASSETS_DIR = 'assets/waifus/'

@app.route('/')
def index():
    return send_from_directory('./static', 'index.html')

# Serve all files from the static directory at the root path
@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('./static', filename)

@app.route('/assets/waifus/')
def get_waifu_images():
    # Get all image files in the waifu directory
    files = [f for f in os.listdir(ASSETS_DIR) if os.path.isfile(os.path.join(ASSETS_DIR, f)) and f.endswith(('jpg', 'png', 'jpeg'))]
    return jsonify({'files': files})

@app.route('/assets/waifus/<filename>')
def get_waifu_image(filename):
    # Serve specific waifu image
    return send_from_directory(ASSETS_DIR, filename)

# Start the app with Uvicorn
if __name__ == '__main__':
    uvicorn.run(app, host="0.0.0.0", port=8000)
