import React, { useEffect } from 'react';
import { Box, Paper, Typography, Chip, Slider, IconButton, Tooltip } from '@mui/material';
import OpenWithIcon from '@mui/icons-material/OpenWith';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { AnatomyViewer3D } from '@/components/3d/AnatomyViewer3D';
import { CameraControls } from '@/components/controls/CameraControls';
import { LayerControls } from '@/components/controls/LayerControls';
import { useAnatomyStore } from '@/stores/useAnatomyStore';
import { AnatomicalCategory } from '@/types/anatomy';
import { themeTokens } from '@/theme/tokens';

const SYSTEM_STRUCTURES: Record<string, { id: string; label: string }[]> = {
  skeletal: [
    { id: 'mandibula', label: 'Mandíbula' },
    { id: 'maxila', label: 'Maxila' },
    { id: 'osso_palatino', label: 'Palatino' },
    { id: 'osso_zigomatico', label: 'Zigomático' },
    { id: 'osso_frontal', label: 'Frontal' },
    { id: 'osso_parietal', label: 'Parietal' },
    { id: 'osso_temporal', label: 'Temporal' },
    { id: 'osso_occipital', label: 'Occipital' },
    { id: 'osso_esfenoide', label: 'Esfenoide' },
    { id: 'osso_etmoide', label: 'Etmoide' },
    { id: 'osso_nasal', label: 'Nasal' },
    { id: 'osso_lacrimal', label: 'Lacrimal' },
    { id: 'osso_vomer', label: 'Vômer' },
    { id: 'concha_nasal_inferior', label: 'Concha Nasal Inf.' },
    { id: 'osso_hioide', label: 'Hioide' },
    { id: 'seio_maxilar', label: 'Seio Maxilar' },
    { id: 'seio_frontal', label: 'Seio Frontal' },
    { id: 'seio_esfenoidal', label: 'Seio Esfenoidal' },
  ],
  muscular: [
    { id: 'masseter', label: 'Masseter' },
    { id: 'temporal_m', label: 'Temporal' },
    { id: 'pterigoideo_lateral', label: 'Pterigóideo Lateral' },
    { id: 'pterigoideo_medial', label: 'Pterigóideo Medial' },
    { id: 'musculo_orbicular_boca', label: 'Orbicular da Boca' },
    { id: 'musculo_bucinador', label: 'Bucinador' },
    { id: 'musculo_mentual', label: 'Mentual' },
  ],
  nervous: [
    { id: 'nervo_alveolar_inferior', label: 'Alveolar Inferior' },
    { id: 'nervo_lingual', label: 'Lingual' },
    { id: 'nervo_bucal', label: 'Bucal' },
    { id: 'nervo_mentual', label: 'Mentual' },
    { id: 'nervo_maxilar_v2', label: 'Maxilar (V2)' },
    { id: 'nervo_palatino_maior', label: 'Palatino Maior' },
    { id: 'nervo_nasopalatino', label: 'Nasopalatino' },
    { id: 'nervo_trigemeo', label: 'Trigêmeo (NC V)' },
    { id: 'nervo_facial', label: 'Facial (NC VII)' },
    { id: 'nervo_hipoglosso', label: 'Hipoglosso (NC XII)' },
  ],
  vascular: [
    { id: 'arteria_maxilar', label: 'Artéria Maxilar' },
    { id: 'arteria_alveolar_inferior', label: 'Art. Alveolar Inferior' },
    { id: 'arteria_facial', label: 'Artéria Facial' },
    { id: 'plexo_pterigoideo', label: 'Plexo Pterigóideo' },
  ],
  oral_tissue: [
    { id: 'lingua', label: 'Língua' },
    { id: 'uvula', label: 'Úvula Palatina' },
    { id: 'gengiva_inserida', label: 'Gengiva Inserida' },
    { id: 'ligamento_periodontal', label: 'Ligamento Periodontal' },
  ],
};

interface SystemFocusViewProps {
  systemType: AnatomicalCategory;
  title: string;
  subtitle: string;
  initialStructureId: string;
}

