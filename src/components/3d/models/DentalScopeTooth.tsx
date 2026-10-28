import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { useAnatomyStore } from '@/stores/useAnatomyStore';
import { DECIDUOUS_TO_HOMOLOGOUS_MAP } from '@/data/dental/deciduousTeethData';
import { themeTokens } from '@/theme/tokens';

interface DentalScopeToothProps {
  fdi?: string;
}

const TOOTH_LAYER_COLORS = {
  enamel: '#F1E8D5',
  dentinCoronal: '#E3C285',
  dentinRadicular: '#DCB978',
  cementum: '#C7A071',
  pdl: '#D4847D',
  pulp: '#DC2626',
  canal: '#EF4444',
};

export const DentalScopeTooth: React.FC<DentalScopeToothProps> = ({ fdi }) => {
  const { activeToothFdi, toothViewMode, activePathologyId } = useAnatomyStore();
  const currentFdi = fdi || activeToothFdi || '36';

  // Dentes decíduos (51 a 85) utilizam os modelos anatômicos homólogos proporcionais
  const isDeciduous = currentFdi in DECIDUOUS_TO_HOMOLOGOUS_MAP;
  const modelFdi = DECIDUOUS_TO_HOMOLOGOUS_MAP[currentFdi] || currentFdi;

  const gltfPath = `/models/dental-scope/teeth/tooth-${modelFdi}.glb`;
  const { scene } = useGLTF(gltfPath);

  // Centralizar o dente e configurar materiais histológicos por camada
  const centeredScene = useMemo(() => {
    const clone = scene.clone(true);

    // Calcular bounding box para centralizar o dente exatamente no centro da câmera
    const box = new THREE.Box3().setFromObject(clone);
    const center = new THREE.Vector3();
    box.getCenter(center);
    clone.position.sub(center);

    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      const name = child.name.toLowerCase();

      // Identificar camada histológica
      const isEnamel = name.includes('enamel');
      const isDentinCoronal = name.includes('dentin-coronal');
      const isDentinRadicular = name.includes('dentin-radicular');
      const isCementum = name.includes('cementum');
      const isPdl = name.includes('pdl');
      const isPulp = name.includes('pulp');
      const isCanal = name.includes('canal');

      let color = TOOTH_LAYER_COLORS.enamel;
      let roughness = 0.35;
      let metalness = 0.04;
      let opacity = 1.0;
      let transparent = false;
      let emissive = '#000000';
      let emissiveIntensity = 0;
      let visible = true;

      if (toothViewMode === 'external') {
        // Visão Externa: Esmalte e Cemento visíveis, camadas internas protegidas
        if (isPulp || isCanal || isDentinCoronal || isDentinRadicular || isPdl) {
          visible = false;
        } else if (isCementum) {
          color = TOOTH_LAYER_COLORS.cementum;
          roughness = 0.65;
        } else if (isEnamel) {
          color = TOOTH_LAYER_COLORS.enamel;
          roughness = 0.2;
          metalness = 0.05;
        }
      } else if (toothViewMode === 'cross_section') {
        // Corte Didático: Esmalte e cemento translúcidos, polpa e canais destacados
        if (isEnamel) {
          color = TOOTH_LAYER_COLORS.enamel;
          transparent = true;
          opacity = 0.32;
          roughness = 0.2;
        } else if (isCementum) {
          color = TOOTH_LAYER_COLORS.cementum;
          transparent = true;
          opacity = 0.4;
          roughness = 0.6;
        } else if (isDentinCoronal) {
          color = TOOTH_LAYER_COLORS.dentinCoronal;
          roughness = 0.55;
        } else if (isDentinRadicular) {
          color = TOOTH_LAYER_COLORS.dentinRadicular;
          roughness = 0.58;
        } else if (isPdl) {
          color = TOOTH_LAYER_COLORS.pdl;
          transparent = true;
          opacity = 0.5;
        } else if (isPulp) {
          color = TOOTH_LAYER_COLORS.pulp;
          emissive = '#991B1B';
          emissiveIntensity = 0.6;
        } else if (isCanal) {
          color = TOOTH_LAYER_COLORS.canal;
          emissive = '#B91C1C';
          emissiveIntensity = 0.7;
        }
      } else if (toothViewMode === 'xray') {
        // Raio X: Modelo translúcido fluorescente
        transparent = true;
        if (isPulp || isCanal) {
          color = '#00C9F6';
          opacity = 0.95;
          emissive = '#00C9F6';
          emissiveIntensity = 0.8;
        } else {
          color = '#38BDF8';
          opacity = 0.35;
          emissive = '#0369A1';
          emissiveIntensity = 0.2;
        }
      } else if (toothViewMode === 'pulp_isolation') {
        // Isolamento Endodôntico: Câmara Pulpar e Canais Radiculares em foco total
        if (isPulp || isCanal) {
          color = '#EF4444';
          emissive = '#DC2626';
          emissiveIntensity = 0.9;
          opacity = 1.0;
        } else {
          color = '#E2E8F0';
          transparent = true;
          opacity = 0.12;
          roughness = 0.3;
        }
      }

      child.visible = visible;
      child.material = new THREE.MeshStandardMaterial({
        color,
        roughness,
        metalness,
        transparent,
        opacity,
        emissive,
        emissiveIntensity,
        side: THREE.DoubleSide,
      });

      child.castShadow = true;
      child.receiveShadow = true;
    });

    return clone;
  }, [scene, toothViewMode]);

  const toothScale: [number, number, number] = isDeciduous ? [2.1, 2.1, 2.1] : [2.6, 2.6, 2.6];

  return (
    <group name={`dental_scope_tooth_${currentFdi}`} scale={toothScale}>
      <primitive object={centeredScene} />

      {/* ================= LESÃO 3D DE CÁRIE DENTÁRIA (PONTO PRETO CAVITADO EM ESMALTE/DENTINA) ================= */}
      {(activePathologyId === 'carie_dentaria' || activePathologyId === 'carie') && (
        <group position={[0.02, 0.43, 0.04]}>
          {/* Luz focal interna na cavitação cariosa */}
          <pointLight color="#F59E0B" intensity={1.4} distance={0.9} />

          {/* 1. Halo desmineralizado de esmalte (Mancha Branca Ativa / descalcificação superficial) */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.055, 0.13, 32]} />
            <meshStandardMaterial
              color="#FEF3C7"
              emissive="#D97706"
              emissiveIntensity={0.25}
              roughness={0.75}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* 2. Cavitação Necrótica Central (O Ponto Preto 3D Clássico) */}
          <mesh position={[0, -0.012, 0]} scale={[1.35, 0.55, 0.88]}>
            <sphereGeometry args={[0.07, 24, 24]} />
            <meshStandardMaterial
              color="#140803"
              emissive="#080301"
              roughness={0.96}
              metalness={0.0}
            />
          </mesh>

          {/* 3. Ramificações nos sulcos e fissuras de desenvolvimento oclusais */}
          <mesh position={[-0.07, -0.008, -0.02]} scale={[1.2, 0.4, 0.6]}>
            <sphereGeometry args={[0.038, 16, 16]} />
            <meshStandardMaterial color="#1C0C05" roughness={0.92} />
          </mesh>
          <mesh position={[0.08, -0.008, 0.03]} scale={[1.15, 0.4, 0.6]}>
            <sphereGeometry args={[0.035, 16, 16]} />
            <meshStandardMaterial color="#1C0C05" roughness={0.92} />
          </mesh>
        </group>
      )}

      {/* ================= HIPEREMIA PULPAR 3D (PULPITE) ================= */}
      {activePathologyId === 'pulpite' && (
        <group position={[0, 0.12, 0.05]}>
          <pointLight color="#DC2626" intensity={2.2} distance={1.4} />
          <mesh>
            <sphereGeometry args={[0.13, 24, 24]} />
            <meshStandardMaterial
              color="#EF4444"
              emissive="#DC2626"
              emissiveIntensity={1.0}
              roughness={0.3}
              transparent
              opacity={0.88}
            />
          </mesh>
        </group>
      )}

      {/* ================= ABSCESSO PERIAPICAL 3D (ÁPICE RADICULAR) ================= */}
      {(activePathologyId === 'abscesso_periapical' || activePathologyId === 'abscesso') && (
        <group position={[0, -0.46, 0.02]}>
          <pointLight color="#EAB308" intensity={1.8} distance={1.4} />
          {/* Halo inflamatório osteolítico */}
          <mesh>
            <sphereGeometry args={[0.16, 24, 24]} />
            <meshStandardMaterial color="#7F1D1D" transparent opacity={0.45} />
          </mesh>
          {/* Núcleo purulento flutuante no forame apical */}
          <mesh>
            <sphereGeometry args={[0.10, 24, 24]} />
            <meshStandardMaterial
              color="#FACC15"
              emissive="#CA8A04"
              emissiveIntensity={0.85}
            />
          </mesh>
        </group>
      )}

      {/* Luzes técnicas direcionadas para anatomia dental */}
      <spotLight position={[5, 8, 5]} intensity={1.4} angle={0.5} penumbra={0.4} color="#FFFFFF" />
      <pointLight position={[-4, -3, -4]} intensity={0.5} color="#7DD3FC" />
    </group>
  );
};
