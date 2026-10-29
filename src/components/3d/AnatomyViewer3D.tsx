import React, { useRef, useState, useEffect, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, events } from '@react-three/fiber';
import { OrbitControls, GizmoHelper, GizmoViewport, useProgress } from '@react-three/drei';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  LinearProgress,
  Fade,
  Paper,
  Chip,
  Tooltip,
  IconButton,
  useMediaQuery,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import HighlightIcon from '@mui/icons-material/Highlight';
import ViewInArIcon from '@mui/icons-material/ViewInAr';

import { useAnatomyStore } from '@/stores/useAnatomyStore';
import { anatomicalStructures } from '@/data/anatomy/structures';
import { SceneLighting } from './SceneLighting';
import { CameraManager } from './CameraManager';
import { DentalScopeModel } from './models/DentalScopeModel';
import { DentalScopeTooth } from './models/DentalScopeTooth';
import { TeethLineup3D } from './models/TeethLineup3D';
import { PathologyOverlays } from './models/PathologyOverlays';
import { SurfaceLandmarkMarker } from './SurfaceLandmarkMarker';
import { SurfaceAnatomyPanel } from '@/features/dental/SurfaceAnatomyPanel';
import { DentalInstrument3D } from './models/DentalInstrument3D';
import { themeTokens } from '@/theme/tokens';

const isObjectVisibleInHierarchy = (obj: THREE.Object3D | null): boolean => {
  let cur: THREE.Object3D | null = obj;
  while (cur) {
    if (!cur.visible) return false;
    cur = cur.parent;
  }
  return true;
};

/**
 * Rastreador de Suspense interno ao Canvas: mantém o estado de carregamento ativo
 * desde o download até a decodificação Meshopt e montagem efetiva das malhas 3D na GPU.
 */
const SuspenseFallbackTracker: React.FC<{ onPendingChange: (pending: boolean) => void }> = ({
  onPendingChange,
}) => {
  useEffect(() => {
    onPendingChange(true);
    return () => {
      onPendingChange(false);
    };
  }, [onPendingChange]);

  return null;
};

/**
 * Overlay visual de carregamento 3D em tempo real para todas as telas (Atlas, Sistemas, Dental, Anestesia, Patologias, Quiz)
 */
