import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Stack,
  Button,
  Divider,
} from '@mui/material';

// EXCLUSIVAMENTE ÍCONES DO MATERIAL UI
import HubIcon from '@mui/icons-material/Hub';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';

import { useAnatomyStore } from '@/stores/useAnatomyStore';
import { anatomicalStructures } from '@/data/anatomy/structures';
import { anatomicalConnectionsMap } from '@/data/connections/anatomicalConnections';
import { AnatomyViewer3D } from '@/components/3d/AnatomyViewer3D';
import { themeTokens } from '@/theme/tokens';

export const ConnectionsView: React.FC = () => {
  const { selectedStructureId, setSelectedStructure } = useAnatomyStore();

  const currentId = selectedStructureId || 'dente_36';
  const currentStructure = anatomicalStructures[currentId] || anatomicalStructures['dente_36'];
  const connections = anatomicalConnectionsMap[currentId] || [];

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', overflow: 'hidden' }}>
      {/* Coluna Esquerda: Grafo Relacional & Lista de Conexões */}
      <Box
        sx={{
          width: { xs: '100%', md: 460 },
          height: '100%',
          overflowY: 'auto',
          backgroundColor: themeTokens.colors.bgSecondary,
          borderRight: `1px solid ${themeTokens.colors.borderSubtle}`,
          p: 2.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: themeTokens.colors.textPrimary, display: 'flex', alignItems: 'center', gap: 1 }}>
            <HubIcon sx={{ color: themeTokens.colors.brandCyan }} />
            Conexões Anatômicas
          </Typography>
          <Typography variant="body2" sx={{ color: themeTokens.colors.textMuted, mt: 0.5 }}>
            Compreenda as relações funcionais, trajetos vasculonervosos e suporte ósseo entre estruturas vizinhas.
          </Typography>
        </Box>

        {/* Estrutura Central em Foco */}
        <Paper
          sx={{
            p: 2,
            backgroundColor: themeTokens.colors.bgElevated,
            border: `1px solid ${themeTokens.colors.brandCyan}`,
            borderRadius: 1.5,
          }}
        >
          <Typography variant="caption" sx={{ color: themeTokens.colors.brandCyan, fontWeight: 700, textTransform: 'uppercase' }}>
            Estrutura em Foco
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, color: themeTokens.colors.textPrimary, mt: 0.2 }}>
            {currentStructure.name}
          </Typography>
          <Typography variant="body2" sx={{ fontStyle: 'italic', color: themeTokens.colors.textMuted }}>
            {currentStructure.scientificName}
          </Typography>
          <Typography variant="body2" sx={{ color: themeTokens.colors.textSecondary, mt: 1, fontSize: '0.84rem' }}>
            {currentStructure.description}
          </Typography>
        </Paper>

        <Typography variant="subtitle2" sx={{ color: themeTokens.colors.brandCyan, mt: 1 }}>
          Estruturas Relacionadas ({connections.length})
        </Typography>

        {/* Lista de Conexões com Ação de Seleção Imediata */}
        <Stack spacing={1.5}>
          {connections.length > 0 ? (
            connections.map((conn, idx) => {
              const target = anatomicalStructures[conn.targetStructureId];
              return (
                <Paper
                  key={idx}
                  sx={{
                    p: 1.8,
                    backgroundColor: themeTokens.colors.bgMain,
                    border: `1px solid ${themeTokens.colors.borderSubtle}`,
                    borderRadius: 1.5,
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      borderColor: themeTokens.colors.brandCyan,
                      backgroundColor: 'rgba(0, 201, 246, 0.04)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.8 }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: themeTokens.colors.textPrimary }}>
                        {target ? target.name : conn.targetStructureId}
                      </Typography>
                      <Chip
                        label={conn.relationLabel}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.68rem',
                          backgroundColor: 'rgba(0, 201, 246, 0.12)',
                          color: themeTokens.colors.brandCyan,
                          mt: 0.5,
                        }}
                      />
                    </Box>

                    <Button
                      size="small"
                      variant="outlined"
                      endIcon={<ArrowForwardIcon fontSize="small" />}
                      onClick={() => setSelectedStructure(conn.targetStructureId)}
                      sx={{
                        fontSize: '0.72rem',
                        py: 0.3,
                        px: 1.2,
                        whiteSpace: 'nowrap',
                        minWidth: 'auto',
                        flexShrink: 0,
                        ml: 1.5,
                      }}
                    >
                      Navegar
                    </Button>
                  </Box>

                  <Typography variant="body2" sx={{ fontSize: '0.8rem', color: themeTokens.colors.textSecondary, mt: 1 }}>
                    <strong>Relevância Anatômica & Clínica:</strong> {conn.clinicalSignificance}
                  </Typography>
                </Paper>
              );
            })
          ) : (
            <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: themeTokens.colors.bgMain }}>
              <Typography variant="body2" sx={{ color: themeTokens.colors.textMuted }}>
                Selecione estruturas como <strong>Mandíbula</strong>, <strong>Primeiro Molar (36)</strong> ou <strong>Nervo Alveolar Inferior</strong> para inspecionar relações detalhadas.
              </Typography>
            </Paper>
          )}
        </Stack>
      </Box>

      {/* Coluna Direita: Visualizador 3D Sincronizado */}
      <Box sx={{ flex: 1, height: '100%', position: 'relative', display: { xs: 'none', md: 'block' } }}>
        <AnatomyViewer3D />
      </Box>
    </Box>
  );
};
