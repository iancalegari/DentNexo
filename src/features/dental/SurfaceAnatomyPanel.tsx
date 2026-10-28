import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Collapse,
  Fade,
} from '@mui/material';

// EXCLUSIVAMENTE ÍCONES DO MATERIAL UI
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { useAnatomyStore } from '@/stores/useAnatomyStore';
import {
  ToothFace,
  getToothSurfaceFeatures,
} from '@/data/dental/surfaceFeaturesData';
import { permanentTeethData } from '@/data/dental/teethData';
import { deciduousTeethData } from '@/data/dental/deciduousTeethData';
import { themeTokens } from '@/theme/tokens';

export const SurfaceAnatomyPanel: React.FC = () => {
  const {
    surfaceExplorationMode,
    activeToothFdi,
    activeToothFace,
    selectedSurfaceFeature,
    hideSurfaceFeatures,
    setSurfaceExplorationMode,
    setActiveToothFace,
    setSelectedSurfaceFeature,
    setHideSurfaceFeatures,
    setInfoPanelOpen,
  } = useAnatomyStore();

  // Fechar o painel de detalhes anatômicos geral nessa visão, pois a exploração tem painel próprio
  React.useEffect(() => {
    if (surfaceExplorationMode) {
      setInfoPanelOpen(false);
    }
  }, [surfaceExplorationMode, setInfoPanelOpen]);

  if (!surfaceExplorationMode) return null;

  const toothInfo =
    permanentTeethData[activeToothFdi] ||
    deciduousTeethData[activeToothFdi] ||
    permanentTeethData['11'];
  const surfaceFeatures = getToothSurfaceFeatures(activeToothFdi);
  const activeFeatureData = surfaceFeatures.find((f) => f.id === selectedSurfaceFeature);

  // Mapeamento das Faces em Português Fiel à Nomenclatura Odontológica
  const toothNumber = parseInt(activeToothFdi, 10);
  const isAnterior = toothNumber % 10 <= 3;
  const isUpper = toothNumber >= 11 && toothNumber <= 28;

  const bitingLabel = isAnterior ? 'Bordo Incisal' : 'Face Oclusal';
  const innerLabel = isUpper ? 'Face Palatina' : 'Face Lingual';

  const facesList: { id: ToothFace; label: string }[] = [
    { id: 'biting', label: bitingLabel },
    { id: 'inner', label: innerLabel },
    { id: 'facial', label: 'Face Vestibular' },
    { id: 'mesial', label: 'Face Mesial' },
    { id: 'distal', label: 'Face Distal' },
  ];

  const handleSelectFace = (face: ToothFace) => {
    setActiveToothFace(activeToothFace === face ? null : face);
  };

  const handleSelectFeature = (featureId: string, featureFace: ToothFace) => {
    if (selectedSurfaceFeature === featureId) {
      setSelectedSurfaceFeature(null);
    } else {
      setSelectedSurfaceFeature(featureId);
      // Gira a câmera suavemente para a face onde o acidente anatômico reside
      setActiveToothFace(featureFace);
    }
  };

  return (
    <Fade in={surfaceExplorationMode}>
      <Paper
        elevation={6}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 1100,
          width: { xs: 300, sm: 350 },
          maxHeight: 'calc(100% - 32px)',
          overflowY: 'auto',
          backgroundColor: 'rgba(17, 20, 24, 0.94)',
          backdropFilter: 'blur(14px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '14px',
          p: 2,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.65)',
          userSelect: 'none',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
          },
        }}
      >
        {/* Cabeçalho Elegante Inspirado no Dental Scope Original */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 1.5,
          }}
        >
          <Box>
            <Typography
              component="h3"
              sx={{
                fontFamily: '"Georgia", "Playfair Display", serif, "Urbanist"',
                fontStyle: 'italic',
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#F1F5F9',
                letterSpacing: '0.01em',
                lineHeight: 1.2,
              }}
            >
              Anatomia de superfície
            </Typography>
            <Typography
              sx={{
                fontFamily: themeTokens.typography.fontFamily,
                fontSize: '0.74rem',
                fontWeight: 600,
                color: '#38BDF8',
                mt: 0.2,
              }}
            >
              Dente FDI {activeToothFdi} • {toothInfo.name}
            </Typography>
          </Box>

          <Tooltip title="Fechar exploração de superfície" arrow placement="top">
            <IconButton
              size="small"
              onClick={() => setSurfaceExplorationMode(false)}
              sx={{
                color: '#94A3B8',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                '&:hover': {
                  backgroundColor: 'rgba(239, 68, 68, 0.2)',
                  color: '#EF4444',
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Grade 1: Botões das 5 Faces do Dente */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, mb: 1.5 }}>
          {/* Linha 1: Mastigação (Oclusal/Incisal), Interna (Lingual/Palatina), Vestibular */}
          <Box sx={{ display: 'flex', gap: 0.8 }}>
            {facesList.slice(0, 3).map((f) => {
              const isActive = activeToothFace === f.id;
              return (
                <Button
                  key={f.id}
                  onClick={() => handleSelectFace(f.id)}
                  sx={{
                    flex: 1,
                    py: 0.75,
                    px: 0.8,
                    minWidth: 0,
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    lineHeight: 1.2,
                    borderRadius: '8px',
                    backgroundColor: isActive ? '#818CF8' : '#1C2128',
                    color: isActive ? '#FFFFFF' : '#E2E8F0',
                    border: isActive
                      ? '1px solid #A5B4FC'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: isActive
                      ? '0 0 12px rgba(129, 140, 248, 0.45)'
                      : 'none',
                    transition: 'all 0.18s ease-in-out',
                    '&:hover': {
                      backgroundColor: isActive ? '#6366F1' : '#28303C',
                      borderColor: '#818CF8',
                    },
                  }}
                >
                  {f.label}
                </Button>
              );
            })}
          </Box>

          {/* Linha 2: Face Mesial e Face Distal */}
          <Box sx={{ display: 'flex', gap: 0.8 }}>
            {facesList.slice(3, 5).map((f) => {
              const isActive = activeToothFace === f.id;
              return (
                <Button
                  key={f.id}
                  onClick={() => handleSelectFace(f.id)}
                  sx={{
                    flex: 1,
                    py: 0.75,
                    px: 0.8,
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    lineHeight: 1.2,
                    borderRadius: '8px',
                    backgroundColor: isActive ? '#818CF8' : '#1C2128',
                    color: isActive ? '#FFFFFF' : '#E2E8F0',
                    border: isActive
                      ? '1px solid #A5B4FC'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: isActive
                      ? '0 0 12px rgba(129, 140, 248, 0.45)'
                      : 'none',
                    transition: 'all 0.18s ease-in-out',
                    '&:hover': {
                      backgroundColor: isActive ? '#6366F1' : '#28303C',
                      borderColor: '#818CF8',
                    },
                  }}
                >
                  {f.label}
                </Button>
              );
            })}
          </Box>
        </Box>

        {/* Botão Largo Destaque: Ocultar/Exibir Detalhes de Superfície */}
        <Button
          fullWidth
          onClick={() => setHideSurfaceFeatures(!hideSurfaceFeatures)}
          startIcon={
            hideSurfaceFeatures ? (
              <VisibilityIcon fontSize="small" />
            ) : (
              <VisibilityOffIcon fontSize="small" />
            )
          }
          sx={{
            py: 0.85,
            mb: 1.5,
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'none',
            borderRadius: '8px',
            backgroundColor: hideSurfaceFeatures ? '#1E232B' : '#818CF8',
            color: hideSurfaceFeatures ? '#94A3B8' : '#FFFFFF',
            border: hideSurfaceFeatures
              ? '1px solid rgba(255, 255, 255, 0.12)'
              : '1px solid #A5B4FC',
            boxShadow: hideSurfaceFeatures
              ? 'none'
              : '0 4px 14px rgba(129, 140, 248, 0.35)',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: hideSurfaceFeatures ? '#2A323F' : '#6366F1',
            },
          }}
        >
          {hideSurfaceFeatures
            ? 'Exibir acidentes anatômicos'
            : 'Ocultar detalhes de superfície'}
        </Button>

        {/* Grade de Botões dos Acidentes Anatômicos (Visível quando hideSurfaceFeatures é falso) */}
        {!hideSurfaceFeatures && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.7, mb: 1.5 }}>
            {surfaceFeatures.map((feat) => {
              const isSelected = selectedSurfaceFeature === feat.id;
              return (
                <Button
                  key={feat.id}
                  onClick={() => handleSelectFeature(feat.id, feat.face)}
                  sx={{
                    py: 0.7,
                    px: 1.2,
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: '8px',
                    backgroundColor: isSelected ? '#818CF8' : '#1C2128',
                    color: isSelected ? '#FFFFFF' : '#E2E8F0',
                    border: isSelected
                      ? '1px solid #A5B4FC'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: isSelected
                      ? '0 0 12px rgba(129, 140, 248, 0.5)'
                      : 'none',
                    transition: 'all 0.16s ease-in-out',
                    '&:hover': {
                      backgroundColor: isSelected ? '#6366F1' : '#28303C',
                      borderColor: '#818CF8',
                      color: '#FFFFFF',
                    },
                  }}
                >
                  {feat.name}
                </Button>
              );
            })}
          </Box>
        )}

        {/* Card Didático com a Explicação Anatômica e Relevância Clínica */}
        <Collapse in={Boolean(activeFeatureData && !hideSurfaceFeatures)}>
          {activeFeatureData && (
            <Box
              sx={{
                p: 1.4,
                backgroundColor: 'rgba(30, 41, 59, 0.7)',
                border: '1px solid rgba(129, 140, 248, 0.3)',
                borderRadius: '8px',
                mt: 0.5,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 0.5 }}>
                <InfoOutlinedIcon sx={{ fontSize: 16, color: '#818CF8' }} />
                <Typography
                  sx={{
                    fontFamily: themeTokens.typography.fontFamily,
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#EEF2FF',
                  }}
                >
                  {activeFeatureData.name}
                </Typography>
              </Box>

              <Typography
                sx={{
                  fontFamily: themeTokens.typography.fontFamily,
                  fontSize: '0.72rem',
                  color: '#CBD5E1',
                  lineHeight: 1.4,
                  mb: 0.6,
                }}
              >
                {activeFeatureData.description}
              </Typography>

              <Typography
                sx={{
                  fontFamily: themeTokens.typography.fontFamily,
                  fontSize: '0.70rem',
                  color: '#38BDF8',
                  lineHeight: 1.3,
                  fontWeight: 500,
                }}
              >
                <strong>Importância Clínica:</strong>{' '}
                {activeFeatureData.clinicalSignificance}
              </Typography>
            </Box>
          )}
        </Collapse>
      </Paper>
    </Fade>
  );
};
