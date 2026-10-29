import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Box,
  Chip,
  IconButton,
} from '@mui/material';

// EXCLUSIVAMENTE ÍCONES DO MATERIAL UI
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import { useAnatomyStore } from '@/stores/useAnatomyStore';
import { anatomicalStructures } from '@/data/anatomy/structures';
import { oralPathologies } from '@/data/pathologies/pathologiesData';
import { permanentTeethData } from '@/data/dental/teethData';
import { themeTokens } from '@/theme/tokens';

export const GlobalSearchDialog: React.FC = () => {
  const navigate = useNavigate();
  const {
    searchModalOpen,
    setSearchModalOpen,
    setSelectedStructure,
    isolateStructure,
    setFocusedSystem,
    setInfoPanelOpen,
    setActiveToothFdi,
    setActivePathology,
  } = useAnatomyStore();
  const [query, setQuery] = useState<string>('');

  // Atalho de Teclado Global Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
      if (e.key === 'Escape' && searchModalOpen) {
        setSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchModalOpen, setSearchModalOpen]);

  // Resultados da busca
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { structures: [], pathologies: [] };

    // Extrair dígitos se o usuário digitar "dente 22" ou "22"
    const queryDigits = q.replace(/\D/g, '');

    // Desduplicar estruturas por ID
    const uniqueStructures = Array.from(
      new Map(Object.values(anatomicalStructures).map((s) => [s.id, s])).values()
    );

    const foundStructuresMap = new Map<string, (typeof uniqueStructures)[0]>();

    // 1. Busca por texto nas estruturas
    uniqueStructures.forEach((s) => {
      const matchName = s.name.toLowerCase().includes(q);
      const matchSci = s.scientificName.toLowerCase().includes(q);
      const matchSyn = s.synonyms?.some((syn) => syn.toLowerCase().includes(q));
      const matchFdi = s.fdiNotation && (s.fdiNotation === q || s.fdiNotation === queryDigits);
      const matchId = s.id.toLowerCase().includes(q);
      const matchCategory = s.category.toLowerCase().includes(q);

      if (matchName || matchSci || matchSyn || matchFdi || matchId || matchCategory) {
        foundStructuresMap.set(s.id, s);
      }
    });

    // 2. Busca direta no catálogo dental por FDI e nome popular
    Object.values(permanentTeethData).forEach((tooth) => {
      const matchFdi = tooth.fdi === q || tooth.fdi === queryDigits;
      const matchName = tooth.name.toLowerCase().includes(q);
      const matchPop = tooth.popularName.toLowerCase().includes(q);

      if (matchFdi || matchName || matchPop) {
        const struct = anatomicalStructures[`dente_${tooth.fdi}`] || anatomicalStructures[tooth.fdi];
        if (struct) {
          foundStructuresMap.set(struct.id, struct);
        }
      }
    });

    const foundPathologies = Object.values(oralPathologies).filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        p.scientificName.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    });

    return {
      structures: Array.from(foundStructuresMap.values()),
      pathologies: foundPathologies,
    };
  }, [query]);

  const handleSelectStructure = (structureId: string, fdi?: string) => {
    let cleanId = structureId;
    if (!isNaN(Number(structureId))) {
      cleanId = `dente_${structureId}`;
    } else if (structureId.startsWith('tooth-')) {
      cleanId = structureId.replace('tooth-', 'dente_');
    }
    setFocusedSystem(null);
    setSelectedStructure(cleanId);
    isolateStructure(cleanId, true);
    setInfoPanelOpen(true);
    if (fdi) {
      setActiveToothFdi(fdi);
    }
    navigate('/atlas');
    setSearchModalOpen(false);
    setQuery('');
  };

  const handleSelectPathology = (pathologyId: string) => {
    setActivePathology(pathologyId);
    navigate('/pathologies');
    setSearchModalOpen(false);
    setQuery('');
  };

  return (
    <Dialog
      open={searchModalOpen}
      onClose={() => setSearchModalOpen(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: themeTokens.colors.bgSecondary,
          border: `1px solid ${themeTokens.colors.borderSubtle}`,
          borderRadius: 2,
          boxShadow: themeTokens.shadows.elevated,
          top: -80,
        },
      }}
    >
      <Box sx={{ p: 2, borderBottom: `1px solid ${themeTokens.colors.borderSubtle}` }}>
        <TextField
          autoFocus
          fullWidth
          placeholder="Pesquisar por estrutura, dente (FDI), músculo, nervo ou patologia..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          variant="standard"
          InputProps={{
            disableUnderline: true,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: themeTokens.colors.brandCyan }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchModalOpen(false)}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              fontSize: '1.05rem',
              color: themeTokens.colors.textPrimary,
            },
          }}
        />
      </Box>

      <DialogContent sx={{ p: 0, maxHeight: 380, minHeight: query ? 200 : 120 }}>
        {query.trim() === '' ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: themeTokens.colors.textMuted }}>
              Digite termos como <strong>"36"</strong>, <strong>"mandíbula"</strong>, <strong>"trigêmeo"</strong>, <strong>"masseter"</strong> ou <strong>"cárie"</strong>.
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {/* Estruturas Anatômicas Encontradas */}
            {results.structures && results.structures.length > 0 && (
              <>
                <Typography
                  variant="caption"
                  sx={{
                    px: 2,
                    pt: 1.5,
                    pb: 0.5,
                    fontWeight: 700,
                    color: themeTokens.colors.brandCyan,
                    display: 'block',
                    textTransform: 'uppercase',
                    fontSize: '0.68rem',
                  }}
                >
                  Estruturas Anatômicas ({results.structures.length})
                </Typography>
                {results.structures.map((s) => (
                  <ListItem key={s.id} disablePadding>
                    <ListItemButton
                      onClick={() => handleSelectStructure(s.id, s.fdiNotation)}
                      sx={{
                        px: 2,
                        py: 1,
                        borderBottom: `1px solid rgba(255, 255, 255, 0.03)`,
                        '&:hover': { backgroundColor: 'rgba(0, 201, 246, 0.08)' },
                      }}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: themeTokens.colors.textPrimary }}>
                              {s.name}
                            </Typography>
                            {s.fdiNotation && (
                              <Chip
                                label={`FDI ${s.fdiNotation}`}
                                size="small"
                                sx={{
                                  height: 18,
                                  fontSize: '0.65rem',
                                  backgroundColor: 'rgba(0, 201, 246, 0.15)',
                                  color: themeTokens.colors.brandCyan,
                                }}
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Typography variant="caption" sx={{ color: themeTokens.colors.textMuted, fontStyle: 'italic' }}>
                            {s.scientificName} • {s.region}
                          </Typography>
                        }
                      />
                      <ArrowForwardIosIcon sx={{ fontSize: '0.75rem', color: themeTokens.colors.textMuted }} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </>
            )}

            {/* Patologias Encontradas */}
            {results.pathologies && results.pathologies.length > 0 && (
              <>
                <Typography
                  variant="caption"
                  sx={{
                    px: 2,
                    pt: 1.5,
                    pb: 0.5,
                    fontWeight: 700,
                    color: '#F59E0B',
                    display: 'block',
                    textTransform: 'uppercase',
                    fontSize: '0.68rem',
                  }}
                >
                  Patologias Odontológicas ({results.pathologies.length})
                </Typography>
                {results.pathologies.map((p) => (
                  <ListItem key={p.id} disablePadding>
                    <ListItemButton
                      onClick={() => handleSelectPathology(p.id)}
                      sx={{
                        px: 2,
                        py: 1,
                        borderBottom: `1px solid rgba(255, 255, 255, 0.03)`,
                        '&:hover': { backgroundColor: 'rgba(245, 158, 11, 0.08)' },
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ fontWeight: 700, color: themeTokens.colors.textPrimary }}>
                            {p.name}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" sx={{ color: themeTokens.colors.textMuted, fontStyle: 'italic' }}>
                            {p.scientificName} • Categoria: {p.category}
                          </Typography>
                        }
                      />
                      <ArrowForwardIosIcon sx={{ fontSize: '0.75rem', color: themeTokens.colors.textMuted }} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </>
            )}

            {results.structures.length === 0 && results.pathologies.length === 0 && (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: themeTokens.colors.textMuted }}>
                  Nenhum resultado encontrado para "{query}".
                </Typography>
              </Box>
            )}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};
