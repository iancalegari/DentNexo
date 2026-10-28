import * as THREE from 'three';

/**
 * Utilitário para geração procedural de texturas e bump-maps anatômicos.
 * Executado 100% em memória no cliente via HTML5 Canvas (zero download de arquivos pesados).
 */

let cachedBoneBump: THREE.CanvasTexture | null = null;
let cachedMuscleBump: THREE.CanvasTexture | null = null;
let cachedGingivaBump: THREE.CanvasTexture | null = null;

/**
 * Gera textura de relevo para osso cortical (crânio, mandíbula, maxila).
 * Simula micro-porosidades trabeculares, canais de Havers e granulação mineral osteocítica.
 */
export function getBoneBumpTexture(): THREE.CanvasTexture {
  if (cachedBoneBump) return cachedBoneBump;

  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    const fallback = new THREE.CanvasTexture(canvas);
    cachedBoneBump = fallback;
    return fallback;
  }

  const imgData = ctx.createImageData(size, size);
  const data = imgData.data;

  // Ruído perlin/fractal simplificado com múltiplos harmônicos
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;

      // Base cinza neutro (128)
      let val = 128;

      // Harmônico 1: Ondulações suaves de contorno ósseo
      val += Math.sin(x * 0.04) * 8 + Math.cos(y * 0.04) * 8;

      // Harmônico 2: Micro-ranhuras e granulação osteocítica
      val += Math.sin((x + y) * 0.15) * 6;

      // Harmônico 3: Ruído aleatório fino de alta frequência (porosidade)
      const noise = (Math.random() - 0.5) * 36;
      val += noise;

      // Harmônico 4: Micro-poros (canais vasculares de Volkmann / Havers)
      if (Math.random() < 0.015) {
        val -= 45; // Depressão punctiforme
      }

      val = Math.max(0, Math.min(255, Math.floor(val)));

      data[idx] = val;     // R
      data[idx + 1] = val; // G
      data[idx + 2] = val; // B
      data[idx + 3] = 255; // Alpha
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  texture.generateMipmaps = true;
  texture.needsUpdate = true;

  cachedBoneBump = texture;
  return texture;
}

/**
 * Gera textura de relevo para músculos estriados esqueléticos (masseter, temporal, bucinador, pterigóideos).
 * Simula feixes musculares longitudinais (fascículos), perimísio e estriações transversais biológicas.
 */
export function getMuscleBumpTexture(): THREE.CanvasTexture {
  if (cachedMuscleBump) return cachedMuscleBump;

  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    const fallback = new THREE.CanvasTexture(canvas);
    cachedMuscleBump = fallback;
    return fallback;
  }

  const imgData = ctx.createImageData(size, size);
  const data = imgData.data;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;

      let val = 128;

      // Fascículos musculares primários (fibras orientadas)
      const fiberWave = Math.sin(x * 0.22 + Math.sin(y * 0.05) * 3.5) * 40;
      val += fiberWave;

      // Feixes secundários mais finos (subfascículos)
      const subFiber = Math.sin(x * 0.6) * 18;
      val += subFiber;

      // Estriações microscópicas transversais finas (sarcômeros)
      const striations = Math.sin(y * 0.8) * 10;
      val += striations;

      // Ruído orgânico de tecido úmido
      val += (Math.random() - 0.5) * 20;

      val = Math.max(0, Math.min(255, Math.floor(val)));

      data[idx] = val;
      data[idx + 1] = val;
      data[idx + 2] = val;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  texture.generateMipmaps = true;
  texture.needsUpdate = true;

  cachedMuscleBump = texture;
  return texture;
}

/**
 * Gera textura de relevo para gengiva inserida.
 * Simula o pontilhado típico em "casca de laranja" e aspecto de mucosa queratinizada.
 */
export function getGingivaBumpTexture(): THREE.CanvasTexture {
  if (cachedGingivaBump) return cachedGingivaBump;

  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    const fallback = new THREE.CanvasTexture(canvas);
    cachedGingivaBump = fallback;
    return fallback;
  }

  const imgData = ctx.createImageData(size, size);
  const data = imgData.data;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;

      let val = 128;

      // Pontilhado gengival denso
      const dotPattern = (Math.sin(x * 0.5) * Math.cos(y * 0.5)) * 18;
      val += dotPattern;

      // Depressões puntiformes aleatórias
      if (Math.random() < 0.08) {
        val -= 35;
      }

      val += (Math.random() - 0.5) * 15;
      val = Math.max(0, Math.min(255, Math.floor(val)));

      data[idx] = val;
      data[idx + 1] = val;
      data[idx + 2] = val;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(12, 12);
  texture.generateMipmaps = true;
  texture.needsUpdate = true;

  cachedGingivaBump = texture;
  return texture;
}
