import React, { useEffect } from 'react';
import { Box, Paper, Typography, Chip, Stack } from '@mui/material';
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
    { id: 'osso_frontal', label: 'Frontal' },
    { id: 'osso_parietal', label: 'Parietal' },
    { id: 'osso_temporal', label: 'Temporal' },
    { id: 'osso_occipital', label: 'Occipital' },
    { id: 'osso_esfenoide', label: 'Esfenoide' },
    { id: 'osso_etmoide', label: 'Etmoide' },
    { id: 'osso_zigomatico', label: 'Zigomático' },
    { id: 'osso_nasal', label: 'Nasal' },
    { id: 'seio_maxilar', label: 'Seio Maxilar' },
    { id: 'neurocranio', label: 'Calvária Geral' },
  ],
  muscular: [
    { id: 'masseter', label: 'Masseter' },
    { id: 'temporal_m', label: 'Temporal' },
    { id: 'pterigoideo_lateral', label: 'Pterigóideo Lateral' },
    { id: 'pterigoideo_medial', label: 'Pterigóideo Medial' },
    { id: 'musculo_orbicular_boca', label: 'Orbicular da Boca' },
    { id: 'musculo_bucinador', label: 'Bucinador' },
  ],
  nervous: [
    { id: 'nervo_alveolar_inferior', label: 'Nervo Alveolar Inferior' },
    { id: 'nervo_maxilar_v2', label: 'Nervo Maxilar (V2)' },
    { id: 'nervo_lingual', label: 'Nervo Lingual' },
    { id: 'nervo_mentual', label: 'Nervo Mentual' },
    { id: 'nervo_trigemeo', label: 'Nervo Trigêmeo' },
  ],
  vascular: [
    { id: 'arteria_maxilar', label: 'Artéria Maxilar' },
    { id: 'arteria_facial', label: 'Artéria Facial' },
  ],
  oral_tissue: [
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
    toggleLayer,
    layers,
    resetCamera,
    setActivePathology,
  } = useAnatomyStore();

  useEffect(() => {
    // Garantir que nenhuma patologia continue ativa no sistema anatômico
    setActivePathology(null);

    // Ativar modo de isolamento e foco anatômico do sistema selecionado
    setFocusedSystem(systemType);
    setSelectedStructure(initialStructureId);
    resetCamera();

    return () => {
      setFocusedSystem(null);
    };
  }, [initialStructureId, systemType, setFocusedSystem, setSelectedStructure, resetCamera, setActivePathology]);

  const structuresList = SYSTEM_STRUCTURES[systemType] || [];

  return (
    <Box sx={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* Barra de Seleção Rápida de Estruturas do Sistema */}
      {structuresList.length > 0 && (
        <Paper
          elevation={4}
          onWheel={(e) => {
            if (e.deltaY !== 0) {
              e.currentTarget.scrollLeft += e.deltaY;
            }
          }}
          sx={{
            position: 'absolute',
            top: 14,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            backgroundColor: 'rgba(15, 23, 42, 0.94)',
            backdropFilter: 'blur(16px)',
            border: `1px solid ${themeTokens.colors.borderSubtle}`,
            borderRadius: '24px',
            px: 2,
            py: 0.6,
            display: 'flex',
            alignItems: 'center',
            gap: 0.8,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
            maxWidth: 'calc(100% - 400px)',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          <Typography
            sx={{
              fontSize: '0.74rem',
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
                  setInfoPanelOpen(true);
                }}
                sx={{
                  fontWeight: 700,
                  fontSize: '0.78rem',
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

      {/* Controles Flutuantes de Camadas (posicionados abaixo da barra de estruturas, recolhidos por padrão) */}
      <LayerControls top={66} defaultExpanded={false} />

      {/* Controles Flutuantes de Câmera */}
      <CameraControls />
    </Box>
  );
};