const ModelLoadingOverlay: React.FC<{
  isSuspensePending: boolean;
  soloToothMode: boolean;
  archesOnlyMode: boolean;
  teethLineupMode: boolean;
  quizSceneMode?: 'full_anatomy' | 'teeth_lineup' | 'instrument_3d';
  activeToothFdi: string;
}> = ({ isSuspensePending, soloToothMode, archesOnlyMode, teethLineupMode, quizSceneMode, activeToothFdi }) => {
  const { active, progress } = useProgress();
  const isVisible = active || isSuspensePending;
  const clampedProgress = Math.min(100, Math.max(0, Math.round(progress)));

  const title = quizSceneMode === 'instrument_3d'
    ? 'Carregando Instrumental Odontológico 3D...'
    : soloToothMode
    ? `Carregando Dente FDI ${activeToothFdi} em 3D...`
    : archesOnlyMode || teethLineupMode
    ? 'Carregando Arcadas Dentárias 3D...'
    : 'Carregando Atlas Craniofacial 3D...';

  const subtitle =
    clampedProgress >= 96 && isSuspensePending
      ? 'Decodificando geometria anatômica e preparando iluminação...'
      : 'Baixando malhas 3D otimizadas • salvo automaticamente no navegador';

  return (
    <Fade in={isVisible} timeout={{ enter: 120, exit: 280 }} unmountOnExit>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 115,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          background: 'radial-gradient(circle at center, rgba(8, 12, 17, 0.72) 0%, rgba(8, 12, 17, 0.42) 100%)',
          px: 2,
        }}
      >
        <Paper
          elevation={8}
          sx={{
            width: '100%',
            maxWidth: { xs: 285, sm: 340 },
            px: { xs: 2.2, sm: 3 },
            py: { xs: 2.2, sm: 2.6 },
            borderRadius: '16px',
            backgroundColor: 'rgba(13, 20, 30, 0.92)',
            backdropFilter: 'blur(14px)',
            border: '1px solid rgba(0, 201, 246, 0.28)',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.65), 0 0 24px rgba(0, 201, 246, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 1.4,
          }}
        >
          <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress
              variant={clampedProgress > 0 && clampedProgress < 100 ? 'determinate' : 'indeterminate'}
              value={clampedProgress}
              size={54}
              thickness={3.6}
              sx={{
                color: themeTokens.colors.brandCyan,
                filter: 'drop-shadow(0 0 8px rgba(0, 201, 246, 0.45))',
              }}
            />
            <ViewInArIcon
              sx={{
                position: 'absolute',
                fontSize: 24,
                color: '#38BDF8',
              }}
            />
          </Box>

          <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 0.7 }}>
              <Typography
                sx={{
                  fontSize: { xs: '0.82rem', sm: '0.88rem' },
                  fontWeight: 800,
                  color: '#F8FAFC',
                  textAlign: 'left',
                  lineHeight: 1.25,
                }}
              >
                {title}
              </Typography>
              {clampedProgress > 0 && (
                <Typography
                  sx={{
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    color: themeTokens.colors.brandCyan,
                    flexShrink: 0,
                  }}
                >
                  {clampedProgress}%
                </Typography>
              )}
            </Box>

            <LinearProgress
              variant={clampedProgress > 0 && clampedProgress < 100 ? 'determinate' : 'indeterminate'}
              value={clampedProgress}
              sx={{
                height: 6,
                borderRadius: 999,
                backgroundColor: 'rgba(148, 163, 184, 0.16)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 999,
                  background: 'linear-gradient(90deg, #0284C7 0%, #00C9F6 50%, #38BDF8 100%)',
                },
              }}
            />

            <Typography
              sx={{
                mt: 1,
                fontSize: { xs: '0.7rem', sm: '0.73rem' },
                color: themeTokens.colors.textSecondary,
                lineHeight: 1.35,
              }}
            >
              {subtitle}
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Fade>
  );
};

interface AnatomyViewer3DProps {
  soloToothMode?: boolean;
  archesOnlyMode?: boolean;
  teethLineupMode?: boolean;
  quizTargetId?: string | null;
  quizAnswered?: boolean;
  hideSelectionBadge?: boolean;
  hideCredits?: boolean;
  hideGizmo?: boolean;
  quizSceneMode?: 'full_anatomy' | 'teeth_lineup' | 'instrument_3d';
  quizInstrumentId?: string | null;
}

