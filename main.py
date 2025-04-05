from fastapi import FastAPI
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
import os
from pathlib import Path
import uvicorn

app = FastAPI()

# Path to the assets directory where waifu images are stored
ASSETS_DIR = Path('assets/waifus/')
STATIC_DIR = Path('static')

# Mount the static directory to serve files from it at /static/ (not at the root)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Route to serve static files without the "/static/" prefix
@app.get("/{filename}")
async def serve_static_file(filename: str):
    file_path = STATIC_DIR / filename
    if file_path.is_file():
        return FileResponse(file_path)
    return JSONResponse({"error": "File not found"}, status_code=404)

@app.get("/assets/waifus/")
async def get_waifu_images():
    # Get all image files in the waifu directory
    files = [f for f in os.listdir(ASSETS_DIR) if ASSETS_DIR.joinpath(f).is_file() and f.endswith(('jpg', 'png', 'jpeg'))]
    return JSONResponse({"files": files})

@app.get("/assets/waifus/{filename}")
async def get_waifu_image(filename: str):
    # Serve a specific waifu image
    file_path = ASSETS_DIR / filename
    if file_path.is_file():
        return FileResponse(file_path)
    return JSONResponse({"error": "File not found"}, status_code=404)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)
