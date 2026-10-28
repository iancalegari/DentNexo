import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useAnatomyStore } from '@/stores/useAnatomyStore';
import { themeTokens } from '@/theme/tokens';

export const NervousModel: React.FC = () => {
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

  const isVisible = layers.nervous;

  const getNerveMaterialProps = (structureId: string, baseColor: string) => {
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
        color: isSelected ? '#38BDF8' : '#38BDF8',
        transparent: true,
        opacity: isSelected ? 0.95 : 0.6,
        roughness: 0.1,
        metalness: 0.1,
        emissive: isSelected ? '#00C9F6' : '#0369A1',
        emissiveIntensity: 0.7,
      };
    }

    let opacity = opacities.nervous;
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
      color = '#FEF08A';
      emissive = '#CA8A04';
      emissiveIntensity = 0.4;
    }

    return {
      visible: true,
      color,
      transparent: opacity < 1.0 || (hasIsolation && !isIsolated),
      opacity,
      roughness: 0.4,
      metalness: 0.1,
      emissive,
      emissiveIntensity,
    };
  };

  // Trajetos dos nervos tridimensionais
  const nerveTubes = useMemo(() => {
    // 1. Nervo Trigêmeo (tronco e gânglio de Gasser)
    const trigeminalGanglionGeo = new THREE.SphereGeometry(0.38, 16, 16);
    trigeminalGanglionGeo.scale(1.2, 0.7, 1.4);

    // 2. Nervo Maxilar (V2) correndo até a tuberosidade e assoalho orbital
    const v2PathLeft = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.1, 1.7, -1.0),
      new THREE.Vector3(1.3, 1.2, -0.2),
      new THREE.Vector3(1.4, 0.8, 0.6),
      new THREE.Vector3(1.25, 0.85, 1.4), // Forame infraorbital
    ]);
    const v2TubeLeft = new THREE.TubeGeometry(v2PathLeft, 32, 0.08, 12, false);

    const v2PathRight = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.1, 1.7, -1.0),
      new THREE.Vector3(-1.3, 1.2, -0.2),
      new THREE.Vector3(-1.4, 0.8, 0.6),
      new THREE.Vector3(-1.25, 0.85, 1.4),
    ]);
    const v2TubeRight = new THREE.TubeGeometry(v2PathRight, 32, 0.08, 12, false);

    // 3. Nervo Alveolar Inferior (trajeto anatômico pelo canal mandibular até forame mentual)
    const naiPathLeft = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.3, 1.5, -1.1),  // Tronco V3
      new THREE.Vector3(2.2, 0.4, -0.9),  // Espaço pterigomandibular / Forame mandibular
      new THREE.Vector3(2.0, -0.6, -0.2), // Início do canal mandibular
      new THREE.Vector3(1.7, -1.1, 0.8),  // Sob ápices do 38 e 36
      new THREE.Vector3(1.3, -1.35, 1.6), // Forame mentual
    ]);
    const naiTubeLeft = new THREE.TubeGeometry(naiPathLeft, 48, 0.09, 12, false);

    const naiPathRight = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.3, 1.5, -1.1),
      new THREE.Vector3(-2.2, 0.4, -0.9),
      new THREE.Vector3(-2.0, -0.6, -0.2),
      new THREE.Vector3(-1.7, -1.1, 0.8),
      new THREE.Vector3(-1.3, -1.35, 1.6),
    ]);
    const naiTubeRight = new THREE.TubeGeometry(naiPathRight, 48, 0.09, 12, false);

    // 4. Nervo Lingual (correndo medialmente ao ângulo e rebordo lingual)
    const lingualPathLeft = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.4, 1.3, -0.9),
      new THREE.Vector3(1.9, 0.2, -0.4),
      new THREE.Vector3(1.6, -0.8, 0.5), // Face medial do terceiro molar
      new THREE.Vector3(0.9, -1.2, 1.3), // Assoalho bucal / língua
    ]);
    const lingualTubeLeft = new THREE.TubeGeometry(lingualPathLeft, 36, 0.075, 12, false);

    const lingualPathRight = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.4, 1.3, -0.9),
      new THREE.Vector3(-1.9, 0.2, -0.4),
      new THREE.Vector3(-1.6, -0.8, 0.5),
      new THREE.Vector3(-0.9, -1.2, 1.3),
    ]);
    const lingualTubeRight = new THREE.TubeGeometry(lingualPathRight, 36, 0.075, 12, false);

    // 5. Nervo Mentual (emergência e ramificação para lábio e mento)
    const mentalPathLeft = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.3, -1.35, 1.6),
      new THREE.Vector3(1.1, -1.3, 2.0),
      new THREE.Vector3(0.6, -1.4, 2.2),
    ]);
    const mentalTubeLeft = new THREE.TubeGeometry(mentalPathLeft, 16, 0.065, 10, false);

    const mentalPathRight = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.3, -1.35, 1.6),
      new THREE.Vector3(-1.1, -1.3, 2.0),
      new THREE.Vector3(-0.6, -1.4, 2.2),
    ]);
    const mentalTubeRight = new THREE.TubeGeometry(mentalPathRight, 16, 0.065, 10, false);

    return {
      trigeminalGanglionGeo,
      v2TubeLeft,
      v2TubeRight,
      naiTubeLeft,
      naiTubeRight,
      lingualTubeLeft,
      lingualTubeRight,
      mentalTubeLeft,
      mentalTubeRight,
    };
  }, []);

  const trigeminalMat = getNerveMaterialProps('nervo_trigemeo', '#FACC15');
  const v2Mat = getNerveMaterialProps('nervo_maxilar_v2', '#FDE047');
  const naiMat = getNerveMaterialProps('nervo_alveolar_inferior', '#EAB308');
  const lingualMat = getNerveMaterialProps('nervo_lingual', '#CA8A04');
  const mentalMat = getNerveMaterialProps('nervo_mentual', '#EAB308');

  if (!isVisible && !xrayMode) return null;

  return (
    <group name="nervous_system">
      {/* ================= GÂNGLIO TRIGEMINAL & TRONCO ================= */}
      {trigeminalMat.visible && (
        <group
          name="nervo_trigemeo"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedStructure('nervo_trigemeo');
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredStructure('nervo_trigemeo');
          }}
          onPointerOut={() => setHoveredStructure(null)}
        >
          <mesh
            geometry={nerveTubes.trigeminalGanglionGeo}
            position={[-1.25, 2.1, -1.2]}
            castShadow
          >
            <meshStandardMaterial {...trigeminalMat} />
          </mesh>
          <mesh
            geometry={nerveTubes.trigeminalGanglionGeo}
            position={[1.25, 2.1, -1.2]}
            castShadow
          >
            <meshStandardMaterial {...trigeminalMat} />
          </mesh>
        </group>
      )}

      {/* ================= NERVO MAXILAR (V2) ================= */}
      {v2Mat.visible && (
        <group
          name="nervo_maxilar_v2"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedStructure('nervo_maxilar_v2');
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredStructure('nervo_maxilar_v2');
          }}
          onPointerOut={() => setHoveredStructure(null)}
        >
          <mesh geometry={nerveTubes.v2TubeLeft} castShadow>
            <meshStandardMaterial {...v2Mat} />
          </mesh>
          <mesh geometry={nerveTubes.v2TubeRight} castShadow>
            <meshStandardMaterial {...v2Mat} />
          </mesh>
        </group>
      )}

      {/* ================= NERVO ALVEOLAR INFERIOR ================= */}
      {naiMat.visible && (
        <group
          name="nervo_alveolar_inferior"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedStructure('nervo_alveolar_inferior');
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredStructure('nervo_alveolar_inferior');
          }}
          onPointerOut={() => setHoveredStructure(null)}
        >
          <mesh geometry={nerveTubes.naiTubeLeft} castShadow>
            <meshStandardMaterial {...naiMat} />
          </mesh>
          <mesh geometry={nerveTubes.naiTubeRight} castShadow>
            <meshStandardMaterial {...naiMat} />
          </mesh>
        </group>
      )}

      {/* ================= NERVO LINGUAL ================= */}
      {lingualMat.visible && (
        <group
          name="nervo_lingual"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedStructure('nervo_lingual');
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredStructure('nervo_lingual');
          }}
          onPointerOut={() => setHoveredStructure(null)}
        >
          <mesh geometry={nerveTubes.lingualTubeLeft} castShadow>
            <meshStandardMaterial {...lingualMat} />
          </mesh>
          <mesh geometry={nerveTubes.lingualTubeRight} castShadow>
            <meshStandardMaterial {...lingualMat} />
          </mesh>
        </group>
      )}

      {/* ================= NERVO MENTUAL ================= */}
      {mentalMat.visible && (
        <group
          name="nervo_mentual"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedStructure('nervo_mentual');
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredStructure('nervo_mentual');
          }}
          onPointerOut={() => setHoveredStructure(null)}
        >
          <mesh geometry={nerveTubes.mentalTubeLeft} castShadow>
            <meshStandardMaterial {...mentalMat} />
          </mesh>
          <mesh geometry={nerveTubes.mentalTubeRight} castShadow>
            <meshStandardMaterial {...mentalMat} />
          </mesh>
        </group>
      )}
    </group>
  );
};
