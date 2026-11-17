import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useAnatomyStore } from '@/stores/useAnatomyStore';
import { themeTokens } from '@/theme/tokens';

interface TongueAndUvula3DProps {
  archesOnlyMode?: boolean;
}

export const TongueAndUvula3D: React.FC<TongueAndUvula3DProps> = ({ archesOnlyMode = false }) => {
  const {
    selectedStructureId,
    hoveredStructureId,
    isolatedStructureId,
    hiddenStructureIds,
    layers,
    opacities,
    xrayMode,
    explosionFactor,
    activeAnesthesiaId,
    anesthesiaJawOpen,
    jawOpen,
    activePathologyId,
    focusedSystem,
    surfaceExplorationMode,
    setSelectedStructure,
    setHoveredStructure,
  } = useAnatomyStore();

  const tongueRef = useRef<THREE.Mesh>(null);
  const tongueGroupRef = useRef<THREE.Group>(null);
  const floorGroupRef = useRef<THREE.Group>(null);
  const anesthesiaGlowRef = useRef<THREE.Mesh>(null);
  const geographicPatchGroupRef = useRef<THREE.Group>(null);
  const tongueJawProgressRef = useRef(0);
  const lingualNerveGroupRef = useRef<THREE.Group>(null);

  const isGeographicTongue = activePathologyId === 'lingua_geografica';

  // Animação de pulso e sincronização da língua/assoalho com o movimento da mandíbula aberta
  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    if (anesthesiaGlowRef.current) {
      const pulse = 0.35 + Math.sin(t * 3.2) * 0.15;
      (anesthesiaGlowRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse;
    }
    if (geographicPatchGroupRef.current) {
      const haloShimmer = 0.45 + Math.sin(t * 2.8) * 0.12;
      geographicPatchGroupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.name.includes('halo')) {
          (child.material as THREE.MeshStandardMaterial).emissiveIntensity = haloShimmer;
        }
      });
    }

    // Acompanhar o movimento de abertura bucal nos bloqueios anestésicos e no Atlas 3D
    const isAnesthesiaActive = Boolean(activeAnesthesiaId);
    const isMouthOpen = (isAnesthesiaActive && anesthesiaJawOpen) || jawOpen;
    const targetJaw = isMouthOpen ? 1.0 : 0.0;
    const currentJaw = tongueJawProgressRef.current;
    const nextJaw = THREE.MathUtils.damp(currentJaw, targetJaw, 6, delta);
    tongueJawProgressRef.current = nextJaw;

    if (tongueGroupRef.current) {
      tongueGroupRef.current.position.y = -2.55 * explosionFactor - 0.70 * nextJaw;
      tongueGroupRef.current.position.z = 0.95 * explosionFactor - 0.50 * nextJaw;
      tongueGroupRef.current.rotation.x = 0.10 * nextJaw;
    }
    if (floorGroupRef.current) {
      floorGroupRef.current.position.y = -2.55 * explosionFactor - 0.78 * nextJaw;
      floorGroupRef.current.position.z = 0.95 * explosionFactor - 0.55 * nextJaw;
      floorGroupRef.current.rotation.x = 0.12 * nextJaw;
    }
    if (lingualNerveGroupRef.current) {
      lingualNerveGroupRef.current.position.y = -2.55 * explosionFactor - 0.70 * nextJaw;
      lingualNerveGroupRef.current.position.z = 0.95 * explosionFactor - 0.50 * nextJaw;
      lingualNerveGroupRef.current.rotation.x = 0.10 * nextJaw;
    }
  });

  // Visibilidade de camadas e isolamento
  const isLayerVisibleOral = isGeographicTongue || layers.oral_tissue || focusedSystem === 'oral_tissue';
  const isLayerVisibleNerves = !isGeographicTongue && (layers.nervous || focusedSystem === 'nervous');

  const isTongueHidden = isGeographicTongue ? false : hiddenStructureIds.includes('lingua');
  const isFloorHidden = isGeographicTongue ? false : hiddenStructureIds.includes('assoalho_boca');
  const isTonsilsHidden = isGeographicTongue || hiddenStructureIds.includes('tonsilas_palatinas');
  const isUvulaHidden = isGeographicTongue || hiddenStructureIds.includes('uvula');
  const isNerveHidden = isGeographicTongue || hiddenStructureIds.includes('nervo_lingual');

  const isTongueSelected = selectedStructureId === 'lingua';
  const isTongueHovered = hoveredStructureId === 'lingua';
  const isTongueIsolated = isolatedStructureId === 'lingua';

  const isFloorSelected = selectedStructureId === 'assoalho_boca';
  const isFloorHovered = hoveredStructureId === 'assoalho_boca';
  const isFloorIsolated = isolatedStructureId === 'assoalho_boca';

  const isTonsilsSelected = selectedStructureId === 'tonsilas_palatinas';
  const isTonsilsHovered = hoveredStructureId === 'tonsilas_palatinas';
  const isTonsilsIsolated = isolatedStructureId === 'tonsilas_palatinas';

  const isUvulaSelected = selectedStructureId === 'uvula';
  const isUvulaHovered = hoveredStructureId === 'uvula';
  const isUvulaIsolated = isolatedStructureId === 'uvula';

  const isLingualNerveSelected = selectedStructureId === 'nervo_lingual';
  const isLingualNerveHovered = hoveredStructureId === 'nervo_lingual';
  const isLingualNerveIsolated = isolatedStructureId === 'nervo_lingual';

  const hasIsolation = isolatedStructureId !== null;

  // Anestesia afetando a língua e nervo lingual
  const isTongueAnesthetized =
    activeAnesthesiaId === 'bloqueio_lingual' || activeAnesthesiaId === 'bloqueio_nai';
  const isUvulaAnesthetized = activeAnesthesiaId === 'bloqueio_palatino_maior';

  // 1. Geometria Anatômica Orgânica da Língua (Normal ou Fissurada com Ranhuras profundas na Língua Geográfica)
  const tongueGeometry = useMemo(() => {
    // Quando a patologia Língua Geográfica está ativa, aumentamos os cortes para criar as ranhuras profundas da Língua Fissurada
    const slices = isGeographicTongue ? 72 : 32;
    const radialSegments = isGeographicTongue ? 48 : 32;
    const positions: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    for (let i = 0; i <= slices; i++) {
      const t = i / slices; // 0 = ápice anterior, 1 = raiz posterior
      const z = 1.94 - t * 3.44;

      // Curvatura vertical anatômica do dorso lingual
      let centerY: number;
      if (t < 0.22) {
        centerY = -0.72 + Math.sin((t / 0.22) * Math.PI * 0.5) * 0.22;
      } else if (t < 0.68) {
        centerY = -0.50 + Math.sin(((t - 0.22) / 0.46) * Math.PI) * 0.14; // cume do dorso em -0.36
      } else {
        const u = (t - 0.68) / 0.32;
        centerY = -0.50 - u * u * 0.95; // raiz desce em direção ao osso hioide
      }

      // Largura da língua no corte transversal
      let halfWidth: number;
      if (t < 0.15) {
        halfWidth = Math.sin((t / 0.15) * Math.PI * 0.5) * 0.68;
      } else if (t < 0.7) {
        halfWidth = 0.68 + ((t - 0.15) / 0.55) * 0.62; // alarga até 1.30 entre molares
      } else {
        halfWidth = 1.30 - ((t - 0.7) / 0.3) * 0.28;
      }

      // Espessura vertical do corte
      let thickness: number;
      if (t < 0.15) {
        thickness = 0.18 + t * 1.3;
      } else if (t < 0.7) {
        thickness = 0.38 + Math.sin(((t - 0.15) / 0.55) * Math.PI) * 0.22;
      } else {
        thickness = 0.52 + (t - 0.7) * 0.75;
      }

      for (let j = 0; j <= radialSegments; j++) {
        const theta = (j / radialSegments) * Math.PI * 2;
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);

        let px = cosT * halfWidth;
        let py = centerY + sinT * (thickness * 0.5);

        // Modulações no dorso superior (sinT > 0)
        if (sinT > 0 && t > 0.08 && t < 0.88) {
          const distFromMid = Math.abs(cosT);

          if (isGeographicTongue) {
            // === LÍNGUA GEOGRÁFICA / LÍNGUA FISSURADA (RANHURAS PROFUNDAS) ===
            // 1. Sulco longitudinal mediano profundo e pronunciado
            const centralFissure = 0.15 * Math.exp(-distFromMid * 10.0) * Math.sin(((t - 0.08) / 0.80) * Math.PI);
            py -= centralFissure;

            // 2. Múltiplas ranhuras transversais profundas (sulci transversales)
            const fissureWave = Math.sin((t - 0.10) * 44.0);
            if (fissureWave > 0.30 && distFromMid > 0.05 && distFromMid < 0.88) {
              const fissureDepth = 0.11 * (fissureWave - 0.30) * Math.sin(distFromMid * Math.PI);
              py -= fissureDepth;
            }

            // 3. Fissuras oblíquas e micro-ranhuras secundárias ramificadas
            const obliqueFissure = Math.sin(t * 32.0 + cosT * 14.0);
            if (obliqueFissure > 0.48 && distFromMid > 0.12 && distFromMid < 0.80) {
              const obDepth = 0.075 * (obliqueFissure - 0.48);
              py -= obDepth;
            }
          } else {
            // Sulco mediano longitudinal padrão na anatomia fisiológica
            const grooveDepth =
              0.075 *
              (1.0 - Math.min(1.0, distFromMid * 3.8)) *
              Math.sin(((t - 0.08) / 0.74) * Math.PI);
            py -= grooveDepth;
          }
        }

        // Leve afilamento ventral em direção ao frênulo lingual
        if (sinT < 0) {
          px *= 0.86;
        }

        positions.push(px, py, z);
        uvs.push(j / radialSegments, t);
      }
    }

    // Gerar faces triangulares
    for (let i = 0; i < slices; i++) {
      for (let j = 0; j < radialSegments; j++) {
        const a = i * (radialSegments + 1) + j;
        const b = (i + 1) * (radialSegments + 1) + j;
        const c = (i + 1) * (radialSegments + 1) + (j + 1);
        const d = i * (radialSegments + 1) + (j + 1);
        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geom.setIndex(indices);
    geom.computeVertexNormals();
    return geom;
  }, [isGeographicTongue]);

  // 1.1 Placas Tridimensionais das Lesões Geográficas (Eritema Despapilado com Halo Saliente)
  const geographicPatches = useMemo(() => {
    if (!isGeographicTongue) return [];

    const createPatchGeom = (radius: number, segments: number, irregularity: number) => {
      const corePositions: number[] = [];
      const coreUvs: number[] = [];
      const coreIndices: number[] = [];

      const haloPositions: number[] = [];
      const haloUvs: number[] = [];
      const haloIndices: number[] = [];

      // Vértice central do núcleo eritematoso
      corePositions.push(0, 0.025, 0);
      coreUvs.push(0.5, 0.5);

      const rPoints: { x: number; z: number; y: number }[] = [];

      for (let i = 0; i <= segments; i++) {
        const phi = (i / segments) * Math.PI * 2;
        // Raio ondulado com borda serpiginosa / formato cartográfico de mapa mundi
        const modR =
          radius *
          (1 +
            Math.sin(phi * 3.0) * irregularity +
            Math.cos(phi * 5.0) * (irregularity * 0.6) +
            Math.sin(phi * 8.0) * (irregularity * 0.3));

        const px = Math.cos(phi) * modR;
        const pz = Math.sin(phi) * modR;
        // Leve abaulamento acompanhando o dorso lingual
        const py = 0.02 - (modR / radius) * 0.008;

        rPoints.push({ x: px, z: pz, y: py });
        corePositions.push(px, py, pz);
        coreUvs.push(0.5 + (px / radius) * 0.5, 0.5 + (pz / radius) * 0.5);
      }

      for (let i = 1; i <= segments; i++) {
        coreIndices.push(0, i, i + 1);
      }

      // Halo elevado esbranquiçado/amarelado circundando a margem da lesão
      for (let i = 0; i <= segments; i++) {
        const pt = rPoints[i];
        const innerX = pt.x * 0.90;
        const innerZ = pt.z * 0.90;
        const outerX = pt.x * 1.14;
        const outerZ = pt.z * 1.14;
        const innerY = pt.y + 0.012;
        const outerY = pt.y + 0.024; // halo ligeiramente saliente

        haloPositions.push(innerX, innerY, innerZ);
        haloUvs.push(0, i / segments);
        haloPositions.push(outerX, outerY, outerZ);
        haloUvs.push(1, i / segments);
      }

      for (let i = 0; i < segments; i++) {
        const a = i * 2;
        const b = i * 2 + 1;
        const c = (i + 1) * 2;
        const d = (i + 1) * 2 + 1;
        haloIndices.push(a, b, d);
        haloIndices.push(a, d, c);
      }

      const coreGeom = new THREE.BufferGeometry();
      coreGeom.setAttribute('position', new THREE.Float32BufferAttribute(corePositions, 3));
      coreGeom.setAttribute('uv', new THREE.Float32BufferAttribute(coreUvs, 2));
      coreGeom.setIndex(coreIndices);
      coreGeom.computeVertexNormals();

      const haloGeom = new THREE.BufferGeometry();
      haloGeom.setAttribute('position', new THREE.Float32BufferAttribute(haloPositions, 3));
      haloGeom.setAttribute('uv', new THREE.Float32BufferAttribute(haloUvs, 2));
      haloGeom.setIndex(haloIndices);
      haloGeom.computeVertexNormals();

      return { coreGeom, haloGeom };
    };

    return [
      {
        id: 'patch_anterolateral_esq',
        position: [0.38, -0.40, 1.05] as [number, number, number],
        rotation: [-0.18, 0.22, -0.15] as [number, number, number],
        ...createPatchGeom(0.38, 36, 0.32),
      },
      {
        id: 'patch_dorsal_dir',
        position: [-0.42, -0.37, 0.42] as [number, number, number],
        rotation: [-0.08, -0.28, 0.18] as [number, number, number],
        ...createPatchGeom(0.42, 36, 0.36),
      },
      {
        id: 'patch_apice_anterior',
        position: [0.06, -0.54, 1.58] as [number, number, number],
        rotation: [0.28, 0.05, 0.04] as [number, number, number],
        ...createPatchGeom(0.26, 28, 0.25),
      },
    ];
  }, [isGeographicTongue]);

  // 2. Geometria Anatômica do Palato Mole (Véu Palatino) e Úvula Palatina
  const { softPalateGeometry, uvulaGeometry } = useMemo(() => {
    const uSegments = 20;
    const vSegments = 16;
    const positions: number[] = [];
    const indices: number[] = [];
    const uvs: number[] = [];

    for (let layer = 0; layer < 2; layer++) {
      const isPharyngeal = layer === 1;
      const thicknessOffset = isPharyngeal ? 0.06 : -0.06;

      for (let j = 0; j <= vSegments; j++) {
        const v = j / vSegments;
        const z = -2.18 - v * 0.67;

        for (let i = 0; i <= uSegments; i++) {
          const u = i / uSegments;
          const normX = (u - 0.5) * 2;
          const halfSpan = 1.42 * (1 - v * 0.12);
          const x = normX * halfSpan;

          const archHeight = Math.cos(normX * (Math.PI * 0.48)) * 0.18;
          const descentY = 0.92 - v * 0.54;
          const y = descentY + archHeight + thicknessOffset;

          positions.push(x, y, z);
          uvs.push(u, v);
        }
      }
    }

    const vertsPerLayer = (uSegments + 1) * (vSegments + 1);

    for (let j = 0; j < vSegments; j++) {
      for (let i = 0; i < uSegments; i++) {
        const a = j * (uSegments + 1) + i;
        const b = (j + 1) * (uSegments + 1) + i;
        const c = (j + 1) * (uSegments + 1) + (i + 1);
        const d = j * (uSegments + 1) + (i + 1);
        indices.push(a, b, d);
        indices.push(b, c, d);

        const a2 = vertsPerLayer + a;
        const b2 = vertsPerLayer + b;
        const c2 = vertsPerLayer + c;
        const d2 = vertsPerLayer + d;
        indices.push(a2, d2, b2);
        indices.push(b2, d2, c2);
      }
    }

    for (let i = 0; i < uSegments; i++) {
      const topA = vSegments * (uSegments + 1) + i;
      const topB = topA + 1;
      const botA = vertsPerLayer + topA;
      const botB = vertsPerLayer + topB;
      indices.push(topA, botA, topB);
      indices.push(topB, botA, botB);
    }

    const palateGeom = new THREE.BufferGeometry();
    palateGeom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    palateGeom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    palateGeom.setIndex(indices);
    palateGeom.computeVertexNormals();

    const uvulaSlices = 18;
    const uvulaRadSegs = 20;
    const uPos: number[] = [];
    const uIndices: number[] = [];
    const uUVs: number[] = [];

    for (let i = 0; i <= uvulaSlices; i++) {
      const t = i / uvulaSlices;
      const y = 0.42 - t * 0.54;

      let radius: number;
      if (t < 0.75) {
        radius = 0.16 * (1 - t * 0.45);
      } else {
        const tipT = (t - 0.75) / 0.25;
        radius = 0.088 * Math.sqrt(Math.max(0, 1 - tipT * tipT));
      }

      for (let j = 0; j <= uvulaRadSegs; j++) {
        const phi = (j / uvulaRadSegs) * Math.PI * 2;
        const x = Math.cos(phi) * radius;
        const z = -2.85 + Math.sin(phi) * (radius * 0.88);

        uPos.push(x, y, z);
        uUVs.push(j / uvulaRadSegs, t);
      }
    }

    for (let i = 0; i < uvulaSlices; i++) {
      for (let j = 0; j < uvulaRadSegs; j++) {
        const a = i * (uvulaRadSegs + 1) + j;
        const b = (i + 1) * (uvulaRadSegs + 1) + j;
        const c = (i + 1) * (uvulaRadSegs + 1) + (j + 1);
        const d = i * (uvulaRadSegs + 1) + (j + 1);
        uIndices.push(a, b, d);
        uIndices.push(b, c, d);
      }
    }

    const uvGeom = new THREE.BufferGeometry();
    uvGeom.setAttribute('position', new THREE.Float32BufferAttribute(uPos, 3));
    uvGeom.setAttribute('uv', new THREE.Float32BufferAttribute(uUVs, 2));
    uvGeom.setIndex(uIndices);
    uvGeom.computeVertexNormals();

    return { softPalateGeometry: palateGeom, uvulaGeometry: uvGeom };
  }, []);

  // 3. Geometria Anatômica do Assoalho da Boca Fechado (Comprimento Total da Língua)
  const { floorOfMouthGeometry, frenulumGeometry } = useMemo(() => {
    const numZ = 48; // Fatias ao longo do comprimento
    const numX = 32; // Segmentos de um lado ao outro da mandíbula (fechado)
    const positions: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    for (let i = 0; i <= numZ; i++) {
      const t = i / numZ; // 0 = ápice anterior (z = 1.95), 1 = raiz posterior (z = -1.50)
      const z = 1.95 - t * 3.45; // Comprimento idêntico ao da língua (1.94 a -1.50)

      // Largura da arcada mandibular interna nesse Z
      let maxHalfWidth: number;
      if (t < 0.12) {
        maxHalfWidth = Math.sin((t / 0.12) * Math.PI * 0.5) * 0.78;
      } else if (t < 0.65) {
        maxHalfWidth = 0.78 + ((t - 0.12) / 0.53) * 0.62; // alarga até 1.40 entre pré-molares e molares
      } else {
        maxHalfWidth = 1.40 + ((t - 0.65) / 0.35) * 0.24; // alarga até 1.64 na região posterior da mandíbula
      }

      // Altura Y da borda mandibular externa
      let edgeY: number;
      if (t < 0.20) {
        edgeY = -0.86 - (t / 0.20) * 0.08;
      } else if (t < 0.70) {
        edgeY = -0.94 - ((t - 0.20) / 0.50) * 0.16;
      } else {
        const uPost = (t - 0.70) / 0.30;
        edgeY = -1.10 - uPost * 0.38; // desce acompanhando a linha milo-hióidea e o osso hioide
      }

      // Altura Y da linha média do assoalho (centro do soalho sob a língua)
      let midY: number;
      if (t < 0.15) {
        midY = -0.95 - t * 0.20;
      } else if (t < 0.70) {
        midY = -0.98 - ((t - 0.15) / 0.55) * 0.22;
      } else {
        const uPost = (t - 0.70) / 0.30;
        midY = -1.20 - uPost * uPost * 0.45; // transição posterior ao hioide
      }

      // Largura da língua nesse ponto (para calcular a calha sublingual livre)
      let tongueHalfW: number;
      if (t < 0.15) {
        tongueHalfW = Math.sin((t / 0.15) * Math.PI * 0.5) * 0.65;
      } else if (t < 0.70) {
        tongueHalfW = 0.65 + ((t - 0.15) / 0.55) * 0.58;
      } else {
        tongueHalfW = 1.23 - ((t - 0.70) / 0.30) * 0.25;
      }

      for (let j = 0; j <= numX; j++) {
        // v varia de -1 (cortical esquerda) a +1 (cortical direita)
        const v = (j / numX) * 2 - 1;
        const distFromMid = Math.abs(v); // 0 no centro, 1 na borda mandibular

        const px = v * maxHalfWidth;
        let py: number;

        if (distFromMid < 0.001) {
          py = midY;
        } else {
          // Curvatura anatômica: perfil de bacia/cinta côncava suave (diafragma do milo-hióideo)
          // Forma uma calha sublingual natural entre o corpo lingual e a mandíbula
          const curveFactor = Math.pow(distFromMid, 1.6);
          py = THREE.MathUtils.lerp(midY, edgeY, curveFactor);

          // Calha sublingual onde a saliva se acumula lateralmente à língua
          const isGutterRegion = px > tongueHalfW * 0.85 && distFromMid < 0.95;
          if (isGutterRegion && t > 0.06 && t < 0.85) {
            const gutterDip = Math.sin(Math.PI * Math.min(1, Math.max(0, (distFromMid - 0.4) / 0.5))) * -0.055;
            py += gutterDip;
          }
        }

        // Relevo anatômico das carúnculas sublinguais anteriores (saída dos ductos de Wharton)
        if (t < 0.16 && distFromMid > 0.04 && distFromMid < 0.22) {
          const caruncula =
            Math.sin(((distFromMid - 0.04) / 0.18) * Math.PI) *
            Math.sin((t / 0.16) * Math.PI) *
            0.042;
          py += caruncula;
        }

        // Pregas sublinguais (glândulas sublinguais sob a mucosa lateral)
        if (t > 0.08 && t < 0.58 && distFromMid > 0.28 && distFromMid < 0.75) {
          const glandRidge =
            Math.sin(((t - 0.08) / 0.50) * Math.PI) *
            Math.sin(((distFromMid - 0.28) / 0.47) * Math.PI) *
            0.045;
          py += glandRidge;
        }

        positions.push(px, py, z);
        uvs.push(j / numX, t);
      }
    }

    for (let i = 0; i < numZ; i++) {
      for (let j = 0; j < numX; j++) {
        const a = i * (numX + 1) + j;
        const b = (i + 1) * (numX + 1) + j;
        const c = (i + 1) * (numX + 1) + (j + 1);
        const d = i * (numX + 1) + (j + 1);

        // Ordem dos vértices para normais apontando para cima
        indices.push(a, d, b);
        indices.push(b, d, c);
      }
    }

    const floorGeom = new THREE.BufferGeometry();
    floorGeom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    floorGeom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    floorGeom.setIndex(indices);
    floorGeom.computeVertexNormals();

    // Frênulo Lingual na linha média (prega mucosa sagital mediana conectando soalho à língua)
    const frenGeom = new THREE.PlaneGeometry(0.32, 0.26, 6, 6);
    frenGeom.rotateY(Math.PI * 0.5);
    frenGeom.translate(0, -0.76, 1.48);

    return { floorOfMouthGeometry: floorGeom, frenulumGeometry: frenGeom };
  }, []);

  // 4. Geometria Anatômica das Amígdalas (Tonsilas Palatinas) com Criptas e Pilares
  const { tonsilsGeometries, tonsillarPillarsGeometry } = useMemo(() => {
    const createTonsilGeom = (isLeft: boolean) => {
      const geom = new THREE.SphereGeometry(0.30, 26, 20);
      geom.scale(0.72, 1.35, 0.90);

      const pos = geom.attributes.position;
      const v = new THREE.Vector3();

      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);

        // Modelagem de criptas tonsilares profundas e lobulações linfoides
        const cryptPattern =
          Math.sin(v.y * 14.0 + v.z * 10.0) * Math.cos(v.x * 12.0) +
          Math.sin(v.y * 22.0) * 0.35;

        if (cryptPattern < -0.32) {
          const depth = (cryptPattern + 0.32) * 0.075;
          v.addScaledVector(v.clone().normalize(), depth);
        } else if (cryptPattern > 0.42) {
          const bump = (cryptPattern - 0.42) * 0.038;
          v.addScaledVector(v.clone().normalize(), bump);
        }

        pos.setXYZ(i, v.x, v.y, v.z);
      }

      geom.computeVertexNormals();
      return geom;
    };

    // Pilares Amigdalianos (Arcos Palatoglosso e Palatofaríngeo)
    const curveL = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.95, 0.38, -1.45),
      new THREE.Vector3(-1.40, -0.05, -1.56),
      new THREE.Vector3(-1.36, -0.46, -1.68),
      new THREE.Vector3(-1.16, -0.74, -1.58),
    ]);
    const curveR = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.95, 0.38, -1.45),
      new THREE.Vector3(1.40, -0.05, -1.56),
      new THREE.Vector3(1.36, -0.46, -1.68),
      new THREE.Vector3(1.16, -0.74, -1.58),
    ]);

    const pillarL = new THREE.TubeGeometry(curveL, 20, 0.055, 10, false);
    const pillarR = new THREE.TubeGeometry(curveR, 20, 0.055, 10, false);

    return {
      tonsilsGeometries: {
        left: createTonsilGeom(true),
        right: createTonsilGeom(false),
      },
      tonsillarPillarsGeometry: { left: pillarL, right: pillarR },
    };
  }, []);

  // 3. Ramos Bilaterais do Nervo Lingual Conectados Diretamente à Língua
  const lingualNerveGeometries = useMemo(() => {
    const leftMainCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.82, -1.06, 0.08),
      new THREE.Vector3(0.79, -0.96, 0.46),
      new THREE.Vector3(0.72, -0.82, 0.92),
      new THREE.Vector3(0.54, -0.68, 1.36),
      new THREE.Vector3(0.26, -0.58, 1.74),
    ]);

    const leftDorsalCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.72, -0.82, 0.92),
      new THREE.Vector3(0.48, -0.56, 1.06),
      new THREE.Vector3(0.22, -0.44, 1.18),
    ]);

    const leftAnteriorCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.54, -0.68, 1.36),
      new THREE.Vector3(0.32, -0.52, 1.48),
      new THREE.Vector3(0.12, -0.46, 1.58),
    ]);

    const rightMainCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.82, -1.06, 0.08),
      new THREE.Vector3(-0.79, -0.96, 0.46),
      new THREE.Vector3(-0.72, -0.82, 0.92),
      new THREE.Vector3(-0.54, -0.68, 1.36),
      new THREE.Vector3(-0.26, -0.58, 1.74),
    ]);

    const rightDorsalCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.72, -0.82, 0.92),
      new THREE.Vector3(-0.48, -0.56, 1.06),
      new THREE.Vector3(-0.22, -0.44, 1.18),
    ]);

    const rightAnteriorCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.54, -0.68, 1.36),
      new THREE.Vector3(-0.32, -0.52, 1.48),
      new THREE.Vector3(-0.12, -0.46, 1.58),
    ]);

    return {
      leftMain: new THREE.TubeGeometry(leftMainCurve, 26, 0.034, 8, false),
      leftDorsal: new THREE.TubeGeometry(leftDorsalCurve, 16, 0.022, 6, false),
      leftAnterior: new THREE.TubeGeometry(leftAnteriorCurve, 16, 0.020, 6, false),
      rightMain: new THREE.TubeGeometry(rightMainCurve, 26, 0.034, 8, false),
      rightDorsal: new THREE.TubeGeometry(rightDorsalCurve, 16, 0.022, 6, false),
      rightAnterior: new THREE.TubeGeometry(rightAnteriorCurve, 16, 0.020, 6, false),
    };
  }, []);

  // 4. Materiais Dinâmicos
  const getTongueMaterial = () => {
    if (xrayMode) {
      return (
        <meshStandardMaterial
          color={isTongueSelected ? '#38BDF8' : '#0369A1'}
          transparent
          opacity={isTongueSelected ? 0.85 : 0.4}
          roughness={0.2}
          metalness={0.1}
          emissive={isTongueSelected ? '#0284C7' : '#082F49'}
          emissiveIntensity={isTongueSelected ? 0.7 : 0.2}
          side={THREE.DoubleSide}
        />
      );
    }

    let opacity = focusedSystem === 'oral_tissue' || isGeographicTongue ? 1.0 : (opacities.oral_tissue ?? 1.0);
    if (hasIsolation && !isTongueIsolated) {
      opacity = 0.15;
    }

    let color = isGeographicTongue ? '#C45160' : '#C84E5D';
    let emissive = '#000000';
    let emissiveIntensity = 0;

    if (isTongueSelected) {
      color = themeTokens.colors.brandCyan;
      emissive = '#00C9F6';
      emissiveIntensity = 0.65;
    } else if (isTongueHovered) {
      color = '#7DD3FC';
      emissive = '#0284C7';
      emissiveIntensity = 0.35;
    } else if (isTongueAnesthetized) {
      emissive = '#10B981';
      emissiveIntensity = 0.32;
    }

    return (
      <meshStandardMaterial
        color={color}
        roughness={isGeographicTongue ? 0.44 : 0.36}
        metalness={0.03}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
        transparent={opacity < 0.99 || (hasIsolation && !isTongueIsolated)}
        opacity={opacity}
        side={THREE.DoubleSide}
      />
    );
  };

  const getUvulaMaterial = () => {
    if (xrayMode) {
      return (
        <meshStandardMaterial
          color={isUvulaSelected ? '#38BDF8' : '#0284C7'}
          transparent
          opacity={isUvulaSelected ? 0.85 : 0.38}
          roughness={0.25}
          side={THREE.DoubleSide}
        />
      );
    }

    let opacity = focusedSystem === 'oral_tissue' ? 1.0 : (opacities.oral_tissue ?? 1.0);
    if (hasIsolation && !isUvulaIsolated) {
      opacity = 0.15;
    }

    let color = '#D66A78';
    let emissive = '#000000';
    let emissiveIntensity = 0;

    if (isUvulaSelected) {
      color = themeTokens.colors.brandCyan;
      emissive = '#00C9F6';
      emissiveIntensity = 0.65;
    } else if (isUvulaHovered) {
      color = '#7DD3FC';
      emissive = '#0284C7';
      emissiveIntensity = 0.35;
    } else if (isUvulaAnesthetized) {
      emissive = '#F59E0B';
      emissiveIntensity = 0.28;
    }

    return (
      <meshStandardMaterial
        color={color}
        roughness={0.34}
        metalness={0.02}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
        transparent={opacity < 0.99 || (hasIsolation && !isUvulaIsolated)}
        opacity={opacity}
        side={THREE.DoubleSide}
      />
    );
  };

  const getLingualNerveMaterial = (isLeft: boolean) => {
    if (xrayMode) {
      return (
        <meshStandardMaterial
          color={isLingualNerveSelected ? '#38BDF8' : '#0284C7'}
          transparent
          opacity={isLingualNerveSelected ? 0.95 : 0.45}
          roughness={0.15}
          emissive={isLingualNerveSelected ? '#00E5FF' : '#0369A1'}
          emissiveIntensity={isLingualNerveSelected ? 0.9 : 0.3}
        />
      );
    }

    let opacity = focusedSystem === 'nervous' ? 1.0 : (opacities.nervous ?? 1.0);
    if (hasIsolation && !isLingualNerveIsolated) {
      opacity = 0.15;
    }

    let color = '#FBBF24';
    let emissive = '#713F12';
    let emissiveIntensity = 0.35;

    if (isTongueAnesthetized && isLeft) {
      color = '#FDE047';
      emissive = '#D97706';
      emissiveIntensity = 0.95;
    }

    if (isLingualNerveSelected) {
      color = themeTokens.colors.brandCyan;
      emissive = '#00E5FF';
      emissiveIntensity = 0.85;
      opacity = 1.0;
    } else if (isLingualNerveHovered) {
      color = '#7DD3FC';
      emissive = '#0284C7';
      emissiveIntensity = 0.55;
    }

    return (
      <meshStandardMaterial
        color={color}
        roughness={0.25}
        metalness={0.05}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
        transparent={opacity < 0.99 || (hasIsolation && !isLingualNerveIsolated)}
        opacity={opacity}
      />
    );
  };

  const getFloorMaterial = () => {
    if (xrayMode) {
      return (
        <meshStandardMaterial
          color={isFloorSelected ? '#38BDF8' : '#D96B78'}
          transparent
          opacity={isFloorSelected ? 0.95 : 0.35}
          roughness={0.2}
          emissive={isFloorSelected ? '#00E5FF' : '#450A0A'}
          emissiveIntensity={isFloorSelected ? 0.8 : 0.15}
          side={THREE.DoubleSide}
        />
      );
    }

    let opacity = focusedSystem === 'oral_tissue' ? 1.0 : (opacities.oral_tissue ?? 1.0);
    if (hasIsolation && !isFloorIsolated) {
      opacity = 0.12;
    }

    let color = '#D96B78';
    let emissive = '#450A0A';
    let emissiveIntensity = 0.12;

    if (isFloorSelected) {
      color = themeTokens.colors.brandCyan;
      emissive = '#00C9F6';
      emissiveIntensity = 0.75;
      opacity = 1.0;
    } else if (isFloorHovered) {
      color = '#F472B6';
      emissive = '#DB2777';
      emissiveIntensity = 0.45;
    }

    return (
      <meshStandardMaterial
        color={color}
        roughness={0.28}
        metalness={0.04}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
        transparent={opacity < 0.99 || (hasIsolation && !isFloorIsolated)}
        opacity={opacity}
        side={THREE.DoubleSide}
      />
    );
  };

  const getTonsilsMaterial = () => {
    if (xrayMode) {
      return (
        <meshStandardMaterial
          color={isTonsilsSelected ? '#38BDF8' : '#CE5B69'}
          transparent
          opacity={isTonsilsSelected ? 0.95 : 0.35}
          roughness={0.3}
          emissive={isTonsilsSelected ? '#00E5FF' : '#450A0A'}
          emissiveIntensity={isTonsilsSelected ? 0.8 : 0.15}
        />
      );
    }

    let opacity = focusedSystem === 'oral_tissue' ? 1.0 : (opacities.oral_tissue ?? 1.0);
    if (hasIsolation && !isTonsilsIsolated) {
      opacity = 0.12;
    }

    let color = '#CE5B69';
    let emissive = '#4C0519';
    let emissiveIntensity = 0.18;

    if (isTonsilsSelected) {
      color = themeTokens.colors.brandCyan;
      emissive = '#00C9F6';
      emissiveIntensity = 0.75;
      opacity = 1.0;
    } else if (isTonsilsHovered) {
      color = '#FB7185';
      emissive = '#E11D48';
      emissiveIntensity = 0.45;
    }

    return (
      <meshStandardMaterial
        color={color}
        roughness={0.42}
        metalness={0.02}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
        transparent={opacity < 0.99 || (hasIsolation && !isTonsilsIsolated)}
        opacity={opacity}
      />
    );
  };

  if (surfaceExplorationMode) return null;

  const tongueExplosionOffset: [number, number, number] = [0, -2.55 * explosionFactor, 0.95 * explosionFactor];
  const floorExplosionOffset: [number, number, number] = [0, -2.55 * explosionFactor, 0.95 * explosionFactor];
  const tonsilsLeftExplosionOffset: [number, number, number] = [-0.85 * explosionFactor, -0.65 * explosionFactor, -0.85 * explosionFactor];
  const tonsilsRightExplosionOffset: [number, number, number] = [0.85 * explosionFactor, -0.65 * explosionFactor, -0.85 * explosionFactor];
  const uvulaExplosionOffset: [number, number, number] = [0, -0.35 * explosionFactor, 1.45 * explosionFactor];

  type InteractiveOralId = 'lingua' | 'uvula' | 'nervo_lingual' | 'assoalho_boca' | 'tonsilas_palatinas';

  const handlePointerOver = (e: any, structureId: InteractiveOralId) => {
    e.stopPropagation();
    setHoveredStructure(structureId);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e: any) => {
    e.stopPropagation();
    setHoveredStructure(null);
    document.body.style.cursor = 'grab';
  };

  const handleClick = (e: any, structureId: InteractiveOralId) => {
    e.stopPropagation();
    const isPathology = typeof window !== 'undefined' && window.location.pathname.includes('/pathologies');
    const isAnesthesia = typeof window !== 'undefined' && window.location.pathname.includes('/anesthesia');
    if (isPathology || isAnesthesia) return;
    setSelectedStructure(structureId);
  };

  return (
    <group name="oral_tongue_and_uvula_group">
      {/* 1. Língua (Normal ou Fissurada com Lesões Geográficas) */}
      {!isTongueHidden && isLayerVisibleOral && (
        <group ref={tongueGroupRef} position={tongueExplosionOffset}>
          <mesh
            ref={tongueRef}
            name="oral-tongue"
            geometry={tongueGeometry}
            castShadow
            receiveShadow
            onPointerOver={(e) => handlePointerOver(e, 'lingua')}
            onPointerOut={handlePointerOut}
            onClick={(e) => handleClick(e, 'lingua')}
          >
            {getTongueMaterial()}
          </mesh>

          {/* Lesões Tridimensionais da Língua Geográfica (Áreas Despapiladas com Bordas Serpiginosas) */}
          {isGeographicTongue && !xrayMode && (
            <group ref={geographicPatchGroupRef} name="geographic-tongue-patches">
              {geographicPatches.map((patch) => (
                <group
                  key={patch.id}
                  position={patch.position}
                  rotation={patch.rotation}
                >
                  {/* Centro Eritematoso Despapilado da Lesão (Glossite) */}
                  <mesh geometry={patch.coreGeom}>
                    <meshStandardMaterial
                      color="#BE123C"
                      emissive="#9F1239"
                      emissiveIntensity={0.35}
                      roughness={0.24}
                      side={THREE.DoubleSide}
                    />
                  </mesh>

                  {/* Halo Elevado Esbranquiçado/Amarelado Saliente Serpiginoso */}
                  <mesh name="geographic-halo" geometry={patch.haloGeom}>
                    <meshStandardMaterial
                      color="#FEF08A"
                      emissive="#FDE047"
                      emissiveIntensity={0.5}
                      roughness={0.4}
                      side={THREE.DoubleSide}
                    />
                  </mesh>
                </group>
              ))}
            </group>
          )}

          {/* Destaque visual da hemilíngua anestesiada no Bloqueio do Nervo Lingual */}
          {isTongueAnesthetized && !xrayMode && !isGeographicTongue && (
            <mesh
              ref={anesthesiaGlowRef}
              position={[0.55, -0.42, 0.7]}
              scale={[0.7, 0.22, 1.4]}
            >
              <sphereGeometry args={[1, 18, 14]} />
              <meshStandardMaterial
                color="#34D399"
                emissive="#10B981"
                emissiveIntensity={0.45}
                transparent
                opacity={0.35}
                roughness={0.2}
                depthWrite={false}
              />
            </mesh>
          )}
        </group>
      )}

      {/* 2. Assoalho da Boca (Soalho Bucal Sublingual com Frênulo Lingual e Carúnculas) */}
      {!isFloorHidden && isLayerVisibleOral && (
        <group
          ref={floorGroupRef}
          name="oral-floor-of-mouth"
          position={floorExplosionOffset}
          onPointerOver={(e) => handlePointerOver(e, 'assoalho_boca')}
          onPointerOut={handlePointerOut}
          onClick={(e) => handleClick(e, 'assoalho_boca')}
        >
          <mesh
            geometry={floorOfMouthGeometry}
            castShadow
            receiveShadow
          >
            {getFloorMaterial()}
          </mesh>
          <mesh
            geometry={frenulumGeometry}
            castShadow
          >
            {getFloorMaterial()}
          </mesh>
        </group>
      )}

      {/* 3. Amígdalas (Tonsilas Palatinas) e Pilares Amigdalianos Bilaterais */}
      {!isTonsilsHidden && isLayerVisibleOral && !archesOnlyMode && (
        <group
          name="oral-tonsils"
          onPointerOver={(e) => handlePointerOver(e, 'tonsilas_palatinas')}
          onPointerOut={handlePointerOut}
          onClick={(e) => handleClick(e, 'tonsilas_palatinas')}
        >
          {/* Amígdala Esquerda com Criptas Tonsilares */}
          <group
            position={[
              -1.38 + tonsilsLeftExplosionOffset[0],
              -0.32 + tonsilsLeftExplosionOffset[1],
              -1.65 + tonsilsLeftExplosionOffset[2],
            ]}
            rotation={[0.15, 0.40, -0.20]}
          >
            <mesh geometry={tonsilsGeometries.left} castShadow receiveShadow>
              {getTonsilsMaterial()}
            </mesh>
          </group>

          {/* Amígdala Direita com Criptas Tonsilares */}
          <group
            position={[
              1.38 + tonsilsRightExplosionOffset[0],
              -0.32 + tonsilsRightExplosionOffset[1],
              -1.65 + tonsilsRightExplosionOffset[2],
            ]}
            rotation={[0.15, -0.40, 0.20]}
          >
            <mesh geometry={tonsilsGeometries.right} castShadow receiveShadow>
              {getTonsilsMaterial()}
            </mesh>
          </group>

          {/* Pilares Amigdalianos (Arcos Palatoglosso e Palatofaríngeo) */}
          <mesh geometry={tonsillarPillarsGeometry.left} position={tonsilsLeftExplosionOffset}>
            {getTonsilsMaterial()}
          </mesh>
          <mesh geometry={tonsillarPillarsGeometry.right} position={tonsilsRightExplosionOffset}>
            {getTonsilsMaterial()}
          </mesh>
        </group>
      )}

      {/* 2. Palato Mole e Úvula Palatina (oculta durante Língua Geográfica para mostrar somente a língua) */}
      {!isUvulaHidden && isLayerVisibleOral && !archesOnlyMode && !isGeographicTongue && (
        <group
          name="oral-uvula"
          position={uvulaExplosionOffset}
          onPointerOver={(e) => handlePointerOver(e, 'uvula')}
          onPointerOut={handlePointerOut}
          onClick={(e) => handleClick(e, 'uvula')}
        >
          <mesh geometry={softPalateGeometry} castShadow receiveShadow>
            {getUvulaMaterial()}
          </mesh>
          <mesh geometry={uvulaGeometry} castShadow receiveShadow>
            {getUvulaMaterial()}
          </mesh>
        </group>
      )}

      {/* 3. Ramos Bilaterais do Nervo Lingual (ocultos durante Língua Geográfica para foco exclusivo na língua) */}
      {!isNerveHidden && !isGeographicTongue && (isLayerVisibleNerves || isLingualNerveSelected || isTongueAnesthetized) && (
        <group
          ref={lingualNerveGroupRef}
          name="lingual-nerve-tongue-connections"
          position={tongueExplosionOffset}
          onPointerOver={(e) => handlePointerOver(e, 'nervo_lingual')}
          onPointerOut={handlePointerOut}
          onClick={(e) => handleClick(e, 'nervo_lingual')}
        >
          <mesh geometry={lingualNerveGeometries.leftMain} castShadow>
            {getLingualNerveMaterial(true)}
          </mesh>
          <mesh geometry={lingualNerveGeometries.leftDorsal}>
            {getLingualNerveMaterial(true)}
          </mesh>
          <mesh geometry={lingualNerveGeometries.leftAnterior}>
            {getLingualNerveMaterial(true)}
          </mesh>
          <mesh geometry={lingualNerveGeometries.rightMain} castShadow>
            {getLingualNerveMaterial(false)}
          </mesh>
          <mesh geometry={lingualNerveGeometries.rightDorsal}>
            {getLingualNerveMaterial(false)}
          </mesh>
          <mesh geometry={lingualNerveGeometries.rightAnterior}>
            {getLingualNerveMaterial(false)}
          </mesh>
        </group>
      )}
    </group>
  );
};
