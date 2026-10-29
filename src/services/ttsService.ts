// Serviço Híbrido de Text-to-Speech Neural (Kokoro TTS pt-BR)
// Vozes Brasileiras Nativas Oficiais:
// - pf_dora: Feminina (Natural Brasileira)
// - pm_alex: Masculina (Natural Brasileiro)
//
// Pipeline em 3 camadas (100% compatível com Netlify / CDN estático + Mobile iOS/Android + Dev Local):
// 1. Áudio Neural Pré-Renderizado Estático (/audio/tts/<audioId>.mp3) -> Latência instantânea (<50ms), zero backend
// 2. Servidor Local Kokoro ONNX (/api/tts em localhost) -> Para textos dinâmicos em desenvolvimento
// 3. Fallback Nativo Web Speech API (pt-BR) -> Contingência universal offline

let currentAudio: HTMLAudioElement | null = null;
let isPlaying = false;
let currentVoice: 'pf_dora' | 'pm_alex' = 'pf_dora';
let currentSessionId = 0;
let abortController: AbortController | null = null;

export interface TTSOptions {
  text: string;
  /** ID estático pré-renderizado em /audio/tts/<audioId>.mp3 para reprodução instantânea em produção (Netlify) */
  audioId?: string;
  voice?: 'pf_dora' | 'pm_alex';
  speed?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

let speechKeepAliveInterval: ReturnType<typeof setInterval> | null = null;

function isLocalDevHost(): boolean {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  return host === 'localhost' || host === '127.0.0.1';
}

// Síntese Web Speech 100% nativa de alta compatibilidade e zero dependências de backend
const speakWithWebSpeech = (options: TTSOptions): boolean => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;

  const synth = window.speechSynthesis;
  synth.cancel();

  if (speechKeepAliveInterval) {
    clearInterval(speechKeepAliveInterval);
    speechKeepAliveInterval = null;
  }

  const sentences = splitTextIntoSentences(options.text);
  if (sentences.length === 0) return false;

  let currentIndex = 0;
  const currentLocalSession = currentSessionId;

  const playSentence = (index: number) => {
    if (index >= sentences.length || currentLocalSession !== currentSessionId) {
      if (speechKeepAliveInterval) {
        clearInterval(speechKeepAliveInterval);
        speechKeepAliveInterval = null;
      }
      isPlaying = false;
      options.onEnd?.();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(sentences[index]);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const voices = synth.getVoices();
    const ptBrVoice =
      voices.find(
        (v) =>
          v.lang === 'pt-BR' &&
          (v.name.includes('Natural') ||
            v.name.includes('Google') ||
            v.name.includes('Luciana') ||
            v.name.includes('Francisca'))
      ) ||
      voices.find((v) => v.lang === 'pt-BR') ||
      voices.find((v) => v.lang.startsWith('pt'));

    if (ptBrVoice) {
      utterance.voice = ptBrVoice;
    }

    utterance.onstart = () => {
      if (index === 0) {
        isPlaying = true;
        options.onStart?.();
      }
    };

    utterance.onend = () => {
      currentIndex++;
      playSentence(currentIndex);
    };

    utterance.onerror = (e) => {
      if (currentLocalSession !== currentSessionId) return;
      console.warn('Web Speech error on chunk, skipping to next:', e);
      currentIndex++;
      playSentence(currentIndex);
    };

    synth.speak(utterance);
  };

  // Keep-alive contra o bug do Chrome que congela síntese após 15 segundos
  speechKeepAliveInterval = setInterval(() => {
    if (synth.speaking && !synth.paused) {
      synth.pause();
      synth.resume();
    }
  }, 10000);

  playSentence(0);
  return true;
};

// Divisão do texto em segmentos concisos para síntese instantânea
function splitTextIntoSentences(text: string): string[] {
  const rawSentences = text
    .split(/(?<=[.?!;:])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (rawSentences.length === 0) return [text];

  const chunks: string[] = [];
  let current = '';

  for (const sentence of rawSentences) {
    // Manter blocos curtos (~120 a 160 caracteres) para geração em menos de 200ms
    if (current && current.length + sentence.length > 150) {
      chunks.push(current);
      current = sentence;
    } else {
      current = current ? `${current} ${sentence}` : sentence;
    }
  }

  if (current) {
    chunks.push(current);
  }

  return chunks;
}

async function fetchAudioBlob(
  text: string,
  voice: string,
  speed: number,
  signal: AbortSignal
): Promise<Blob> {
  // Evita chamadas para 127.0.0.1 em produção HTTPS (Netlify) para não disparar avisos de rede local no navegador
  if (!isLocalDevHost()) {
    throw new Error('Ambiente estático de produção (sem servidor Python local)');
  }

  const endpoints = ['/api/tts', 'http://127.0.0.1:5005/api/tts'];
  let lastError: any = null;

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice, speed }),
        signal,
      });

      if (res.ok) {
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('audio')) {
          const blob = await res.blob();
          if (blob.size > 100) return blob;
        }
      }
    } catch (e: any) {
      if (e.name === 'AbortError') throw e;
      lastError = e;
    }
  }

  throw new Error(lastError?.message || 'Servidor Kokoro TTS offline');
}

