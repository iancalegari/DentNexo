import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useAnatomyStore } from '@/stores/useAnatomyStore';
import { themeTokens } from '@/theme/tokens';

export const SoftTissueModel: React.FC = () => {
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

  const isVisible = layers.oral_tissue;

  const getTissueMaterialProps = (structureId: string, baseColor: string) => {
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
        color: '#0369A1',
        transparent: true,
        opacity: isSelected ? 0.8 : 0.2,
      };
    }

    let opacity = opacities.oral_tissue;
    if (hasIsolation && !isIsolated) {
      opacity = 0.15;
    }

    let color = baseColor;
    let emissive = '#000000';
    let emissiveIntensity = 0;

    if (isSelected) {
      color = themeTokens.colors.brandCyan;
      emissive = '#00C9F6';
      emissiveIntensity = 0.5;
    } else if (isHovered) {
      color = '#FBCFE8';
      emissive = '#DB2777';
      emissiveIntensity = 0.25;
    }

    return {
      visible: true,
      color,
      transparent: opacity < 1.0 || (hasIsolation && !isIsolated),
      opacity,
      roughness: 0.6,
      metalness: 0.05,
      emissive,
      emissiveIntensity,
    };
  };

  const tissueGeometries = useMemo(() => {
    // 1. Gengiva Superior (Arco festonado cobrindo o colo maxilar)
    const upperGingivaCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.1, 0.05, 0.3),
      new THREE.Vector3(-1.4, -0.05, 1.6),
      new THREE.Vector3(0.0, -0.08, 2.15),
      new THREE.Vector3(1.4, -0.05, 1.6),
      new THREE.Vector3(2.1, 0.05, 0.3),
    ]);
    const upperGingivaGeo = new THREE.TubeGeometry(upperGingivaCurve, 48, 0.32, 16, false);

    // 2. Gengiva Inferior (Arco festonado mandibular)
    const lowerGingivaCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.0, -1.0, 0.2),
      new THREE.Vector3(-1.3, -1.1, 1.5),
      new THREE.Vector3(0.0, -1.12, 2.0),
      new THREE.Vector3(1.3, -1.1, 1.5),
      new THREE.Vector3(2.0, -1.0, 0.2),
    ]);
    const lowerGingivaGeo = new THREE.TubeGeometry(lowerGingivaCurve, 48, 0.3, 16, false);

    // 3. Luva do Ligamento Periodontal do dente molar 36
    const pdlGeo = new THREE.CylinderGeometry(0.42, 0.36, 1.1, 16);

    return {
      upperGingivaGeo,
      lowerGingivaGeo,
      pdlGeo,
    };
  }, []);

  const gingivaMat = getTissueMaterialProps('gengiva_inserida', '#F472B6');
  const pdlMat = getTissueMaterialProps('ligamento_periodontal', '#F97316');

  if (!isVisible && !xrayMode) return null;

  return (
    <group name="oral_soft_tissues">
      {/* ================= GENGIVA INSERIDA & MARGEM LIVRE ================= */}
      {gingivaMat.visible && (
        <group
          name="gengiva_inserida"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedStructure('gengiva_inserida');
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredStructure('gengiva_inserida');
          }}
          onPointerOut={() => setHoveredStructure(null)}
        >
          {/* Gengiva Superior */}
          <mesh geometry={tissueGeometries.upperGingivaGeo} castShadow receiveShadow>
            <meshStandardMaterial {...gingivaMat} />
          </mesh>

          {/* Gengiva Inferior */}
          <mesh geometry={tissueGeometries.lowerGingivaGeo} castShadow receiveShadow>
            <meshStandardMaterial {...gingivaMat} />
          </mesh>
        </group>
      )}

      {/* ================= LIGAMENTO PERIODONTAL ================= */}
      {pdlMat.visible && (
        <group
          name="ligamento_periodontal"
          position={[1.68, -1.45, 0.88]}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedStructure('ligamento_periodontal');
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredStructure('ligamento_periodontal');
          }}
          onPointerOut={() => setHoveredStructure(null)}
        >
          <mesh geometry={tissueGeometries.pdlGeo}>
            <meshStandardMaterial {...pdlMat} transparent opacity={xrayMode ? 0.3 : 0.65} />
          </mesh>
        </group>
      )}
    </group>
  );
};
