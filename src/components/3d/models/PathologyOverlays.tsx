import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Box, Typography } from '@mui/material';
import { useAnatomyStore } from '@/stores/useAnatomyStore';
import { themeTokens } from '@/theme/tokens';
import { TOOTH_3D_CENTERS } from '@/data/dental/surfaceFeaturesData';

interface PathologyOverlaysProps {
  isSoloTooth?: boolean;
}

export const PathologyOverlays: React.FC<PathologyOverlaysProps> = ({ isSoloTooth = false }) => {
  const { activePathologyId, activeToothFdi } = useAnatomyStore();
  const pulseRef = useRef<THREE.Mesh>(null);
  const secondaryPulseRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    if (pulseRef.current) {
      const scale = 1 + Math.sin(elapsed * 3.8) * 0.09;
      pulseRef.current.scale.set(scale, scale, 1);
    }
    if (secondaryPulseRef.current) {
      const scaleSec = 1 + Math.cos(elapsed * 4.2) * 0.12;
      secondaryPulseRef.current.scale.set(scaleSec, scaleSec, 1);
    }
  });

  if (!activePathologyId) return null;

  const fdi = activeToothFdi || '36';
  const toothCenter = TOOTH_3D_CENTERS[fdi] || [2.126, -0.588, -0.357];

  // Helper para renderizar a etiqueta 3D flutuante informativa
  const renderFloatingBadge = (
    title: string,
    subtitle: string,
    borderColor: string,
    glowColor: string,
    titleColor = '#FEE2E2',
    subtitleColor = '#FDA4AF'
  ) => (
    <Html
      position={[0, 0.28, 0]}
      center
      distanceFactor={isSoloTooth ? 4.8 : 6.2}
      style={{ pointerEvents: 'none' }}
    >
      <Box
        sx={{
          backgroundColor: 'rgba(15, 23, 42, 0.94)',
          backdropFilter: 'blur(8px)',
          border: `1px solid ${borderColor}`,
          borderRadius: '6px',
          px: 1.2,
          py: 0.5,
          whiteSpace: 'nowrap',
          boxShadow: `0 4px 16px ${glowColor}`,
          transform: 'translateY(-12px)',
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
            color: titleColor,
            lineHeight: 1.2,
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            fontFamily: themeTokens.typography.fontFamily,
            fontSize: '0.66rem',
            fontWeight: 600,
            color: subtitleColor,
            lineHeight: 1.1,
            mt: 0.2,
          }}
        >
          {subtitle}
        </Typography>
        <Box
          sx={{
            width: 0,
            height: 0,
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop: `5px solid ${borderColor}`,
            position: 'absolute',
            bottom: -5,
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        />
      </Box>
    </Html>
  );

  // ================= 1. CÁRIE DENTÁRIA (ESMALTE & DENTINA) =================
  if (activePathologyId === 'carie_dentaria' || activePathologyId === 'carie') {
    const pos: [number, number, number] = isSoloTooth
      ? [0, 1.35, 0.05]
      : [toothCenter[0], toothCenter[1] + 0.12, toothCenter[2] + 0.08];

    return (
      <group position={pos}>
        <pointLight color="#F59E0B" intensity={1.5} distance={1.8} />

        {/* 1. Halo de Desmineralização Ativa (Mancha branca / âmbar) */}
        {!isSoloTooth && (
          <mesh ref={pulseRef}>
            <circleGeometry args={[0.09, 32]} />
            <meshStandardMaterial
              color="#FEF3C7"
              emissive="#D97706"
              emissiveIntensity={0.5}
              roughness={0.7}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}

        {/* 2. Cavitação Necrótica Profunda em Dentina (Escurecida) */}
        {!isSoloTooth && (
          <mesh position={[0, 0, 0.01]}>
            <circleGeometry args={[0.05, 32]} />
            <meshStandardMaterial
              color="#29180C"
              emissive="#1A0D05"
              emissiveIntensity={0.4}
              roughness={0.9}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}

        {renderFloatingBadge(
          `Cárie Dentária Ativa (FDI ${fdi})`,
          'Desmineralização de esmalte • Cavitação em dentina',
          '#F59E0B',
          'rgba(245, 158, 11, 0.45)',
          '#FEF3C7',
          '#FBBF24'
        )}
      </group>
    );
  }

  // ================= 2. PULPITE DENTÁRIA (CÂMARA & CANAIS) =================
  if (activePathologyId === 'pulpite') {
    const pos: [number, number, number] = isSoloTooth
      ? [0, 1.15, 0.05]
      : [toothCenter[0], toothCenter[1] + 0.02, toothCenter[2] + 0.06];

    return (
      <group position={pos}>
        <pointLight color="#DC2626" intensity={2.0} distance={2.2} />

        {!isSoloTooth && (
          <>
            {/* Foco Hiperêmico Pulpar Pulsátil (Latejamento da dor aguda) */}
            <mesh ref={pulseRef}>
              <sphereGeometry args={[0.1, 24, 24]} />
              <meshStandardMaterial
                color="#EF4444"
                emissive="#DC2626"
                emissiveIntensity={0.9}
                roughness={0.3}
                transparent
                opacity={0.88}
              />
            </mesh>

            {/* Onda de dilatação microvascular periférica */}
            <mesh ref={secondaryPulseRef} position={[0, 0, 0]}>
              <ringGeometry args={[0.08, 0.15, 32]} />
              <meshBasicMaterial color="#B91C1C" transparent opacity={0.5} side={THREE.DoubleSide} />
            </mesh>
          </>
        )}

        {renderFloatingBadge(
          `Pulpite Irreversível Sintomática (FDI ${fdi})`,
          'Hiperemia vascular aguda • Dor pulsátil e edema pulpar',
          '#DC2626',
          'rgba(220, 38, 38, 0.55)',
          '#FEE2E2',
          '#F87171'
        )}
      </group>
    );
  }

  // ================= 3. ABSCESSO PERIAPICAL AGUDO =================
  if (activePathologyId === 'abscesso_periapical' || activePathologyId === 'abscesso') {
    const pos: [number, number, number] = isSoloTooth
      ? [0, -1.45, 0.05]
      : [toothCenter[0], toothCenter[1] - 0.45, toothCenter[2] - 0.04];

    return (
      <group position={pos}>
        <pointLight color="#EAB308" intensity={1.8} distance={2.2} />

        {/* 1. Halo osteolítico inflamatório periapical */}
        <mesh position={[0, 0, -0.01]}>
          <sphereGeometry args={[0.16, 24, 24]} />
          <meshStandardMaterial
            color="#7F1D1D"
            emissive="#991B1B"
            emissiveIntensity={0.4}
            transparent
            opacity={0.4}
            roughness={0.6}
          />
        </mesh>

        {/* 2. Núcleo Purulento Flutuante no Ápice Radicular (Amarelado) */}
        <mesh ref={pulseRef}>
          <sphereGeometry args={[0.11, 24, 24]} />
          <meshStandardMaterial
            color="#FACC15"
            emissive="#CA8A04"
            emissiveIntensity={0.8}
            roughness={0.4}
          />
        </mesh>

        {renderFloatingBadge(
          `Abscesso Periapical Agudo (FDI ${fdi})`,
          'Exsudato purulento periapical • Osteólise e dor à percussão',
          '#EAB308',
          'rgba(234, 179, 8, 0.5)',
          '#FEF9C3',
          '#FACC15'
        )}
      </group>
    );
  }

  // ================= 4. PERIODONTITE (BOLSA PERIODONTAL & PERDA ÓSSEA) =================
  if (activePathologyId === 'periodontite') {
    const pos: [number, number, number] = isSoloTooth
      ? [0.28, -0.15, 0.35]
      : [toothCenter[0], toothCenter[1] - 0.14, toothCenter[2] + 0.14];

    return (
      <group position={pos}>
        <pointLight color="#991B1B" intensity={1.4} distance={2.0} />

        {/* 1. Área de Reabsorção Óssea Alveolar / Bolsa Periodontal */}
        <mesh ref={pulseRef}>
          <ringGeometry args={[0.06, 0.14, 32]} />
          <meshStandardMaterial
            color="#991B1B"
            emissive="#7F1D1D"
            emissiveIntensity={0.7}
            roughness={0.5}
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* 2. Marcador de profundidade de sondagem clínica patológica (≥ 5mm) */}
        <mesh position={[0, 0, 0.02]} rotation={[0, 0, Math.PI / 4]}>
          <cylinderGeometry args={[0.015, 0.015, 0.24, 16]} />
          <meshStandardMaterial color="#E11D48" emissive="#BE123C" emissiveIntensity={0.6} />
        </mesh>

        {renderFloatingBadge(
          `Periodontite Crônica (FDI ${fdi})`,
          'Perda de inserção clínica • Reabsorção óssea e bolsa ≥ 5mm',
          '#991B1B',
          'rgba(153, 27, 27, 0.55)',
          '#FEE2E2',
          '#FB7185'
        )}
      </group>
    );
  }

  // ================= 5. GENGIVITE INDUZIDA POR BIOFILME =================
  if (activePathologyId === 'gengivite') {
    const pos: [number, number, number] = isSoloTooth
      ? [0, -0.1, 0.42]
      : [0.0, -0.65, 2.45];

    return (
      <group position={pos}>
        <pointLight color="#E11D48" intensity={1.6} distance={2.0} />

        <mesh ref={pulseRef}>
          <ringGeometry args={[0.08, 0.18, 32]} />
          <meshBasicMaterial color="#E11D48" transparent opacity={0.65} side={THREE.DoubleSide} />
        </mesh>

        {renderFloatingBadge(
          'Gengivite Margino-Papilar',
          'Eritema difuso • Edema e perda do pontilhado gengival',
          '#E11D48',
          'rgba(225, 29, 72, 0.45)',
          '#FFE4E6',
          '#FB7185'
        )}
      </group>
    );
  }

  // ================= 6. ESTOMATITE AFTOSA RECORRENTE (AFTA ORAL / ÚLCERA) =================
  if (activePathologyId === 'afta_oral' || activePathologyId === 'estomatite') {
    const pos: [number, number, number] = isSoloTooth
      ? [0, -0.32, 0.48]
      : [0.15, -0.92, 2.34];

    return (
      <group position={pos} rotation={[0.2, 0.05, 0]}>
        <pointLight color="#EF4444" intensity={1.5} distance={1.8} />

        {/* 1. Halo Eritematoso Inflamatório Periférico (Vermelho vivo) */}
        <mesh ref={pulseRef}>
          <circleGeometry args={[0.13, 32]} />
          <meshStandardMaterial
            color="#DC2626"
            emissive="#B91C1C"
            emissiveIntensity={0.8}
            roughness={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* 2. Borda eritematosa intermediária */}
        <mesh position={[0, 0, 0.005]}>
          <ringGeometry args={[0.07, 0.11, 32]} />
          <meshBasicMaterial color="#EF4444" transparent opacity={0.85} side={THREE.DoubleSide} />
        </mesh>

        {/* 3. Fundo da Cratera com Pseudomembrana Fibrinosa (Amarelada/Esbranquiçada) */}
        <mesh position={[0, 0, 0.01]}>
          <circleGeometry args={[0.07, 32]} />
          <meshStandardMaterial
            color="#FEF08A"
            emissive="#CA8A04"
            emissiveIntensity={0.3}
            roughness={0.7}
            side={THREE.DoubleSide}
          />
        </mesh>

        {renderFloatingBadge(
          'Estomatite Aftosa (Afta Oral / EAR)',
          'Úlcera rasa dolorosa • Fundo fibrinoso e halo eritematoso',
          '#EF4444',
          'rgba(239, 68, 68, 0.45)',
          '#FEE2E2',
          '#F87171'
        )}
      </group>
    );
  }

  // ================= 7. LÍNGUA GEOGRÁFICA (GLOSSITE MIGRATÓRIA BENIGNA) =================
  if (activePathologyId === 'lingua_geografica') {
    return (
      <group position={[0, -0.15, 0.95]}>
        <pointLight color="#F43F5E" intensity={1.8} distance={2.5} />
        {renderFloatingBadge(
          'Língua Geográfica (Glossite Migratória Benigna)',
          'Despapilação com bordas serpiginosas salientes e ranhuras dorsais',
          '#F43F5E',
          'rgba(244, 63, 94, 0.55)',
          '#FFE4E6',
          '#FDA4AF'
        )}
      </group>
    );
  }

  return null;
};
