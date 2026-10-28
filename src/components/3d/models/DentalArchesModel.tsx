import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useAnatomyStore } from '@/stores/useAnatomyStore';
import { themeTokens } from '@/theme/tokens';

interface ToothMeshDef {
  fdi: string;
  structureId: string;
  arch: 'upper' | 'lower';
  quadrant: 1 | 2 | 3 | 4;
  type: 'incisor' | 'canine' | 'premolar' | 'molar';
  pos: [number, number, number];
  rot: [number, number, number];
  scale: [number, number, number];
  roots: number;
}

export const DentalArchesModel: React.FC = () => {
  const {
    selectedStructureId,
    hoveredStructureId,
    isolatedStructureId,
    hiddenStructureIds,
    layers,
    opacities,
    xrayMode,
    wisdomToothState,
    alignmentState,
    setSelectedStructure,
    setHoveredStructure,
    setActiveToothFdi,
  } = useAnatomyStore();

  const isVisible = layers.dental;

  // Definição geométrica dos 32 dentes da dentição permanente
  const teethList: ToothMeshDef[] = useMemo(() => {
    return [
      // ====== ARCADA SUPERIOR (MAXILA) ======
      // Quadrante 1 (Superior Direito: 18 -> 11)
      { fdi: '18', structureId: 'dente_18', arch: 'upper', quadrant: 1, type: 'molar', pos: [-2.15, 0.05, 0.15], rot: [-0.1, 0.5, 0.1], scale: [0.95, 1.0, 0.95], roots: 3 },
      { fdi: '17', structureId: 'dente_17', arch: 'upper', quadrant: 1, type: 'molar', pos: [-1.95, 0.02, 0.55], rot: [-0.08, 0.42, 0.08], scale: [1.0, 1.05, 1.0], roots: 3 },
      { fdi: '16', structureId: 'dente_16', arch: 'upper', quadrant: 1, type: 'molar', pos: [-1.75, 0.0, 0.95], rot: [-0.05, 0.35, 0.05], scale: [1.08, 1.1, 1.08], roots: 3 },
      { fdi: '15', structureId: 'dente_15', arch: 'upper', quadrant: 1, type: 'premolar', pos: [-1.48, -0.02, 1.3], rot: [-0.04, 0.28, 0.04], scale: [0.85, 1.0, 0.85], roots: 1 },
      { fdi: '14', structureId: 'dente_14', arch: 'upper', quadrant: 1, type: 'premolar', pos: [-1.22, -0.04, 1.6], rot: [-0.03, 0.22, 0.03], scale: [0.85, 1.0, 0.85], roots: 2 },
      { fdi: '13', structureId: 'dente_13', arch: 'upper', quadrant: 1, type: 'canine', pos: [-0.92, -0.05, 1.88], rot: [-0.02, 0.16, 0.02], scale: [0.9, 1.25, 0.9], roots: 1 },
      { fdi: '12', structureId: 'dente_12', arch: 'upper', quadrant: 1, type: 'incisor', pos: [-0.58, -0.06, 2.06], rot: [-0.02, 0.1, 0.01], scale: [0.8, 1.0, 0.75], roots: 1 },
      { fdi: '11', structureId: 'dente_11', arch: 'upper', quadrant: 1, type: 'incisor', pos: [-0.22, -0.07, 2.15], rot: [0, 0.04, 0], scale: [0.95, 1.1, 0.85], roots: 1 },

      // Quadrante 2 (Superior Esquerdo: 21 -> 28)
      { fdi: '21', structureId: 'dente_21', arch: 'upper', quadrant: 2, type: 'incisor', pos: [0.22, -0.07, 2.15], rot: [0, -0.04, 0], scale: [0.95, 1.1, 0.85], roots: 1 },
      { fdi: '22', structureId: 'dente_22', arch: 'upper', quadrant: 2, type: 'incisor', pos: [0.58, -0.06, 2.06], rot: [-0.02, -0.1, -0.01], scale: [0.8, 1.0, 0.75], roots: 1 },
      { fdi: '23', structureId: 'dente_23', arch: 'upper', quadrant: 2, type: 'canine', pos: [0.92, -0.05, 1.88], rot: [-0.02, -0.16, -0.02], scale: [0.9, 1.25, 0.9], roots: 1 },
      { fdi: '24', structureId: 'dente_24', arch: 'upper', quadrant: 2, type: 'premolar', pos: [1.22, -0.04, 1.6], rot: [-0.03, -0.22, -0.03], scale: [0.85, 1.0, 0.85], roots: 2 },
      { fdi: '25', structureId: 'dente_25', arch: 'upper', quadrant: 2, type: 'premolar', pos: [1.48, -0.02, 1.3], rot: [-0.04, -0.28, -0.04], scale: [0.85, 1.0, 0.85], roots: 1 },
      { fdi: '26', structureId: 'dente_26', arch: 'upper', quadrant: 2, type: 'molar', pos: [1.75, 0.0, 0.95], rot: [-0.05, -0.35, -0.05], scale: [1.08, 1.1, 1.08], roots: 3 },
      { fdi: '27', structureId: 'dente_27', arch: 'upper', quadrant: 2, type: 'molar', pos: [1.95, 0.02, 0.55], rot: [-0.08, -0.42, -0.08], scale: [1.0, 1.05, 1.0], roots: 3 },
      { fdi: '28', structureId: 'dente_28', arch: 'upper', quadrant: 2, type: 'molar', pos: [2.15, 0.05, 0.15], rot: [-0.1, -0.5, -0.1], scale: [0.95, 1.0, 0.95], roots: 3 },

      // ====== ARCADA INFERIOR (MANDÍBULA) ======
      // Quadrante 4 (Inferior Direito: 48 -> 41)
      { fdi: '48', structureId: 'dente_48', arch: 'lower', quadrant: 4, type: 'molar', pos: [-2.05, -1.0, 0.1], rot: [0.1, 0.5, -0.1], scale: [0.95, 1.0, 0.95], roots: 2 },
      { fdi: '47', structureId: 'dente_47', arch: 'lower', quadrant: 4, type: 'molar', pos: [-1.88, -1.03, 0.5], rot: [0.08, 0.42, -0.08], scale: [1.0, 1.05, 1.0], roots: 2 },
      { fdi: '46', structureId: 'dente_46', arch: 'lower', quadrant: 4, type: 'molar', pos: [-1.68, -1.06, 0.88], rot: [0.05, 0.35, -0.05], scale: [1.1, 1.1, 1.1], roots: 2 },
      { fdi: '45', structureId: 'dente_45', arch: 'lower', quadrant: 4, type: 'premolar', pos: [-1.4, -1.1, 1.25], rot: [0.04, 0.28, -0.04], scale: [0.85, 1.0, 0.85], roots: 1 },
      { fdi: '44', structureId: 'dente_44', arch: 'lower', quadrant: 4, type: 'premolar', pos: [-1.15, -1.12, 1.55], rot: [0.03, 0.22, -0.03], scale: [0.85, 1.0, 0.85], roots: 1 },
      { fdi: '43', structureId: 'dente_43', arch: 'lower', quadrant: 4, type: 'canine', pos: [-0.85, -1.13, 1.8], rot: [0.02, 0.16, -0.02], scale: [0.88, 1.2, 0.88], roots: 1 },
      { fdi: '42', structureId: 'dente_42', arch: 'lower', quadrant: 4, type: 'incisor', pos: [-0.52, -1.14, 1.96], rot: [0.02, 0.1, -0.01], scale: [0.72, 0.95, 0.7], roots: 1 },
      { fdi: '41', structureId: 'dente_41', arch: 'lower', quadrant: 4, type: 'incisor', pos: [-0.18, -1.15, 2.03], rot: [0, 0.04, 0], scale: [0.68, 0.95, 0.65], roots: 1 },

      // Quadrante 3 (Inferior Esquerdo: 31 -> 38)
      { fdi: '31', structureId: 'dente_31', arch: 'lower', quadrant: 3, type: 'incisor', pos: [0.18, -1.15, 2.03], rot: [0, -0.04, 0], scale: [0.68, 0.95, 0.65], roots: 1 },
      { fdi: '32', structureId: 'dente_32', arch: 'lower', quadrant: 3, type: 'incisor', pos: [0.52, -1.14, 1.96], rot: [0.02, -0.1, 0.01], scale: [0.72, 0.95, 0.7], roots: 1 },
      { fdi: '33', structureId: 'dente_33', arch: 'lower', quadrant: 3, type: 'canine', pos: [0.85, -1.13, 1.8], rot: [0.02, -0.16, 0.02], scale: [0.88, 1.2, 0.88], roots: 1 },
      { fdi: '34', structureId: 'dente_34', arch: 'lower', quadrant: 3, type: 'premolar', pos: [1.15, -1.12, 1.55], rot: [0.03, -0.22, 0.03], scale: [0.85, 1.0, 0.85], roots: 1 },
      { fdi: '35', structureId: 'dente_35', arch: 'lower', quadrant: 3, type: 'premolar', pos: [1.4, -1.1, 1.25], rot: [0.04, -0.28, 0.04], scale: [0.85, 1.0, 0.85], roots: 1 },
      { fdi: '36', structureId: 'dente_36', arch: 'lower', quadrant: 3, type: 'molar', pos: [1.68, -1.06, 0.88], rot: [0.05, -0.35, 0.05], scale: [1.1, 1.1, 1.1], roots: 2 },
      { fdi: '37', structureId: 'dente_37', arch: 'lower', quadrant: 3, type: 'molar', pos: [1.88, -1.03, 0.5], rot: [0.08, -0.42, 0.08], scale: [1.0, 1.05, 1.0], roots: 2 },
      { fdi: '38', structureId: 'dente_38', arch: 'lower', quadrant: 3, type: 'molar', pos: [2.05, -1.0, 0.1], rot: [0.1, -0.5, 0.1], scale: [0.95, 1.0, 0.95], roots: 2 },
    ];
  }, []);

  // Geometrias por tipo anatômico
  const geometries = useMemo(() => {
    // 1. Molar: Coroa com cúspides oclusais + raízes
    const molarCrown = new THREE.CylinderGeometry(0.38, 0.34, 0.45, 16);
    const molarRoot = new THREE.ConeGeometry(0.16, 0.85, 12);

    // 2. Pré-molar: Coroa bicuspidada
    const premolarCrown = new THREE.CylinderGeometry(0.28, 0.24, 0.48, 16);
    const premolarRoot = new THREE.ConeGeometry(0.14, 0.9, 12);

    // 3. Canino: Coroa com cúspide pontiaguda + raiz longa
    const canineCrown = new THREE.ConeGeometry(0.26, 0.65, 16);
    const canineRoot = new THREE.ConeGeometry(0.16, 1.2, 12);

    // 4. Incisivo: Coroa em cunha achatada
    const incisorCrown = new THREE.BoxGeometry(0.42, 0.55, 0.18);
    const incisorRoot = new THREE.ConeGeometry(0.13, 0.95, 12);

    return {
      molarCrown,
      molarRoot,
      premolarCrown,
      premolarRoot,
      canineCrown,
      canineRoot,
      incisorCrown,
      incisorRoot,
    };
  }, []);

  // Handler de Material por dente
  const getToothMaterial = (tooth: ToothMeshDef) => {
    const isSelected = selectedStructureId === tooth.structureId || selectedStructureId === `dente_${tooth.fdi}`;
    const isHovered = hoveredStructureId === tooth.structureId;
    const isIsolated = isolatedStructureId === tooth.structureId || isolatedStructureId === `dente_${tooth.fdi}`;
    const hasIsolation = isolatedStructureId !== null;
    const isHidden = hiddenStructureIds.includes(tooth.structureId) || hiddenStructureIds.includes(`dente_${tooth.fdi}`);

    if (isHidden || !isVisible) {
      return { visible: false };
    }

    if (xrayMode) {
      return {
        visible: true,
        color: isSelected ? '#38BDF8' : '#E0F2FE',
        transparent: true,
        opacity: isSelected ? 0.95 : 0.65,
        roughness: 0.2,
        metalness: 0.1,
        emissive: isSelected ? '#00C9F6' : '#0369A1',
        emissiveIntensity: isSelected ? 0.6 : 0.25,
      };
    }

    let opacity = opacities.dental;
    if (hasIsolation && !isIsolated) {
      opacity = 0.15;
    }

    let color = '#F8FAFC'; // Esmalte dental branco natural
    let emissive = '#000000';
    let emissiveIntensity = 0;

    if (isSelected) {
      color = themeTokens.colors.brandCyan;
      emissive = '#0090B3';
      emissiveIntensity = 0.6;
    } else if (isHovered) {
      color = '#7DD3FC';
      emissive = '#0284C7';
      emissiveIntensity = 0.3;
    }

    return {
      visible: true,
      color,
      transparent: opacity < 1.0 || (hasIsolation && !isIsolated),
      opacity,
      roughness: 0.35,
      metalness: 0.05,
      emissive,
      emissiveIntensity,
    };
  };

  if (!isVisible && !xrayMode) return null;

  return (
    <group name="dental_arches">
      {teethList.map((tooth) => {
        const matProps = getToothMaterial(tooth);
        if (!matProps.visible) return null;

        // Ajustes para dente do siso (38 e 48) conforme estado didático
        let finalPos = [...tooth.pos] as [number, number, number];
        let finalRot = [...tooth.rot] as [number, number, number];

        if (tooth.fdi === '38' || tooth.fdi === '48') {
          if (wisdomToothState === 'absent') {
            return null;
          }
          if (wisdomToothState === 'mesioangular') {
            finalRot[0] += tooth.fdi === '38' ? 0.65 : 0.65;
            finalRot[2] += tooth.fdi === '38' ? 0.35 : -0.35;
            finalPos[1] -= 0.15;
          } else if (wisdomToothState === 'horizontal') {
            finalRot[0] += 1.35;
            finalPos[1] -= 0.25;
            finalPos[2] += 0.15;
          } else if (wisdomToothState === 'impacted') {
            finalPos[1] -= 0.45; // retido no osso
            finalRot[0] += 0.4;
          }
        }

        // Variações de alinhamento didático
        if (alignmentState === 'crowded_anterior' && (tooth.fdi === '31' || tooth.fdi === '41' || tooth.fdi === '12' || tooth.fdi === '22')) {
          finalPos[2] += tooth.fdi === '31' ? 0.08 : -0.06;
          finalRot[1] += 0.25;
        } else if (alignmentState === 'diastema_central' && (tooth.fdi === '11' || tooth.fdi === '21')) {
          finalPos[0] += tooth.fdi === '11' ? -0.15 : 0.15;
        }

        const isUpper = tooth.arch === 'upper';

        return (
          <group
            key={tooth.fdi}
            name={`tooth_${tooth.fdi}`}
            position={finalPos}
            rotation={finalRot}
            scale={tooth.scale}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedStructure(tooth.structureId);
              setActiveToothFdi(tooth.fdi);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredStructure(tooth.structureId);
            }}
            onPointerOut={() => setHoveredStructure(null)}
          >
            {/* COROA DENTAL */}
            {tooth.type === 'molar' && (
              <mesh geometry={geometries.molarCrown} castShadow receiveShadow>
                <meshStandardMaterial {...matProps} />
              </mesh>
            )}

            {tooth.type === 'premolar' && (
              <mesh geometry={geometries.premolarCrown} castShadow receiveShadow>
                <meshStandardMaterial {...matProps} />
              </mesh>
            )}

            {tooth.type === 'canine' && (
              <mesh
                geometry={geometries.canineCrown}
                rotation={[isUpper ? 0 : Math.PI, 0, 0]}
                castShadow
                receiveShadow
              >
                <meshStandardMaterial {...matProps} />
              </mesh>
            )}

            {tooth.type === 'incisor' && (
              <mesh geometry={geometries.incisorCrown} castShadow receiveShadow>
                <meshStandardMaterial {...matProps} />
              </mesh>
            )}

            {/* RAÍZES DENTÁRIAS */}
            {tooth.type === 'molar' ? (
              // Molares com 2 ou 3 raízes
              <>
                <mesh
                  geometry={geometries.molarRoot}
                  position={[-0.14, isUpper ? 0.6 : -0.6, 0.08]}
                  rotation={[isUpper ? Math.PI : 0, 0, -0.15]}
                >
                  <meshStandardMaterial {...matProps} color="#FDE68A" />
                </mesh>
                <mesh
                  geometry={geometries.molarRoot}
                  position={[0.14, isUpper ? 0.6 : -0.6, -0.08]}
                  rotation={[isUpper ? Math.PI : 0, 0, 0.15]}
                >
                  <meshStandardMaterial {...matProps} color="#FDE68A" />
                </mesh>
                {isUpper && (
                  <mesh
                    geometry={geometries.molarRoot}
                    position={[0, 0.65, -0.2]}
                    rotation={[Math.PI + 0.2, 0, 0]}
                  >
                    <meshStandardMaterial {...matProps} color="#FDE68A" />
                  </mesh>
                )}
              </>
            ) : tooth.type === 'premolar' && tooth.roots === 2 ? (
              // Pré-molar superior bifurcado
              <>
                <mesh
                  geometry={geometries.premolarRoot}
                  position={[0, isUpper ? 0.55 : -0.55, 0.1]}
                  rotation={[isUpper ? Math.PI : 0, 0, 0]}
                >
                  <meshStandardMaterial {...matProps} color="#FDE68A" />
                </mesh>
                <mesh
                  geometry={geometries.premolarRoot}
                  position={[0, isUpper ? 0.55 : -0.55, -0.1]}
                  rotation={[isUpper ? Math.PI : 0, 0, 0]}
                >
                  <meshStandardMaterial {...matProps} color="#FDE68A" />
                </mesh>
              </>
            ) : tooth.type === 'canine' ? (
              // Canino com raiz única longa
              <mesh
                geometry={geometries.canineRoot}
                position={[0, isUpper ? 0.75 : -0.75, 0]}
                rotation={[isUpper ? Math.PI : 0, 0, 0]}
              >
                <meshStandardMaterial {...matProps} color="#FDE68A" />
              </mesh>
            ) : (
              // Incisivos e pré-molares unirradiculares
              <mesh
                geometry={geometries.incisorRoot}
                position={[0, isUpper ? 0.6 : -0.6, 0]}
                rotation={[isUpper ? Math.PI : 0, 0, 0]}
              >
                <meshStandardMaterial {...matProps} color="#FDE68A" />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
};
