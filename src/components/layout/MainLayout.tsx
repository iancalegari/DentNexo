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

export const MainLayout: React.FC = () => {
  const location = useLocation();

  const getSectionTitle = () => {
    switch (location.pathname) {
      case '/dental':
        return 'Anatomia Dental & Notação FDI';
      case '/skeletal':
        return 'Esqueleto Craniofacial & Mandíbula';
      case '/muscular':
        return 'Músculos da Mastigação';
      case '/nervous':
        return 'Inervação Trigeminal & Canais Nervosos';
      case '/vascular':
        return 'Vascularização Orofacial';
      case '/periodontal':
        return 'Periodonto & Tecidos de Sustentação';
      case '/pathologies':
        return 'Atlas de Patologias Odontológicas';
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
        width: '100vw',
        height: '100vh',
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
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        {/* 2. Barra Lateral Esquerda Navegacional (Região B) */}
        <SidebarNav />

        {/* 3. Área Central do Módulo / Visualizador 3D (Região C) */}
        <Box
          component="main"
          sx={{
            flex: 1,
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Outlet />
        </Box>

        {/* 4. Painel Lateral Direito Contextual (Região D) - Oculto em Questionários */}
        {!location.pathname.startsWith('/quiz') && <InfoPanel />}
      </Box>

      {/* Diálogos Globais */}
      <GlobalSearchDialog />
      <ExportDialog />

      {/* Menu de Contexto 3D (clique direito) - Oculto em Questionários */}
      {!location.pathname.startsWith('/quiz') && <ContextMenu3D />}
    </Box>
  );
};
