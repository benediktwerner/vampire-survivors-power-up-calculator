#!/usr/bin/env python3

from PIL import Image
import os, json


FILE = "items"
PNG = f"{FILE}.png"
JSON = f"{FILE}.json"
TARGET_DIR = "icons"

os.makedirs(TARGET_DIR, exist_ok=True)

with open(JSON) as f:
    data = json.load(f)

with Image.open(PNG) as img:
    frames = data["textures"][0]["frames"]

    for frame in frames:
        fname = frame["filename"]
        pos = frame["frame"]
        x, y, w, h = (pos[c] for c in ("x", "y", "w","h"))
        part = img.crop((x, y, x+w, y+h))
        part.save(f"{TARGET_DIR}/{fname}")
