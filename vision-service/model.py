import io, json, os
from concurrent.futures import ThreadPoolExecutor, TimeoutError as FutTimeout

import torch
from PIL import Image
from google import genai
from google.genai import types
from transformers import CLIPModel, CLIPProcessor

ALLOWED_TYPES = ["tshirt", "shirt", "jeans", "trousers", "dress",
                 "jacket", "sweater", "shorts", "skirt", "shoes", "hoodie"]

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

GEMINI_MODELS = [
    "gemini-3.5-flash-lite",
    "gemini-3.1-flash-lite",
    "gemini-3.5-flash",
    "gemini-3.7-flash",
    "gemini-3.8-flash",
]

PROMPT = f"""List every clearly visible clothing or footwear item.
Return JSON: {{"items":[{{"type":TYPE,"color":COLOR,"quantity":COUNT}}]}}
TYPE is one of: {", ".join(ALLOWED_TYPES)}, other.
COLOR is the main color in plain words. COUNT is an integer.
If no clothing is visible, return {{"items":[]}}."""

def _gemini(image: Image.Image):
    img = image.copy()
    img.thumbnail((768, 768))
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=85)
    part = types.Part.from_bytes(data=buf.getvalue(), mime_type="image/jpeg")

    last_err = None
    for model_name in GEMINI_MODELS:
        for attempt in range(2):
            try:
                resp = client.models.generate_content(
                    model=model_name,
                    contents=[part, PROMPT],
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        temperature=0,
                        max_output_tokens=400,
                    ),
                )
                return json.loads(resp.text)
            except Exception as e:
                last_err = e
                print(f"{model_name} attempt {attempt+1} failed: {e!r}", flush=True)
                if "404" in str(e) or "NOT_FOUND" in str(e):
                    break         
                time.sleep(1.5)
    raise last_err

# ---------- Fallback: CLIP on CPU ----------
_clip = CLIPModel.from_pretrained("openai/clip-vit-base-patch32").eval()
_clip_proc = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
_labels = ALLOWED_TYPES
_text_prompts = [f"a photo of a {l}" for l in _labels]

def _clip_classify(image: Image.Image):
    inputs = _clip_proc(text=_text_prompts, images=image, return_tensors="pt", padding=True)
    with torch.inference_mode():
        probs = _clip(**inputs).logits_per_image.softmax(dim=1)[0]
    idx = int(probs.argmax())
    return {"items": [{"type": _labels[idx], "color": "uncertain", "quantity": 1}]}

# ---------- Public function (same name your app.py already calls) ----------
_pool = ThreadPoolExecutor(max_workers=2)

def analyze_clothing(image: Image.Image):
    try:
        data = _pool.submit(_gemini, image).result(timeout=12)
    except (FutTimeout, Exception) as e:
        print("Gemini failed, using CLIP fallback:", e, flush=True)
        data = _clip_classify(image)
        data["fallback"] = True

    items = []
    for it in data.get("items", [])[:20]:
        if not isinstance(it, dict):
            continue
        t = str(it.get("type", "other")).lower()
        if t not in ALLOWED_TYPES:
            t = "other"
        try:
            q = int(it.get("quantity", 1))
        except (TypeError, ValueError):
            q = 1
        items.append({"type": t,
                      "color": str(it.get("color", "uncertain"))[:40],
                      "quantity": max(1, min(q, 20))})
    return {"items": items, "fallback": data.get("fallback", False)}