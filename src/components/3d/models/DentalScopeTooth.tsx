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
  const { activeToothFdi, toothViewMode, activePathologyId, selectedStructureId } = useAnatomyStore();
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

    const isSelectedPdl = selectedStructureId === 'ligamento_periodontal';

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
        if (isPulp || isCanal || isDentinCoronal || isDentinRadicular) {
          visible = false;
        } else if (isPdl) {
          visible = isSelectedPdl;
          if (isSelectedPdl) {
            color = themeTokens.colors.brandCyan;
            emissive = '#00C9F6';
            emissiveIntensity = 0.85;
            transparent = true;
            opacity = 0.9;
          }
        } else if (isCementum) {
          color = TOOTH_LAYER_COLORS.cementum;
          roughness = 0.65;
          if (isSelectedPdl) {
            transparent = true;
            opacity = 0.35;
          }
        } else if (isEnamel) {
          color = TOOTH_LAYER_COLORS.enamel;
          roughness = 0.2;
          metalness = 0.05;
          if (isSelectedPdl) {
            transparent = true;
            opacity = 0.35;
          }
        }
      } else if (toothViewMode === 'cross_section') {
        // Corte Didático: Esmalte e cemento translúcidos, polpa e canais destacados
        if (isEnamel) {
          color = TOOTH_LAYER_COLORS.enamel;
          transparent = true;
          opacity = isSelectedPdl ? 0.2 : 0.32;
          roughness = 0.2;
        } else if (isCementum) {
          color = TOOTH_LAYER_COLORS.cementum;
          transparent = true;
          opacity = isSelectedPdl ? 0.25 : 0.4;
          roughness = 0.6;
        } else if (isDentinCoronal) {
          color = TOOTH_LAYER_COLORS.dentinCoronal;
          roughness = 0.55;
        } else if (isDentinRadicular) {
          color = TOOTH_LAYER_COLORS.dentinRadicular;
          roughness = 0.58;
        } else if (isPdl) {
          color = isSelectedPdl ? themeTokens.colors.brandCyan : TOOTH_LAYER_COLORS.pdl;
          emissive = isSelectedPdl ? '#00C9F6' : '#000000';
          emissiveIntensity = isSelectedPdl ? 0.85 : 0;
          transparent = true;
          opacity = isSelectedPdl ? 0.95 : 0.5;
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
  }, [scene, toothViewMode, selectedStructureId]);

  const toothScale: [number, number, number] = isDeciduous ? [2.1, 2.1, 2.1] : [2.6, 2.6, 2.6];

  return (
    <group name={`dental_scope_tooth_${currentFdi}`} scale={toothScale}>
      <primitive object={centeredScene} />

      {/* ================= LESÃO 3D DE CÁRIE DENTÁRIA (PONTO PRETO CAVITADO EM ESMALTE/DENTINA) ================= */}
      {(activePathologyId === 'carie_dentaria' || activePathologyId === 'carie') && (
        <group position={[-0.032, 0.662, 0.185]} rotation={[0.10, 0.20, -0.05]}>
          {/* Luz focal quente na cavitação cariosa da superfície oclusal */}
          <pointLight position={[0, 0.08, 0]} color="#F59E0B" intensity={1.6} distance={0.9} />

          {/* 1. Halo Periférico de Desmineralização em Esmalte (Mancha Branca Ativa / descalcificação superficial de fóssula) */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, 0]}>
            <ringGeometry args={[0.045, 0.115, 32]} />
            <meshStandardMaterial
              color="#FEF3C7"
              emissive="#D97706"
              emissiveIntensity={0.35}
              roughness={0.7}
              side={THREE.DoubleSide}
              polygonOffset
              polygonOffsetFactor={-2}
              polygonOffsetUnits={-2}
            />
          </mesh>

          {/* 2. Cavitação Necrótica Central (Ponto Preto Moldado à Fóssula Oclusal) */}
          <mesh position={[0, 0.004, 0]} scale={[1.3, 0.45, 0.95]}>
            <sphereGeometry args={[0.058, 24, 24]} />
            <meshStandardMaterial
              color="#0E0502"
              emissive="#050201"
              roughness={0.94}
              metalness={0.04}
            />
          </mesh>

          {/* 3. Ramificações que se moldam aos sulcos e fissuras de desenvolvimento mésio-distal */}
          <mesh position={[-0.052, 0.006, 0.018]} scale={[1.25, 0.35, 0.55]} rotation={[0, 0.2, 0]}>
            <sphereGeometry args={[0.034, 16, 16]} />
            <meshStandardMaterial color="#160804" roughness={0.92} />
          </mesh>
          <mesh position={[0.055, 0.004, -0.016]} scale={[1.2, 0.35, 0.55]} rotation={[0, -0.2, 0]}>
            <sphereGeometry args={[0.032, 16, 16]} />
            <meshStandardMaterial color="#160804" roughness={0.92} />
          </mesh>
          <mesh position={[0.008, 0.005, -0.045]} scale={[0.55, 0.35, 1.15]}>
            <sphereGeometry args={[0.026, 16, 16]} />
            <meshStandardMaterial color="#1A0A05" roughness={0.92} />
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
