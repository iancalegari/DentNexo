import React, { useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Slider,
  Switch,
  Collapse,
  Stack,
  Divider,
} from '@mui/material';

// EXCLUSIVAMENTE ÍCONES DO MATERIAL UI
import LayersIcon from '@mui/icons-material/Layers';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PsychologyIcon from '@mui/icons-material/Psychology';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import ScienceIcon from '@mui/icons-material/Science';
import HealingIcon from '@mui/icons-material/Healing';
import OpenWithIcon from '@mui/icons-material/OpenWith';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

import { useAnatomyStore } from '@/stores/useAnatomyStore';
import { LayerOpacity, LayerVisibility } from '@/types/anatomy';
import { themeTokens } from '@/theme/tokens';

interface LayerControlsProps {
  top?: number | string;
  defaultExpanded?: boolean;
  showJawControl?: boolean;
}

export const LayerControls: React.FC<LayerControlsProps> = ({
  top = 12,
  defaultExpanded = true,
  showJawControl,
}) => {
  const [expanded, setExpanded] = useState<boolean>(() => {
    if (!defaultExpanded) return false;
    if (typeof window !== 'undefined' && (window.innerWidth < 1024 || window.innerHeight < 760)) {
      return false;
    }
    return true;
  });
  const {
    layers,
    opacities,
    explosionFactor,
    jawOpen,
    focusedSystem,
    toggleLayer,
    setLayerOpacity,
    setExplosionFactor,
    toggleJawOpen,
  } = useAnatomyStore();

  // A opção de abrir a boca fica disponível no Atlas 3D, mas é desativada nos Sistemas Anatômicos
  const isJawControlAllowed = showJawControl !== undefined ? showJawControl : !focusedSystem;

  const layerItems: {
    key: keyof LayerVisibility;
    label: string;
    icon: React.ReactNode;
    color: string;
    hasOpacity: boolean;
  }[] = [
    { key: 'skeletal', label: 'Esqueleto & Crânio', icon: <AccessibilityNewIcon fontSize="small" />, color: '#CBD5E1', hasOpacity: true },
    { key: 'dental', label: 'Dentes & Arcadas', icon: <MedicalServicesIcon fontSize="small" />, color: '#F8FAFC', hasOpacity: true },
    { key: 'muscular', label: 'Músculos', icon: <FitnessCenterIcon fontSize="small" />, color: '#EF4444', hasOpacity: true },
    { key: 'nervous', label: 'Nervos Cranianos', icon: <PsychologyIcon fontSize="small" />, color: '#FACC15', hasOpacity: true },
    { key: 'vascular', label: 'Vasos Sanguíneos', icon: <BloodtypeIcon fontSize="small" />, color: '#DC2626', hasOpacity: true },
    { key: 'oral_tissue', label: 'Gengiva, Língua & Tecidos Orais', icon: <ScienceIcon fontSize="small" />, color: '#F472B6', hasOpacity: true },
  ];

  return (
    <Paper
      elevation={4}
      sx={{
        position: 'absolute',
        top,
        left: { xs: 10, sm: 14 },
        zIndex: 1100,
        backgroundColor: themeTokens.colors.bgOverlay,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${themeTokens.colors.borderSubtle}`,
        borderRadius: `${themeTokens.borderRadius.md}px`,
        px: 1.2,
        py: expanded ? 1.1 : 0.7,
        width: expanded ? 260 : 'fit-content',
        maxWidth: 'calc(100vw - 20px)',
        maxHeight: 'calc(100% - 70px)',
        overflowX: 'hidden',
        overflowY: expanded ? 'auto' : 'hidden',
        boxSizing: 'border-box',
        boxShadow: themeTokens.shadows.elevated,
        scrollbarWidth: 'thin',
        '&::-webkit-scrollbar': {
          width: '5px',
          height: '0px',
        },
        '&::-webkit-scrollbar:horizontal': {
          display: 'none',
          height: '0px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(255, 255, 255, 0.18)',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: 'rgba(255, 255, 255, 0.35)',
        },
        '& .MuiCollapse-root': {
          overflowX: 'hidden',
        },
        '& .MuiCollapse-wrapper': {
          overflowX: 'hidden',
        },
        '& .MuiCollapse-wrapperInner': {
          overflowX: 'hidden',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 0.8,
          cursor: 'pointer',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
          <LayersIcon fontSize="small" sx={{ color: themeTokens.colors.brandCyan }} />
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              fontSize: '0.78rem',
              color: themeTokens.colors.textPrimary,
              whiteSpace: 'nowrap',
            }}
          >
            Camadas Anatômicas
          </Typography>
        </Box>
        <IconButton size="small" sx={{ p: 0.2 }}>
          {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
        </IconButton>
      </Box>

      <Collapse in={expanded} unmountOnExit>
        <Divider sx={{ my: 1, borderColor: themeTokens.colors.borderSubtle }} />
        <Stack spacing={1}>
          {layerItems.map((layer) => {
            const isVisible = layers[layer.key];
            const currentOpacity = layer.hasOpacity ? opacities[layer.key as keyof LayerOpacity] : 1;

            return (
              <Box key={layer.key} sx={{ py: 0.2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ color: layer.color }}>{layer.icon}</Box>
                    <Typography variant="body2" sx={{ fontSize: '0.78rem', color: isVisible ? themeTokens.colors.textPrimary : themeTokens.colors.textMuted }}>
                      {layer.label}
                    </Typography>
                  </Box>

                  <Tooltip title={isVisible ? 'Ocultar camada' : 'Exibir camada'}>
                    <IconButton size="small" onClick={() => toggleLayer(layer.key)}>
                      {isVisible ? (
                        <VisibilityIcon fontSize="small" sx={{ color: themeTokens.colors.brandCyan, fontSize: '1rem' }} />
                      ) : (
                        <VisibilityOffIcon fontSize="small" sx={{ color: themeTokens.colors.textMuted, fontSize: '1rem' }} />
                      )}
                    </IconButton>
                  </Tooltip>
                </Box>

                {layer.hasOpacity && isVisible && (
                  <Box sx={{ px: 1, pt: 0.2 }}>
                    <Slider
                      size="small"
                      value={currentOpacity}
                      min={0.1}
                      max={1.0}
                      step={0.05}
                      onChange={(_, val) => setLayerOpacity(layer.key as keyof LayerOpacity, val as number)}
                      sx={{
                        color: themeTokens.colors.brandCyan,
                        height: 3,
                        '& .MuiSlider-thumb': {
                          width: 10,
                          height: 10,
                        },
                      }}
                    />
                  </Box>
                )}
              </Box>
            );
          })}
        </Stack>

        {/* Controle Anatômico: Abertura Bucal (Mandíbula / Boca do Esqueleto) — Ativo apenas no Atlas 3D, oculto nos Sistemas Anatômicos */}
        {isJawControlAllowed && (
          <>
            <Divider sx={{ my: 1.2, borderColor: themeTokens.colors.borderSubtle }} />
            <Box
              sx={{
                px: 0.8,
                py: 0.6,
                borderRadius: '8px',
                backgroundColor:
                  jawOpen ? 'rgba(0, 201, 246, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                border:
                  jawOpen
                    ? `1px solid ${themeTokens.colors.brandCyan}`
                    : '1px solid transparent',
                transition: 'all 0.2s ease',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <AccessibilityNewIcon
                    sx={{
                      fontSize: '0.95rem',
                      color: jawOpen ? themeTokens.colors.brandCyan : '#94A3B8',
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      color: jawOpen ? themeTokens.colors.brandCyan : themeTokens.colors.textPrimary,
                    }}
                  >
                    Abrir Boca (Esqueleto)
                  </Typography>
                </Box>

                <Switch
                  size="small"
                  checked={jawOpen}
                  onChange={() => toggleJawOpen()}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: themeTokens.colors.brandCyan,
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: themeTokens.colors.brandCyan,
                    },
                  }}
                />
              </Box>
              <Typography
                sx={{
                  fontSize: '0.66rem',
                  color: themeTokens.colors.textMuted,
                  lineHeight: 1.25,
                  px: 0.4,
                }}
              >
                {jawOpen
                  ? 'Mandíbula aberta com rotação na ATM.'
                  : 'Mandíbula fechada (em oclusão cêntrica).'}
              </Typography>
            </Box>
          </>
        )}

        {/* Controle de Dissecação 3D — Modo Vista Explodida do Crânio (0% a 100%) */}
        <Divider sx={{ my: 1.2, borderColor: themeTokens.colors.borderSubtle }} />
        <Box
          sx={{
            px: 0.6,
            py: 0.6,
            borderRadius: '8px',
            backgroundColor:
              explosionFactor > 0 ? 'rgba(0, 201, 246, 0.08)' : 'rgba(255, 255, 255, 0.02)',
            border:
              explosionFactor > 0
                ? '1px solid rgba(0, 201, 246, 0.28)'
                : '1px solid transparent',
            transition: 'all 0.2s ease',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <OpenWithIcon
                sx={{
                  fontSize: '0.95rem',
                  color: explosionFactor > 0 ? themeTokens.colors.brandCyan : '#94A3B8',
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  color: explosionFactor > 0 ? themeTokens.colors.brandCyan : themeTokens.colors.textPrimary,
                }}
              >
                Vista Explodida
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
              <Typography
                sx={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: explosionFactor > 0 ? themeTokens.colors.brandCyan : themeTokens.colors.textMuted,
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
                    <RestartAltIcon sx={{ fontSize: '0.95rem' }} />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>

          <Box sx={{ px: 0.8 }}>
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
                '& .MuiSlider-thumb': {
                  width: 12,
                  height: 12,
                },
              }}
            />
          </Box>
          <Typography
            sx={{
              fontSize: '0.66rem',
              color: themeTokens.colors.textMuted,
              lineHeight: 1.25,
              px: 0.4,
            }}
          >
            Afasta os ossos cranianos revelando suturas e seios paranasais internos.
          </Typography>
        </Box>
      </Collapse>
    </Paper>
  );
};
