import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { Box, Typography } from '@mui/material';
import { useAnatomyStore } from '@/stores/useAnatomyStore';
import { themeTokens } from '@/theme/tokens';
import { TOOTH_3D_CENTERS } from '@/data/dental/surfaceFeaturesData';

interface PeriodontalLigamentsProps {
  archesOnlyMode?: boolean;
}

export const PeriodontalLigaments: React.FC<PeriodontalLigamentsProps> = () => {
  const {
    selectedStructureId,
    hoveredStructureId,
    focusedSystem,
    layers,
    setSelectedStructure,
    setHoveredStructure,
  } = useAnatomyStore();

  const isSelected = selectedStructureId === 'ligamento_periodontal';
  const isHovered = hoveredStructureId === 'ligamento_periodontal';
  const isAnotherSelected = selectedStructureId !== null && !isSelected;
  const isVisible = layers.oral_tissue || focusedSystem === 'oral_tissue' || isSelected;

  // Gerar mangas tridimensionais do ligamento periodontal ao redor das raízes para todos os 32 dentes
  const pdlItems = useMemo(() => {
    const teethList = [
      // Maxila (Superior)
      { fdi: '11', type: 'incisor', isUpper: true },
      { fdi: '12', type: 'incisor', isUpper: true },
      { fdi: '13', type: 'canine', isUpper: true },
      { fdi: '14', type: 'premolar', isUpper: true },
      { fdi: '15', type: 'premolar', isUpper: true },
      { fdi: '16', type: 'molar', isUpper: true },
      { fdi: '17', type: 'molar', isUpper: true },
      { fdi: '18', type: 'molar', isUpper: true },
      { fdi: '21', type: 'incisor', isUpper: true },
      { fdi: '22', type: 'incisor', isUpper: true },
      { fdi: '23', type: 'canine', isUpper: true },
      { fdi: '24', type: 'premolar', isUpper: true },
      { fdi: '25', type: 'premolar', isUpper: true },
      { fdi: '26', type: 'molar', isUpper: true },
      { fdi: '27', type: 'molar', isUpper: true },
      { fdi: '28', type: 'molar', isUpper: true },
      // Mandíbula (Inferior)
      { fdi: '31', type: 'incisor', isUpper: false },
      { fdi: '32', type: 'incisor', isUpper: false },
      { fdi: '33', type: 'canine', isUpper: false },
      { fdi: '34', type: 'premolar', isUpper: false },
      { fdi: '35', type: 'premolar', isUpper: false },
      { fdi: '36', type: 'molar', isUpper: false },
      { fdi: '37', type: 'molar', isUpper: false },
      { fdi: '38', type: 'molar', isUpper: false },
      { fdi: '41', type: 'incisor', isUpper: false },
      { fdi: '42', type: 'incisor', isUpper: false },
      { fdi: '43', type: 'canine', isUpper: false },
      { fdi: '44', type: 'premolar', isUpper: false },
      { fdi: '45', type: 'premolar', isUpper: false },
      { fdi: '46', type: 'molar', isUpper: false },
      { fdi: '47', type: 'molar', isUpper: false },
      { fdi: '48', type: 'molar', isUpper: false },
    ];

    return teethList.map(({ fdi, type, isUpper }) => {
      const center = TOOTH_3D_CENTERS[fdi] || [0, 0, 0];
      let height = 0.55;
      let rTop = 0.16;
      let rBottom = 0.12;

      if (type === 'molar') {
        height = 0.65;
        rTop = 0.28;
        rBottom = 0.22;
      } else if (type === 'canine') {
        height = 0.75;
        rTop = 0.20;
        rBottom = 0.14;
      } else if (type === 'premolar') {
        height = 0.60;
        rTop = 0.21;
        rBottom = 0.16;
      }

      // No arco superior a raiz cresce para cima (+Y); no inferior para baixo (-Y)
      const posY = isUpper ? center[1] + height * 0.45 : center[1] - height * 0.45;
      const pos: [number, number, number] = [center[0], posY, center[2]];

      // Ajuste de rotação para acompanhar inclinação radicular
      const rotZ = center[0] * 0.05;

      return {
        fdi,
        pos,
        geometryArgs: isUpper
          ? ([rBottom, rTop, height, 16] as [number, number, number, number])
          : ([rTop, rBottom, height, 16] as [number, number, number, number]),
        rotation: [0, 0, rotZ] as [number, number, number],
      };
    });
  }, []);

  if (!isVisible) return null;

  const matColor = isSelected
    ? themeTokens.colors.brandCyan
    : isHovered
    ? '#FB923C'
    : '#F97316';

  const emissiveColor = isSelected
    ? '#00C9F6'
    : isHovered
    ? '#EA580C'
    : '#C2410C';

  const emissiveIntensity = isSelected ? 0.85 : isHovered ? 0.45 : 0.2;
  const opacity = isSelected ? 0.95 : isAnotherSelected ? 0.22 : 0.78;

  return (
    <group
      name="periodontal_ligament_system"
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
      {pdlItems.map((item) => (
        <mesh
          key={item.fdi}
          position={item.pos}
          rotation={item.rotation}
          castShadow={false}
          receiveShadow
        >
          <cylinderGeometry args={item.geometryArgs} />
          <meshStandardMaterial
            color={matColor}
            emissive={emissiveColor}
            emissiveIntensity={emissiveIntensity}
            roughness={0.42}
            metalness={0.06}
            transparent
            opacity={opacity}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Etiqueta Flutuante 3D Exclusiva ao Selecionar o Ligamento Periodontal (Posicionada nos Incisivos Centrais Frontais) */}
      {isSelected && (
        <Html
          position={[-0.065, 1.45, 2.72]}
          center
          distanceFactor={6}
          style={{ pointerEvents: 'none' }}
        >
          <Box
            sx={{
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              backdropFilter: 'blur(10px)',
              border: `1.5px solid ${themeTokens.colors.brandCyan}`,
              borderRadius: '8px',
              px: 1.5,
              py: 0.8,
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 24px rgba(0, 201, 246, 0.55)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              userSelect: 'none',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: themeTokens.colors.brandCyan,
                  boxShadow: `0 0 8px ${themeTokens.colors.brandCyan}`,
                }}
              />
              <Typography
                sx={{
                  fontFamily: themeTokens.typography.fontFamily,
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  color: themeTokens.colors.brandCyan,
                  letterSpacing: '0.02em',
                }}
              >
                Ligamento Periodontal (LPO)
              </Typography>
            </Box>
            <Typography
              sx={{
                fontFamily: themeTokens.typography.fontFamily,
                fontSize: '0.68rem',
                fontWeight: 600,
                color: '#E0F2FE',
                mt: 0.3,
              }}
            >
              Fibras de Sharpey inseridas no alvéolo • Amortecimento e propriocepção
            </Typography>
            <Typography
              sx={{
                fontFamily: themeTokens.typography.fontFamily,
                fontSize: '0.62rem',
                fontWeight: 700,
                color: '#38BDF8',
                mt: 0.2,
                backgroundColor: 'rgba(0, 201, 246, 0.12)',
                px: 0.8,
                py: 0.15,
                borderRadius: '4px',
              }}
            >
              Espessura fisiológica: 0,15 mm - 0,38 mm
            </Typography>
            <Box
              sx={{
                width: 0,
                height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: `6px solid ${themeTokens.colors.brandCyan}`,
                position: 'absolute',
                bottom: -6,
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            />
          </Box>
        </Html>
      )}
    </group>
  );
};
