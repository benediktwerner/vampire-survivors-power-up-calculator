#!/usr/bin/env python3

from PIL import Image
import os, json


os.makedirs("images")

with open("items.json") as f:
    data = json.load(f)

with Image.open("items.png") as img:
    frames = data["textures"][0]["frames"]

    for frame in frames:
        fname = frame["filename"]
        pos = frame["frame"]
        x, y, w, h = (pos[c] for c in ("x", "y", "w","h"))
        part = img.crop((x, y, x+w, y+h))
        part.save(f"icons/{fname}")
