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

import { useAnatomyStore } from '@/stores/useAnatomyStore';
import { themeTokens } from '@/theme/tokens';

interface AppHeaderProps {
  currentSectionTitle?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ currentSectionTitle = 'Atlas Anatômico 3D' }) => {
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

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: themeTokens.colors.bgSecondary,
        borderBottom: `1px solid ${themeTokens.colors.borderSubtle}`,
        height: 60,
        zIndex: 1100,
      }}
    >
      <Toolbar sx={{ minHeight: '60px !important', px: 2, display: 'flex', justifyContent: 'space-between' }}>
        {/* Lado Esquerdo: Toggle Lateral + Marca DentNexo + Seção */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Tooltip title={sidebarExpanded ? 'Recolher menu lateral' : 'Expandir menu lateral'}>
            <IconButton onClick={toggleSidebar} size="small" sx={{ color: themeTokens.colors.textPrimary }}>
              <MenuIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Logotipo DentNexo Oficial */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.2,
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <Box
              component="img"
              src="/logo_pura.svg"
              alt="DentNexo Logo"
              sx={{ width: 28, height: 28, objectFit: 'contain' }}
            />
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  fontSize: '1.15rem',
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
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  color: themeTokens.colors.textMuted,
                  display: 'block',
                }}
              >
                ATLAS ODONTOLÓGICO
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              height: 24,
              width: '1px',
              backgroundColor: themeTokens.colors.borderSubtle,
              mx: 1,
              display: { xs: 'none', md: 'block' },
            }}
          />

          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              fontSize: '0.88rem',
              color: themeTokens.colors.textPrimary,
              display: { xs: 'none', md: 'block' },
            }}
          >
            {currentSectionTitle}
          </Typography>
        </Box>

        {/* Centro: Campo de Pesquisa Anatômica Rápida */}
        <Box sx={{ flex: 1, maxWidth: 380, mx: 2, display: { xs: 'none', sm: 'block' } }}>
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
              py: 0.6,
              px: 1.5,
              fontSize: '0.8rem',
              '&:hover': {
                borderColor: themeTokens.colors.brandCyan,
                backgroundColor: 'rgba(0, 201, 246, 0.05)',
              },
            }}
          >
            <span>Buscar estrutura, dente (FDI) ou patologia...</span>
            <Chip
              label="Ctrl+K"
              size="small"
              sx={{
                height: 18,
                fontSize: '0.65rem',
                backgroundColor: themeTokens.colors.bgElevated,
                color: themeTokens.colors.textMuted,
                border: `1px solid ${themeTokens.colors.borderSubtle}`,
              }}
            />
          </Button>
        </Box>

        {/* Lado Direito: Modo Raio X + Exportar + Reset + Painel Lateral */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Botão de Busca Mobile */}
          <Tooltip title="Pesquisar estruturas">
            <IconButton
              onClick={() => setSearchModalOpen(true)}
              size="small"
              sx={{ display: { xs: 'flex', sm: 'none' } }}
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
                height: 32,
                fontSize: '0.75rem',
                px: 1.2,
                backgroundColor: xrayMode ? '#0284C7' : 'transparent',
                borderColor: xrayMode ? '#38BDF8' : themeTokens.colors.borderSubtle,
                color: xrayMode ? '#FFFFFF' : themeTokens.colors.textSecondary,
                '&:hover': {
                  backgroundColor: xrayMode ? '#0369A1' : 'rgba(2, 132, 199, 0.1)',
                },
              }}
            >
              <span style={{ display: 'inline-block' }}>Raio X</span>
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
                height: 32,
                fontSize: '0.75rem',
                px: 1.4,
                borderColor: 'rgba(0, 201, 246, 0.4)',
                color: themeTokens.colors.brandCyan,
              }}
            >
              Exportar
            </Button>
          </Tooltip>

          {/* Alternador do Painel Lateral de Detalhes Anatômicos */}
          <Tooltip title={infoPanelOpen ? 'Recolher painel de detalhes' : 'Exibir painel de detalhes anatômicos'}>
            <IconButton
              onClick={() => setInfoPanelOpen(!infoPanelOpen)}
              size="small"
              sx={{
                height: 32,
                width: 32,
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
        </Box>
      </Toolbar>
    </AppBar>
  );
};
