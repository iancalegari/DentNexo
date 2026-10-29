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
    focusedSystem,
    surfaceExplorationMode,
    setSelectedStructure,
    setHoveredStructure,
  } = useAnatomyStore();

  const tongueRef = useRef<THREE.Mesh>(null);
  const anesthesiaGlowRef = useRef<THREE.Mesh>(null);

  // Animação de pulso para difusão anestésica na hemilíngua
  useFrame(({ clock }) => {
    if (anesthesiaGlowRef.current) {
      const t = clock.getElapsedTime();
      const pulse = 0.35 + Math.sin(t * 3.2) * 0.15;
      (anesthesiaGlowRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse;
    }
  });

  // Visibilidade de camadas e isolamento
  const isLayerVisibleOral = layers.oral_tissue || focusedSystem === 'oral_tissue';
  const isLayerVisibleNerves = layers.nervous || focusedSystem === 'nervous';

  const isTongueHidden = hiddenStructureIds.includes('lingua');
  const isUvulaHidden = hiddenStructureIds.includes('uvula');
  const isNerveHidden = hiddenStructureIds.includes('nervo_lingual');

  const isTongueSelected = selectedStructureId === 'lingua';
  const isTongueHovered = hoveredStructureId === 'lingua';
  const isTongueIsolated = isolatedStructureId === 'lingua';

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

  // 1. Geometria Anatômica Orgânica da Língua
  const tongueGeometry = useMemo(() => {
    const slices = 32;
    const radialSegments = 32;
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

        // Sulco mediano longitudinal característico no dorso superior
        if (sinT > 0 && t > 0.08 && t < 0.82) {
          const distFromMid = Math.abs(cosT);
          const grooveDepth =
            0.075 *
            (1.0 - Math.min(1.0, distFromMid * 3.8)) *
            Math.sin(((t - 0.08) / 0.74) * Math.PI);
          py -= grooveDepth;
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
  }, []);

  // 2. Geometria Anatômica Realista do Palato Mole (Véu Palatino) e Úvula Palatina
  // Conexão direta com a borda posterior dos ossos palatinos (z = -2.18), arqueando suavemente
  // em cortina muscular contínua com espessura real e a úvula cônica pendular na linha média.
  const { softPalateGeometry, uvulaGeometry } = useMemo(() => {
    // A) Véu Palatino Volumétrico (Dupla face contínua com espessura muscular e arcos palatofaríngeos)
    const uSegments = 20; // através do arco transversal (esquerda para direita)
    const vSegments = 16; // profundidade anteroposterior (do palato duro à borda livre)
    const positions: number[] = [];
    const indices: number[] = [];
    const uvs: number[] = [];

    // Gerar duas camadas: oral (inferior) e faríngea (superior) com espessura anatômica (~0.12)
    for (let layer = 0; layer < 2; layer++) {
      const isPharyngeal = layer === 1;
      const thicknessOffset = isPharyngeal ? 0.06 : -0.06;

      for (let j = 0; j <= vSegments; j++) {
        const v = j / vSegments; // 0 = junção no palato duro (z = -2.18), 1 = borda livre (z = -2.85)
        const z = -2.18 - v * 0.67;

        for (let i = 0; i <= uSegments; i++) {
          const u = i / uSegments; // 0 (esquerda) a 1 (direita)
          const normX = (u - 0.5) * 2; // -1 a +1
          const halfSpan = 1.42 * (1 - v * 0.12);
          const x = normX * halfSpan;

          // Curvatura do arco palatino (côncavo oralmente, arqueado superiormente)
          const archHeight = Math.cos(normX * (Math.PI * 0.48)) * 0.18;
          // Descida suave oblíqua do palato duro em direção à orofaringe
          const descentY = 0.92 - v * 0.54;
          const y = descentY + archHeight + thicknessOffset;

          positions.push(x, y, z);
          uvs.push(u, v);
        }
      }
    }

    const vertsPerLayer = (uSegments + 1) * (vSegments + 1);

    // Conectar faces da camada oral (inferior)
    for (let j = 0; j < vSegments; j++) {
      for (let i = 0; i < uSegments; i++) {
        const a = j * (uSegments + 1) + i;
        const b = (j + 1) * (uSegments + 1) + i;
        const c = (j + 1) * (uSegments + 1) + (i + 1);
        const d = j * (uSegments + 1) + (i + 1);
        indices.push(a, b, d);
        indices.push(b, c, d);

        // Camada faríngea (superior - normais invertidas)
        const a2 = vertsPerLayer + a;
        const b2 = vertsPerLayer + b;
        const c2 = vertsPerLayer + c;
        const d2 = vertsPerLayer + d;
        indices.push(a2, d2, b2);
        indices.push(b2, d2, c2);
      }
    }

    // Selar as bordas laterais e a borda livre posterior para fechar o sólido anatômico
    // Borda posterior livre (v = vSegments)
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

    // B) Úvula Palatina Anatômica (Projeção muscular cônica suave com ápice arredondado)
    // Suspensa exatamente na linha média da borda livre posterior do palato mole (x=0, z=-2.85, y=0.42 descendo até y=-0.12)
    const uvulaSlices = 18;
    const uvulaRadSegs = 20;
    const uPos: number[] = [];
    const uIndices: number[] = [];
    const uUVs: number[] = [];

    for (let i = 0; i <= uvulaSlices; i++) {
      const t = i / uvulaSlices; // 0 = base muscular superior, 1 = ápice inferior livre
      const y = 0.42 - t * 0.54; // comprimento total ~0.54 unidades

      // Raio da úvula: largo na base (0.16), afinando suavemente (0.09) e arredondando no ápice
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
        // Leve compressão anteroposterior orgânica
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

  // 3. Ramos Terminais Bilaterais do Nervo Lingual (Nervus lingualis) Conectados Diretamente à Língua
  // Partem da extremidade do nervo no espaço pterigomandibular (z = 0.08, y = -1.06, x = ±0.82)
  // penetram a borda lateral da língua e ramificam-se pelos 2/3 anteriores e dorso gustatório.
  const lingualNerveGeometries = useMemo(() => {
    // Tronco principal esquerdo (lado odontológico anestesiado nos bloqueios NAI e Lingual)
    const leftMainCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.82, -1.06, 0.08), // extremidade do lingual-nerve-left do modelo
      new THREE.Vector3(0.79, -0.96, 0.46), // sulco gengivolingual medial ao dente 37
      new THREE.Vector3(0.72, -0.82, 0.92), // penetração na margem lateral da hemilíngua
      new THREE.Vector3(0.54, -0.68, 1.36), // trajeto anterolateral no corpo lingual
      new THREE.Vector3(0.26, -0.58, 1.74), // ramificação terminal próxima ao ápice
    ]);

    // Ramo gustatório/sensitivo dorsal esquerdo (para papilhas fungiformes e dorso)
    const leftDorsalCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.72, -0.82, 0.92),
      new THREE.Vector3(0.48, -0.56, 1.06),
      new THREE.Vector3(0.22, -0.44, 1.18),
    ]);

    // Ramo anteromedial esquerdo
    const leftAnteriorCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.54, -0.68, 1.36),
      new THREE.Vector3(0.32, -0.52, 1.48),
      new THREE.Vector3(0.12, -0.46, 1.58),
    ]);

    // Tronco principal direito (simétrico no hemisfério X negativo)
    const rightMainCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.82, -1.06, 0.08),
      new THREE.Vector3(-0.79, -0.96, 0.46),
      new THREE.Vector3(-0.72, -0.82, 0.92),
      new THREE.Vector3(-0.54, -0.68, 1.36),
      new THREE.Vector3(-0.26, -0.58, 1.74),
    ]);

    // Ramo dorsal direito
    const rightDorsalCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.72, -0.82, 0.92),
      new THREE.Vector3(-0.48, -0.56, 1.06),
      new THREE.Vector3(-0.22, -0.44, 1.18),
    ]);

    // Ramo anteromedial direito
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

  // 4. Materiais Dinâmicos (Língua, Úvula/Palato e Nervo Lingual)
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

    let opacity = focusedSystem === 'oral_tissue' ? 1.0 : (opacities.oral_tissue ?? 1.0);
    if (hasIsolation && !isTongueIsolated) {
      opacity = 0.15;
    }

    let color = '#C84E5D'; // Tom mucoso orgânico aveludado realista
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
        roughness={0.36}
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

    // Cor base dourada característica do sistema nervoso trigêmeo
    let color = '#FBBF24';
    let emissive = '#713F12';
    let emissiveIntensity = 0.35;

    // Realce no Bloqueio Anestésico do Nervo Lingual ou NAI
    if (isTongueAnesthetized && isLeft) {
      color = '#FDE047';
      emissive = '#D97706';
      emissiveIntensity = 0.95;
    }

    // Seleção ou Hover direto
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

  // Se estiver em modo exploração de superfície dental isolada, não renderizar tecidos moles
  if (surfaceExplorationMode) return null;

  // Vetor de deslocamento na vista explodida (língua e nervo acompanham a mandíbula; palato/úvula acompanham a maxila)
  const tongueExplosionOffset: [number, number, number] = [0, -2.55 * explosionFactor, 0.95 * explosionFactor];
  const uvulaExplosionOffset: [number, number, number] = [0, -0.35 * explosionFactor, 1.45 * explosionFactor];

  const handlePointerOver = (e: any, structureId: 'lingua' | 'uvula' | 'nervo_lingual') => {
    e.stopPropagation();
    setHoveredStructure(structureId);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e: any) => {
    e.stopPropagation();
    setHoveredStructure(null);
    document.body.style.cursor = 'grab';
  };

  const handleClick = (e: any, structureId: 'lingua' | 'uvula' | 'nervo_lingual') => {
    e.stopPropagation();
    const isPathology = typeof window !== 'undefined' && window.location.pathname.includes('/pathologies');
    const isAnesthesia = typeof window !== 'undefined' && window.location.pathname.includes('/anesthesia');
    if (isPathology || isAnesthesia) return;
    setSelectedStructure(structureId);
  };

  return (
    <group name="oral_tongue_and_uvula_group">
      {/* 1. Língua (situada no assoalho bucal entre as arcadas inferiores) */}
      {!isTongueHidden && isLayerVisibleOral && (
        <group position={tongueExplosionOffset}>
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

          {/* Destaque visual da hemilíngua anestesiada no Bloqueio do Nervo Lingual (2/3 anteriores esquerdos) */}
          {isTongueAnesthetized && !xrayMode && (
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

      {/* 2. Palato Mole (Véu Palatino) e Úvula Palatina (suspensa na linha média posterior) */}
      {!isUvulaHidden && isLayerVisibleOral && !archesOnlyMode && (
        <group
          name="oral-uvula"
          position={uvulaExplosionOffset}
          onPointerOver={(e) => handlePointerOver(e, 'uvula')}
          onPointerOut={handlePointerOut}
          onClick={(e) => handleClick(e, 'uvula')}
        >
          {/* Véu Palatino Anatômico Contínuo */}
          <mesh geometry={softPalateGeometry} castShadow receiveShadow>
            {getUvulaMaterial()}
          </mesh>

          {/* Úvula Palatina Cônica Suave */}
          <mesh geometry={uvulaGeometry} castShadow receiveShadow>
            {getUvulaMaterial()}
          </mesh>
        </group>
      )}

      {/* 3. Ramos Bilaterais do Nervo Lingual Conectando o Crânio/Mandíbula à Língua */}
      {!isNerveHidden && (isLayerVisibleNerves || isLingualNerveSelected || isTongueAnesthetized) && (
        <group
          name="lingual-nerve-tongue-connections"
          position={tongueExplosionOffset}
          onPointerOver={(e) => handlePointerOver(e, 'nervo_lingual')}
          onPointerOut={handlePointerOut}
          onClick={(e) => handleClick(e, 'nervo_lingual')}
        >
          {/* Nervo Lingual Esquerdo (Ramos terminais e dorso gustatório) */}
          <mesh geometry={lingualNerveGeometries.leftMain} castShadow>
            {getLingualNerveMaterial(true)}
          </mesh>
          <mesh geometry={lingualNerveGeometries.leftDorsal}>
            {getLingualNerveMaterial(true)}
          </mesh>
          <mesh geometry={lingualNerveGeometries.leftAnterior}>
            {getLingualNerveMaterial(true)}
          </mesh>

          {/* Nervo Lingual Direito (Ramos simétricos) */}
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
