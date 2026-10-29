import React, { useRef, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, GizmoHelper, GizmoViewport } from '@react-three/drei';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { useAnatomyStore } from '@/stores/useAnatomyStore';
import { SceneLighting } from './SceneLighting';
import { CameraManager } from './CameraManager';
import { DentalScopeModel } from './models/DentalScopeModel';
import { DentalScopeTooth } from './models/DentalScopeTooth';
import { PathologyOverlays } from './models/PathologyOverlays';
import { SurfaceLandmarkMarker } from './SurfaceLandmarkMarker';
import { SurfaceAnatomyPanel } from '@/features/dental/SurfaceAnatomyPanel';
import { themeTokens } from '@/theme/tokens';

/**
 * Fallback de carregamento para os modelos GLB
 */
const LoadingFallback: React.FC = () => (
  <mesh>
    <boxGeometry args={[0.5, 0.5, 0.5]} />
    <meshStandardMaterial color="#1E293B" wireframe />
  </mesh>
);

interface AnatomyViewer3DProps {
  soloToothMode?: boolean;
  archesOnlyMode?: boolean;
  hideCredits?: boolean;
  hideGizmo?: boolean;
}

export const AnatomyViewer3D: React.FC<AnatomyViewer3DProps> = ({
  soloToothMode = false,
  archesOnlyMode = false,
  hideCredits = false,
  hideGizmo = false,
}) => {
  const { xrayMode, toothViewMode, hiddenStructureIds, unhideStructure } = useAnatomyStore();
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const [isInteracting, setIsInteracting] = useState<boolean>(false);
  const [isModelLoading, setIsModelLoading] = useState<boolean>(true);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        position: 'relative',
        backgroundColor: xrayMode ? '#040d16' : '#0B0F14',
        overflow: 'hidden',
        transition: 'background-color 0.4s ease',
        cursor: isInteracting ? 'grabbing' : 'grab',
      }}
    >
      <Canvas
        camera={{ position: [8.5, 6.2, 11.5], fov: 42, near: 0.1, far: 100 }}
        dpr={[1, 1.5]}
        shadows={false}
        gl={{
          antialias: true,
          preserveDrawingBuffer: true,
          powerPreference: 'high-performance',
        }}
        onPointerDown={() => setIsInteracting(true)}
        onPointerUp={() => setIsInteracting(false)}
      >
        {/* Iluminação de Estúdio / Negatoscópio Radiográfico */}
        <SceneLighting xrayMode={xrayMode} />

        {/* Gerenciador de Animação e Presets de Câmera */}
        <CameraManager controlsRef={controlsRef} />

        {/* Rotação Livre 360° em todos os eixos sem travas restritivas */}
        <OrbitControls
          ref={controlsRef}
          makeDefault
          target={[0, 0.5, 0]}
          enableDamping
          dampingFactor={0.06}
          rotateSpeed={0.85}
          zoomSpeed={1.0}
          panSpeed={0.9}
          minDistance={1.0}
          maxDistance={35}
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
          enablePan={true}
          screenSpacePanning={true}
        />

        {/* Gizmo de Orientação Anatômica XYZ (se não estiver desativado na visualização) */}
        {!hideGizmo && (
          <GizmoHelper alignment="bottom-left" margin={[80, 145]}>
            <GizmoViewport
              axisColors={['#EF4444', '#10B981', '#38BDF8']}
              labelColor="#FFFFFF"
            />
          </GizmoHelper>
        )}

        {/* Modelos Tridimensionais Interativos Dental Scope */}
        {soloToothMode ? (
          <Suspense fallback={<LoadingFallback />}>
            <DentalScopeTooth />
            <PathologyOverlays isSoloTooth={true} />
          </Suspense>
        ) : (
          <group position={[0, -0.2, 0]}>
            {/* Modelo Mestre Dental Scope (Crânio, Mandíbula, Dentes, Músculos, Neurovascular) */}
            <Suspense fallback={<LoadingFallback />}>
              <DentalScopeModel archesOnlyMode={archesOnlyMode} />
            </Suspense>

            {/* Camada visual de patologias odontológicas */}
            <PathologyOverlays isSoloTooth={false} />

            {/* Marcador 3D de Acidentes Anatômicos de Superfície */}
            <SurfaceLandmarkMarker />
          </group>
        )}
      </Canvas>

      {/* Painel Flutuante Dental Scope de Anatomia de Superfície & Faces */}
      <SurfaceAnatomyPanel />

      {/* Botão Flutuante de Reexibir Estruturas Ocultas */}
      {hiddenStructureIds.length > 0 && (
        <Button
          variant="contained"
          size="small"
          startIcon={<VisibilityIcon fontSize="small" />}
          onClick={() => hiddenStructureIds.forEach((id) => unhideStructure(id))}
          sx={{
            position: 'absolute',
            bottom: 95,
            left: 24,
            zIndex: 100,
            backgroundColor: '#059669',
            color: '#FFFFFF',
            fontSize: '0.76rem',
            fontWeight: 700,
            textTransform: 'none',
            borderRadius: '8px',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
            '&:hover': { backgroundColor: '#047857' },
          }}
        >
          {hiddenStructureIds.length} estrutura(s) oculta(s) • Reexibir Tudo
        </Button>
      )}

      {/* Indicador HUD de Navegação */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 24,
          left: 24,
          zIndex: 100,
          backgroundColor: 'rgba(11, 15, 20, 0.78)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(41, 52, 66, 0.65)',
          borderRadius: '8px',
          px: 1.8,
          py: 0.9,
          pointerEvents: 'none',
          userSelect: 'none',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
          transition: 'opacity 0.2s ease',
          opacity: isInteracting ? 0.35 : 0.95,
        }}
      >
        <Typography
          sx={{
            fontFamily: themeTokens.typography.fontFamily,
            fontSize: '0.82rem',
            fontWeight: 700,
            color: '#86EFAC',
            letterSpacing: '0.01em',
            lineHeight: 1.3,
          }}
        >
          Arraste para girar • toque para selecionar
        </Typography>
        <Typography
          sx={{
            fontFamily: themeTokens.typography.fontFamily,
            fontSize: '0.74rem',
            fontWeight: 500,
            color: '#94A3B8',
            lineHeight: 1.3,
            mt: 0.2,
          }}
        >
          Roda ou pinça: zoom • botão direito: menu de ações
        </Typography>
      </Box>

      {/* Referência da Origem dos Modelos 3D (se não estiver desativada na visualização) */}
      {!hideCredits && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 24,
            right: 24,
            zIndex: 100,
            backgroundColor: 'rgba(11, 15, 20, 0.75)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '6px',
            px: 1.2,
            py: 0.45,
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.4)',
            transition: 'opacity 0.2s ease',
            opacity: isInteracting ? 0.25 : 0.85,
            display: { xs: 'none', md: 'block' },
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontFamily: themeTokens.typography.fontFamily,
              fontSize: '0.65rem',
              color: '#64748B',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              lineHeight: 1.2,
            }}
          >
            <span>Modelos 3D:</span>
            <Box
              component="a"
              href="https://github.com/Yoosseph/dental-scope"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: '#38BDF8',
                textDecoration: 'none',
                fontWeight: 600,
                '&:hover': { textDecoration: 'underline', color: themeTokens.colors.brandCyan },
              }}
            >
              Dental Scope / BodyParts3D & Z-Anatomy (CC BY-SA 4.0)
            </Box>
          </Typography>
        </Box>
      )}
    </Box>
  );
};
