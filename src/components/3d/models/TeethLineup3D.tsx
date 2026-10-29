import React, { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useGLTF, Html } from '@react-three/drei';
import { Box, Typography } from '@mui/material';
import { useAnatomyStore } from '@/stores/useAnatomyStore';
import { themeTokens } from '@/theme/tokens';

interface TeethLineup3DProps {
  targetStructureId?: string | null;
  quizAnswered?: boolean;
}

interface LineupToothItem {
  fdi: string;
  structureId: string;
  mesh: THREE.Mesh;
  material: THREE.MeshStandardMaterial;
  worldPos: [number, number, number];
  isUpper: boolean;
}

const UPPER_ROW_FDI = ['18', '17', '16', '15', '14', '13', '12', '11', '21', '22', '23', '24', '25', '26', '27', '28'];
const LOWER_ROW_FDI = ['48', '47', '46', '45', '44', '43', '42', '41', '31', '32', '33', '34', '35', '36', '37', '38'];

export const TeethLineup3D: React.FC<TeethLineup3DProps> = ({
  targetStructureId = null,
  quizAnswered = false,
}) => {
  const coreGLTF = useGLTF('/models/dental-scope/core.glb');

  const {
    selectedStructureId,
    hoveredStructureId,
    setHoveredStructure,
  } = useAnatomyStore();

  const { lineupGroup, toothItems } = useMemo(() => {
    const group = new THREE.Group();
    const clonedScene = coreGLTF.scene.clone(true);
    const items: LineupToothItem[] = [];

    const toothMap = new Map<string, THREE.Mesh>();
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.name.startsWith('tooth-')) {
        if (!child.geometry.attributes.normal) {
          child.geometry.computeVertexNormals();
        }
        const fdi = child.name.replace('tooth-', '');
        toothMap.set(fdi, child);
      }
    });

    const spacingX = 1.42;
    const midlineGap = 0.45;

    const placeRow = (fdiList: string[], isUpper: boolean) => {
      const rowY = isUpper ? 1.85 : -1.85;

      fdiList.forEach((fdi, index) => {
        const srcMesh = toothMap.get(fdi);
        if (!srcMesh) return;

        const mesh = srcMesh.clone();
        const origX = srcMesh.position.x;
        const origZ = srcMesh.position.z;

        // Posição horizontal simétrica em torno da linha média (x = 0)
        const offsetFromCenter = index - 7.5;
        const gapOffset = index < 8 ? -midlineGap : midlineGap;
        const posX = offsetFromCenter * spacingX + gapOffset;

        mesh.position.set(posX, rowY, 0);

        // Girar suavemente a face vestibular/bucal de cada dente para frente (+Z) na vitrine panorâmica
        const archAngle = Math.atan2(origX, origZ + 1.6);
        mesh.rotation.set(0, -archAngle * 0.85, 0);

        const material = new THREE.MeshStandardMaterial({
          color: new THREE.Color('#F4F1E6'),
          roughness: 0.24,
          metalness: 0.04,
          emissive: new THREE.Color('#000000'),
          emissiveIntensity: 0,
          side: THREE.DoubleSide,
        });

        mesh.material = material;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        group.add(mesh);

        items.push({
          fdi,
          structureId: `dente_${fdi}`,
          mesh,
          material,
          worldPos: [posX, rowY, 0],
          isUpper,
        });
      });
    };

    placeRow(UPPER_ROW_FDI, true);
    placeRow(LOWER_ROW_FDI, false);

    return { lineupGroup: group, toothItems: items };
  }, [coreGLTF.scene]);

  // Atualizar cores e realces interativos (hover, seleção, acerto e erro)
  useEffect(() => {
    for (const item of toothItems) {
      const isSelected = selectedStructureId === item.structureId;
      const isHovered = hoveredStructureId === item.structureId;
      const isTarget = targetStructureId === item.structureId;

      let hex = '#F4F1E6';
      let emissiveHex = '#000000';
      let emissiveIntensity = 0;
      let zOffset = 0;

      if (quizAnswered) {
        if (isTarget) {
          // Sempre destaca o dente correto em verde após responder
          hex = '#10B981';
          emissiveHex = '#065F46';
          emissiveIntensity = 0.65;
          zOffset = 0.35;
        } else if (isSelected && !isTarget) {
          // Dente clicado incorretamente fica vermelho
          hex = '#EF4444';
          emissiveHex = '#991B1B';
          emissiveIntensity = 0.6;
          zOffset = 0.2;
        }
      } else {
        if (isSelected) {
          hex = themeTokens.colors.brandCyan;
          emissiveHex = '#006B85';
          emissiveIntensity = 0.6;
          zOffset = 0.32;
        } else if (isHovered) {
          hex = '#7DD3FC';
          emissiveHex = '#0369A1';
          emissiveIntensity = 0.3;
          zOffset = 0.16;
        }
      }

      item.material.color.set(hex);
      item.material.emissive.set(emissiveHex);
      item.material.emissiveIntensity = emissiveIntensity;
      item.mesh.position.z = zOffset;
    }
  }, [toothItems, selectedStructureId, hoveredStructureId, targetStructureId, quizAnswered]);

  const handlePointerOver = (e: any) => {
    if (quizAnswered) return;
    const meshName = e.object?.name;
    if (meshName && meshName.startsWith('tooth-')) {
      e.stopPropagation();
      const fdi = meshName.replace('tooth-', '');
      setHoveredStructure(`dente_${fdi}`);
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerOut = () => {
    setHoveredStructure(null);
    document.body.style.cursor = 'grab';
  };

  const handleClick = (e: any) => {
    if (quizAnswered) return;
    const meshName = e.object?.name;
    if (meshName && meshName.startsWith('tooth-')) {
      e.stopPropagation();
      const fdi = meshName.replace('tooth-', '');
      useAnatomyStore.setState({
        selectedStructureId: `dente_${fdi}`,
        infoPanelOpen: false,
      });
    }
  };

  const selectedItem = toothItems.find((t) => t.structureId === selectedStructureId);
  const targetItem = quizAnswered ? toothItems.find((t) => t.structureId === targetStructureId) : null;

  return (
    <group
      name="teeth_lineup_3d"
      scale={[0.56, 0.56, 0.56]}
      position={[0, 1.0, 0]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      <primitive object={lineupGroup} />

      {/* Linha Média Sagital Divisória (orientação anatômica sem revelar FDI individual) */}
      <mesh position={[0, 0, -0.2]}>
        <boxGeometry args={[0.04, 7.2, 0.04]} />
        <meshBasicMaterial color="#00C9F6" transparent opacity={0.45} />
      </mesh>

      {/* Plano Oclusal Horizontal */}
      <mesh position={[0, 0, -0.2]}>
        <boxGeometry args={[23.2, 0.03, 0.03]} />
        <meshBasicMaterial color="#38BDF8" transparent opacity={0.28} />
      </mesh>

      {/* Legendas sutis de Quadrantes (sem dar spoiler do número individual do dente) */}
      <Html position={[-6.5, 4.1, 0]} center style={{ pointerEvents: 'none' }}>
        <Box
          sx={{
            px: 1.2,
            py: 0.3,
            borderRadius: '6px',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            whiteSpace: 'nowrap',
          }}
        >
          <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: '#94A3B8' }}>
            Superior Direito (Quadrante 1)
          </Typography>
        </Box>
      </Html>

      <Html position={[6.5, 4.1, 0]} center style={{ pointerEvents: 'none' }}>
        <Box
          sx={{
            px: 1.2,
            py: 0.3,
            borderRadius: '6px',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            whiteSpace: 'nowrap',
          }}
        >
          <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: '#94A3B8' }}>
            Superior Esquerdo (Quadrante 2)
          </Typography>
        </Box>
      </Html>

      <Html position={[-6.5, -4.1, 0]} center style={{ pointerEvents: 'none' }}>
        <Box
          sx={{
            px: 1.2,
            py: 0.3,
            borderRadius: '6px',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            whiteSpace: 'nowrap',
          }}
        >
          <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: '#94A3B8' }}>
            Inferior Direito (Quadrante 4)
          </Typography>
        </Box>
      </Html>

      <Html position={[6.5, -4.1, 0]} center style={{ pointerEvents: 'none' }}>
        <Box
          sx={{
            px: 1.2,
            py: 0.3,
            borderRadius: '6px',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            whiteSpace: 'nowrap',
          }}
        >
          <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: '#94A3B8' }}>
            Inferior Esquerdo (Quadrante 3)
          </Typography>
        </Box>
      </Html>

      {/* Após confirmar a resposta, revela o rótulo FDI exato sobre o dente correto (e sobre o clicado, se errou) */}
      {quizAnswered && targetItem && (
        <Html
          position={[
            targetItem.worldPos[0],
            targetItem.isUpper ? targetItem.worldPos[1] + 1.85 : targetItem.worldPos[1] - 1.85,
            0.5,
          ]}
          center
          style={{ pointerEvents: 'none' }}
        >
          <Box
            sx={{
              px: 1,
              py: 0.25,
              borderRadius: '6px',
              backgroundColor: 'rgba(6, 95, 70, 0.95)',
              border: '1.5px solid #10B981',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.45)',
            }}
          >
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: '#ECFDF5' }}>
              ✓ Correto: FDI {targetItem.fdi}
            </Typography>
          </Box>
        </Html>
      )}

      {quizAnswered && selectedItem && selectedItem.structureId !== targetStructureId && (
        <Html
          position={[
            selectedItem.worldPos[0],
            selectedItem.isUpper ? selectedItem.worldPos[1] + 1.85 : selectedItem.worldPos[1] - 1.85,
            0.5,
          ]}
          center
          style={{ pointerEvents: 'none' }}
        >
          <Box
            sx={{
              px: 1,
              py: 0.25,
              borderRadius: '6px',
              backgroundColor: 'rgba(127, 29, 29, 0.95)',
              border: '1.5px solid #EF4444',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.45)',
            }}
          >
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: '#FEF2F2' }}>
              ✕ Clicado: FDI {selectedItem.fdi}
            </Typography>
          </Box>
        </Html>
      )}
    </group>
  );
};