export const AnatomyViewer3D: React.FC<AnatomyViewer3DProps> = ({
  soloToothMode = false,
  archesOnlyMode = false,
  teethLineupMode = false,
  quizTargetId = null,
  quizAnswered = false,
  hideSelectionBadge = false,
  hideCredits = false,
  hideGizmo = false,
  quizSceneMode = 'full_anatomy',
  quizInstrumentId = null,
}) => {
  const {
    xrayMode,
    toothViewMode,
    hiddenStructureIds,
    unhideStructure,
    selectedStructureId,
    isolatedStructureId,
    setSelectedStructure,
    isolateStructure,
    infoPanelOpen,
    setInfoPanelOpen,
    surfaceExplorationMode,
    activeToothFdi,
  } = useAnatomyStore();

  const isCompactCanvas = useMediaQuery('(max-width: 899px), (max-height: 700px)');

  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const [isInteracting, setIsInteracting] = useState<boolean>(false);
  const [isModelLoading, setIsModelLoading] = useState<boolean>(false);

  // Armazena a coordenada inicial do ponteiro para distinguir clique estático de arraste para rotação
  const pointerDownPos = useRef<{ x: number; y: number; time: number } | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsInteracting(true);
    pointerDownPos.current = { x: e.clientX, y: e.clientY, time: Date.now() };
  };

  const handlePointerUp = () => {
    setIsInteracting(false);
  };

  // Desmarca ao pressionar a tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedStructureId) {
          setSelectedStructure(null);
          isolateStructure(null);
          setInfoPanelOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedStructureId, setSelectedStructure, isolateStructure, setInfoPanelOpen]);

  /**
   * Chamado quando o clique cai no espaço vazio (fora de qualquer malha do esqueleto).
   * Se o usuário arrastou para rotacionar (dist > 5px), NÃO desmarca.
   * Se foi um clique estático (dist <= 5px), desmarca a estrutura selecionada.
   */
  const handlePointerMissed = (e: MouseEvent) => {
    // Apenas responde ao botão primário (esquerdo)
    if (e.button !== 0) return;
    if (!pointerDownPos.current) return;

    const dx = e.clientX - pointerDownPos.current.x;
    const dy = e.clientY - pointerDownPos.current.y;
    const dist = Math.hypot(dx, dy);

    // Se houve arraste de rotação de câmera com OrbitControls, preserva a seleção intacta
    if (dist > 5) {
      return;
    }

    // Clique intencional no espaço vazio fora do esqueleto: desmarca
    if (selectedStructureId) {
      setSelectedStructure(null);
      isolateStructure(null);
      setInfoPanelOpen(false);
    }
  };

  const selectedStructure = selectedStructureId ? anatomicalStructures[selectedStructureId] : null;

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        position: 'relative',
        backgroundColor: xrayMode ? '#040d16' : '#0B0F14',
        overflow: 'hidden',
        touchAction: 'none',
        transition: 'background-color 0.4s ease',
        cursor: isInteracting ? 'grabbing' : 'grab',
      }}
    >
      <Canvas
        camera={{
          position: archesOnlyMode ? [7.5, 4.5, 9.5] : [11.5, 8.5, 15.5],
          fov: 42,
          near: 0.1,
          far: 100,
        }}
        dpr={[1, 1.5]}
        shadows
        gl={{
          antialias: true,
          preserveDrawingBuffer: true,
          powerPreference: 'high-performance',
        }}
        events={(store) => ({
          ...events(store),
          filter: (intersections) => intersections.filter((hit) => isObjectVisibleInHierarchy(hit.object)),
        })}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMissed={handlePointerMissed}
      >
        {/* Iluminação de Estúdio / Negatoscópio Radiográfico */}
        <SceneLighting xrayMode={xrayMode} />

        {/* Gerenciador de Animação e Presets de Câmera */}
        <CameraManager
          controlsRef={controlsRef}
          archesOnlyMode={archesOnlyMode}
          teethLineupMode={teethLineupMode}
        />

        {/* Rotação Livre 360° em todos os eixos sem travas restritivas */}
        <OrbitControls
          ref={controlsRef}
          makeDefault
          target={[0, teethLineupMode ? 1.0 : archesOnlyMode ? 0.3 : 1.2, 0]}
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

        {/* Gizmo de Orientação Anatômica XYZ (oculto automaticamente em telas compactas/mobile) */}
        {!hideGizmo && !isCompactCanvas && (
          <GizmoHelper alignment="bottom-left" margin={[74, 130]}>
            <GizmoViewport
              axisColors={['#EF4444', '#10B981', '#38BDF8']}
              labelColor="#FFFFFF"
            />
          </GizmoHelper>
        )}

        {/* Modelos Tridimensionais Interativos Dental Scope */}
        {quizSceneMode === 'instrument_3d' && quizInstrumentId ? (
          <Suspense fallback={<SuspenseFallbackTracker onPendingChange={setIsModelLoading} />}>
            <group position={[0, 0, 0]}>
              <DentalInstrument3D instrumentId={quizInstrumentId} />
            </group>
          </Suspense>
        ) : soloToothMode ? (
          <Suspense fallback={<SuspenseFallbackTracker onPendingChange={setIsModelLoading} />}>
            <DentalScopeTooth />
            <PathologyOverlays isSoloTooth={true} />
          </Suspense>
        ) : teethLineupMode ? (
          <Suspense fallback={<SuspenseFallbackTracker onPendingChange={setIsModelLoading} />}>
            <TeethLineup3D targetStructureId={quizTargetId} quizAnswered={quizAnswered} />
          </Suspense>
        ) : (
          <group position={[0, -0.2, 0]}>
            {/* Modelo Mestre Dental Scope (Crânio, Mandíbula, Dentes, Músculos, Neurovascular) */}
            <Suspense fallback={<SuspenseFallbackTracker onPendingChange={setIsModelLoading} />}>
              <DentalScopeModel archesOnlyMode={archesOnlyMode} />
            </Suspense>

            {/* Camada visual de patologias odontológicas */}
            <PathologyOverlays isSoloTooth={false} />

            {/* Marcador 3D de Acidentes Anatômicos de Superfície */}
            <SurfaceLandmarkMarker />
          </group>
        )}
      </Canvas>

      {/* Indicador Visual de Carregamento 3D em Tempo Real (Progresso % + Status) */}
      <ModelLoadingOverlay
        isSuspensePending={isModelLoading}
        soloToothMode={soloToothMode}
        archesOnlyMode={archesOnlyMode}
        teethLineupMode={teethLineupMode}
        quizSceneMode={quizSceneMode}
        activeToothFdi={activeToothFdi || '36'}
      />

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
            bottom: { xs: 92, sm: 98, lg: 84 },
            left: { xs: 10, sm: 16, lg: 20 },
            maxWidth: 'calc(100% - 20px)',
            zIndex: 100,
            backgroundColor: '#059669',
            color: '#FFFFFF',
            fontSize: { xs: '0.7rem', sm: '0.75rem' },
            fontWeight: 700,
            textTransform: 'none',
            borderRadius: '8px',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
            '&:hover': { backgroundColor: '#047857' },
          }}
        >
          {hiddenStructureIds.length} oculta(s) • Reexibir Tudo
        </Button>
      )}

      {/* Indicador HUD de Navegação (exibido apenas em desktops amplos para não colidir com controles mobile) */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          zIndex: 100,
          display: { xs: 'none', xl: 'block' },
          '@media (max-height: 700px)': {
            display: 'none',
          },
          backgroundColor: 'rgba(11, 15, 20, 0.78)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(41, 52, 66, 0.65)',
          borderRadius: '8px',
          px: 1.5,
          py: 0.75,
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
            fontSize: '0.78rem',
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
            fontSize: '0.7rem',
            fontWeight: 500,
            color: '#94A3B8',
            lineHeight: 1.3,
            mt: 0.15,
          }}
        >
          Roda ou pinça: zoom • botão direito: menu de ações
        </Typography>
      </Box>

      {/* Referência da Origem dos Modelos 3D (discreta no canto inferior direito) */}
      {!hideCredits && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            zIndex: 100,
            backgroundColor: 'rgba(11, 15, 20, 0.42)',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255, 255, 255, 0.04)',
            borderRadius: '5px',
            px: 1,
            py: 0.35,
            transition: 'opacity 0.2s ease',
            opacity: isInteracting ? 0.18 : 0.55,
            '&:hover': { opacity: 0.88 },
            display: { xs: 'none', md: 'block' },
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontFamily: themeTokens.typography.fontFamily,
              fontSize: '0.62rem',
              color: '#526071',
              display: 'flex',
              alignItems: 'center',
              gap: 0.4,
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
                color: '#64748B',
                textDecoration: 'none',
                fontWeight: 500,
                transition: 'color 0.15s ease',
                '&:hover': { textDecoration: 'underline', color: '#94A3B8' },
              }}
            >
              Dental Scope / BodyParts3D & Z-Anatomy (CC BY-SA 4.0)
            </Box>
          </Typography>
        </Box>
      )}

      {/* Badge Flutuante de Estrutura Selecionada com Ações Rápidas (Isolar, Info e Desmarcar) */}
      {selectedStructureId && !surfaceExplorationMode && !hideSelectionBadge && (
        <Paper
          elevation={4}
          sx={{
            position: 'absolute',
            bottom: { xs: 50, sm: 58, lg: 64 },
            left: '50%',
            transform: 'translateX(-50%)',
            maxWidth: 'calc(100% - 16px)',
            zIndex: 100,
            backgroundColor: 'rgba(15, 23, 42, 0.92)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(56, 189, 248, 0.45)',
            borderRadius: '24px',
            px: { xs: 1.1, sm: 1.7 },
            py: { xs: 0.45, sm: 0.65 },
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 0.6, sm: 1.0 },
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.55)',
            transition: 'opacity 0.2s ease',
            opacity: isInteracting ? 0.35 : 1.0,
          }}
        >
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#00C9F6', flexShrink: 0 }} />
          <Typography
            variant="caption"
            sx={{
              color: '#F8FAFC',
              fontWeight: 700,
              fontSize: { xs: '0.74rem', sm: '0.82rem' },
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minWidth: 0,
            }}
          >
            {selectedStructure?.name || selectedStructureId}
          </Typography>

          {!soloToothMode && !teethLineupMode && (
            <Chip
              icon={
                <HighlightIcon
                  sx={{
                    fontSize: '13px !important',
                    color: isolatedStructureId === selectedStructureId ? '#071018 !important' : '#FDE047 !important',
                  }}
                />
              }
              label={isolatedStructureId === selectedStructureId ? 'Restaurar' : 'Isolar'}
              size="small"
              onClick={() => isolateStructure(selectedStructureId)}
              sx={{
                height: 22,
                fontSize: '0.7rem',
                fontWeight: 700,
                flexShrink: 0,
                backgroundColor:
                  isolatedStructureId === selectedStructureId
                    ? themeTokens.colors.brandCyan
                    : 'rgba(250, 204, 21, 0.16)',
                color: isolatedStructureId === selectedStructureId ? '#071018' : '#FEF08A',
                border:
                  isolatedStructureId === selectedStructureId
                    ? `1px solid ${themeTokens.colors.brandCyan}`
                    : '1px solid rgba(250, 204, 21, 0.4)',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor:
                    isolatedStructureId === selectedStructureId
                      ? '#38DDF8'
                      : 'rgba(250, 204, 21, 0.28)',
                },
              }}
            />
          )}

          {!infoPanelOpen && (
            <Chip
              icon={<InfoOutlinedIcon sx={{ fontSize: '13px !important', color: '#38BDF8 !important' }} />}
              label="Info"
              size="small"
              onClick={() => setInfoPanelOpen(true)}
              sx={{
                height: 22,
                fontSize: '0.7rem',
                fontWeight: 700,
                flexShrink: 0,
                backgroundColor: 'rgba(0, 201, 246, 0.16)',
                color: '#38BDF8',
                border: '1px solid rgba(0, 201, 246, 0.38)',
                cursor: 'pointer',
              }}
            />
          )}

          {/* No celular exibe botão compacto X; em telas maiores exibe Chip Desmarcar */}
          <IconButton
            size="small"
            onClick={() => {
              setSelectedStructure(null);
              isolateStructure(null);
              setInfoPanelOpen(false);
            }}
            sx={{
              display: { xs: 'inline-flex', sm: 'none' },
              p: 0.35,
              flexShrink: 0,
              backgroundColor: 'rgba(239, 68, 68, 0.18)',
              color: '#FCA5A5',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.35)' },
            }}
          >
            <CloseIcon sx={{ fontSize: 13 }} />
          </IconButton>

          <Tooltip title="Desmarcar seleção (ou clique no espaço vazio / pressione Esc)">
            <Chip
              label="Desmarcar"
              size="small"
              onDelete={() => {
                setSelectedStructure(null);
                isolateStructure(null);
                setInfoPanelOpen(false);
              }}
              onClick={() => {
                setSelectedStructure(null);
                isolateStructure(null);
                setInfoPanelOpen(false);
              }}
              sx={{
                display: { xs: 'none', sm: 'inline-flex' },
                height: 22,
                fontSize: '0.7rem',
                fontWeight: 600,
                flexShrink: 0,
                backgroundColor: 'rgba(239, 68, 68, 0.18)',
                color: '#FCA5A5',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(239, 68, 68, 0.35)',
                },
                '& .MuiChip-deleteIcon': {
                  color: '#FCA5A5',
                  fontSize: 14,
                },
              }}
            />
          </Tooltip>
        </Paper>
      )}
    </Box>
  );
};
