import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Tooltip,
  IconButton,
  Collapse,
} from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { useAnatomyStore } from '@/stores/useAnatomyStore';
import { permanentTeethData } from '@/data/dental/teethData';
import { deciduousTeethData } from '@/data/dental/deciduousTeethData';
import { themeTokens } from '@/theme/tokens';

// ==================== ÍCONES SVG ANATÔMICOS DOS DENTES (SILHUETAS DIDÁTICAS) ====================

// Molares: Coroa volumosa com múltiplos lóbulos/cúspides e sulcos oclusais
const MolarIcon: React.FC<{ isSelected?: boolean }> = () => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4.5 7 C4 4.5 6 3 8 3.8 C9.5 4.4 10.5 4.4 12 3.8 C13.5 4.4 14.5 4.4 16 3.8 C18 3 20 4.5 19.5 7 C19 10.5 18 15 17 18 C16.2 20.2 15 21 14 21 C13.2 21 12.6 18.5 12 17.5 C11.4 18.5 10.8 21 10 21 C9 21 7.8 20.2 7 18 C6 15 5 10.5 4.5 7 Z" />
    <path d="M8.5 7.5 C10 9 12 9.5 12 13" />
    <path d="M15.5 7.5 C14 9 12 9.5 12 13" />
  </svg>
);

// Pré-Molares: Coroa bicuspidada com 2 cúspides distintas e sulco central
const PremolarIcon: React.FC<{ isSelected?: boolean }> = () => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 7.5 C5.5 5 8 3.8 10 4.2 C11 4.5 13 4.5 14 4.2 C16 3.8 18.5 5 18 7.5 C17.5 11 16.5 15.5 15 18.5 C14 20.5 13.2 21 12 21 C10.8 21 10 20.5 9 18.5 C7.5 15.5 6.5 11 6 7.5 Z" />
    <path d="M10 8 C11 9.5 12 10.2 12 13" />
    <path d="M14 8 C13 9.5 12 10.2 12 13" />
  </svg>
);

// Caninos: Coroa pontiaguda com cúspide em lança e crista central proeminente
const CanineIcon: React.FC<{ isSelected?: boolean }> = () => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M7 8.5 C6.5 6 9.5 3.8 12 2.6 C14.5 3.8 17.5 6 17 8.5 C16.5 12 15.5 16 14 18.8 C13.2 20.5 12.6 21.2 12 21.2 C11.4 21.2 10.8 20.5 10 18.8 C8.5 16 7.5 12 7 8.5 Z" />
    <line x1="12" y1="5.5" x2="12" y2="13.5" />
  </svg>
);

// Incisivos: Coroa plana em cunha/pá com bordo incisal reto
const IncisorIcon: React.FC<{ isSelected?: boolean }> = () => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6.5 5 C9 4.3 15 4.3 17.5 5 C17.8 8 16.8 13.5 15 17.5 C13.8 20 13 21 12 21 C11 21 10.2 20 9 17.5 C7.2 13.5 6.2 8 6.5 5 Z" />
    <line x1="8.5" y1="5.8" x2="15.5" y2="5.8" />
    <line x1="12" y1="7.5" x2="12" y2="13" />
  </svg>
);

const getToothTypeIcon = (fdi: string, isSelected: boolean) => {
  const lastDigit = parseInt(fdi[fdi.length - 1], 10);

  // Molares: 6, 7, 8 (permanentes) ou 4, 5 (decíduos)
  if (lastDigit === 6 || lastDigit === 7 || lastDigit === 8 || (fdi.length === 2 && parseInt(fdi[0], 10) >= 5 && lastDigit === 5)) {
    return <MolarIcon isSelected={isSelected} />;
  }
  // Pré-molares: 4, 5 (permanentes) ou 4 (decíduos)
  if (lastDigit === 4 || lastDigit === 5) {
    return <PremolarIcon isSelected={isSelected} />;
  }
  // Caninos: 3
  if (lastDigit === 3) {
    return <CanineIcon isSelected={isSelected} />;
  }
  // Incisivos: 1, 2
  return <IncisorIcon isSelected={isSelected} />;
};

interface OdontogramFDIProps {
  allowDeciduous?: boolean;
}

