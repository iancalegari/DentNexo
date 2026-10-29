import React, { useState, useEffect } from 'react';
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
} from '@mui/material';

// EXCLUSIVAMENTE ÍCONES DO MATERIAL UI
import HealingIcon from '@mui/icons-material/Healing';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import ContrastIcon from '@mui/icons-material/Contrast';
import FlareIcon from '@mui/icons-material/Flare';

import { useAnatomyStore } from '@/stores/useAnatomyStore';
import { oralPathologies } from '@/data/pathologies/pathologiesData';
import { AnatomyViewer3D } from '@/components/3d/AnatomyViewer3D';
import { CameraControls } from '@/components/controls/CameraControls';
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

  // Limpar patologia ativa e modo de exploração ao entrar/sair de Patologias
  useEffect(() => {
    setInfoPanelOpen(false);
    setSurfaceExplorationMode(false);
    setSelectedStructure(null);

    return () => {
      setActivePathology(null);
      setSelectedStructure(null);
    };
  }, [setActivePathology, setInfoPanelOpen, setSurfaceExplorationMode, setSelectedStructure]);

  // Extrair dentes afetados pela patologia selecionada
  const affectedTeeth = (selectedPathology?.affectedStructures || [])
    .filter((s) => s.startsWith('dente_'))
    .map((s) => s.replace('dente_', ''));

  const isGingivalOrMucosal =
    selectedPathology?.id === 'gengivite' ||
    selectedPathology?.id === 'periodontite' ||
    selectedPathology?.id === 'afta_oral';

  const isToothPathology = !isGingivalOrMucosal && affectedTeeth.length > 0;

  // Modo de visualização 3D: por padrão 'general' (mostra crânio e arcadas contextualizados)
  const [viewMode, setViewMode] = useState<'tooth' | 'general'>('general');

  // Ao trocar de patologia, focar na estrutura SEM abrir o painel de detalhes nem isolar automaticamente
  useEffect(() => {
    if (isGingivalOrMucosal) {
      setViewMode('general');
      if (layers.oral_tissue === false) toggleLayer('oral_tissue');
      if (layers.dental === false) toggleLayer('dental');
    } else if (isToothPathology) {
      const primaryTooth = affectedTeeth[0] || '36';
      setActiveToothFdi(primaryTooth);
    } else {
      setViewMode('general');
    }
    setInfoPanelOpen(false);
  }, [selectedPathology?.id]);

  const handleSelectAffectedTooth = (fdi: string) => {
    setActiveToothFdi(fdi);
  };

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', overflow: 'hidden' }}>
      {/* Coluna Esquerda: Catálogo Científico de Patologias */}
      <Box
        sx={{
          width: { xs: '100%', md: 460 },
          height: '100%',
          overflowY: 'auto',
          backgroundColor: themeTokens.colors.bgSecondary,
          borderRight: `1px solid ${themeTokens.colors.borderSubtle}`,
          p: 2.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
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

      {/* Coluna Direita: Visualizador 3D com a Estrutura Afetada */}
      <Box sx={{ flex: 1, height: '100%', position: 'relative', display: { xs: 'none', md: 'block' } }}>
        <AnatomyViewer3D soloToothMode={viewMode === 'tooth' && isToothPathology} />
        <CameraControls />

        {/* HUD de Controle de Visualização 3D na área da Patologia */}
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 100,
            backgroundColor: 'rgba(11, 15, 20, 0.88)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${themeTokens.colors.borderSubtle}`,
            borderRadius: 2,
            p: 1.5,
            maxWidth: 360,
          }}
        >
          <Typography variant="caption" sx={{ color: '#E11D48', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Visualização Anatômica da Patologia
          </Typography>

          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: themeTokens.colors.textPrimary, mt: 0.3, mb: 1.2 }}>
            {viewMode === 'tooth' && isToothPathology
              ? `Dente FDI ${activeToothFdi || '36'} (Estrutura Afetada)`
              : 'Arcada & Crânio Completo'}
          </Typography>

          {isToothPathology && (
            <ButtonGroup size="small" sx={{ mb: 1 }}>
              <Button
                variant={viewMode === 'tooth' ? 'contained' : 'outlined'}
                onClick={() => setViewMode('tooth')}
                startIcon={<ViewInArIcon fontSize="small" />}
                sx={{
                  fontWeight: 700,
                  fontSize: '0.74rem',
                  backgroundColor: viewMode === 'tooth' ? themeTokens.colors.brandCyan : undefined,
                  color: viewMode === 'tooth' ? '#0B0F14' : themeTokens.colors.textPrimary,
                }}
              >
                Dente 3D Isolado
              </Button>
              <Button
                variant={viewMode === 'general' ? 'contained' : 'outlined'}
                onClick={() => setViewMode('general')}
                startIcon={<VisibilityIcon fontSize="small" />}
                sx={{
                  fontWeight: 700,
                  fontSize: '0.74rem',
                }}
              >
                Visão Geral
              </Button>
            </ButtonGroup>
          )}

          {/* Seletor de Modo Anatômico do Dente Afetado */}
          {viewMode === 'tooth' && isToothPathology && (
            <Box sx={{ mt: 1, pt: 1.2, borderTop: `1px solid ${themeTokens.colors.borderSubtle}` }}>
              <Typography
                variant="caption"
                sx={{
                  color: themeTokens.colors.brandCyan,
                  fontWeight: 700,
                  display: 'block',
                  mb: 0.8,
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

          <Typography variant="caption" sx={{ color: themeTokens.colors.textMuted, display: 'block', mt: 1.2, fontSize: '0.72rem' }}>
            {viewMode === 'tooth' && isToothPathology
              ? 'Exibindo anatomia 3D de alta fidelidade com camadas histológicas (esmalte, dentina e polpa).'
              : 'Exibindo conjunto ósseo e craniofacial.'}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};
