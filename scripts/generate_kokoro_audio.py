"""
Gera todos os arquivos estáticos de voz neural Kokoro TTS (pt-BR, pf_dora) em MP3
para hospedagem 100% estática (Netlify / CDN) sem necessidade de backend Python em produção.

Saída: public/audio/tts/<audioId>.mp3
"""

import os
import re
import sys
import json
import time
from concurrent.futures import ProcessPoolExecutor, as_completed

os.environ["OMP_NUM_THREADS"] = "3"
os.environ["MKL_NUM_THREADS"] = "3"

import numpy as np
import soundfile as sf
import onnxruntime as ort
from kokoro_onnx import Kokoro

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(ROOT_DIR, "kokoro_weights", "kokoro-v1.0.onnx")
VOICES_PATH = os.path.join(ROOT_DIR, "kokoro_weights", "voices-v1.0.bin")
OUT_DIR = os.path.join(ROOT_DIR, "public", "audio", "tts")

_WORKER_KOKORO = None
_SENTENCE_CACHE = {}


def init_worker():
    global _WORKER_KOKORO
    so = ort.SessionOptions()
    so.intra_op_num_threads = 3
    so.inter_op_num_threads = 1
    so.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
    sess = ort.InferenceSession(
        MODEL_PATH,
        sess_options=so,
        providers=["CPUExecutionProvider"],
    )
    _WORKER_KOKORO = Kokoro.from_session(sess, VOICES_PATH)


def clean_and_split_text(text: str) -> list[str]:
    cleaned = (
        text.replace("•", ", ")
        .replace("—", ", ")
        .replace("–", ", ")
        .replace("  ", " ")
        .strip()
    )
    raw_parts = [s.strip() for s in re.split(r"(?<=[.?!;:])\s+", cleaned) if s.strip()]
    if not raw_parts:
        return [cleaned]

    chunks: list[str] = []
    current = ""
    for part in raw_parts:
        # Sub-dividir frases muito extensas por vírgula para nunca exceder o limite de 510 fonemas
        subparts = [part]
        if len(part) > 260:
            subparts = [sp.strip() for sp in re.split(r"(?<=,)\s+", part) if sp.strip()]

        for sp in subparts:
            if current and len(current) + len(sp) + 1 > 240:
                chunks.append(current)
                current = sp
            else:
                current = f"{current} {sp}".strip() if current else sp

    if current:
        chunks.append(current)

    return chunks


def synthesize_item(item: dict) -> tuple[str, int, float]:
    global _WORKER_KOKORO, _SENTENCE_CACHE
    t0 = time.time()
    audio_id = item["audioId"]
    text = item["text"]

    chunks = clean_and_split_text(text)
    segments = []
    sample_rate = 24000
    pause = np.zeros(int(0.14 * sample_rate), dtype=np.float32)

    for idx, chunk in enumerate(chunks):
        if chunk in _SENTENCE_CACHE:
            samples, sample_rate = _SENTENCE_CACHE[chunk]
        else:
            samples, sample_rate = _WORKER_KOKORO.create(
                chunk,
                voice="pf_dora",
                speed=1.0,
                lang="pt-br",
                trim=True,
            )
            if len(chunk) < 200 and len(_SENTENCE_CACHE) < 512:
                _SENTENCE_CACHE[chunk] = (samples, sample_rate)

        if samples is not None and len(samples) > 0:
            segments.append(samples.astype(np.float32))
            if idx < len(chunks) - 1:
                segments.append(pause)

    if not segments:
        raise RuntimeError(f"Nenhum áudio gerado para {audio_id}")

    full_audio = np.concatenate(segments)
    peak = float(np.max(np.abs(full_audio)))
    if peak > 0.98:
        full_audio = full_audio * (0.96 / peak)

    os.makedirs(OUT_DIR, exist_ok=True)
    out_path = os.path.join(OUT_DIR, f"{audio_id}.mp3")
    tmp_path = os.path.join(OUT_DIR, f".tmp_{os.getpid()}_{audio_id}.mp3")

    sf.write(tmp_path, full_audio, sample_rate, format="MP3", compression_level=0.88)
    os.replace(tmp_path, out_path)

    size_bytes = os.path.getsize(out_path)
    elapsed = time.time() - t0
    return audio_id, size_bytes, elapsed


def main():
    if len(sys.argv) < 2:
        print("Uso: python scripts/generate_kokoro_audio.py <caminho_tts_corpus.json>")
        sys.exit(1)

    corpus_path = sys.argv[1]
    with open(corpus_path, "r", encoding="utf-8") as f:
        items = json.load(f)

    os.makedirs(OUT_DIR, exist_ok=True)
    total = len(items)
    print(f"Sintetizando {total} arquivos MP3 Kokoro (pf_dora, pt-BR) em {OUT_DIR}...", flush=True)

    t_start = time.time()
    completed = 0
    total_bytes = 0

    with ProcessPoolExecutor(max_workers=5, initializer=init_worker) as pool:
        futures = {pool.submit(synthesize_item, item): item["audioId"] for item in items}
        for fut in as_completed(futures):
            aid = futures[fut]
            audio_id, size_bytes, elapsed = fut.result()
            completed += 1
            total_bytes += size_bytes
            if completed % 10 == 0 or completed == total or completed <= 3:
                print(
                    f"[{completed}/{total}] {audio_id}.mp3 ({size_bytes / 1024:.1f} KB em {elapsed:.1f}s)",
                    flush=True,
                )

    total_time = time.time() - t_start
    print(
        f"CONCLUIDO: {completed}/{total} MP3s gerados ({total_bytes / (1024 * 1024):.2f} MB totais) em {total_time:.1f}s!",
        flush=True,
    )


if __name__ == "__main__":
    main()

