import os
import re
import json

tts_dir = os.path.join("public", "audio", "tts")
existing = set(f.replace(".mp3", "") for f in os.listdir(tts_dir) if f.endswith(".mp3"))

# Parse structures from structures.ts
with open(os.path.join("src", "data", "anatomy", "structures.ts"), "r", encoding="utf-8") as f:
    text = f.read()

# Match structure blocks: id: 'xxx'
ids = re.findall(r"id:\s*['\"]([a-zA-Z0-9_]+)['\"]", text)
unique_ids = sorted(list(set(ids)))

missing = [i for i in unique_ids if i not in existing and not i.startswith("mesh_") and not i.startswith("dente_")]
print(f"Total structures scanned: {len(unique_ids)}")
print(f"Missing audios: {missing}")

