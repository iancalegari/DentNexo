import React from 'react';
import {
  Paper,
  Box,
  Tooltip,
  IconButton,
  Divider,
} from '@mui/material';

// EXCLUSIVAMENTE ÍCONES DO MATERIAL UI
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid';

import { useAnatomyStore } from '@/stores/useAnatomyStore';
import { ViewPreset } from '@/types/anatomy';
import { themeTokens } from '@/theme/tokens';

export const CameraControls: React.FC = () => {
  const { cameraPreset, setCameraPreset, resetVisibility } = useAnatomyStore();

  const presets: { id: ViewPreset; label: string; icon: React.ReactNode }[] = [
    { id: 'isometric', label: 'Visão Isométrica 45°', icon: <ViewInArIcon fontSize="small" /> },
    { id: 'frontal', label: 'Vista Frontal / Anterior', icon: <VisibilityIcon fontSize="small" /> },
    { id: 'lateral_right', label: 'Vista Lateral Direita', icon: <RotateRightIcon fontSize="small" /> },
    { id: 'lateral_left', label: 'Vista Lateral Esquerda', icon: <RotateLeftIcon fontSize="small" /> },
    { id: 'superior', label: 'Vista Superior', icon: <ArrowUpwardIcon fontSize="small" /> },
    { id: 'inferior', label: 'Vista Inferior (Base)', icon: <ArrowDownwardIcon fontSize="small" /> },
    { id: 'occlusal_upper', label: 'Oclusal Superior', icon: <FlipCameraAndroidIcon fontSize="small" /> },
    { id: 'occlusal_lower', label: 'Oclusal Inferior', icon: <CenterFocusStrongIcon fontSize="small" /> },
  ];

  return (
    <Paper
      elevation={4}
      sx={{
        position: 'absolute',
        bottom: { xs: 10, sm: 14, lg: 18 },
        left: '50%',
        transform: 'translateX(-50%)',
        maxWidth: 'calc(100% - 16px)',
        overflowX: 'auto',
        zIndex: 1000,
        backgroundColor: themeTokens.colors.bgOverlay,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${themeTokens.colors.borderSubtle}`,
        borderRadius: `${themeTokens.borderRadius.round}px`,
        p: { xs: 0.4, sm: 0.55 },
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 0.25, sm: 0.4 },
        boxShadow: themeTokens.shadows.elevated,
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {presets.map((p) => {
        const isSelected = cameraPreset === p.id;
        return (
          <Tooltip key={p.id} title={p.label} placement="top" arrow>
            <IconButton
              size="small"
              onClick={() => setCameraPreset(p.id)}
              sx={{
                width: { xs: 28, sm: 32, lg: 34 },
                height: { xs: 28, sm: 32, lg: 34 },
                flexShrink: 0,
                color: isSelected ? themeTokens.colors.brandCyan : themeTokens.colors.textSecondary,
                backgroundColor: isSelected ? 'rgba(0, 201, 246, 0.15)' : 'transparent',
                border: isSelected ? `1px solid ${themeTokens.colors.brandCyan}` : '1px solid transparent',
                '&:hover': {
                  backgroundColor: 'rgba(0, 201, 246, 0.25)',
                  color: themeTokens.colors.brandCyan,
                },
              }}
            >
              {p.icon}
            </IconButton>
          </Tooltip>
        );
      })}
    </Paper>
  );
};
