import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Chip,
  Divider,
} from '@mui/material';

// EXCLUSIVAMENTE ÍCONES DO MATERIAL UI
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import ContrastIcon from '@mui/icons-material/Contrast';
import FlareIcon from '@mui/icons-material/Flare';
import StraightenIcon from '@mui/icons-material/Straighten';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import { AnatomyViewer3D } from '@/components/3d/AnatomyViewer3D';
import { CameraControls } from '@/components/controls/CameraControls';
import { OdontogramFDI } from './OdontogramFDI';
import { useAnatomyStore } from '@/stores/useAnatomyStore';
import { permanentTeethData, internalToothLayers } from '@/data/dental/teethData';
import { deciduousTeethData } from '@/data/dental/deciduousTeethData';
import { ToothViewMode, WisdomToothState, AlignmentState } from '@/types/dental';
import { themeTokens } from '@/theme/tokens';

export const DentalAtlasView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'solo_tooth' | 'surface' | 'arches'>('solo_tooth');
  const {
    activeToothFdi,
    toothViewMode,
    wisdomToothState,
    alignmentState,
    surfaceExplorationMode,
    setActiveToothFdi,
    setSelectedStructure,
    setToothViewMode,
    setWisdomToothState,
    setAlignmentState,
    setSurfaceExplorationMode,
    setInfoPanelOpen,
    setActivePathology,
  } = useAnatomyStore();

  // Ao entrar em Anatomia Dental & FDI, garantir que patologias não apareçam no dente ou arcada
  // e ao sair da aba odontológica, restaurar visão anatômica completa
  React.useEffect(() => {
    setActivePathology(null);
    return () => {
      setSurfaceExplorationMode(false);
    };
  }, [setActivePathology, setSurfaceExplorationMode]);

  const currentTooth = (permanentTeethData[activeToothFdi] as any) || (deciduousTeethData[activeToothFdi] as any) || permanentTeethData['36'];

  const handleTabChange = (_: React.SyntheticEvent, val: 'solo_tooth' | 'surface' | 'arches') => {
    setActiveTab(val);
    const isDeciduous = Boolean(deciduousTeethData[activeToothFdi]);
    const nextFdi = val !== 'solo_tooth' && isDeciduous ? '36' : activeToothFdi;

    if (val !== 'solo_tooth' && isDeciduous) {
      setActiveToothFdi('36');
      setSelectedStructure('dente_36');
    }

    if (val === 'surface') {
      setSurfaceExplorationMode(true, nextFdi);
      setInfoPanelOpen(false); // Fecha o painel de detalhes lateral pois a exploração de superfície tem painel próprio
    } else {
      setSurfaceExplorationMode(false);
    }
  };

  // Se o usuário fechar o painel de superfície 3D, refletir na tab
  React.useEffect(() => {
    if (activeTab === 'surface') {
      if (!surfaceExplorationMode) {
        setActiveTab('solo_tooth');
      }
    }
  }, [surfaceExplorationMode, activeTab]);

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Barra de Ferramentas Odontológicas */}
      <Paper
        elevation={0}
        sx={{
          px: { xs: 1, sm: 1.5 },
          py: { xs: 0.65, lg: 1 },
          '@media (max-height: 800px)': {
            py: 0.55,
          },
          backgroundColor: themeTokens.colors.bgSecondary,
          borderBottom: `1px solid ${themeTokens.colors.borderSubtle}`,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: { xs: 0.8, lg: 1.2 },
          zIndex: 10,
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, maxWidth: '100%', minWidth: 0 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              minHeight: 32,
              maxWidth: '100%',
              '& .MuiTab-root': {
                minHeight: 32,
                py: 0.3,
                px: { xs: 1, sm: 1.4 },
                fontSize: { xs: '0.74rem', sm: '0.78rem', xl: '0.82rem' },
                fontWeight: 700,
              },
            }}
          >
            <Tab value="solo_tooth" label={`Dente FDI ${activeToothFdi}`} />
            <Tab
              value="surface"
              label="Dentro do Dente (Faces)"
              sx={{
                '&.Mui-selected': {
                  color: '#818CF8 !important',
                },
              }}
            />
            <Tab value="arches" label="Arcadas & Alinhamento" />
          </Tabs>

          <Chip
            label={currentTooth.name}
            size="small"
            sx={{
              backgroundColor: 'rgba(0, 201, 246, 0.12)',
              color: themeTokens.colors.brandCyan,
              border: `1px solid ${themeTokens.colors.brandCyan}`,
              fontWeight: 700,
              flexShrink: 0,
              display: { xs: 'none', xl: 'flex' },
            }}
          />
        </Box>

        {activeTab === 'solo_tooth' ? (
          /* Modos de visualização do dente: Externo, Corte Seccional, Raio X, Isolamento Pulpar */
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, overflowX: 'auto', maxWidth: '100%' }}>
            <Typography variant="caption" sx={{ color: themeTokens.colors.textMuted, fontWeight: 600, display: { xs: 'none', xl: 'block' } }}>
              Modo:
            </Typography>
            <ButtonGroup
              size="small"
              variant="outlined"
              sx={{
                flexShrink: 0,
                '& .MuiButton-root': {
                  fontSize: { xs: '0.7rem', sm: '0.74rem' },
                  px: { xs: 0.9, sm: 1.2 },
                  py: 0.35,
                  whiteSpace: 'nowrap',
                },
              }}
            >
              <Button
                variant={toothViewMode === 'external' ? 'contained' : 'outlined'}
                onClick={() => setToothViewMode('external')}
                startIcon={<ViewInArIcon sx={{ fontSize: '15px !important' }} />}
              >
                Externo
              </Button>
              <Button
                variant={toothViewMode === 'cross_section' ? 'contained' : 'outlined'}
                onClick={() => setToothViewMode('cross_section')}
                startIcon={<ContentCutIcon sx={{ fontSize: '15px !important' }} />}
              >
                Corte Sagital
              </Button>
              <Button
                variant={toothViewMode === 'xray' ? 'contained' : 'outlined'}
                onClick={() => setToothViewMode('xray')}
                startIcon={<ContrastIcon sx={{ fontSize: '15px !important' }} />}
              >
                Translúcido
              </Button>
              <Button
                variant={toothViewMode === 'pulp_isolation' ? 'contained' : 'outlined'}
                onClick={() => setToothViewMode('pulp_isolation')}
                startIcon={<FlareIcon sx={{ fontSize: '15px !important' }} />}
              >
                Câmara & Canais
              </Button>
            </ButtonGroup>
          </Box>
        ) : activeTab === 'surface' ? null : (
          /* Variações didáticas de Terceiro Molar (Siso) e Apinhamento / Diastema */
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              width: { xs: '100%', md: 'auto' },
              pt: { xs: 1.1, md: 0.5 },
              pb: { xs: 0.2, md: 0 },
              overflow: 'visible',
            }}
          >
            <FormControl size="small" sx={{ flex: { xs: 1, md: 'none' }, minWidth: { xs: 0, sm: 162 } }}>
              <InputLabel sx={{ fontSize: '0.73rem' }}>Posicionamento do Siso</InputLabel>
              <Select
                value={wisdomToothState}
                label="Posicionamento do Siso"
                onChange={(e) => setWisdomToothState(e.target.value as WisdomToothState)}
                sx={{ height: 34, fontSize: { xs: '0.72rem', sm: '0.76rem' } }}
              >
                <MenuItem value="erupted">Normal / Erupionado</MenuItem>
                <MenuItem value="mesioangular">Impactação Mesioangular</MenuItem>
                <MenuItem value="horizontal">Impactação Horizontal</MenuItem>
                <MenuItem value="impacted">Incluso Ósseo</MenuItem>
                <MenuItem value="absent">Ausente / Agenesia</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ flex: { xs: 1, md: 'none' }, minWidth: { xs: 0, sm: 162 } }}>
              <InputLabel sx={{ fontSize: '0.73rem' }}>Alinhamento Dental</InputLabel>
              <Select
                value={alignmentState}
                label="Alinhamento Dental"
                onChange={(e) => setAlignmentState(e.target.value as AlignmentState)}
                sx={{ height: 34, fontSize: { xs: '0.72rem', sm: '0.76rem' } }}
              >
                <MenuItem value="aligned">Alinhamento Normal</MenuItem>
                <MenuItem value="crowded_anterior">Apinhamento Anterior</MenuItem>
                <MenuItem value="diastema_central">Diastema Interincisal</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        )}
      </Paper>

      {/* Área Central: Visualizador 3D com Odontograma Superior/Inferior */}
      <Box sx={{ flex: 1, position: 'relative', minHeight: 0 }}>
        <AnatomyViewer3D
          soloToothMode={activeTab === 'solo_tooth'}
          archesOnlyMode={activeTab === 'arches'}
          hideCredits={true}
          hideGizmo={true}
        />
        <CameraControls />

        {/* HUD Informativo quando em modo Arcadas Completas */}
        {activeTab === 'arches' && (
          <Paper
            elevation={3}
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              zIndex: 100,
              display: { xs: 'none', md: 'block' },
              backgroundColor: 'rgba(11, 15, 20, 0.88)',
              backdropFilter: 'blur(8px)',
              border: `1px solid ${themeTokens.colors.borderSubtle}`,
              borderRadius: 1.5,
              p: 1.2,
              maxWidth: 280,
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: themeTokens.colors.brandCyan, mb: 0.3, fontSize: '0.76rem' }}>
              Arcadas Dentárias & Gengiva
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: themeTokens.colors.textSecondary,
                display: 'block',
                mb: 0.5,
                '@media (max-height: 780px)': { display: 'none' },
              }}
            >
              Visualização isolada da dentição completa e tecidos gengivais (sem ossos craniofaciais).
            </Typography>
            <Typography variant="caption" sx={{ color: '#38BDF8', fontWeight: 700, display: 'block', fontSize: '0.72rem' }}>
              Posicionamento do Siso:{' '}
              <span style={{ color: '#F59E0B' }}>
                {wisdomToothState === 'erupted'
                  ? 'Erupionado / Normal'
                  : wisdomToothState === 'mesioangular'
                  ? 'Impactação Mesioangular'
                  : wisdomToothState === 'horizontal'
                  ? 'Impactação Horizontal'
                  : wisdomToothState === 'impacted'
                  ? 'Incluso Ósseo'
                  : 'Ausente (Agenesia)'}
              </span>
            </Typography>
          </Paper>
        )}

        {/* Camadas Internas do Dente (Legenda Interativa quando em modo Solo Tooth) */}
        {activeTab === 'solo_tooth' && (
          <Paper
            elevation={3}
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              zIndex: 100,
              display: { xs: 'none', sm: 'block' },
              backgroundColor: themeTokens.colors.bgOverlay,
              backdropFilter: 'blur(8px)',
              border: `1px solid ${themeTokens.colors.borderSubtle}`,
              borderRadius: 1.5,
              p: 1.2,
              maxWidth: 245,
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: themeTokens.colors.brandCyan, mb: 0.6, fontSize: '0.75rem' }}>
              Camadas Histológicas
            </Typography>
            <Stack spacing={0.55}>
              {internalToothLayers.map((layer) => (
                <Box key={layer.id} sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.8 }}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '3px',
                      backgroundColor: layer.colorHex,
                      border: '1px solid rgba(255,255,255,0.2)',
                      mt: 0.3,
                      flexShrink: 0,
                    }}
                  />
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: themeTokens.colors.textPrimary, display: 'block', lineHeight: 1.2, fontSize: '0.72rem' }}>
                      {layer.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: themeTokens.colors.textMuted,
                        fontSize: '0.65rem',
                        display: 'block',
                        '@media (max-height: 800px)': { display: 'none' },
                      }}
                    >
                      {layer.thicknessMm}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Paper>
        )}
      </Box>

      {/* Odontograma FDI Compacto na Base */}
      <Box
        sx={{
          px: { xs: 0.8, sm: 1.2 },
          py: { xs: 0.6, sm: 0.9 },
          '@media (max-height: 800px)': {
            py: 0.5,
          },
          backgroundColor: themeTokens.colors.bgSecondary,
          borderTop: `1px solid ${themeTokens.colors.borderSubtle}`,
          flexShrink: 0,
        }}
      >
        <OdontogramFDI allowDeciduous={activeTab === 'solo_tooth'} />
      </Box>
    </Box>
  );
};
