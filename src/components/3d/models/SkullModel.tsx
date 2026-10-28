import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useAnatomyStore } from '@/stores/useAnatomyStore';
import { themeTokens } from '@/theme/tokens';

export const SkullModel: React.FC = () => {
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

  const isVisible = layers.skeletal;

  // Helper para calcular material dinâmico
  const getMaterialProps = (structureId: string, baseColor: string) => {
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
        color: isSelected ? '#38BDF8' : '#0284C7',
        transparent: true,
        opacity: isSelected ? 0.9 : 0.45,
        wireframe: false,
        roughness: 0.2,
        metalness: 0.1,
        emissive: isSelected ? '#0369A1' : '#082F49',
        emissiveIntensity: isSelected ? 0.6 : 0.2,
        side: THREE.DoubleSide,
      };
    }

    let opacity = opacities.skeletal;
    if (hasIsolation && !isIsolated) {
      opacity = 0.15; // Preservar contexto espacial translúcido conforme exigência
    }

    let color = baseColor;
    let emissive = '#000000';
    let emissiveIntensity = 0;

    if (isSelected) {
      color = themeTokens.colors.brandCyan;
      emissive = '#006B85';
      emissiveIntensity = 0.5;
    } else if (isHovered) {
      color = '#7DD3FC';
      emissive = '#0369A1';
      emissiveIntensity = 0.25;
    }

    return {
      visible: true,
      color,
      transparent: opacity < 1.0 || (hasIsolation && !isIsolated),
      opacity,
      roughness: 0.55,
      metalness: 0.1,
      emissive,
      emissiveIntensity,
    };
  };

  // 1. Geometria da Mandíbula detalhada
  const mandibleGeometries = useMemo(() => {
    // Corpo da mandíbula em ferradura arqueada
    const bodyCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.6, -1.0, -1.2), // Ângulo direito
      new THREE.Vector3(-2.2, -1.3, 0.4),  // Corpo posterior direito
      new THREE.Vector3(-1.4, -1.5, 1.8),  // Pré-molares direito
      new THREE.Vector3(0.0, -1.6, 2.4),   // Sínfise mentual anterior
      new THREE.Vector3(1.4, -1.5, 1.8),   // Pré-molares esquerdo
      new THREE.Vector3(2.2, -1.3, 0.4),   // Corpo posterior esquerdo
      new THREE.Vector3(2.6, -1.0, -1.2),  // Ângulo esquerdo
    ]);

    const bodyGeo = new THREE.TubeGeometry(bodyCurve, 64, 0.48, 16, false);

    // Ramos mandibulares ascendentes bilaterais
    const ramusLeftGeo = new THREE.CylinderGeometry(0.35, 0.48, 2.2, 16);
    const ramusRightGeo = new THREE.CylinderGeometry(0.35, 0.48, 2.2, 16);

    // Côndilos mandibulares (ATM)
    const condyleGeo = new THREE.SphereGeometry(0.38, 16, 16);
    condyleGeo.scale(1.4, 0.8, 0.9);

    // Processos coronoides (inserção do músculo temporal)
    const coronoidGeo = new THREE.ConeGeometry(0.32, 1.0, 16);

    // Processo alveolar mandibular
    const alveolarCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.0, -1.0, 0.2),
      new THREE.Vector3(-1.3, -1.15, 1.5),
      new THREE.Vector3(0.0, -1.2, 2.0),
      new THREE.Vector3(1.3, -1.15, 1.5),
      new THREE.Vector3(2.0, -1.0, 0.2),
    ]);
    const alveolarGeo = new THREE.TubeGeometry(alveolarCurve, 48, 0.32, 14, false);

    return { bodyGeo, ramusLeftGeo, ramusRightGeo, condyleGeo, coronoidGeo, alveolarGeo };
  }, []);

  // 2. Geometria da Maxila com processo alveolar e seios maxilares
  const maxillaGeometries = useMemo(() => {
    // Arco alveolar maxilar
    const archCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.1, 0.0, 0.3),
      new THREE.Vector3(-1.4, -0.1, 1.6),
      new THREE.Vector3(0.0, -0.15, 2.15),
      new THREE.Vector3(1.4, -0.1, 1.6),
      new THREE.Vector3(2.1, 0.0, 0.3),
    ]);
    const archGeo = new THREE.TubeGeometry(archCurve, 48, 0.38, 16, false);

    // Corpo da maxila e piriforme nasal
    const bodyGeo = new THREE.CylinderGeometry(1.6, 2.1, 1.1, 16);
    bodyGeo.scale(1.1, 0.9, 0.8);

    // Seio maxilar (piramidal pneumático)
    const sinusGeo = new THREE.ConeGeometry(0.85, 1.4, 16);
    sinusGeo.scale(1.0, 1.0, 0.8);

    return { archGeo, bodyGeo, sinusGeo };
  }, []);

  // 3. Geometria do Neurocrânio (Calvária, temporal, base)
  const craniumGeometries = useMemo(() => {
    const vaultGeo = new THREE.SphereGeometry(3.1, 32, 32);
    vaultGeo.scale(0.95, 1.15, 1.25);

    const zygomaticGeo = new THREE.TorusGeometry(1.4, 0.18, 12, 24, Math.PI * 0.9);

    return { vaultGeo, zygomaticGeo };
  }, []);

  const mandibleMatProps = getMaterialProps('mandibula', '#CBD5E1');
  const maxillaMatProps = getMaterialProps('maxila', '#E2E8F0');
  const craniumMatProps = getMaterialProps('neurocranio', '#94A3B8');
  const sinusMatProps = getMaterialProps('seio_maxilar', '#64748B');

  if (!isVisible && !xrayMode) return null;

  return (
    <group name="skeletal_system">
      {/* ================= MANDÍBULA ================= */}
      {mandibleMatProps.visible && (
        <group
          name="mandibula"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedStructure('mandibula');
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredStructure('mandibula');
          }}
          onPointerOut={() => setHoveredStructure(null)}
        >
          {/* Corpo arqueado */}
          <mesh geometry={mandibleGeometries.bodyGeo} castShadow receiveShadow>
            <meshStandardMaterial {...mandibleMatProps} />
          </mesh>

          {/* Crista alveolar */}
          <mesh geometry={mandibleGeometries.alveolarGeo} castShadow receiveShadow>
            <meshStandardMaterial {...mandibleMatProps} />
          </mesh>

          {/* Ramo ascendente direito */}
          <mesh
            geometry={mandibleGeometries.ramusRightGeo}
            position={[-2.65, 0.05, -1.25]}
            rotation={[0.1, 0, 0.15]}
            castShadow
          >
            <meshStandardMaterial {...mandibleMatProps} />
          </mesh>

          {/* Côndilo direito (ATM) */}
          <mesh
            geometry={mandibleGeometries.condyleGeo}
            position={[-2.8, 1.25, -1.5]}
            castShadow
          >
            <meshStandardMaterial {...mandibleMatProps} />
          </mesh>

          {/* Processo coronoide direito */}
          <mesh
            geometry={mandibleGeometries.coronoidGeo}
            position={[-2.5, 1.15, -0.6]}
            rotation={[-0.2, 0, 0]}
            castShadow
          >
            <meshStandardMaterial {...mandibleMatProps} />
          </mesh>

          {/* Ramo ascendente esquerdo */}
          <mesh
            geometry={mandibleGeometries.ramusLeftGeo}
            position={[2.65, 0.05, -1.25]}
            rotation={[0.1, 0, -0.15]}
            castShadow
          >
            <meshStandardMaterial {...mandibleMatProps} />
          </mesh>

          {/* Côndilo esquerdo (ATM) */}
          <mesh
            geometry={mandibleGeometries.condyleGeo}
            position={[2.8, 1.25, -1.5]}
            castShadow
          >
            <meshStandardMaterial {...mandibleMatProps} />
          </mesh>

          {/* Processo coronoide esquerdo */}
          <mesh
            geometry={mandibleGeometries.coronoidGeo}
            position={[2.5, 1.15, -0.6]}
            rotation={[-0.2, 0, 0]}
            castShadow
          >
            <meshStandardMaterial {...mandibleMatProps} />
          </mesh>

          {/* Forames mentuais (marcos anatômicos bilaterais) */}
          <mesh position={[-1.3, -1.4, 1.65]}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshBasicMaterial color="#0B0F14" />
          </mesh>
          <mesh position={[1.3, -1.4, 1.65]}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshBasicMaterial color="#0B0F14" />
          </mesh>
        </group>
      )}

      {/* ================= MAXILA ================= */}
      {maxillaMatProps.visible && (
        <group
          name="maxila"
          position={[0, 0.15, 0]}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedStructure('maxila');
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredStructure('maxila');
          }}
          onPointerOut={() => setHoveredStructure(null)}
        >
          {/* Arco alveolar superior */}
          <mesh geometry={maxillaGeometries.archGeo} castShadow receiveShadow>
            <meshStandardMaterial {...maxillaMatProps} />
          </mesh>

          {/* Corpo da maxila e abertura piriforme */}
          <mesh
            geometry={maxillaGeometries.bodyGeo}
            position={[0, 0.65, 0.8]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial {...maxillaMatProps} />
          </mesh>

          {/* Forames infraorbitais bilaterais */}
          <mesh position={[-1.25, 0.85, 1.45]}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshBasicMaterial color="#0B0F14" />
          </mesh>
          <mesh position={[1.25, 0.85, 1.45]}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshBasicMaterial color="#0B0F14" />
          </mesh>
        </group>
      )}

      {/* ================= SEIOS MAXILARES ================= */}
      {sinusMatProps.visible && (
        <group
          name="seio_maxilar"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedStructure('seio_maxilar');
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredStructure('seio_maxilar');
          }}
          onPointerOut={() => setHoveredStructure(null)}
        >
          {/* Seio maxilar direito */}
          <mesh
            geometry={maxillaGeometries.sinusGeo}
            position={[-1.4, 0.85, 0.5]}
            rotation={[0.2, 0.3, -0.1]}
          >
            <meshStandardMaterial {...sinusMatProps} transparent opacity={0.65} />
          </mesh>

          {/* Seio maxilar esquerdo */}
          <mesh
            geometry={maxillaGeometries.sinusGeo}
            position={[1.4, 0.85, 0.5]}
            rotation={[0.2, -0.3, 0.1]}
          >
            <meshStandardMaterial {...sinusMatProps} transparent opacity={0.65} />
          </mesh>
        </group>
      )}

      {/* ================= NEUROCRÂNIO / CÁLVARIA ================= */}
      {craniumMatProps.visible && (
        <group
          name="neurocranio"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedStructure('neurocranio');
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredStructure('neurocranio');
          }}
          onPointerOut={() => setHoveredStructure(null)}
        >
          {/* Calvária craniana posterior e superior */}
          <mesh
            geometry={craniumGeometries.vaultGeo}
            position={[0, 2.6, -0.8]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial
              {...craniumMatProps}
              transparent
              opacity={xrayMode ? 0.3 : Math.min(craniumMatProps.opacity as number, 0.45)}
            />
          </mesh>

          {/* Arco zigomático direito */}
          <mesh
            geometry={craniumGeometries.zygomaticGeo}
            position={[-2.4, 0.9, 0.2]}
            rotation={[Math.PI / 2, 0.2, -0.4]}
            castShadow
          >
            <meshStandardMaterial {...craniumMatProps} />
          </mesh>

          {/* Arco zigomático esquerdo */}
          <mesh
            geometry={craniumGeometries.zygomaticGeo}
            position={[2.4, 0.9, 0.2]}
            rotation={[Math.PI / 2, -0.2, 0.4]}
            castShadow
          >
            <meshStandardMaterial {...craniumMatProps} />
          </mesh>
        </group>
      )}
    </group>
  );
};
