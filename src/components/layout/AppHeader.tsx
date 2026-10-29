import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
  Tooltip,
  Chip,
} from '@mui/material';

// Importando EXCLUSIVAMENTE ícones de @mui/icons-material
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import LayersIcon from '@mui/icons-material/Layers';
import BiotechIcon from '@mui/icons-material/Biotech';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ContrastIcon from '@mui/icons-material/Contrast';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import ViewSidebarIcon from '@mui/icons-material/ViewSidebar';

import { useLocation, useNavigate } from 'react-router-dom';
import { useAnatomyStore } from '@/stores/useAnatomyStore';
import { themeTokens } from '@/theme/tokens';

interface AppHeaderProps {
  currentSectionTitle?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ currentSectionTitle = 'Atlas Anatômico 3D' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    xrayMode,
    sidebarExpanded,
    infoPanelOpen,
    setXRayMode,
    resetVisibility,
    toggleSidebar,
    setSearchModalOpen,
    setExportDialogOpen,
    setInfoPanelOpen,
  } = useAnatomyStore();

  const hideInfoToggle =
    location.pathname.startsWith('/quiz') ||
    location.pathname.startsWith('/pathologies') ||
    location.pathname.startsWith('/anesthesia') ||
    location.pathname.startsWith('/favorites');

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: themeTokens.colors.bgSecondary,
        borderBottom: `1px solid ${themeTokens.colors.borderSubtle}`,
        height: { xs: 50, sm: 54, lg: 58 },
        '@media (max-height: 760px)': {
          height: 48,
        },
        flexShrink: 0,
        zIndex: 1100,
      }}
    >
      <Toolbar
        sx={{
          minHeight: '100% !important',
          height: '100%',
          px: { xs: 1, sm: 1.5, md: 2 },
          display: 'flex',
          justifyContent: 'space-between',
          gap: 1,
        }}
      >
        {/* Lado Esquerdo: Toggle Lateral + Marca DentNexo + Seção */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.8, sm: 1.2 }, minWidth: 0 }}>
          <Tooltip title={sidebarExpanded ? 'Recolher menu lateral' : 'Abrir menu lateral'}>
            <IconButton onClick={toggleSidebar} size="small" sx={{ color: themeTokens.colors.textPrimary }}>
              <MenuIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Logotipo DentNexo Oficial */}
          <Box
            onClick={() => navigate('/atlas')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 0.8, sm: 1.1 },
              cursor: 'pointer',
              userSelect: 'none',
              flexShrink: 0,
            }}
          >
            <Box
              component="img"
              src="/logo_pura.svg"
              alt="DentNexo Logo"
              sx={{ width: { xs: 24, sm: 27 }, height: { xs: 24, sm: 27 }, objectFit: 'contain' }}
            />
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '0.98rem', sm: '1.1rem' },
                  letterSpacing: '0.02em',
                  lineHeight: 1,
                  display: 'flex',
                }}
              >
                <span>DENT</span>
                <span style={{ color: themeTokens.colors.brandCyan }}>NEXO</span>
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.58rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  color: themeTokens.colors.textMuted,
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                ATLAS ODONTOLÓGICO
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              height: 22,
              width: '1px',
              backgroundColor: themeTokens.colors.borderSubtle,
              mx: 0.8,
              display: { xs: 'none', lg: 'block' },
              flexShrink: 0,
            }}
          />

          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              fontSize: '0.84rem',
              color: themeTokens.colors.textPrimary,
              display: { xs: 'none', lg: 'block' },
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {currentSectionTitle}
          </Typography>
        </Box>

        {/* Centro: Campo de Pesquisa Anatômica Rápida */}
        <Box sx={{ flex: 1, maxWidth: { md: 290, lg: 370 }, mx: { md: 1, lg: 2 }, display: { xs: 'none', md: 'block' } }}>
          <Button
            onClick={() => setSearchModalOpen(true)}
            variant="outlined"
            fullWidth
            size="small"
            startIcon={<SearchIcon fontSize="small" sx={{ color: themeTokens.colors.brandCyan }} />}
            sx={{
              justifyContent: 'space-between',
              backgroundColor: themeTokens.colors.bgMain,
              borderColor: themeTokens.colors.borderSubtle,
              color: themeTokens.colors.textSecondary,
              py: 0.45,
              px: 1.2,
              fontSize: '0.76rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              '&:hover': {
                borderColor: themeTokens.colors.brandCyan,
                backgroundColor: 'rgba(0, 201, 246, 0.05)',
              },
            }}
          >
            <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Buscar estrutura, dente (FDI) ou patologia...
            </Box>
            <Chip
              label="Ctrl+K"
              size="small"
              sx={{
                height: 18,
                ml: 0.8,
                flexShrink: 0,
                fontSize: '0.62rem',
                display: { md: 'none', lg: 'inline-flex' },
                backgroundColor: themeTokens.colors.bgElevated,
                color: themeTokens.colors.textMuted,
                border: `1px solid ${themeTokens.colors.borderSubtle}`,
              }}
            />
          </Button>
        </Box>

        {/* Lado Direito: Modo Raio X + Exportar + Reset + Painel Lateral */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 0.8 }, flexShrink: 0 }}>
          {/* Botão de Busca Mobile / Tablet Retrato */}
          <Tooltip title="Pesquisar estruturas">
            <IconButton
              onClick={() => setSearchModalOpen(true)}
              size="small"
              sx={{ display: { xs: 'flex', md: 'none' }, color: themeTokens.colors.brandCyan }}
            >
              <SearchIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Alternador de Visão Radiográfica (Raio X) */}
          <Tooltip title={xrayMode ? 'Desativar Visão Radiográfica' : 'Ativar Visão Radiográfica (Raio X didático)'}>
            <Button
              onClick={() => setXRayMode(!xrayMode)}
              variant={xrayMode ? 'contained' : 'outlined'}
              size="small"
              startIcon={<ContrastIcon fontSize="small" />}
              sx={{
                height: { xs: 30, sm: 32 },
                minWidth: { xs: 34, sm: 'auto' },
                fontSize: '0.74rem',
                px: { xs: 0.8, sm: 1.2 },
                '& .MuiButton-startIcon': {
                  mr: { xs: 0, sm: 0.7 },
                  ml: 0,
                },
                backgroundColor: xrayMode ? '#0284C7' : 'transparent',
                borderColor: xrayMode ? '#38BDF8' : themeTokens.colors.borderSubtle,
                color: xrayMode ? '#FFFFFF' : themeTokens.colors.textSecondary,
                '&:hover': {
                  backgroundColor: xrayMode ? '#0369A1' : 'rgba(2, 132, 199, 0.1)',
                },
              }}
            >
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline-block' } }}>
                Raio X
              </Box>
            </Button>
          </Tooltip>

          {/* Reset da Câmera e Visibilidade */}
          <Tooltip title="Restaurar estado anatômico inicial">
            <IconButton onClick={resetVisibility} size="small">
              <RestartAltIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Exportar Imagem com Marca d'Água Oficial */}
          <Tooltip title="Capturar e exportar imagem com marca-d'água">
            <Button
              onClick={() => setExportDialogOpen(true)}
              variant="outlined"
              size="small"
              startIcon={<CameraAltIcon fontSize="small" />}
              sx={{
                height: { xs: 30, sm: 32 },
                minWidth: { xs: 34, sm: 'auto' },
                fontSize: '0.74rem',
                px: { xs: 0.8, sm: 1.3 },
                '& .MuiButton-startIcon': {
                  mr: { xs: 0, sm: 0.7 },
                  ml: 0,
                },
                borderColor: 'rgba(0, 201, 246, 0.4)',
                color: themeTokens.colors.brandCyan,
              }}
            >
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline-block' } }}>
                Exportar
              </Box>
            </Button>
          </Tooltip>

          {/* Alternador do Painel Lateral de Detalhes Anatômicos */}
          {!hideInfoToggle && (
            <Tooltip title={infoPanelOpen ? 'Recolher painel de detalhes' : 'Exibir painel de detalhes anatômicos'}>
              <IconButton
                onClick={() => setInfoPanelOpen(!infoPanelOpen)}
                size="small"
                sx={{
                  height: { xs: 30, sm: 32 },
                  width: { xs: 30, sm: 32 },
                  border: `1px solid ${infoPanelOpen ? themeTokens.colors.brandCyan : themeTokens.colors.borderSubtle}`,
                  color: infoPanelOpen ? themeTokens.colors.brandCyan : themeTokens.colors.textSecondary,
                  backgroundColor: infoPanelOpen ? 'rgba(0, 201, 246, 0.12)' : 'transparent',
                  '&:hover': {
                    borderColor: themeTokens.colors.brandCyan,
                    color: themeTokens.colors.brandCyan,
                  },
                }}
              >
                <ViewSidebarIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
