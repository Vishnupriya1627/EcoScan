import time
from PIL import Image
from model import analyze_clothing

start = time.time()
print(analyze_clothing(Image.open("test.webp").convert("RGB")))
print(f"Took {time.time() - start:.1f}s")