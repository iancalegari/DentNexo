import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useAnatomyStore } from '@/stores/useAnatomyStore';
import { themeTokens } from '@/theme/tokens';

export const VascularModel: React.FC = () => {
  const {
    selectedStructureId,
    hoveredStructureId,
    isolatedStructureId,
    hiddenStructureIds,
    layers,
    opacities,
    xrayMode,
    setSelectedStructure,
    setHoveredStructure,
  } = useAnatomyStore();

  const isVisible = layers.vascular;

  const getVesselMaterialProps = (structureId: string, baseColor: string) => {
    const isSelected = selectedStructureId === structureId;
    const isHovered = hoveredStructureId === structureId;
    const isIsolated = isolatedStructureId === structureId;
    const hasIsolation = isolatedStructureId !== null;
    const isHidden = hiddenStructureIds.includes(structureId);

    if (isHidden || !isVisible) {
      return { visible: false };
    }

    if (xrayMode) {
      return {
        visible: true,
        color: '#0284C7',
        transparent: true,
        opacity: isSelected ? 0.9 : 0.35,
        roughness: 0.2,
      };
    }

    let opacity = opacities.vascular;
    if (hasIsolation && !isIsolated) {
      opacity = 0.15;
    }

    let color = baseColor;
    let emissive = '#000000';
    let emissiveIntensity = 0;

    if (isSelected) {
      color = themeTokens.colors.brandCyan;
      emissive = '#00C9F6';
      emissiveIntensity = 0.7;
    } else if (isHovered) {
      color = '#F87171';
      emissive = '#991B1B';
      emissiveIntensity = 0.3;
    }

    return {
      visible: true,
      color,
      transparent: opacity < 1.0 || (hasIsolation && !isIsolated),
      opacity,
      roughness: 0.35,
      metalness: 0.1,
      emissive,
      emissiveIntensity,
    };
  };

  const vesselTubes = useMemo(() => {
    // 1. Artéria Maxilar: Ramo da carótida externa atravessando a fossa infratemporal
    const maxPathLeft = new THREE.CatmullRomCurve3([
      new THREE.Vector3(2.5, 0.8, -1.3),
      new THREE.Vector3(1.9, 0.9, -0.6),
      new THREE.Vector3(1.6, 0.7, 0.2),
      new THREE.Vector3(1.4, 0.6, 0.8), // Fossa pterigopalatina
    ]);
    const maxTubeLeft = new THREE.TubeGeometry(maxPathLeft, 32, 0.085, 12, false);

    const maxPathRight = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.5, 0.8, -1.3),
      new THREE.Vector3(-1.9, 0.9, -0.6),
      new THREE.Vector3(-1.6, 0.7, 0.2),
      new THREE.Vector3(-1.4, 0.6, 0.8),
    ]);
    const maxTubeRight = new THREE.TubeGeometry(maxPathRight, 32, 0.085, 12, false);

    // 2. Artéria Facial: Contornando a borda inferior mandibular e subindo sinuosa
    const facialPathLeft = new THREE.CatmullRomCurve3([
      new THREE.Vector3(2.4, -1.1, -0.4),  // Borda inferior da mandíbula
      new THREE.Vector3(2.2, -0.6, 0.6),   // Ângulo anterior do masseter
      new THREE.Vector3(1.7, 0.1, 1.4),    // Comissura labial
      new THREE.Vector3(1.1, 0.9, 1.6),    // Asa do nariz
    ]);
    const facialTubeLeft = new THREE.TubeGeometry(facialPathLeft, 48, 0.075, 12, false);

    const facialPathRight = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.4, -1.1, -0.4),
      new THREE.Vector3(-2.2, -0.6, 0.6),
      new THREE.Vector3(-1.7, 0.1, 1.4),
      new THREE.Vector3(-1.1, 0.9, 1.6),
    ]);
    const facialTubeRight = new THREE.TubeGeometry(facialPathRight, 48, 0.075, 12, false);

    return {
      maxTubeLeft,
      maxTubeRight,
      facialTubeLeft,
      facialTubeRight,
    };
  }, []);

  const maxMat = getVesselMaterialProps('arteria_maxilar', '#EF4444');
  const facialMat = getVesselMaterialProps('arteria_facial', '#DC2626');

  if (!isVisible && !xrayMode) return null;

  return (
    <group name="vascular_system">
      {/* ================= ARTÉRIA MAXILAR ================= */}
      {maxMat.visible && (
        <group
          name="arteria_maxilar"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedStructure('arteria_maxilar');
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredStructure('arteria_maxilar');
          }}
          onPointerOut={() => setHoveredStructure(null)}
        >
          <mesh geometry={vesselTubes.maxTubeLeft} castShadow>
            <meshStandardMaterial {...maxMat} />
          </mesh>
          <mesh geometry={vesselTubes.maxTubeRight} castShadow>
            <meshStandardMaterial {...maxMat} />
          </mesh>
        </group>
      )}

      {/* ================= ARTÉRIA FACIAL ================= */}
      {facialMat.visible && (
        <group
          name="arteria_facial"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedStructure('arteria_facial');
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredStructure('arteria_facial');
          }}
          onPointerOut={() => setHoveredStructure(null)}
        >
          <mesh geometry={vesselTubes.facialTubeLeft} castShadow>
            <meshStandardMaterial {...facialMat} />
          </mesh>
          <mesh geometry={vesselTubes.facialTubeRight} castShadow>
            <meshStandardMaterial {...facialMat} />
          </mesh>
        </group>
      )}
    </group>
  );
};
