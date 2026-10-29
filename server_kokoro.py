import sys
import os
import json
import io
import hashlib
import threading
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
from kokoro_onnx import Kokoro
import soundfile as sf

PORT = 5005
# Cache puramente em memória RAM (sem gravação de arquivos de áudio em disco)
RAM_CACHE = {}
SYNTH_LOCK = threading.Lock()

print("Iniciando Kokoro TTS Engine...")
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'kokoro_weights', 'kokoro-v1.0.onnx')
VOICES_PATH = os.path.join(os.path.dirname(__file__), 'kokoro_weights', 'voices-v1.0.bin')

kokoro = Kokoro(MODEL_PATH, VOICES_PATH)
print("Kokoro TTS carregado e pronto para sintese de alta qualidade (pf_dora / pm_alex)!")

class KokoroHandler(BaseHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_POST(self):
        if self.path == '/api/tts' or self.path == '/tts':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length).decode('utf-8')
            try:
                body = json.loads(post_data)
                text = body.get('text', '').strip()
                voice = body.get('voice', 'pf_dora')
                speed = float(body.get('speed', 1.0))
            except Exception as e:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(b'Invalid JSON')
                return

            self.generate_and_respond(text, voice, speed)
        else:
            self.send_response(404)
            self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == '/api/tts' or parsed.path == '/tts':
            qs = parse_qs(parsed.query)
            text = qs.get('text', [''])[0].strip()
            voice = qs.get('voice', ['pf_dora'])[0]
            speed = float(qs.get('speed', ['1.0'])[0])
            self.generate_and_respond(text, voice, speed)
        elif parsed.path == '/health':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(b'{"status": "ok", "model": "kokoro-82m", "voices": ["pf_dora", "pm_alex"]}')
        else:
            self.send_response(404)
            self.end_headers()

    def generate_and_respond(self, text, voice, speed):
        if not text:
            self.send_response(400)
            self.end_headers()
            self.wfile.write(b'Missing text')
            return

        # Cache em memória RAM com base no hash do texto e voz
        text_hash = hashlib.md5(f"{voice}_{speed}_{text}".encode('utf-8')).hexdigest()

        if text_hash in RAM_CACHE:
            wav_bytes = RAM_CACHE[text_hash]
            self.send_response(200)
            self.send_header('Content-Type', 'audio/wav')
            self.send_header('Content-Length', str(len(wav_bytes)))
            self.send_header('X-Kokoro-Cache', 'HIT')
            self.end_headers()
            self.wfile.write(wav_bytes)
            return

        try:
            # Limpeza leve de símbolos gráficos para pronúncia fluida no Kokoro pt-BR
            clean_text = (
                text.replace('•', ', ')
                .replace('—', ', ')
                .replace('–', ', ')
            )
            with SYNTH_LOCK:
                samples, sample_rate = kokoro.create(clean_text, voice=voice, speed=speed, lang='pt-br')

            buf = io.BytesIO()
            sf.write(buf, samples, sample_rate, format='WAV')
            wav_bytes = buf.getvalue()

            # Guardar apenas em RAM
            RAM_CACHE[text_hash] = wav_bytes

            self.send_response(200)
            self.send_header('Content-Type', 'audio/wav')
            self.send_header('Content-Length', str(len(wav_bytes)))
            self.send_header('X-Kokoro-Cache', 'MISS')
            self.end_headers()
            self.wfile.write(wav_bytes)
        except Exception as e:
            print(f"Erro na sintese Kokoro: {e}", file=sys.stderr)
            self.send_response(500)
            self.end_headers()
            self.wfile.write(f"Error: {e}".encode('utf-8'))

if __name__ == '__main__':
    server = ThreadingHTTPServer(('127.0.0.1', PORT), KokoroHandler)
    print(f"Servidor Kokoro TTS rodando em http://127.0.0.1:{PORT}/", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
