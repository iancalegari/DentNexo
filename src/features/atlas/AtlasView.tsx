import React from 'react';
import { Box } from '@mui/material';
import { AnatomyViewer3D } from '@/components/3d/AnatomyViewer3D';
import { CameraControls } from '@/components/controls/CameraControls';
import { LayerControls } from '@/components/controls/LayerControls';

export const AtlasView: React.FC = () => {
  return (
    <Box sx={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* Visualizador Anatômico 3D Principal */}
      <AnatomyViewer3D />

      {/* Controles Flutuantes de Camadas Anatômicas */}
      <LayerControls />

      {/* Controles Flutuantes de Câmera e Vistas */}
      <CameraControls />
    </Box>
  );
};
