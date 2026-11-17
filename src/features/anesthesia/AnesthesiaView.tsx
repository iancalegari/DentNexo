import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Divider,
  Stack,
  Button,
  CircularProgress,
} from '@mui/material';

// EXCLUSIVAMENTE ÍCONES DO MATERIAL UI (@mui/icons-material)
import VaccinesIcon from '@mui/icons-material/Vaccines';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import StraightenIcon from '@mui/icons-material/Straighten';
import OpacityIcon from '@mui/icons-material/Opacity';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import StopIcon from '@mui/icons-material/Stop';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';

import { useAnatomyStore } from '@/stores/useAnatomyStore';
import { ANESTHESIA_TECHNIQUES, ANESTHESIA_MAP } from '@/data/clinical/anesthesiaData';
import { AnatomyViewer3D } from '@/components/3d/AnatomyViewer3D';
import { CameraControls } from '@/components/controls/CameraControls';
import { ttsService } from '@/services/ttsService';
import { themeTokens } from '@/theme/tokens';

export const AnesthesiaView: React.FC = () => {
  const {
    activeAnesthesiaId,
    setActiveAnesthesia,
    anesthesiaJawOpen,
    toggleAnesthesiaJaw,
    triggerAnesthesiaFocus,
    setInfoPanelOpen,
    setSurfaceExplorationMode,
    setSelectedStructure,
    setActivePathology,
    setExplosionFactor,
    setXRayMode,
  } = useAnatomyStore();

  const currentTechnique =
    (activeAnesthesiaId && ANESTHESIA_MAP[activeAnesthesiaId]) || ANESTHESIA_TECHNIQUES[0];
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsLoading, setTtsLoading] = useState(false);

  useEffect(() => {
    setInfoPanelOpen(false);
    setSurfaceExplorationMode(false);
    setSelectedStructure(null);
    setActivePathology(null);
    setExplosionFactor(0);
    setXRayMode(false);

    if (!useAnatomyStore.getState().activeAnesthesiaId) {
      setActiveAnesthesia(ANESTHESIA_TECHNIQUES[0].id);
    }

    return () => {
      ttsService.stop();
      setActiveAnesthesia(null);
    };
  }, [
    setActiveAnesthesia,
    setInfoPanelOpen,
    setSurfaceExplorationMode,
    setSelectedStructure,
    setActivePathology,
    setExplosionFactor,
    setXRayMode,
  ]);

  useEffect(() => {
    ttsService.stop();
    setIsSpeaking(false);
    setTtsLoading(false);
  }, [currentTechnique.id]);

  const handleListenTechnique = useCallback(() => {
    if (isSpeaking) {
      ttsService.stop();
      setIsSpeaking(false);
      setTtsLoading(false);
      return;
    }

    const textParts = [
      `${currentTechnique.name}. ${currentTechnique.subtitle}.`,
      `Taxa de eficácia clínica: ${currentTechnique.successRate}. Agulha recomendada: ${currentTechnique.needleSpec}, com penetração de ${currentTechnique.insertionDepthMm} e volume de ${currentTechnique.anestheticVolume}.`,
      currentTechnique.anesthetizedStructuresSummary?.length
        ? `Território anestesiado: ${currentTechnique.anesthetizedStructuresSummary.join('; ')}.`
        : '',
      currentTechnique.landmarks?.length
        ? `Pontos de reparo anatômicos: ${currentTechnique.landmarks.join('; ')}.`
        : '',
      currentTechnique.stepByStep?.length
        ? `Protocolo passo a passo: ${currentTechnique.stepByStep.join(' ')}`
        : '',
      currentTechnique.complications?.length
        ? `Cuidados e complicações a evitar: ${currentTechnique.complications.join(' ')}`
        : '',
    ]
      .filter(Boolean)
      .join(' ');

    setTtsLoading(true);
    ttsService.speak({
      audioId: `anestesia_${currentTechnique.id}`,
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
  }, [currentTechnique, isSpeaking]);

  const mandibularBlocks = ANESTHESIA_TECHNIQUES.filter((t) => t.arch === 'mandibular');
  const maxillaryBlocks = ANESTHESIA_TECHNIQUES.filter((t) => t.arch === 'maxillary');

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
      {/* Coluna Esquerda: Seletor de Técnicas e Protocolo Clínico Completo */}
      <Box
        sx={{
          width: { xs: '100%', md: 355, lg: 410, xl: 470 },
          flex: { xs: 1, md: 'none' },
          minHeight: 0,
          height: { xs: 'auto', md: '100%' },
          overflowY: 'auto',
          backgroundColor: themeTokens.colors.bgSecondary,
          borderRight: { xs: 'none', md: `1px solid ${themeTokens.colors.borderSubtle}` },
          p: { xs: 1.6, sm: 2, lg: 2.5 },
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 1.6, md: 2.2 },
        }}
      >
        {/* Cabeçalho */}
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              fontSize: '1.3rem',
              color: themeTokens.colors.textPrimary,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <VaccinesIcon sx={{ color: '#10B981' }} />
            Anestesiologia 3D
          </Typography>
          <Typography variant="body2" sx={{ color: themeTokens.colors.textSecondary, mt: 0.4, fontSize: '0.82rem' }}>
            Simulador tridimensional de bloqueios regionais odontológicos, trajetória da agulha e território anestesiado.
          </Typography>
        </Box>

        {/* Seletor de Técnicas Mandibulares e Maxilares */}
        <Paper
          elevation={0}
          sx={{
            p: 1.6,
            borderRadius: `${themeTokens.borderRadius.md}px`,
            backgroundColor: 'rgba(15, 23, 42, 0.55)',
            border: `1px solid ${themeTokens.colors.borderSubtle}`,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: 800,
              letterSpacing: '0.06em',
              color: '#94A3B8',
              textTransform: 'uppercase',
              fontSize: '0.68rem',
              display: 'block',
              mb: 0.8,
            }}
          >
            Mandíbula — Divisão V3 ({mandibularBlocks.length})
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.7, mb: 1.5 }}>
            {mandibularBlocks.map((tech) => {
              const isSelected = currentTechnique.id === tech.id;
              return (
                <Chip
                  key={tech.id}
                  label={tech.shortName}
                  onClick={() => setActiveAnesthesia(tech.id)}
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    height: 28,
                    backgroundColor: isSelected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    color: isSelected ? '#34D399' : '#CBD5E1',
                    border: isSelected
                      ? '1px solid #10B981'
                      : `1px solid ${themeTokens.colors.borderSubtle}`,
                    '&:hover': {
                      backgroundColor: 'rgba(16, 185, 129, 0.14)',
                    },
                  }}
                />
              );
            })}
          </Box>

          <Typography
            variant="caption"
            sx={{
              fontWeight: 800,
              letterSpacing: '0.06em',
              color: '#94A3B8',
              textTransform: 'uppercase',
              fontSize: '0.68rem',
              display: 'block',
              mb: 0.8,
            }}
          >
            Maxila & Palato — Divisão V2 ({maxillaryBlocks.length})
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.7 }}>
            {maxillaryBlocks.map((tech) => {
              const isSelected = currentTechnique.id === tech.id;
              return (
                <Chip
                  key={tech.id}
                  label={tech.shortName}
                  onClick={() => setActiveAnesthesia(tech.id)}
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    height: 28,
                    backgroundColor: isSelected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    color: isSelected ? '#34D399' : '#CBD5E1',
                    border: isSelected
                      ? '1px solid #10B981'
                      : `1px solid ${themeTokens.colors.borderSubtle}`,
                    '&:hover': {
                      backgroundColor: 'rgba(16, 185, 129, 0.14)',
                    },
                  }}
                />
              );
            })}
          </Box>
        </Paper>

        {/* Ficha Clínica da Técnica Selecionada */}
        <Paper
          elevation={0}
          sx={{
            p: 2.2,
            borderRadius: `${themeTokens.borderRadius.md}px`,
            backgroundColor: themeTokens.colors.bgElevated,
            border: `1px solid ${themeTokens.colors.borderSubtle}`,
          }}
        >
          {/* Título + Badges */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mb: 1 }}>
            <Chip
              size="small"
              label={currentTechnique.arch === 'mandibular' ? 'Arcada Inferior (V3)' : 'Arcada Superior (V2)'}
              sx={{
                height: 22,
                fontSize: '0.69rem',
                fontWeight: 700,
                backgroundColor: 'rgba(0, 201, 246, 0.14)',
                color: themeTokens.colors.brandCyan,
                border: '1px solid rgba(0, 201, 246, 0.3)',
              }}
            />
            <Chip
              size="small"
              label={`Índice de Sucesso: ${currentTechnique.successRate}`}
              sx={{
                height: 22,
                fontSize: '0.69rem',
                fontWeight: 700,
                backgroundColor: 'rgba(16, 185, 129, 0.14)',
                color: '#34D399',
                border: '1px solid rgba(16, 185, 129, 0.3)',
              }}
            />
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.06rem', color: '#F8FAFC', lineHeight: 1.3 }}>
            {currentTechnique.name}
          </Typography>
          <Typography variant="body2" sx={{ color: themeTokens.colors.textSecondary, fontSize: '0.8rem', mt: 0.4 }}>
            {currentTechnique.subtitle}
          </Typography>

          <Button
            variant={isSpeaking ? 'contained' : 'outlined'}
            size="small"
            fullWidth
            onClick={handleListenTechnique}
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
            {ttsLoading ? 'Carregando voz...' : isSpeaking ? 'Parar Áudio' : 'Ouvir Protocolo Anestésico'}
          </Button>

          <Divider sx={{ my: 1.8, borderColor: themeTokens.colors.borderSubtle }} />

          {/* ÁREA COMPLETA ANESTESIADA (DENTES + TECIDOS MOLES) */}
          <Box
            sx={{
              p: 1.5,
              borderRadius: '10px',
              backgroundColor: 'rgba(16, 185, 129, 0.07)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              mb: 2,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 800,
                fontSize: '0.76rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: '#34D399',
                display: 'flex',
                alignItems: 'center',
                gap: 0.7,
                mb: 1,
              }}
            >
              <CheckCircleOutlineIcon sx={{ fontSize: '1rem' }} />
              Território Completo Anestesiado
            </Typography>

            {currentTechnique.anesthetizedTeeth.length > 0 ? (
              <Box sx={{ mb: 1.2 }}>
                <Typography sx={{ fontSize: '0.73rem', color: '#A7F3D0', fontWeight: 700, mb: 0.6 }}>
                  Dentes com Anestesia Pulpar (FDI):
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6 }}>
                  {currentTechnique.anesthetizedTeeth.map((fdi) => (
                    <Chip
                      key={fdi}
                      size="small"
                      label={`Dente ${fdi}`}
                      sx={{
                        height: 23,
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        backgroundColor: 'rgba(16, 185, 129, 0.24)',
                        color: '#6EE7B7',
                        border: '1px solid rgba(52, 211, 153, 0.5)',
                      }}
                    />
                  ))}
                </Box>
              </Box>
            ) : (
              <Box sx={{ mb: 1.2 }}>
                <Typography sx={{ fontSize: '0.73rem', color: '#A7F3D0', fontWeight: 700, mb: 0.6 }}>
                  Região Dentária & Mucosa/Gengiva Afetada (FDI):
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6 }}>
                  {currentTechnique.softTissueTeeth.map((fdi) => (
                    <Chip
                      key={fdi}
                      size="small"
                      label={`Região ${fdi}`}
                      sx={{
                        height: 23,
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        backgroundColor: 'rgba(16, 185, 129, 0.24)',
                        color: '#6EE7B7',
                        border: '1px solid rgba(52, 211, 153, 0.5)',
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            <Stack spacing={0.6}>
              {currentTechnique.anesthetizedStructuresSummary.map((item, idx) => (
                <Typography
                  key={idx}
                  variant="body2"
                  sx={{ fontSize: '0.79rem', color: '#E2E8F0', lineHeight: 1.45, pl: 0.5 }}
                >
                  • {item}
                </Typography>
              ))}
            </Stack>
          </Box>

          {/* PARÂMETROS TÉCNICOS (AGULHA, PROFUNDIDADE, VOLUME E ASPIRAÇÃO) */}
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 800,
              fontSize: '0.75rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: themeTokens.colors.brandCyan,
              mb: 1,
            }}
          >
            Parâmetros Clínicos da Punção
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 1,
              mb: 2,
            }}
          >
            <Box
              sx={{
                p: 1.2,
                borderRadius: '8px',
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                border: `1px solid ${themeTokens.colors.borderSubtle}`,
              }}
            >
              <Typography sx={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <VaccinesIcon sx={{ fontSize: '0.85rem', color: '#38BDF8' }} /> Agulha Indicada
              </Typography>
              <Typography sx={{ fontSize: '0.78rem', color: '#F8FAFC', fontWeight: 700, mt: 0.3 }}>
                {currentTechnique.needleSpec}
              </Typography>
            </Box>

            <Box
              sx={{
                p: 1.2,
                borderRadius: '8px',
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                border: `1px solid ${themeTokens.colors.borderSubtle}`,
              }}
            >
              <Typography sx={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <StraightenIcon sx={{ fontSize: '0.85rem', color: '#34D399' }} /> Profundidade
              </Typography>
              <Typography sx={{ fontSize: '0.78rem', color: '#F8FAFC', fontWeight: 700, mt: 0.3 }}>
                {currentTechnique.insertionDepthMm}
              </Typography>
            </Box>

            <Box
              sx={{
                p: 1.2,
                borderRadius: '8px',
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                border: `1px solid ${themeTokens.colors.borderSubtle}`,
              }}
            >
              <Typography sx={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <OpacityIcon sx={{ fontSize: '0.85rem', color: '#A78BFA' }} /> Volume (Tubete)
              </Typography>
              <Typography sx={{ fontSize: '0.78rem', color: '#F8FAFC', fontWeight: 700, mt: 0.3 }}>
                {currentTechnique.anestheticVolume}
              </Typography>
            </Box>

            <Box
              sx={{
                p: 1.2,
                borderRadius: '8px',
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                border: `1px solid ${themeTokens.colors.borderSubtle}`,
              }}
            >
              <Typography sx={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ShieldOutlinedIcon sx={{ fontSize: '0.85rem', color: '#FBBF24' }} /> Aspiração Positiva
              </Typography>
              <Typography sx={{ fontSize: '0.78rem', color: '#F8FAFC', fontWeight: 700, mt: 0.3 }}>
                {currentTechnique.aspirationRisk}
              </Typography>
            </Box>
          </Box>

          {/* PONTOS DE REPARO ANATÔMICOS */}
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 800,
              fontSize: '0.75rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: '#FBBF24',
              display: 'flex',
              alignItems: 'center',
              gap: 0.6,
              mb: 0.8,
            }}
          >
            <MyLocationIcon sx={{ fontSize: '0.95rem' }} />
            Pontos de Reparo Anatômicos
          </Typography>
          <Stack spacing={0.5} sx={{ mb: 2 }}>
            {currentTechnique.landmarks.map((lm, idx) => (
              <Typography key={idx} sx={{ fontSize: '0.79rem', color: '#CBD5E1', lineHeight: 1.45 }}>
                • {lm}
              </Typography>
            ))}
          </Stack>

          {/* PASSO A PASSO DA EXECUÇÃO */}
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 800,
              fontSize: '0.75rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: themeTokens.colors.brandCyan,
              display: 'flex',
              alignItems: 'center',
              gap: 0.6,
              mb: 0.8,
            }}
          >
            <FormatListNumberedIcon sx={{ fontSize: '0.95rem' }} />
            Passo a Passo da Técnica (Malamed)
          </Typography>
          <Stack spacing={0.8} sx={{ mb: 2 }}>
            {currentTechnique.stepByStep.map((step, idx) => (
              <Box
                key={idx}
                sx={{
                  display: 'flex',
                  gap: 1,
                  alignItems: 'flex-start',
                  p: 1,
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.025)',
                }}
              >
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0, 201, 246, 0.18)',
                    color: themeTokens.colors.brandCyan,
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    mt: 0.1,
                  }}
                >
                  {idx + 1}
                </Box>
                <Typography sx={{ fontSize: '0.79rem', color: '#E2E8F0', lineHeight: 1.45 }}>
                  {step}
                </Typography>
              </Box>
            ))}
          </Stack>

          {/* COMPLICAÇÕES E CUIDADOS ANATÔMICOS */}
          <Box
            sx={{
              p: 1.4,
              borderRadius: '10px',
              backgroundColor: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.28)',
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 800,
                fontSize: '0.75rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: '#FBBF24',
                display: 'flex',
                alignItems: 'center',
                gap: 0.6,
                mb: 0.8,
              }}
            >
              <WarningAmberIcon sx={{ fontSize: '0.95rem' }} />
              Acidentes, Complicações & Prevenção
            </Typography>
            <Stack spacing={0.6}>
              {currentTechnique.complications.map((comp, idx) => (
                <Typography key={idx} sx={{ fontSize: '0.78rem', color: '#FDE68A', lineHeight: 1.45 }}>
                  • {comp}
                </Typography>
              ))}
            </Stack>
          </Box>
        </Paper>
      </Box>

      {/* Coluna Direita (Topo no Mobile): Visualizador 3D Interativo da Punção e Área Afetada */}
      <Box
        sx={{
          flex: { xs: 'none', md: 1 },
          width: { xs: '100%', md: 'auto' },
          height: { xs: '42%', sm: '45%', md: '100%' },
          minWidth: 0,
          flexShrink: 0,
          position: 'relative',
          overflow: 'hidden',
          borderBottom: { xs: `1px solid ${themeTokens.colors.borderSubtle}`, md: 'none' },
        }}
      >
        {/* Barra Superior de Legenda Visual + Foco Rápido na Agulha */}
        <Paper
          elevation={4}
          sx={{
            position: 'absolute',
            top: { xs: 8, md: 12 },
            left: '50%',
            transform: 'translateX(-50%)',
            maxWidth: 'calc(100% - 16px)',
            zIndex: 1000,
            backgroundColor: 'rgba(15, 23, 42, 0.92)',
            backdropFilter: 'blur(14px)',
            border: `1px solid ${themeTokens.colors.borderSubtle}`,
            borderRadius: { xs: '14px', md: '999px' },
            px: { xs: 1.1, md: 1.8 },
            py: { xs: 0.45, md: 0.65 },
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: { xs: 0.8, md: 1.4 },
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#FDE047', boxShadow: '0 0 8px #F59E0B' }} />
            <Typography sx={{ fontSize: { xs: '0.67rem', sm: '0.72rem' }, fontWeight: 700, color: '#FEF08A', whiteSpace: 'nowrap' }}>
              Nervo Alvo
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#34D399', boxShadow: '0 0 8px #10B981' }} />
            <Typography sx={{ fontSize: { xs: '0.67rem', sm: '0.72rem' }, fontWeight: 700, color: '#A7F3D0', whiteSpace: 'nowrap' }}>
              Área Anestesiada
            </Typography>
          </Box>

          <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#14B8A6', border: '1px solid #5EEAD4' }} />
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#99F6E4', whiteSpace: 'nowrap' }}>
              Mucosa & Difusão
            </Typography>
          </Box>

          <Button
            size="small"
            variant="outlined"
            startIcon={<UnfoldMoreIcon sx={{ fontSize: '0.9rem !important' }} />}
            onClick={toggleAnesthesiaJaw}
            title={anesthesiaJawOpen ? 'Fechar mandíbula' : 'Abrir mandíbula para punção'}
            sx={{
              borderRadius: '999px',
              textTransform: 'none',
              fontSize: { xs: '0.68rem', sm: '0.72rem' },
              fontWeight: 700,
              py: 0.2,
              px: { xs: 1, sm: 1.2 },
              color: anesthesiaJawOpen ? '#34D399' : '#94A3B8',
              borderColor: anesthesiaJawOpen ? 'rgba(16, 185, 129, 0.5)' : 'rgba(148, 163, 184, 0.3)',
              backgroundColor: anesthesiaJawOpen ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
              '&:hover': {
                borderColor: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.22)',
              },
            }}
          >
            {anesthesiaJawOpen ? 'Boca Aberta' : 'Abrir Boca'}
          </Button>

          <Button
            size="small"
            variant="outlined"
            startIcon={<CenterFocusStrongIcon sx={{ fontSize: '0.9rem !important' }} />}
            onClick={triggerAnesthesiaFocus}
            sx={{
              borderRadius: '999px',
              textTransform: 'none',
              fontSize: { xs: '0.68rem', sm: '0.72rem' },
              fontWeight: 700,
              py: 0.2,
              px: { xs: 1, sm: 1.2 },
              color: themeTokens.colors.brandCyan,
              borderColor: 'rgba(0, 201, 246, 0.45)',
              '&:hover': {
                borderColor: themeTokens.colors.brandCyan,
                backgroundColor: 'rgba(0, 201, 246, 0.12)',
              },
            }}
          >
            Focar Punção
          </Button>
        </Paper>

        <AnatomyViewer3D hideSelectionBadge />
        <CameraControls />
      </Box>
    </Box>
  );
};
