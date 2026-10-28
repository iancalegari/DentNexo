import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { useAnatomyStore } from '@/stores/useAnatomyStore';
import { themeTokens } from '@/theme/tokens';

/**
 * Mapeamento dos nomes dos objetos do GLB para notação FDI e nomes anatômicos.
 * O modelo tem 64 objetos: 32 coroas + 32 raízes (_00X suffix = raízes).
 */
interface ToothMapping {
  fdi: string;
  name: string;
  structureId: string;
  isRoot: boolean;
}

const TOOTH_MAP: Record<string, ToothMapping> = {
  // ===== ARCADA SUPERIOR DIREITA (Q1) =====
  // Coroas
  'Incisor_upper_right1': { fdi: '11', name: 'Incisivo Central Superior Direito', structureId: 'dente_11', isRoot: false },
  'Incisor_upper_right_2': { fdi: '12', name: 'Incisivo Lateral Superior Direito', structureId: 'dente_12', isRoot: false },
  'Canine_upper_right': { fdi: '13', name: 'Canino Superior Direito', structureId: 'dente_13', isRoot: false },
  'Premolar_Upper_right_1': { fdi: '14', name: '1° Pré-Molar Superior Direito', structureId: 'dente_14', isRoot: false },
  'Premolar_upper_right_2': { fdi: '15', name: '2° Pré-Molar Superior Direito', structureId: 'dente_15', isRoot: false },
  'Molar_upper_right_1': { fdi: '16', name: '1° Molar Superior Direito', structureId: 'dente_16', isRoot: false },
  'Molar_upper_right_2': { fdi: '17', name: '2° Molar Superior Direito', structureId: 'dente_17', isRoot: false },
  'Molar_upper_right_3': { fdi: '18', name: '3° Molar Superior Direito', structureId: 'dente_18', isRoot: false },
  // Raízes
  'Incisor_upper_right002': { fdi: '11', name: 'Raiz Incisivo Central Superior Direito', structureId: 'dente_11', isRoot: true },
  'Incisor_upper_right_003': { fdi: '12', name: 'Raiz Incisivo Lateral Superior Direito', structureId: 'dente_12', isRoot: true },
  'Canine_upper_right001': { fdi: '13', name: 'Raiz Canino Superior Direito', structureId: 'dente_13', isRoot: true },
  'Premolar_Upper_right_002': { fdi: '14', name: 'Raiz 1° Pré-Molar Superior Direito', structureId: 'dente_14', isRoot: true },
  'Premolar_upper_right_003': { fdi: '15', name: 'Raiz 2° Pré-Molar Superior Direito', structureId: 'dente_15', isRoot: true },
  'Molar_upper_right_004': { fdi: '16', name: 'Raiz 1° Molar Superior Direito', structureId: 'dente_16', isRoot: true },
  'Molar_upper_right_005': { fdi: '17', name: 'Raiz 2° Molar Superior Direito', structureId: 'dente_17', isRoot: true },
  'Molar_upper_right_006': { fdi: '18', name: 'Raiz 3° Molar Superior Direito', structureId: 'dente_18', isRoot: true },

  // ===== ARCADA SUPERIOR ESQUERDA (Q2) =====
  'Incisor_upper_left_1': { fdi: '21', name: 'Incisivo Central Superior Esquerdo', structureId: 'dente_21', isRoot: false },
  'Incisor_upper_left2': { fdi: '22', name: 'Incisivo Lateral Superior Esquerdo', structureId: 'dente_22', isRoot: false },
  'Canine_upper_left': { fdi: '23', name: 'Canino Superior Esquerdo', structureId: 'dente_23', isRoot: false },
  'Premolar_upper_left_1': { fdi: '24', name: '1° Pré-Molar Superior Esquerdo', structureId: 'dente_24', isRoot: false },
  'Premolar_upper_left_2': { fdi: '25', name: '2° Pré-Molar Superior Esquerdo', structureId: 'dente_25', isRoot: false },
  'Molar_upper_left_1': { fdi: '26', name: '1° Molar Superior Esquerdo', structureId: 'dente_26', isRoot: false },
  'Molar_upper_left_2': { fdi: '27', name: '2° Molar Superior Esquerdo', structureId: 'dente_27', isRoot: false },
  'Molar_upper_left_3': { fdi: '28', name: '3° Molar Superior Esquerdo', structureId: 'dente_28', isRoot: false },
  // Raízes
  'Incisor_upper_left_002': { fdi: '21', name: 'Raiz Incisivo Central Superior Esquerdo', structureId: 'dente_21', isRoot: true },
  'Incisor_upper_left003': { fdi: '22', name: 'Raiz Incisivo Lateral Superior Esquerdo', structureId: 'dente_22', isRoot: true },
  'Canine_upper_left001': { fdi: '23', name: 'Raiz Canino Superior Esquerdo', structureId: 'dente_23', isRoot: true },
  'Premolar_upper_left_003': { fdi: '24', name: 'Raiz 1° Pré-Molar Superior Esquerdo', structureId: 'dente_24', isRoot: true },
  'Premolar_upper_left_004': { fdi: '25', name: 'Raiz 2° Pré-Molar Superior Esquerdo', structureId: 'dente_25', isRoot: true },
  'Molar_upper_left_004': { fdi: '26', name: 'Raiz 1° Molar Superior Esquerdo', structureId: 'dente_26', isRoot: true },
  'Molar_upper_left_005': { fdi: '27', name: 'Raiz 2° Molar Superior Esquerdo', structureId: 'dente_27', isRoot: true },
  'Molar_upper_left_006': { fdi: '28', name: 'Raiz 3° Molar Superior Esquerdo', structureId: 'dente_28', isRoot: true },

  // ===== ARCADA INFERIOR ESQUERDA (Q3) =====
  'Incisor_lower_left_1': { fdi: '31', name: 'Incisivo Central Inferior Esquerdo', structureId: 'dente_31', isRoot: false },
  'Incisor_lower_left_2': { fdi: '32', name: 'Incisivo Lateral Inferior Esquerdo', structureId: 'dente_32', isRoot: false },
  'Canine_lower_left': { fdi: '33', name: 'Canino Inferior Esquerdo', structureId: 'dente_33', isRoot: false },
  'Premolar_lower_left_1': { fdi: '34', name: '1° Pré-Molar Inferior Esquerdo', structureId: 'dente_34', isRoot: false },
  'Premolar_lower_left_2': { fdi: '35', name: '2° Pré-Molar Inferior Esquerdo', structureId: 'dente_35', isRoot: false },
  'Molar_lower_left_1': { fdi: '36', name: '1° Molar Inferior Esquerdo', structureId: 'dente_36', isRoot: false },
  'Molar_lower_left_2': { fdi: '37', name: '2° Molar Inferior Esquerdo', structureId: 'dente_37', isRoot: false },
  'Molar_lower_left_3': { fdi: '38', name: '3° Molar Inferior Esquerdo', structureId: 'dente_38', isRoot: false },
  // Raízes
  'Incisor_lower_left_003': { fdi: '31', name: 'Raiz Incisivo Central Inferior Esquerdo', structureId: 'dente_31', isRoot: true },
  'Incisor_lower_left_004': { fdi: '32', name: 'Raiz Incisivo Lateral Inferior Esquerdo', structureId: 'dente_32', isRoot: true },
  'Canine_lower_left001': { fdi: '33', name: 'Raiz Canino Inferior Esquerdo', structureId: 'dente_33', isRoot: true },
  'Premolar_lower_left_003': { fdi: '34', name: 'Raiz 1° Pré-Molar Inferior Esquerdo', structureId: 'dente_34', isRoot: true },
  'Premolar_lower_left_004': { fdi: '35', name: 'Raiz 2° Pré-Molar Inferior Esquerdo', structureId: 'dente_35', isRoot: true },
  'Molar_lower_left_004': { fdi: '36', name: 'Raiz 1° Molar Inferior Esquerdo', structureId: 'dente_36', isRoot: true },
  'Molar_lower_left_005': { fdi: '37', name: 'Raiz 2° Molar Inferior Esquerdo', structureId: 'dente_37', isRoot: true },
  'Molar_lower_left_006': { fdi: '38', name: 'Raiz 3° Molar Inferior Esquerdo', structureId: 'dente_38', isRoot: true },

  // ===== ARCADA INFERIOR DIREITA (Q4) =====
  'Incisor_lower_right1': { fdi: '41', name: 'Incisivo Central Inferior Direito', structureId: 'dente_41', isRoot: false },
  'Incisor_lower_right_2': { fdi: '42', name: 'Incisivo Lateral Inferior Direito', structureId: 'dente_42', isRoot: false },
  'Canine_lower_right': { fdi: '43', name: 'Canino Inferior Direito', structureId: 'dente_43', isRoot: false },
  'Premolar_lower_right_1': { fdi: '44', name: '1° Pré-Molar Inferior Direito', structureId: 'dente_44', isRoot: false },
  'Premolar_lower_right_2': { fdi: '45', name: '2° Pré-Molar Inferior Direito', structureId: 'dente_45', isRoot: false },
  'Molar_lower_right_1': { fdi: '46', name: '1° Molar Inferior Direito', structureId: 'dente_46', isRoot: false },
  'Molar_lower_right_2': { fdi: '47', name: '2° Molar Inferior Direito', structureId: 'dente_47', isRoot: false },
  'Molar_lower_right_3': { fdi: '48', name: '3° Molar Inferior Direito', structureId: 'dente_48', isRoot: false },
  // Raízes
  'Incisor_lower_right002': { fdi: '41', name: 'Raiz Incisivo Central Inferior Direito', structureId: 'dente_41', isRoot: true },
  'Incisor_lower_right_003': { fdi: '42', name: 'Raiz Incisivo Lateral Inferior Direito', structureId: 'dente_42', isRoot: true },
  'Canine_lower_right001': { fdi: '43', name: 'Raiz Canino Inferior Direito', structureId: 'dente_43', isRoot: true },
  'Premolar_lower_right_003': { fdi: '44', name: 'Raiz 1° Pré-Molar Inferior Direito', structureId: 'dente_44', isRoot: true },
  'Premolar_lower_right_004': { fdi: '45', name: 'Raiz 2° Pré-Molar Inferior Direito', structureId: 'dente_45', isRoot: true },
  'Molar_lower_right_004': { fdi: '46', name: 'Raiz 1° Molar Inferior Direito', structureId: 'dente_46', isRoot: true },
  'Molar_lower_right_005': { fdi: '47', name: 'Raiz 2° Molar Inferior Direito', structureId: 'dente_47', isRoot: true },
  'Molar_lower_right_006': { fdi: '48', name: 'Raiz 3° Molar Inferior Direito', structureId: 'dente_48', isRoot: true },
};