export const OdontogramFDI: React.FC<OdontogramFDIProps> = ({ allowDeciduous = true }) => {
  const [dentition, setDentition] = useState<'permanent' | 'deciduous'>('permanent');
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const {
    activeToothFdi,
    surfaceExplorationMode,
    setActiveToothFdi,
    setSelectedStructure,
    setInfoPanelOpen,
  } = useAnatomyStore();

  const canShowDeciduous = allowDeciduous && !surfaceExplorationMode;
  const effectiveDentition = canShowDeciduous ? dentition : 'permanent';

  React.useEffect(() => {
    if (!canShowDeciduous && dentition === 'deciduous') {
      setDentition('permanent');
    }
  }, [canShowDeciduous, dentition]);

  // Dentição Permanente (ISO 3950)
  // Arco Superior: 18 a 11 (Quadrante 1) | 21 a 28 (Quadrante 2)
  const q1 = ['18', '17', '16', '15', '14', '13', '12', '11'];
  const q2 = ['21', '22', '23', '24', '25', '26', '27', '28'];

  // Arco Inferior: 48 a 41 (Quadrante 4) | 31 a 38 (Quadrante 3)
  const q4 = ['48', '47', '46', '45', '44', '43', '42', '41'];
  const q3 = ['31', '32', '33', '34', '35', '36', '37', '38'];

  // Dentição Decídua
  const q5 = ['55', '54', '53', '52', '51'];
  const q6 = ['61', '62', '63', '64', '65'];
  const q8 = ['85', '84', '83', '82', '81'];
  const q7 = ['71', '72', '73', '74', '75'];

  const handleSelectTooth = (fdi: string) => {
    setActiveToothFdi(fdi);
    setSelectedStructure(`dente_${fdi}`);
    if (typeof window === 'undefined' || window.innerWidth >= 900) {
      setInfoPanelOpen(true);
    }
  };

  const renderToothCard = (fdi: string) => {
    const isSelected = activeToothFdi === fdi;
    const toothInfo = permanentTeethData[fdi] || deciduousTeethData[fdi];

    return (
      <Tooltip
        key={fdi}
        title={toothInfo ? `${toothInfo.name} (${toothInfo.popularName})` : `Dente FDI ${fdi}`}
        arrow
        placement="top"
      >
        <Box
          onClick={() => handleSelectTooth(fdi)}
          sx={{
            width: { xs: 28, sm: 32, md: 34, xl: 38 },
            height: { xs: 44, sm: 48, md: 50, xl: 58 },
            '@media (max-height: 800px)': {
              width: 31,
              height: 42,
              py: 0.4,
            },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            py: { xs: 0.45, sm: 0.6 },
            borderRadius: '6px',
            cursor: 'pointer',
            backgroundColor: isSelected ? '#155E75' : 'rgba(255, 255, 255, 0.02)',
            color: isSelected ? '#FFFFFF' : '#94A3B8',
            border: isSelected ? `2px solid #00C9F6` : `1px solid rgba(255, 255, 255, 0.08)`,
            boxShadow: isSelected ? '0 0 10px rgba(0, 201, 246, 0.35)' : 'none',
            transition: 'all 0.16s ease-in-out',
            userSelect: 'none',
            flexShrink: 0,
            '&:hover': {
              borderColor: '#00C9F6',
              backgroundColor: isSelected ? '#155E75' : 'rgba(0, 201, 246, 0.12)',
              color: '#FFFFFF',
              transform: 'translateY(-2px)',
            },
          }}
        >
          {/* Desenho Anatômico do Dente */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isSelected ? '#38BDF8' : '#64748B',
              mt: 0.1,
              '& svg': {
                width: { xs: 14, sm: 16, xl: 19 },
                height: { xs: 14, sm: 16, xl: 19 },
                '@media (max-height: 800px)': {
                  width: 15,
                  height: 15,
                },
              },
            }}
          >
            {getToothTypeIcon(fdi, isSelected)}
          </Box>

          {/* Número FDI ISO 3950 */}
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: { xs: '0.68rem', sm: '0.74rem', xl: '0.82rem' },
              '@media (max-height: 800px)': {
                fontSize: '0.7rem',
              },
              lineHeight: 1,
              color: isSelected ? '#FFFFFF' : '#CBD5E1',
            }}
          >
            {fdi}
          </Typography>
        </Box>
      </Tooltip>
    );
  };

  return (
    <Paper
      elevation={2}
      sx={{
        px: { xs: 1.1, sm: 1.5 },
        py: { xs: 0.8, sm: 1.0 },
        '@media (max-height: 800px)': {
          py: 0.65,
        },
        backgroundColor: themeTokens.colors.bgSecondary,
        border: `1px solid ${themeTokens.colors.borderSubtle}`,
        borderRadius: 2,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: collapsed ? 0 : 0.8, flexWrap: 'wrap', gap: 0.8 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, minWidth: 0 }}>
          <IconButton
            size="small"
            onClick={() => setCollapsed(!collapsed)}
            sx={{ p: 0.3, color: themeTokens.colors.brandCyan }}
            title={collapsed ? 'Expandir Odontograma' : 'Recolher Odontograma'}
          >
            {collapsed ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
          </IconButton>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="subtitle1"
              onClick={() => setCollapsed(!collapsed)}
              sx={{
                fontWeight: 800,
                fontSize: { xs: '0.8rem', sm: '0.88rem' },
                lineHeight: 1.2,
                color: themeTokens.colors.textPrimary,
                cursor: 'pointer',
              }}
            >
              Odontograma FDI (ISO 3950) {collapsed ? `• Dente ${activeToothFdi}` : ''}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: themeTokens.colors.textMuted,
                display: { xs: 'none', xl: 'block' },
                '@media (max-height: 820px)': {
                  display: 'none',
                },
              }}
            >
              Clique em qualquer dente para visualizar a anatomia 3D individual e a explicação clínica completa no painel à direita.
            </Typography>
          </Box>
        </Box>

        {!collapsed && (
          <Tabs
            value={effectiveDentition}
            onChange={(_, val) => setDentition(val)}
            sx={{
              minHeight: 28,
              '& .MuiTab-root': {
                minHeight: 28,
                py: 0.2,
                px: { xs: 0.9, sm: 1.2 },
                fontSize: { xs: '0.7rem', sm: '0.74rem' },
                fontWeight: 700,
              },
            }}
          >
            <Tab value="permanent" label="Permanente (32)" />
            {canShowDeciduous && <Tab value="deciduous" label="Decídua (20)" />}
          </Tabs>
        )}
      </Box>

      {/* Grid Odontograma no Formato Fiel (Upper / Lower com Divisor Central) */}
      <Collapse in={!collapsed} unmountOnExit>
        <Box
          sx={{
            display: 'flex',
            p: { xs: 0.8, sm: 1.0 },
            '@media (max-height: 800px)': {
              p: 0.7,
            },
            backgroundColor: '#0F1722',
            borderRadius: 1.5,
            border: `1px solid ${themeTokens.colors.borderSubtle}`,
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            width: '100%',
          }}
        >
          {effectiveDentition === 'permanent' ? (
            <Box sx={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', minWidth: 'max-content', mx: 'auto' }}>
              {/* LINHA SUPERIOR (UPPER): 18 a 11 | 21 a 28 */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.45 }}>
                <Box sx={{ display: 'flex', gap: 0.45 }}>{q1.map(renderToothCard)}</Box>
                <Box sx={{ width: '2px', height: 38, backgroundColor: 'rgba(0, 201, 246, 0.4)', mx: 0.5 }} />
                <Box sx={{ display: 'flex', gap: 0.45 }}>{q2.map(renderToothCard)}</Box>
              </Box>

              {/* DIVISOR CENTRAL (UPPER / LOWER) */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  my: 0.45,
                  '@media (max-height: 800px)': {
                    my: 0.25,
                  },
                }}
              >
                <Box sx={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
                <Box sx={{ px: 1.5, display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      color: '#94A3B8',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      lineHeight: 1,
                    }}
                  >
                    Superior / Inferior
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
              </Box>

              {/* LINHA INFERIOR (LOWER): 48 a 41 | 31 a 38 */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.45 }}>
                <Box sx={{ display: 'flex', gap: 0.45 }}>{q4.map(renderToothCard)}</Box>
                <Box sx={{ width: '2px', height: 38, backgroundColor: 'rgba(0, 201, 246, 0.4)', mx: 0.5 }} />
                <Box sx={{ display: 'flex', gap: 0.45 }}>{q3.map(renderToothCard)}</Box>
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', minWidth: 'max-content', mx: 'auto' }}>
              {/* Dentição Decídua Superior: 55 a 51 | 61 a 65 */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.45 }}>
                <Box sx={{ display: 'flex', gap: 0.45 }}>{q5.map(renderToothCard)}</Box>
                <Box sx={{ width: '2px', height: 38, backgroundColor: 'rgba(0, 201, 246, 0.4)', mx: 0.5 }} />
                <Box sx={{ display: 'flex', gap: 0.45 }}>{q6.map(renderToothCard)}</Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  my: 0.45,
                  '@media (max-height: 800px)': {
                    my: 0.25,
                  },
                }}
              >
                <Box sx={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
                <Box sx={{ px: 1.5, display: 'flex', alignItems: 'center' }}>
                  <Typography variant="caption" sx={{ fontSize: '0.6rem', fontWeight: 700, color: '#94A3B8', lineHeight: 1 }}>
                    Decíduo Sup. / Inf.
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
              </Box>

              {/* Dentição Decídua Inferior: 85 a 81 | 71 a 75 */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.45 }}>
                <Box sx={{ display: 'flex', gap: 0.45 }}>{q8.map(renderToothCard)}</Box>
                <Box sx={{ width: '2px', height: 38, backgroundColor: 'rgba(0, 201, 246, 0.4)', mx: 0.5 }} />
                <Box sx={{ display: 'flex', gap: 0.45 }}>{q7.map(renderToothCard)}</Box>
              </Box>
            </Box>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
};
