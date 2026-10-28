import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useAnatomyStore } from '@/stores/useAnatomyStore';
import { themeTokens } from '@/theme/tokens';

export const MuscularModel: React.FC = () => {
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

  const isVisible = layers.muscular;

  const getMuscleMaterialProps = (structureId: string, baseColor: string) => {
    const isSelected = selectedStructureId === structureId;
    const isHovered = hoveredStructureId === structureId;
    const isIsolated = isolatedStructureId === structureId;
    const hasIsolation = isolatedStructureId !== null;
    const isHidden = hiddenStructureIds.includes(structureId);

    if (isHidden || !isVisible) {
      return { visible: false };
    }

    if (xrayMode) {
      // No raio X didático tecidos moles aparecem com transparência baixa
      return {
        visible: true,
        color: '#0369A1',
        transparent: true,
        opacity: 0.18,
        roughness: 0.8,
        metalness: 0.0,
      };
    }

    let opacity = opacities.muscular;
    if (hasIsolation && !isIsolated) {
      opacity = 0.12;
    }

    let color = baseColor;
    let emissive = '#000000';
    let emissiveIntensity = 0;

    if (isSelected) {
      color = themeTokens.colors.brandCyan;
      emissive = '#0090B3';
      emissiveIntensity = 0.5;
    } else if (isHovered) {
      color = '#FDA4AF';
      emissive = '#BE123C';
      emissiveIntensity = 0.25;
    }

    return {
      visible: true,
      color,
      transparent: opacity < 1.0 || (hasIsolation && !isIsolated),
      opacity,
      roughness: 0.65,
      metalness: 0.05,
      emissive,
      emissiveIntensity,
      side: THREE.DoubleSide,
    };
  };

  // Geometrias dos músculos mastigatórios
  const muscleGeometries = useMemo(() => {
    // 1. Masseter: Quadrangular espesso conectando o arco zigomático ao ângulo da mandíbula
    const masseterGeo = new THREE.BoxGeometry(0.35, 2.1, 1.4);
    masseterGeo.scale(1.0, 1.0, 0.9);

    // 2. Temporal: Formato de leque na fossa temporal
    const temporalisGeo = new THREE.CylinderGeometry(0.2, 2.4, 2.6, 16, 1, false, 0, Math.PI);
    temporalisGeo.scale(0.35, 1.0, 1.1);

    // 3. Pterigóideo Lateral: Cone horizontal profundo até o colo do côndilo
    const lateralPterygoidGeo = new THREE.ConeGeometry(0.42, 1.8, 16);

    // 4. Pterigóideo Medial: Oblíquo da fossa pterigoidea até a face interna do ângulo
    const medialPterygoidGeo = new THREE.BoxGeometry(0.3, 1.9, 1.1);

    return {
      masseterGeo,
      temporalisGeo,
      lateralPterygoidGeo,
      medialPterygoidGeo,
    };
  }, []);

  const masseterMat = getMuscleMaterialProps('masseter', '#EF4444');
  const temporalMat = getMuscleMaterialProps('temporal_m', '#DC2626');
  const latPterygoidMat = getMuscleMaterialProps('pterigoideo_lateral', '#B91C1C');
  const medPterygoidMat = getMuscleMaterialProps('pterigoideo_medial', '#991B1B');

  if (!isVisible && !xrayMode) return null;

  return (
    <group name="muscular_system">
      {/* ================= MASSETER ================= */}
      {masseterMat.visible && (
        <group
          name="masseter"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedStructure('masseter');
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredStructure('masseter');
          }}
          onPointerOut={() => setHoveredStructure(null)}
        >
          {/* Masseter Direito */}
          <mesh
            geometry={muscleGeometries.masseterGeo}
            position={[-2.75, 0.05, -0.2]}
            rotation={[0.35, 0.15, 0.08]}
            castShadow
          >
            <meshStandardMaterial {...masseterMat} />
          </mesh>

          {/* Masseter Esquerdo */}
          <mesh
            geometry={muscleGeometries.masseterGeo}
            position={[2.75, 0.05, -0.2]}
            rotation={[0.35, -0.15, -0.08]}
            castShadow
          >
            <meshStandardMaterial {...masseterMat} />
          </mesh>
        </group>
      )}

      {/* ================= MÚSCULO TEMPORAL ================= */}
      {temporalMat.visible && (
        <group
          name="temporal_m"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedStructure('temporal_m');
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredStructure('temporal_m');
          }}
          onPointerOut={() => setHoveredStructure(null)}
        >
          {/* Temporal Direito */}
          <mesh
            geometry={muscleGeometries.temporalisGeo}
            position={[-2.4, 2.3, -0.7]}
            rotation={[0.1, 0.2, 0.1]}
            castShadow
          >
            <meshStandardMaterial {...temporalMat} />
          </mesh>

          {/* Temporal Esquerdo */}
          <mesh
            geometry={muscleGeometries.temporalisGeo}
            position={[2.4, 2.3, -0.7]}
            rotation={[0.1, -0.2, -0.1]}
            castShadow
          >
            <meshStandardMaterial {...temporalMat} />
          </mesh>
        </group>
      )}

      {/* ================= PTERIGÓIDEO LATERAL ================= */}
      {latPterygoidMat.visible && (
        <group
          name="pterigoideo_lateral"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedStructure('pterigoideo_lateral');
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredStructure('pterigoideo_lateral');
          }}
          onPointerOut={() => setHoveredStructure(null)}
        >
          {/* Pterigóideo Lateral Direito */}
          <mesh
            geometry={muscleGeometries.lateralPterygoidGeo}
            position={[-1.7, 0.9, -0.8]}
            rotation={[1.3, 0.4, -0.8]}
          >
            <meshStandardMaterial {...latPterygoidMat} />
          </mesh>

          {/* Pterigóideo Lateral Esquerdo */}
          <mesh
            geometry={muscleGeometries.lateralPterygoidGeo}
            position={[1.7, 0.9, -0.8]}
            rotation={[1.3, -0.4, 0.8]}
          >
            <meshStandardMaterial {...latPterygoidMat} />
          </mesh>
        </group>
      )}

      {/* ================= PTERIGÓIDEO MEDIAL ================= */}
      {medPterygoidMat.visible && (
        <group
          name="pterigoideo_medial"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedStructure('pterigoideo_medial');
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredStructure('pterigoideo_medial');
          }}
          onPointerOut={() => setHoveredStructure(null)}
        >
          {/* Pterigóideo Medial Direito */}
          <mesh
            geometry={muscleGeometries.medialPterygoidGeo}
            position={[-1.85, -0.2, -0.8]}
            rotation={[0.4, -0.3, 0.2]}
          >
            <meshStandardMaterial {...medPterygoidMat} />
          </mesh>

          {/* Pterigóideo Medial Esquerdo */}
          <mesh
            geometry={muscleGeometries.medialPterygoidGeo}
            position={[1.85, -0.2, -0.8]}
            rotation={[0.4, 0.3, -0.2]}
          >
            <meshStandardMaterial {...medPterygoidMat} />
          </mesh>
        </group>
      )}
    </group>
  );
};
