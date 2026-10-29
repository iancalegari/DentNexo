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

import { useAnatomyStore } from '@/stores/useAnatomyStore';
import { LayerOpacity, LayerVisibility } from '@/types/anatomy';
import { themeTokens } from '@/theme/tokens';

interface LayerControlsProps {
  top?: number | string;
  defaultExpanded?: boolean;
}

export const LayerControls: React.FC<LayerControlsProps> = ({
  top = 16,
  defaultExpanded = true,
}) => {
  const [expanded, setExpanded] = useState<boolean>(defaultExpanded);
  const { layers, opacities, toggleLayer, setLayerOpacity } = useAnatomyStore();

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
    { key: 'oral_tissue', label: 'Gengiva & Periodonto', icon: <ScienceIcon fontSize="small" />, color: '#F472B6', hasOpacity: true },
  ];

  return (
    <Paper
      elevation={4}
      sx={{
        position: 'absolute',
        top,
        left: 16,
        zIndex: 1000,
        backgroundColor: themeTokens.colors.bgOverlay,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${themeTokens.colors.borderSubtle}`,
        borderRadius: `${themeTokens.borderRadius.md}px`,
        p: 1.2,
        width: expanded ? 260 : 'auto',
        boxShadow: themeTokens.shadows.elevated,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LayersIcon fontSize="small" sx={{ color: themeTokens.colors.brandCyan }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.8rem', color: themeTokens.colors.textPrimary }}>
            Camadas Anatômicas
          </Typography>
        </Box>
        <IconButton size="small" sx={{ p: 0.2 }}>
          {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
        </IconButton>
      </Box>

      <Collapse in={expanded}>
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
      </Collapse>
    </Paper>
  );
};
