# uvicorn app:app --host 127.0.0.1 --port 8000
# .venv\Scripts\activate

import traceback
from io import BytesIO

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.concurrency import run_in_threadpool
from PIL import Image, UnidentifiedImageError

from model import analyze_clothing

app = FastAPI(title="EcoScan Vision Service")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    print("Received image", flush=True)

    if file.content_type not in {"image/jpeg", "image/png", "image/webp"}:
        raise HTTPException(status_code=400, detail="Unsupported image type")

    content = await file.read()
    if not content or len(content) > 8 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image must be between 1 byte and 8 MB")

    try:
        image = Image.open(BytesIO(content)).convert("RGB")
    except (UnidentifiedImageError, OSError):
        raise HTTPException(status_code=400, detail="Invalid image file")

    print("Image decoded; starting analysis", flush=True)

    try:
        # Run the blocking model call in a worker thread so the server stays responsive.
        result = await run_in_threadpool(analyze_clothing, image)
        print("Analysis completed", flush=True)
        return result
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Image analysis failed: {e}")