import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Alert,
  Divider,
  Stack,
  Button,
  ButtonGroup,
  CircularProgress,
} from '@mui/material';

// EXCLUSIVAMENTE ÍCONES DO MATERIAL UI
import HealingIcon from '@mui/icons-material/Healing';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import ContrastIcon from '@mui/icons-material/Contrast';
import FlareIcon from '@mui/icons-material/Flare';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import StopIcon from '@mui/icons-material/Stop';

import { useAnatomyStore } from '@/stores/useAnatomyStore';
import { oralPathologies } from '@/data/pathologies/pathologiesData';
import { AnatomyViewer3D } from '@/components/3d/AnatomyViewer3D';
import { CameraControls } from '@/components/controls/CameraControls';
import { ttsService } from '@/services/ttsService';
import { themeTokens } from '@/theme/tokens';

export const PathologiesView: React.FC = () => {
  const {
    activePathologyId,
    activeToothFdi,
    toothViewMode,
    setToothViewMode,
    layers,
    toggleLayer,
    setActivePathology,
    setActiveToothFdi,
    setSelectedStructure,
    setInfoPanelOpen,
    setSurfaceExplorationMode,
  } = useAnatomyStore();

  const selectedPathology = activePathologyId ? oralPathologies[activePathologyId] : oralPathologies['carie_dentaria'];
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsLoading, setTtsLoading] = useState(false);

  // Inicializar patologia padrão ao entrar e limpar ao sair de Patologias
  useEffect(() => {
    setInfoPanelOpen(false);
    setSurfaceExplorationMode(false);
    setSelectedStructure(null);
    if (!useAnatomyStore.getState().activePathologyId) {
      setActivePathology('carie_dentaria');
    }

    return () => {
      ttsService.stop();
      setActivePathology(null);
      setSelectedStructure(null);
    };
  }, [setActivePathology, setInfoPanelOpen, setSurfaceExplorationMode, setSelectedStructure]);

  // Interromper áudio ao alternar patologia
  useEffect(() => {
    ttsService.stop();
    setIsSpeaking(false);
    setTtsLoading(false);
  }, [selectedPathology?.id]);

  const handleListenPathology = useCallback(() => {
    if (!selectedPathology) return;
    if (isSpeaking) {
      ttsService.stop();
      setIsSpeaking(false);
      setTtsLoading(false);
      return;
    }

    const stagesText = (selectedPathology.stages || [])
      .map((s) => `Estágio ${s.stage}, ${s.title}: ${s.description}`)
      .join(' ');

    const textParts = [
      `${selectedPathology.name}.`,
      stagesText,
      selectedPathology.etiology?.length ? `Etiologia principal: ${selectedPathology.etiology.join('; ')}.` : '',
      selectedPathology.clinicalSigns?.length
        ? `Sinais e sintomas clínicos: ${selectedPathology.clinicalSigns.join('; ')}.`
        : '',
      selectedPathology.treatmentOptions?.length
        ? `Conduta clínica e tratamento: ${selectedPathology.treatmentOptions.join('; ')}.`
        : '',
    ]
      .filter(Boolean)
      .join(' ');

    setTtsLoading(true);
    ttsService.speak({
      audioId: `patologia_${selectedPathology.id}`,
      text: textParts,
      onStart: () => {
        setIsSpeaking(true);
        setTtsLoading(false);
      },
      onEnd: () => {
        setIsSpeaking(false);
        setTtsLoading(false);
      },
      onError: () => {
        setIsSpeaking(false);
        setTtsLoading(false);
      },
    });
  }, [selectedPathology, isSpeaking]);

  // Extrair dentes afetados pela patologia selecionada
  const affectedTeeth = (selectedPathology?.affectedStructures || [])
    .filter((s) => s.startsWith('dente_'))
    .map((s) => s.replace('dente_', ''));

  const isGingivalOrMucosal =
    selectedPathology?.id === 'gengivite' ||
    selectedPathology?.id === 'periodontite' ||
    selectedPathology?.id === 'afta_oral' ||
    selectedPathology?.id === 'lingua_geografica';

  const isToothPathology = !isGingivalOrMucosal && affectedTeeth.length > 0;

  // Ao trocar de patologia, focar automaticamente no Dente 3D Isolado (para Cárie, Pulpite e Abscesso)
  // e ajustar as camadas (ocultando músculos para expor a gengiva em gengivite/periodontite)
  useEffect(() => {
    if (isGingivalOrMucosal) {
      if (selectedPathology?.id === 'gengivite' || selectedPathology?.id === 'periodontite') {
        useAnatomyStore.setState((state) => ({
          layers: {
            ...state.layers,
            oral_tissue: true,
            dental: true,
            skeletal: true,
            muscular: false,
            nervous: false,
            vascular: false,
            pathologies: false,
          },
        }));
      } else {
        if (layers.oral_tissue === false) toggleLayer('oral_tissue');
        if (layers.dental === false) toggleLayer('dental');
      }
    } else if (isToothPathology) {
      const primaryTooth = affectedTeeth[0] || '36';
      setActiveToothFdi(primaryTooth);
      if (selectedPathology?.id === 'pulpite') {
        setToothViewMode('pulp_isolation');
      } else if (selectedPathology?.id === 'abscesso_periapical') {
        setToothViewMode('cross_section');
      } else {
        setToothViewMode('external');
      }
    }
    setInfoPanelOpen(false);
  }, [selectedPathology?.id]);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: { xs: 'column-reverse', md: 'row' },
        overflow: 'hidden',
      }}
    >
      {/* Coluna Esquerda: Catálogo Científico de Patologias */}
      <Box
        sx={{
          width: { xs: '100%', md: 350, lg: 400, xl: 460 },
          flex: { xs: 1, md: 'none' },
          minHeight: 0,
          height: { xs: 'auto', md: '100%' },
          overflowY: 'auto',
          backgroundColor: themeTokens.colors.bgSecondary,
          borderRight: { xs: 'none', md: `1px solid ${themeTokens.colors.borderSubtle}` },
          p: { xs: 1.6, sm: 2, lg: 2.5 },
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 1.8, md: 2.2 },
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: themeTokens.colors.textPrimary,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <HealingIcon sx={{ color: '#E11D48' }} />
            Patologias Odontológicas
          </Typography>
          <Typography variant="body2" sx={{ color: themeTokens.colors.textMuted, mt: 0.5 }}>
            Modelos didáticos de progressão tecidual, diagnóstico diferencial e condutas baseadas em evidências.
          </Typography>
        </Box>

        {/* Seleção de Patologias */}
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {Object.values(oralPathologies).map((p) => {
            const isSelected = selectedPathology.id === p.id;
            return (
              <Chip
                key={p.id}
                label={p.name}
                onClick={() => {
                  setActivePathology(p.id);
                  setInfoPanelOpen(false);
                }}
                color={isSelected ? 'error' : 'default'}
                variant={isSelected ? 'filled' : 'outlined'}
                sx={{
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  borderColor: isSelected ? '#E11D48' : themeTokens.colors.borderSubtle,
                }}
              />
            );
          })}
        </Stack>

        <Divider sx={{ borderColor: themeTokens.colors.borderSubtle }} />

        {/* Detalhes Clínicos da Patologia Selecionada */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: themeTokens.colors.textPrimary }}>
              {selectedPathology.name}
            </Typography>
            <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#E11D48' }}>
              {selectedPathology.scientificName} • Categoria: {selectedPathology.category.toUpperCase()}
            </Typography>
            <Button
              variant={isSpeaking ? 'contained' : 'outlined'}
              size="small"
              fullWidth
              onClick={handleListenPathology}
              disabled={ttsLoading}
              startIcon={
                ttsLoading ? (
                  <CircularProgress size={16} sx={{ color: themeTokens.colors.brandCyan }} />
                ) : isSpeaking ? (
                  <StopIcon fontSize="small" />
                ) : (
                  <VolumeUpIcon fontSize="small" />
                )
              }
              sx={{
                mt: 1.2,
                fontSize: '0.78rem',
                py: 0.55,
                borderColor: isSpeaking ? '#10B981' : 'rgba(0, 201, 246, 0.4)',
                color: isSpeaking ? '#FFFFFF' : themeTokens.colors.brandCyan,
                backgroundColor: isSpeaking ? '#10B981' : 'transparent',
                '&:hover': {
                  backgroundColor: isSpeaking ? '#059669' : 'rgba(0, 201, 246, 0.08)',
                  borderColor: isSpeaking ? '#10B981' : themeTokens.colors.brandCyan,
                },
              }}
            >
              {ttsLoading ? 'Carregando voz...' : isSpeaking ? 'Parar Áudio' : 'Ouvir Explicação Clínica'}
            </Button>
          </Box>

          {/* Modelo Dental Demonstrativo */}
          {affectedTeeth.length > 0 && (
            <Paper
              sx={{
                p: 1.5,
                backgroundColor: 'rgba(0, 201, 246, 0.06)',
                border: `1px solid rgba(0, 201, 246, 0.25)`,
                borderRadius: 1.5,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: themeTokens.colors.brandCyan,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  display: 'block',
                  mb: 0.8,
                }}
              >
                Modelo Dental Demonstrativo 3D:
              </Typography>
              <Chip
                label="Dente FDI 36 — Primeiro Molar Inferior"
                color="primary"
                variant="filled"
                size="small"
                sx={{
                  fontWeight: 700,
                  backgroundColor: themeTokens.colors.brandCyan,
                  color: '#0B0F14',
                  fontSize: '0.78rem',
                }}
              />
            </Paper>
          )}

          {/* Alerta de Urgência quando presente */}
          {selectedPathology.urgencyWarning && (
            <Alert
              severity="warning"
              icon={<WarningAmberIcon fontSize="inherit" />}
              sx={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                color: themeTokens.colors.textPrimary,
                fontSize: '0.78rem',
              }}
            >
              {selectedPathology.urgencyWarning}
            </Alert>
          )}

          {/* Estágios de Progressão e Profundidade Tecidual */}
          {selectedPathology.stages && selectedPathology.stages.length > 0 && (
            <Box>
              <Typography variant="subtitle2" sx={{ color: themeTokens.colors.brandCyan, mb: 1 }}>
                Estágios de Progressão Tecidual
              </Typography>
              <Stack spacing={1.5}>
                {selectedPathology.stages.map((st) => (
                  <Paper
                    key={st.stage}
                    sx={{
                      p: 1.5,
                      backgroundColor: themeTokens.colors.bgMain,
                      border: `1px solid ${themeTokens.colors.borderSubtle}`,
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: themeTokens.colors.textPrimary }}>
                      {st.title}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.82rem', color: themeTokens.colors.textSecondary, mt: 0.4 }}>
                      {st.description}
                    </Typography>
                    <Box sx={{ mt: 0.8, pt: 0.8, borderTop: `1px solid rgba(255,255,255,0.05)` }}>
                      <Typography variant="caption" sx={{ color: '#F59E0B', display: 'block' }}>
                        Profundidade: {st.tissueDepth}
                      </Typography>
                      <Typography variant="caption" sx={{ color: themeTokens.colors.textMuted, display: 'block' }}>
                        Aspecto Radiográfico: {st.radiographicAppearance}
                      </Typography>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            </Box>
          )}

          {/* Etiologia e Fatores de Risco */}
          <Box>
            <Typography variant="subtitle2" sx={{ color: themeTokens.colors.brandCyan, mb: 0.6 }}>
              Etiologia e Fatores de Risco
            </Typography>
            <Stack spacing={0.6}>
              {selectedPathology.etiology.map((et, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <Box sx={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#E11D48', mt: 0.8 }} />
                  <Typography variant="body2" sx={{ fontSize: '0.8rem', color: themeTokens.colors.textSecondary }}>
                    {et}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Manifestações Clínicas */}
          <Box>
            <Typography variant="subtitle2" sx={{ color: themeTokens.colors.brandCyan, mb: 0.6 }}>
              Manifestações Clínicas Comuns
            </Typography>
            <Stack spacing={0.6}>
              {selectedPathology.clinicalSigns.map((cs, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <Box sx={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#F59E0B', mt: 0.8 }} />
                  <Typography variant="body2" sx={{ fontSize: '0.8rem', color: themeTokens.colors.textSecondary }}>
                    {cs}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Opções Gerais de Tratamento */}
          <Box sx={{ p: 1.8, backgroundColor: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ color: '#10B981', mb: 0.8, display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <CheckCircleOutlineIcon fontSize="small" />
              Condutas Clínicas Odontológicas
            </Typography>
            <Stack spacing={0.8}>
              {selectedPathology.treatmentOptions.map((to, i) => (
                <Typography key={i} variant="body2" sx={{ fontSize: '0.8rem', color: themeTokens.colors.textPrimary }}>
                  • {to}
                </Typography>
              ))}
            </Stack>
          </Box>
        </Box>
      </Box>

      {/* Coluna Direita (Topo no Mobile): Visualizador 3D com a Estrutura Afetada */}
      <Box
        sx={{
          flex: { xs: 'none', md: 1 },
          width: { xs: '100%', md: 'auto' },
          height: { xs: '42%', sm: '45%', md: '100%' },
          minWidth: 0,
          flexShrink: 0,
          position: 'relative',
          borderBottom: { xs: `1px solid ${themeTokens.colors.borderSubtle}`, md: 'none' },
        }}
      >
        <AnatomyViewer3D soloToothMode={isToothPathology} />
        <CameraControls />

        {/* HUD de Controle de Visualização 3D na área da Patologia */}
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            top: { xs: 8, md: 14 },
            left: { xs: 8, md: 14 },
            zIndex: 100,
            backgroundColor: 'rgba(11, 15, 20, 0.88)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${themeTokens.colors.borderSubtle}`,
            borderRadius: 2,
            p: { xs: 0.8, md: 1.3 },
            maxWidth: { xs: 'calc(100% - 16px)', md: 350 },
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: '#E11D48',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              display: { xs: 'none', md: 'block' },
            }}
          >
            Visualização Anatômica da Patologia
          </Typography>

          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '0.75rem', md: '0.84rem' },
              color: themeTokens.colors.textPrimary,
              mt: { xs: 0, md: 0.3 },
              mb: isToothPathology ? 0.5 : 0.2,
            }}
          >
            {isToothPathology
              ? `Dente 3D Isolado — FDI ${activeToothFdi || '36'}`
              : 'Arcada & Crânio Completo'}
          </Typography>

          {/* Seletor de Modo Anatômico do Dente Afetado */}
          {isToothPathology && (
            <Box sx={{ mt: 0.5, pt: { xs: 0.5, md: 0.8 }, borderTop: `1px solid ${themeTokens.colors.borderSubtle}` }}>
              <Typography
                variant="caption"
                sx={{
                  color: themeTokens.colors.brandCyan,
                  fontWeight: 700,
                  display: { xs: 'none', md: 'block' },
                  mb: 0.6,
                  fontSize: '0.72rem',
                }}
              >
                Modo Anatômico:
              </Typography>
              <ButtonGroup size="small" variant="outlined" sx={{ flexWrap: 'wrap', gap: 0.6 }}>
                <Button
                  variant={toothViewMode === 'external' ? 'contained' : 'outlined'}
                  onClick={() => setToothViewMode('external')}
                  startIcon={<ViewInArIcon sx={{ fontSize: 14 }} />}
                  sx={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    px: 1,
                    py: 0.4,
                    backgroundColor: toothViewMode === 'external' ? themeTokens.colors.brandCyan : undefined,
                    color: toothViewMode === 'external' ? '#0B0F14' : themeTokens.colors.textPrimary,
                    borderColor: toothViewMode === 'external' ? themeTokens.colors.brandCyan : themeTokens.colors.borderSubtle,
                  }}
                >
                  Externo
                </Button>
                <Button
                  variant={toothViewMode === 'cross_section' ? 'contained' : 'outlined'}
                  onClick={() => setToothViewMode('cross_section')}
                  startIcon={<ContentCutIcon sx={{ fontSize: 14 }} />}
                  sx={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    px: 1,
                    py: 0.4,
                    backgroundColor: toothViewMode === 'cross_section' ? themeTokens.colors.brandCyan : undefined,
                    color: toothViewMode === 'cross_section' ? '#0B0F14' : themeTokens.colors.textPrimary,
                    borderColor: toothViewMode === 'cross_section' ? themeTokens.colors.brandCyan : themeTokens.colors.borderSubtle,
                  }}
                >
                  Corte Sagital
                </Button>
                <Button
                  variant={toothViewMode === 'xray' ? 'contained' : 'outlined'}
                  onClick={() => setToothViewMode('xray')}
                  startIcon={<ContrastIcon sx={{ fontSize: 14 }} />}
                  sx={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    px: 1,
                    py: 0.4,
                    backgroundColor: toothViewMode === 'xray' ? themeTokens.colors.brandCyan : undefined,
                    color: toothViewMode === 'xray' ? '#0B0F14' : themeTokens.colors.textPrimary,
                    borderColor: toothViewMode === 'xray' ? themeTokens.colors.brandCyan : themeTokens.colors.borderSubtle,
                  }}
                >
                  Translúcido
                </Button>
                <Button
                  variant={toothViewMode === 'pulp_isolation' ? 'contained' : 'outlined'}
                  onClick={() => setToothViewMode('pulp_isolation')}
                  startIcon={<FlareIcon sx={{ fontSize: 14 }} />}
                  sx={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    px: 1,
                    py: 0.4,
                    backgroundColor: toothViewMode === 'pulp_isolation' ? themeTokens.colors.brandCyan : undefined,
                    color: toothViewMode === 'pulp_isolation' ? '#0B0F14' : themeTokens.colors.textPrimary,
                    borderColor: toothViewMode === 'pulp_isolation' ? themeTokens.colors.brandCyan : themeTokens.colors.borderSubtle,
                  }}
                >
                  Câmara e Canais
                </Button>
              </ButtonGroup>
            </Box>
          )}

          <Typography
            variant="caption"
            sx={{
              color: themeTokens.colors.textMuted,
              display: { xs: 'none', lg: 'block' },
              '@media (max-height: 760px)': { display: 'none' },
              mt: 1,
              fontSize: '0.7rem',
            }}
          >
            {isToothPathology
              ? 'Exibindo anatomia 3D de alta fidelidade com camadas histológicas (esmalte, dentina e polpa).'
              : 'Exibindo conjunto ósseo e craniofacial.'}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};
