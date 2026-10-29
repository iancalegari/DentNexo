import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';

import { AppHeader } from './AppHeader';
import { SidebarNav } from './SidebarNav';
import { InfoPanel } from './InfoPanel';
import { GlobalSearchDialog } from '@/components/search/GlobalSearchDialog';
import { ExportDialog } from '@/components/controls/ExportDialog';
import { ContextMenu3D } from '@/components/3d/ContextMenu3D';
import { themeTokens } from '@/theme/tokens';
import { useAnatomyStore } from '@/stores/useAnatomyStore';

export const MainLayout: React.FC = () => {
  const location = useLocation();
  const {
    surfaceExplorationMode,
    setSurfaceExplorationMode,
    setSelectedStructure,
    setInfoPanelOpen,
    isolateStructure,
    setActiveAnesthesia,
    setExplosionFactor,
    resetCamera,
  } = useAnatomyStore();

  const prevPathRef = React.useRef(location.pathname);

  React.useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      const preserveIsolation = Boolean(
        (location.state as { preserveIsolation?: boolean } | null)?.preserveIsolation
      );

      // Ao trocar de aba/página manualmente, limpar a seleção; preservar quando vindo de Favoritos/Busca com estrutura isolada
      if (!preserveIsolation) {
        setSelectedStructure(null);
        isolateStructure(null);
        setInfoPanelOpen(false);
      }
      setExplosionFactor(0);

      if (location.pathname !== '/dental') {
        setSurfaceExplorationMode(false);
      }
      if (location.pathname !== '/anesthesia') {
        setActiveAnesthesia(null);
      }

      resetCamera();
      prevPathRef.current = location.pathname;
    }
  }, [
    location.pathname,
    location.state,
    setSelectedStructure,
    isolateStructure,
    setInfoPanelOpen,
    setSurfaceExplorationMode,
    setActiveAnesthesia,
    setExplosionFactor,
    resetCamera,
  ]);

  const getSectionTitle = () => {
    switch (location.pathname) {
      case '/dental':
        return 'Anatomia Dental & Notação FDI';
      case '/skeletal':
        return 'Esqueleto Craniofacial & Mandíbula';
      case '/muscular':
        return 'Músculos da Cabeça & Face';
      case '/nervous':
        return 'Inervação Trigeminal & Canais Nervosos';
      case '/vascular':
        return 'Vascularização Orofacial';
      case '/periodontal':
        return 'Periodonto & Tecidos de Sustentação';
      case '/pathologies':
        return 'Atlas de Patologias Odontológicas';
      case '/anesthesia':
        return 'Simulador 3D de Bloqueios Anestésicos Odontológicos';
      case '/quiz':
        return 'Questionários & Desafios 3D';
      case '/favorites':
        return 'Caderno de Estudos & Favoritos';
      case '/atlas':
      default:
        return 'Atlas Anatômico Interativo 3D';
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100dvh',
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: themeTokens.colors.bgMain,
        color: themeTokens.colors.textPrimary,
        overflow: 'hidden',
      }}
    >
      {/* 1. Barra Superior Principal (Região A) */}
      <AppHeader currentSectionTitle={getSectionTitle()} />

      {/* Regiões Centrais B, C e D */}
      <Box sx={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        {/* 2. Barra Lateral Esquerda Navegacional (Região B) */}
        <SidebarNav />

        {/* 3. Área Central do Módulo / Visualizador 3D (Região C) */}
        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Outlet />
        </Box>

        {/* 4. Painel Lateral Direito Contextual (Região D) - Oculto em Questionários, Patologias e Anestesiologia */}
        {!location.pathname.startsWith('/quiz') &&
          !location.pathname.startsWith('/pathologies') &&
          !location.pathname.startsWith('/anesthesia') && <InfoPanel />}
      </Box>

      {/* Diálogos Globais */}
      <GlobalSearchDialog />
      <ExportDialog />

      {/* Menu de Contexto 3D (clique direito) - Oculto em Questionários, Patologias e Anestesiologia */}
      {!location.pathname.startsWith('/quiz') &&
        !location.pathname.startsWith('/pathologies') &&
        !location.pathname.startsWith('/anesthesia') && <ContextMenu3D />}
    </Box>
  );
};
