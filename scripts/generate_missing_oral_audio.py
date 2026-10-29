"""
Gera os arquivos de áudio neural Kokoro TTS (pf_dora, pt-br) para:
- assoalho_boca.mp3
- tonsilas_palatinas.mp3
"""

import os
import re
import numpy as np
import soundfile as sf
import onnxruntime as ort
from kokoro_onnx import Kokoro

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(ROOT_DIR, "kokoro_weights", "kokoro-v1.0.onnx")
VOICES_PATH = os.path.join(ROOT_DIR, "kokoro_weights", "voices-v1.0.bin")
OUT_DIR = os.path.join(ROOT_DIR, "public", "audio", "tts")
os.makedirs(OUT_DIR, exist_ok=True)

print("Inicializando modelo neural Kokoro TTS...")
so = ort.SessionOptions()
so.intra_op_num_threads = 4
sess = ort.InferenceSession(MODEL_PATH, sess_options=so, providers=["CPUExecutionProvider"])
kokoro = Kokoro.from_session(sess, VOICES_PATH)

items = [
    {
        "id": "assoalho_boca",
        "text": (
            "Assoalho da Boca. "
            "Região anatômica em formato de ferradura situada abaixo da porção móvel anterior e lateral da língua, "
            "delimitada pelo corpo mandibular e sustentada pela cinta muscular do músculo milo-hióideo. "
            "Função: Sustentação do órgão lingual, acomodação das glândulas salivares sublinguais e submandibulares, "
            "proteção neurovascular e mobilidade do bolo alimentar na fase preparatória da deglutição. "
            "Localização e trajeto: Abaixo da superfície ventral da língua e medial ao corpo e cortical lingual da mandíbula. "
            "Inervação: Sensibilidade geral mediada pelo Nervo Lingual, ramo de V três. "
            "Inervação motora do músculo milo-hióideo pelo Nervo Milo-Hióideo, ramo do Alveolar Inferior. "
            "Inervação motora do gênio-hióideo via C um junto ao Nervo Hipoglosso. "
            "Vascularização: Artéria sublingual, ramo da artéria lingual, e artéria submentual, ramo da artéria facial, "
            "com drenagem pelas veias linguais e faciais. "
            "Composição tecidual: Músculo milo-hióideo, diafragma muscular do soalho oral, "
            "músculo gênio-hióideo e ventre anterior do digástrico, glândulas salivares sublinguais e ducto de Wharton da submandibular, "
            "mucosa delgada não queratinizada com carúnculas sublinguais e pregas sublinguais. "
            "Importância clínica e odontológica: O assoalho bucal é uma das áreas de maior risco para o desenvolvimento de "
            "Carcinoma Espinocelular de boca, exigindo inspeção visual rigorosa e palpação bimanual durante o exame estomatológico preventivo. "
            "Abriga as carúnculas sublinguais, saída dos ductos submandibulares de Wharton, passíveis de sialolitíase, que são cálculos salivares, "
            "e rânulas, que são cistos de retenção ou extravasamento mucoso da glândula sublingual que podem mergulhar nos espaços fasciais cervicais."
        )
    },
    {
        "id": "tonsilas_palatinas",
        "text": (
            "Amígdalas ou Tonsilas Palatinas. "
            "Massas bilaterais de tecido linfoide de formato ovoide alojadas na fossa tonsilar ou nicho amigdalino da orofaringe, "
            "delimitadas entre os arcos palatoglosso anterior e palatofaríngeo posterior. "
            "Função: Imunovigilância e defesa primária das vias aéreas e digestórias superiores contra patógenos inalados e ingeridos, "
            "atuando como componente central do Anel Linfático de Waldeyer. "
            "Localização e trajeto: Paredes laterais da orofaringe, logo atrás da raiz da língua e anterolaterais à úvula. "
            "Inervação: Inervação sensitiva conduzida pelos ramos tonsilares do Nervo Glossofaríngeo, nono par craniano, "
            "e nervos palatinos menores do ramo maxilar. "
            "Vascularização: Rico suprimento arterial anastomótico proveniente do ramo tonsilar da artéria facial, "
            "artéria palatina ascendente, ramos dorsais da artéria lingual e artéria faríngea ascendente. "
            "Composição tecidual: Agregados de folículos linfoides com centros germinativos ativos, "
            "criptas tonsilares profundas com dez a vinte invaginações epiteliais, epitélio estratificado pavimentoso não queratinizado de cobertura "
            "e cápsula fibrosa fina externa que as separa do músculo constritor superior da faringe. "
            "Importância clínica e odontológica: Local de alta prevalência de amigdalites bacterianas agudas por Streptococcus e virais. "
            "As criptas tonsilares acumulam restos celulares, bactérias anaeróbias e muco dessecado, formando os cáseos amigdalianos, "
            "importante causa de halitose crônica e queixas frequentes em consultório. "
            "A hipertrofia amigdaliana obstrutiva graus três e quatro de Brodsky é etiologia primária de respiração bucal, "
            "má oclusão dental com mordida aberta anterior e apneia obstrutiva do sono em crianças e adultos."
        )
    }
]

silence = np.zeros(int(24000 * 0.16), dtype=np.float32)

for item in items:
    audio_id = item["id"]
    text = item["text"]
    out_path = os.path.join(OUT_DIR, f"{audio_id}.mp3")
    
    print(f"\nSintetizando áudio Kokoro (pf_dora, pt-BR) para: {audio_id}...")
    
    # Divide em orações limpas sem exceder tamanho máximo
    raw_parts = [s.strip() for s in re.split(r"(?<=[.?!;:])\s+", text) if s.strip()]
    audio_segments = []

    for idx, part in enumerate(raw_parts):
        # Trata partes longas
        subparts = [part]
        if len(part) > 220:
            subparts = [sp.strip() for sp in re.split(r"(?<=,)\s+", part) if sp.strip()]
            
        for sp in subparts:
            samples, sr = kokoro.create(sp, voice="pf_dora", speed=1.0, lang="pt-br")
            if samples is not None and len(samples) > 0:
                audio_segments.append(samples)
                audio_segments.append(silence)

    if audio_segments:
        combined = np.concatenate(audio_segments)
        peak = float(np.max(np.abs(combined)))
        if peak > 0.98:
            combined = combined * (0.96 / peak)
            
        sf.write(out_path, combined, 24000, format="MP3")
        size_kb = os.path.getsize(out_path) / 1024
        print(f"-> SUCESSO: {out_path} ({size_kb:.1f} KB)")
    else:
        print(f"-> ERRO ao gerar {audio_id}")

print("\nTodos os áudios foram gerados com sucesso!")

