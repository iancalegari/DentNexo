import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Box, Typography } from '@mui/material';
import { useAnatomyStore } from '@/stores/useAnatomyStore';
import { TOOTH_3D_CENTERS, getToothSurfaceFeatures } from '@/data/dental/surfaceFeaturesData';
import { themeTokens } from '@/theme/tokens';

export const SurfaceLandmarkMarker: React.FC = () => {
  const {
    surfaceExplorationMode,
    activeToothFdi,
    selectedSurfaceFeature,
    hideSurfaceFeatures,
  } = useAnatomyStore();

  const pulseRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    if (pulseRef.current) {
      const scale = 1 + Math.sin(elapsed * 4) * 0.18;
      pulseRef.current.scale.set(scale, scale, scale);
    }
    if (ringRef.current) {
      const ringScale = 1 + ((elapsed * 1.5) % 1) * 1.2;
      const opacity = Math.max(0, 1 - ((elapsed * 1.5) % 1));
      ringRef.current.scale.set(ringScale, ringScale, ringScale);
      if (ringRef.current.material instanceof THREE.MeshBasicMaterial) {
        ringRef.current.material.opacity = opacity * 0.7;
      }
    }
  });

  if (!surfaceExplorationMode || hideSurfaceFeatures || !selectedSurfaceFeature) {
    return null;
  }

  const toothCenter = TOOTH_3D_CENTERS[activeToothFdi] || [0, 0, 0];
  const features = getToothSurfaceFeatures(activeToothFdi);
  const feature = features.find((f) => f.id === selectedSurfaceFeature);

  if (!feature) return null;

  const markerPosition: [number, number, number] = [
    toothCenter[0] + feature.offset[0],
    toothCenter[1] + feature.offset[1],
    toothCenter[2] + feature.offset[2],
  ];

  return (
    <group position={markerPosition}>
      {/* Luz focal sobre o acidente anatômico */}
      <pointLight color="#818CF8" intensity={1.8} distance={2.5} />

      {/* Esfera central do pin indicador */}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.075, 24, 24]} />
        <meshStandardMaterial
          color="#818CF8"
          emissive="#6366F1"
          emissiveIntensity={1.2}
          roughness={0.15}
          metalness={0.2}
        />
      </mesh>

      {/* Anel holográfico de pulsação */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.09, 0.12, 32]} />
        <meshBasicMaterial color="#A5B4FC" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>

      {/* Etiqueta 3D Ancorada ao Marcador */}
      <Html
        position={[0, 0.22, 0]}
        center
        distanceFactor={6}
        zIndexRange={[100, 200]}
        style={{ pointerEvents: 'none' }}
      >
        <Box
          sx={{
            backgroundColor: 'rgba(15, 23, 42, 0.92)',
            backdropFilter: 'blur(8px)',
            border: '1px solid #818CF8',
            borderRadius: '6px',
            px: 1.2,
            py: 0.5,
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.45)',
            transform: 'translateY(-10px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography
            sx={{
              fontFamily: themeTokens.typography.fontFamily,
              fontSize: '0.78rem',
              fontWeight: 800,
              color: '#EEF2FF',
              lineHeight: 1.2,
              letterSpacing: '0.02em',
            }}
          >
            {feature.name}
          </Typography>
          <Box
            sx={{
              width: 0,
              height: 0,
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              borderTop: '5px solid #818CF8',
              position: 'absolute',
              bottom: -5,
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          />
        </Box>
      </Html>
    </group>
  );
};