async function speakDynamicOrFallback(
  options: TTSOptions,
  sessionId: number,
  signal: AbortSignal
): Promise<void> {
  const text = options.text.trim();
  const voice = options.voice || currentVoice;
  const speed = options.speed || 1.0;

  if (!isLocalDevHost()) {
    const fallbackWorked = speakWithWebSpeech(options);
    if (!fallbackWorked) {
      options.onError?.('Síntese de voz indisponível neste dispositivo');
    }
    return;
  }

  const chunks = splitTextIntoSentences(text);
  if (chunks.length === 0) return;

  try {
    const chunkPromises: Map<number, Promise<Blob>> = new Map();

    const getChunkPromise = (index: number) => {
      if (!chunkPromises.has(index) && index < chunks.length) {
        chunkPromises.set(index, fetchAudioBlob(chunks[index], voice, speed, signal));
      }
      return chunkPromises.get(index);
    };

    getChunkPromise(0);
    if (chunks.length > 1) {
      getChunkPromise(1);
    }

    await getChunkPromise(0)!;
    if (sessionId !== currentSessionId) return;

    isPlaying = true;
    options.onStart?.();

    let currentChunkIndex = 0;

    const playNextChunk = async () => {
      if (sessionId !== currentSessionId) return;

      if (currentChunkIndex >= chunks.length) {
        isPlaying = false;
        options.onEnd?.();
        return;
      }

      const nextIndex = currentChunkIndex + 1;
      if (nextIndex < chunks.length) {
        getChunkPromise(nextIndex);
      }

      try {
        const blob = await getChunkPromise(currentChunkIndex)!;
        if (sessionId !== currentSessionId) return;

        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        currentAudio = audio;

        audio.onended = () => {
          URL.revokeObjectURL(url);
          currentChunkIndex++;
          playNextChunk();
        };

        audio.onerror = (e) => {
          console.warn('Erro ao tocar segmento Kokoro:', e);
          URL.revokeObjectURL(url);
          currentChunkIndex++;
          playNextChunk();
        };

        await audio.play();
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        console.warn('Erro no segmento de áudio:', err);
        currentChunkIndex++;
        playNextChunk();
      }
    };

    playNextChunk();
  } catch (err: any) {
    if (err.name === 'AbortError' || sessionId !== currentSessionId) return;
    console.warn('Servidor Kokoro indisponível, acionando fallback nativo:', err?.message);
    const fallbackWorked = speakWithWebSpeech(options);
    if (!fallbackWorked) {
      options.onError?.(err?.message || 'Erro ao sintetizar voz');
    }
  }
}

export const ttsService = {
  getVoice(): 'pf_dora' | 'pm_alex' {
    return currentVoice;
  },

  setVoice(voice: 'pf_dora' | 'pm_alex'): void {
    currentVoice = voice;
  },

  /**
   * Reproduz explicação em voz neural Kokoro TTS (MP3 estático CDN -> servidor local -> Web Speech)
   */
  async speak(options: TTSOptions): Promise<void> {
    this.stop();

    const text = options.text.trim();
    if (!text) return;

    const sessionId = ++currentSessionId;
    abortController = new AbortController();
    const signal = abortController.signal;

    // Camada 1: Áudio Kokoro Neural Pré-Renderizado Estático (Instantâneo no Netlify e Mobile iOS/Android)
    if (options.audioId) {
      const baseUrl = ((import.meta as any).env?.BASE_URL as string | undefined) || '/';
      const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
      const staticUrl = `${normalizedBase}audio/tts/${encodeURIComponent(options.audioId)}.mp3`;

      const audio = new Audio(staticUrl);
      audio.preload = 'auto';
      if (options.speed && options.speed !== 1.0) {
        audio.playbackRate = options.speed;
      }
      currentAudio = audio;

      let started = false;
      let handledFallback = false;

      const triggerFallback = () => {
        if (handledFallback || sessionId !== currentSessionId) return;
        handledFallback = true;
        currentAudio = null;
        void speakDynamicOrFallback(options, sessionId, signal);
      };

      audio.onplaying = () => {
        if (sessionId !== currentSessionId) return;
        if (!started) {
          started = true;
          isPlaying = true;
          options.onStart?.();
        }
      };

      audio.onended = () => {
        if (sessionId !== currentSessionId) return;
        isPlaying = false;
        currentAudio = null;
        options.onEnd?.();
      };

      audio.onerror = () => {
        if (sessionId !== currentSessionId) return;
        if (!started) {
          triggerFallback();
        } else {
          isPlaying = false;
          currentAudio = null;
          options.onEnd?.();
        }
      };

      try {
        // Disparo síncrono na cadeia do clique do usuário (essencial para Safari iOS)
        await audio.play();
        if (sessionId === currentSessionId && !started) {
          started = true;
          isPlaying = true;
          options.onStart?.();
        }
        return;
      } catch (err: any) {
        if (err?.name === 'AbortError' || sessionId !== currentSessionId) return;
        triggerFallback();
        return;
      }
    }

    // Camadas 2 & 3: Servidor Kokoro Local (dev) ou Web Speech API
    await speakDynamicOrFallback(options, sessionId, signal);
  },

  /**
   * Interrompe qualquer áudio em reprodução
   */
  stop(): void {
    currentSessionId++;

    if (speechKeepAliveInterval) {
      clearInterval(speechKeepAliveInterval);
      speechKeepAliveInterval = null;
    }

    if (abortController) {
      try {
        abortController.abort();
      } catch {
        // Ignora
      }
      abortController = null;
    }

    if (currentAudio) {
      try {
        currentAudio.onended = null;
        currentAudio.onerror = null;
        currentAudio.onplaying = null;
        currentAudio.pause();
        currentAudio.currentTime = 0;
      } catch {
        // Ignora
      }
      currentAudio = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignora
      }
    }

    isPlaying = false;
  },

  /**
   * Verifica se o áudio está tocando
   */
  isPlaying(): boolean {
    return isPlaying;
  },
};