export const RealTeethModel: React.FC = () => {
  const { scene } = useGLTF('/models/teeth.glb');
  const groupRef = useRef<THREE.Group>(null);

  const {
    selectedStructureId,
    hoveredStructureId,
    isolatedStructureId,
    hiddenStructureIds,
    layers,
    opacities,
    xrayMode,
    activePathologyId,
    setSelectedStructure,
    setHoveredStructure,
  } = useAnatomyStore();

  const isVisible = layers.dental;

  // Clonar a cena para poder modificar materiais independentemente
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    return clone;
  }, [scene]);

  // Aplicar materiais dinâmicos baseados no estado
  useEffect(() => {
    if (!clonedScene) return;

    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const meshName = child.name;
        const mapping = TOOTH_MAP[meshName];

        if (!mapping) return;

        const structureId = mapping.structureId;
        const isSelected = selectedStructureId === structureId;
        const isHovered = hoveredStructureId === structureId;
        const isIsolated = isolatedStructureId === structureId;
        const hasIsolation = isolatedStructureId !== null;
        const isHidden = hiddenStructureIds.includes(structureId);

        // Criar novo material para cada estado
        const mat = new THREE.MeshStandardMaterial();

        if (mapping.isRoot) {
          // O modelo 3D possui 32 dentes no arco e 32 dentes duplicados em linha de vitrine
          // Ocultamos a duplicata da vitrine para exibir apenas o arco dental natural
          child.visible = false;
          return;
        }

        if (isHidden || !isVisible) {
          child.visible = false;
          return;
        }

        child.visible = true;

        if (xrayMode) {
          mat.color.set(isSelected ? '#38BDF8' : '#7DD3FC');
          mat.transparent = true;
          mat.opacity = isSelected ? 0.85 : 0.4;
          mat.emissive.set(isSelected ? '#0369A1' : '#082F49');
          mat.emissiveIntensity = isSelected ? 0.6 : 0.15;
          mat.roughness = 0.2;
          mat.metalness = 0.05;
          mat.side = THREE.DoubleSide;
        } else {
          // Esmalte dental realista com brilho natural
          const baseColor = themeTokens.colors.anatomy.enamel || '#FAF8F2';

          if (isSelected) {
            mat.color.set(themeTokens.colors.brandCyan);
            mat.emissive.set('#006B85');
            mat.emissiveIntensity = 0.5;
          } else if (isHovered) {
            mat.color.set('#7DD3FC');
            mat.emissive.set('#0369A1');
            mat.emissiveIntensity = 0.2;
          } else {
            mat.color.set(baseColor);
            mat.emissive.set('#000000');
            mat.emissiveIntensity = 0;
          }

          let opacity = opacities.dental;
          if (hasIsolation && !isIsolated) {
            opacity = 0.12;
          }

          mat.transparent = opacity < 1.0 || (hasIsolation && !isIsolated);
          mat.opacity = opacity;
          mat.roughness = 0.22;
          mat.metalness = 0.04;
        }

        child.material = mat;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [clonedScene, selectedStructureId, hoveredStructureId, isolatedStructureId, hiddenStructureIds, isVisible, opacities.dental, xrayMode, activePathologyId]);

  if (!isVisible && !xrayMode) return null;

  // Handlers de interação por dente
  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    const meshName = e.object?.name;
    const mapping = meshName ? TOOTH_MAP[meshName] : null;
    if (mapping) {
      setHoveredStructure(mapping.structureId);
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerOut = () => {
    setHoveredStructure(null);
    document.body.style.cursor = 'grab';
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    const meshName = e.object?.name;
    const mapping = meshName ? TOOTH_MAP[meshName] : null;
    if (mapping) {
      setSelectedStructure(mapping.structureId);
    }
  };

  return (
    <group
      ref={groupRef}
      name="real_teeth_model"
      // Escala e posição para alinhar com o restante do modelo anatômico
      scale={[0.35, 0.35, 0.35]}
      position={[0, -0.5, 0]}
      rotation={[0, 0, 0]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      <primitive object={clonedScene} />
    </group>
  );
};

// Pre-load do modelo
useGLTF.preload('/models/teeth.glb');