export const SystemFocusView: React.FC<SystemFocusViewProps> = ({
  systemType,
  title,
  subtitle,
  initialStructureId,
}) => {
  const {
    selectedStructureId,
    setSelectedStructure,
    setInfoPanelOpen,
    infoPanelOpen,
    setFocusedSystem,
    explosionFactor,
    setExplosionFactor,
    resetCamera,
    setActivePathology,
  } = useAnatomyStore();

  useEffect(() => {
    // Garantir que nenhuma patologia continue ativa no sistema anatômico
    setActivePathology(null);

    // Limpar isolamentos ou ocultações residuais do Atlas 3D e garantir que o sistema focado esteja sempre 100% ativo
    useAnatomyStore.setState((state) => ({
      isolatedStructureId: null,
      hiddenStructureIds: [],
      layers: {
        ...state.layers,
        [systemType]: true,
        dental: true,
        skeletal: true,
      },
      opacities: {
        ...state.opacities,
        [systemType]: 1.0,
      },
    }));

    // Ativar modo de isolamento e foco anatômico do sistema selecionado
    setFocusedSystem(systemType);
    setSelectedStructure(initialStructureId);
    resetCamera();

    return () => {
      setFocusedSystem(null);
      setExplosionFactor(0);
    };
  }, [initialStructureId, systemType, setFocusedSystem, setSelectedStructure, resetCamera, setActivePathology, setExplosionFactor]);

  const structuresList = SYSTEM_STRUCTURES[systemType] || [];

  return (
    <Box sx={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* Barra de Seleção Rápida de Estruturas do Sistema */}
      {structuresList.length > 0 && (
        <Paper
          elevation={4}
          sx={{
            position: 'absolute',
            top: { xs: 50, md: 12 },
            left: { xs: 10, md: '50%' },
            right: { xs: 10, md: 'auto' },
            transform: { xs: 'none', md: 'translateX(-50%)' },
            zIndex: 1000,
            backgroundColor: 'rgba(15, 23, 42, 0.94)',
            backdropFilter: 'blur(16px)',
            border: `1px solid ${themeTokens.colors.borderSubtle}`,
            borderRadius: { xs: '12px', md: '16px' },
            px: { xs: 1, sm: 1.4 },
            py: 0.55,
            display: 'flex',
            flexWrap: { xs: 'nowrap', md: 'wrap' },
            alignItems: 'center',
            justifyContent: { xs: 'flex-start', md: 'center' },
            gap: 0.55,
            overflowX: { xs: 'auto', md: 'hidden' },
            overflowY: { xs: 'hidden', md: 'auto' },
            maxHeight: { xs: 'none', md: 72, xl: 105 },
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
            maxWidth: { xs: 'none', md: 'calc(100% - 350px)', lg: 'min(640px, calc(100% - 380px))' },
            scrollbarWidth: { xs: 'none', md: 'thin' },
            '&::-webkit-scrollbar': { display: { xs: 'none', md: 'block' }, height: 4, width: 4 },
          }}
        >
          <Typography
            sx={{
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#94A3B8',
              mr: 0.5,
              whiteSpace: 'nowrap',
              flexShrink: 0,
              display: { xs: 'none', sm: 'block' },
            }}
          >
            Focar:
          </Typography>
          {structuresList.map((st) => {
            const isSelected = selectedStructureId === st.id;
            return (
              <Chip
                key={st.id}
                label={st.label}
                size="small"
                onClick={() => {
                  setSelectedStructure(st.id);
                }}
                sx={{
                  fontWeight: 700,
                  fontSize: '0.73rem',
                  height: '26px',
                  cursor: 'pointer',
                  flexShrink: 0,
                  backgroundColor: isSelected
                    ? 'rgba(0, 201, 246, 0.22)'
                    : 'rgba(255, 255, 255, 0.05)',
                  color: isSelected ? themeTokens.colors.brandCyan : '#CBD5E1',
                  border: isSelected
                    ? `1px solid ${themeTokens.colors.brandCyan}`
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  transition: 'all 0.16s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 201, 246, 0.15)',
                    color: themeTokens.colors.brandCyan,
                  },
                }}
              />
            );
          })}
        </Paper>
      )}

      {/* Visualizador 3D com a câmera livre e iluminação clínica */}
      <AnatomyViewer3D />

      {/* Controles Flutuantes de Camadas (alinhados no topo junto à barra Focar, recolhidos por padrão) */}
      <LayerControls top={12} defaultExpanded={false} />

      {/* Controle Rápido Dedicado de Dissecação 3D (Vista Explodida) no Sistema Esquelético (em telas compactas/mobile fica apenas dentro de Camadas Anatômicas) */}
      {systemType === 'skeletal' && (
        <Paper
          elevation={4}
          sx={{
            display: { xs: 'none', lg: 'block' },
            position: 'absolute',
            bottom: 48,
            right: 16,
            zIndex: 1000,
            width: 235,
            backgroundColor: 'rgba(15, 23, 42, 0.92)',
            backdropFilter: 'blur(12px)',
            border:
              explosionFactor > 0
                ? `1px solid ${themeTokens.colors.brandCyan}`
                : `1px solid ${themeTokens.colors.borderSubtle}`,
            borderRadius: '12px',
            px: { xs: 1.1, sm: 1.5 },
            py: { xs: 0.7, sm: 1.0 },
            boxShadow: themeTokens.shadows.elevated,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
              <OpenWithIcon sx={{ fontSize: '0.95rem', color: themeTokens.colors.brandCyan }} />
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#F8FAFC' }}>
                Vista Explodida (Crânio)
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
              <Typography
                sx={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: themeTokens.colors.brandCyan,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {Math.round(explosionFactor * 100)}%
              </Typography>
              {explosionFactor > 0 && (
                <Tooltip title="Remontar crânio (0%)">
                  <IconButton
                    size="small"
                    onClick={() => setExplosionFactor(0)}
                    sx={{ p: 0.2, color: themeTokens.colors.brandCyan }}
                  >
                    <RestartAltIcon sx={{ fontSize: '0.9rem' }} />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>
          <Slider
            size="small"
            value={Math.round(explosionFactor * 100)}
            min={0}
            max={100}
            step={1}
            onChange={(_, val) => setExplosionFactor((val as number) / 100)}
            sx={{
              color: themeTokens.colors.brandCyan,
              height: 4,
              py: 0.8,
              '& .MuiSlider-thumb': { width: 12, height: 12 },
            }}
          />
        </Paper>
      )}

      {/* Controles Flutuantes de Câmera */}
      <CameraControls />
    </Box>
  );
};
