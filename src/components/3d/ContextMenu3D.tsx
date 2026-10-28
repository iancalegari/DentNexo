import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  MenuList,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  TextField,
  Button,
  Stack,
  Fade,
  IconButton,
} from '@mui/material';

import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import HighlightIcon from '@mui/icons-material/Highlight';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import CloseIcon from '@mui/icons-material/Close';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

import { useAnatomyStore } from '@/stores/useAnatomyStore';
import { anatomicalStructures } from '@/data/anatomy/structures';
import { storageService } from '@/services/storageService';
import { themeTokens } from '@/theme/tokens';

interface ContextMenu3DProps {
  onNavigateToNote?: (structureId: string) => void;
}

export const ContextMenu3D: React.FC<ContextMenu3DProps> = ({ onNavigateToNote }) => {
  const {
    selectedStructureId,
    isolatedStructureId,
    hiddenStructureIds,
    isolateStructure,
    hideStructure,
    unhideStructure,
    setSelectedStructure,
    setInfoPanelOpen,
  } = useAnatomyStore();

  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  const structure = selectedStructureId ? anatomicalStructures[selectedStructureId] : null;

  // Atualizar estado de favorito quando a estrutura selecionada mudar
  useEffect(() => {
    if (selectedStructureId) {
      setIsFavorite(storageService.isFavorite(selectedStructureId));
    }
  }, [selectedStructureId]);

  // Interceptar clique direito global sobre o canvas 3D
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Verificar se o clique foi dentro de um canvas (3D viewer)
      if (target.tagName === 'CANVAS' && selectedStructureId) {
        e.preventDefault();
        setMenuPosition({ x: e.clientX, y: e.clientY });
        setShowNoteForm(false);
        setNoteTitle('');
        setNoteContent('');
      }
    };

    const handleClick = () => {
      if (!showNoteForm) {
        setMenuPosition(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuPosition(null);
        setShowNoteForm(false);
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedStructureId, showNoteForm]);

  const handleToggleFavorite = () => {
    if (!selectedStructureId) return;
    const updated = storageService.toggleFavorite(selectedStructureId);
    setIsFavorite(updated.includes(selectedStructureId));
    setMenuPosition(null);
  };

  const handleAnnotate = () => {
    setShowNoteForm(true);
    if (structure) {
      setNoteTitle(`Anotação: ${structure.name}`);
    }
  };

  const handleSaveNote = () => {
    if (!selectedStructureId || !noteTitle.trim() || !noteContent.trim()) return;

    storageService.saveNote({
      structureId: selectedStructureId,
      structureName: structure?.name || selectedStructureId,
      title: noteTitle,
      content: noteContent,
      tags: ['Anotação 3D', structure?.category || 'Geral'],
    });

    setMenuPosition(null);
    setShowNoteForm(false);
    setNoteTitle('');
    setNoteContent('');
  };

  const handleIsolate = () => {
    if (!selectedStructureId) return;
    isolateStructure(selectedStructureId);
    setMenuPosition(null);
  };

  const isHidden = selectedStructureId ? hiddenStructureIds.includes(selectedStructureId) : false;

  const handleToggleHide = () => {
    if (!selectedStructureId) return;
    if (isHidden) {
      unhideStructure(selectedStructureId);
    } else {
      hideStructure(selectedStructureId);
    }
    setMenuPosition(null);
  };

  const handleUnhideAll = () => {
    hiddenStructureIds.forEach((id) => unhideStructure(id));
    setMenuPosition(null);
  };

  const handleShowDetails = () => {
    if (selectedStructureId) {
      setSelectedStructure(selectedStructureId);
    }
    setInfoPanelOpen(true);
    setMenuPosition(null);
  };

  if (!menuPosition || !structure) return null;

  const isIsolated = isolatedStructureId === selectedStructureId;

  // Ajustar posição para não sair da tela
  const adjustedX = Math.min(menuPosition.x, window.innerWidth - (showNoteForm ? 380 : 260));
  const adjustedY = Math.min(menuPosition.y, window.innerHeight - (showNoteForm ? 320 : 280));

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        pointerEvents: showNoteForm ? 'auto' : 'none',
      }}
      onClick={(e) => {
        if (showNoteForm) {
          e.stopPropagation();
        }
      }}
    >
      <Fade in timeout={150}>
        <Paper
          elevation={16}
          onClick={(e) => e.stopPropagation()}
          sx={{
            position: 'absolute',
            top: adjustedY,
            left: adjustedX,
            minWidth: showNoteForm ? 360 : 240,
            pointerEvents: 'auto',
            backgroundColor: themeTokens.colors.bgElevated,
            border: `1px solid ${themeTokens.colors.borderSubtle}`,
            borderRadius: `${themeTokens.borderRadius.md}px`,
            overflow: 'hidden',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.7), 0 0 1px rgba(0, 201, 246, 0.3)',
          }}
        >
          {/* Cabeçalho com nome da estrutura */}
          <Box
            sx={{
              px: 2,
              py: 1.2,
              backgroundColor: 'rgba(0, 201, 246, 0.08)',
              borderBottom: `1px solid ${themeTokens.colors.borderSubtle}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 800, color: themeTokens.colors.textPrimary, fontSize: '0.85rem' }}
              >
                {structure.name}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: themeTokens.colors.brandCyan, fontStyle: 'italic', fontSize: '0.7rem' }}
              >
                {structure.scientificName}
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={() => {
                setMenuPosition(null);
                setShowNoteForm(false);
              }}
              sx={{ color: themeTokens.colors.textMuted }}
            >
              <CloseIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>

          {!showNoteForm ? (
            <MenuList dense sx={{ py: 0.5 }}>
              {/* Favoritar */}
              <MenuItem
                onClick={handleToggleFavorite}
                sx={{
                  py: 1,
                  '&:hover': { backgroundColor: 'rgba(0, 201, 246, 0.08)' },
                }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  {isFavorite ? (
                    <BookmarkIcon fontSize="small" sx={{ color: themeTokens.colors.brandCyan }} />
                  ) : (
                    <BookmarkBorderIcon fontSize="small" sx={{ color: themeTokens.colors.textSecondary }} />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                  primaryTypographyProps={{
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: themeTokens.colors.textPrimary,
                  }}
                />
              </MenuItem>

              {/* Anotar */}
              <MenuItem
                onClick={handleAnnotate}
                sx={{
                  py: 1,
                  '&:hover': { backgroundColor: 'rgba(0, 201, 246, 0.08)' },
                }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <NoteAltIcon fontSize="small" sx={{ color: '#F59E0B' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Criar Anotação"
                  primaryTypographyProps={{
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: themeTokens.colors.textPrimary,
                  }}
                />
              </MenuItem>

              <Divider sx={{ borderColor: themeTokens.colors.borderSubtle, my: 0.5 }} />

              {/* Isolar */}
              <MenuItem
                onClick={handleIsolate}
                sx={{
                  py: 1,
                  '&:hover': { backgroundColor: 'rgba(0, 201, 246, 0.08)' },
                }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <HighlightIcon fontSize="small" sx={{ color: '#10B981' }} />
                </ListItemIcon>
                <ListItemText
                  primary={isIsolated ? 'Restaurar Visualização' : 'Isolar Estrutura'}
                  primaryTypographyProps={{
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: themeTokens.colors.textPrimary,
                  }}
                />
              </MenuItem>

              {/* Ocultar / Reexibir Estrutura */}
              <MenuItem
                onClick={handleToggleHide}
                sx={{
                  py: 1,
                  '&:hover': {
                    backgroundColor: isHidden
                      ? 'rgba(16, 185, 129, 0.08)'
                      : 'rgba(239, 68, 68, 0.08)',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  {isHidden ? (
                    <VisibilityIcon fontSize="small" sx={{ color: '#10B981' }} />
                  ) : (
                    <VisibilityOffIcon fontSize="small" sx={{ color: '#EF4444' }} />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={isHidden ? 'Reexibir Estrutura' : 'Ocultar Estrutura'}
                  primaryTypographyProps={{
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: isHidden ? '#34D399' : themeTokens.colors.textPrimary,
                  }}
                />
              </MenuItem>

              {/* Reexibir Todas as Estruturas Ocultas */}
              {hiddenStructureIds.length > 0 && (
                <MenuItem
                  onClick={handleUnhideAll}
                  sx={{
                    py: 1,
                    '&:hover': { backgroundColor: 'rgba(16, 185, 129, 0.12)' },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <VisibilityIcon fontSize="small" sx={{ color: '#10B981' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Reexibir Tudo (${hiddenStructureIds.length})`}
                    primaryTypographyProps={{
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: '#34D399',
                    }}
                  />
                </MenuItem>
              )}

              <Divider sx={{ borderColor: themeTokens.colors.borderSubtle, my: 0.5 }} />

              {/* Ver Detalhes */}
              <MenuItem
                onClick={handleShowDetails}
                sx={{
                  py: 1,
                  '&:hover': { backgroundColor: 'rgba(0, 201, 246, 0.08)' },
                }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CenterFocusStrongIcon fontSize="small" sx={{ color: themeTokens.colors.brandCyan }} />
                </ListItemIcon>
                <ListItemText
                  primary="Abrir Painel de Detalhes"
                  primaryTypographyProps={{
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: themeTokens.colors.textPrimary,
                  }}
                />
              </MenuItem>
            </MenuList>
          ) : (
            /* Formulário de Anotação Inline */
            <Box sx={{ p: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{ color: themeTokens.colors.brandCyan, fontWeight: 700, mb: 1.5 }}
              >
                Nova Anotação para {structure.name}
              </Typography>
              <TextField
                fullWidth
                size="small"
                label="Título da anotação"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                sx={{ mb: 1.5 }}
                InputLabelProps={{ sx: { fontSize: '0.82rem' } }}
              />
              <TextField
                fullWidth
                multiline
                rows={3}
                size="small"
                label="Conteúdo (ex: marcos anatômicos, dicas clínicas)"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                sx={{ mb: 2 }}
                InputLabelProps={{ sx: { fontSize: '0.82rem' } }}
              />
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setShowNoteForm(false)}
                  sx={{ fontSize: '0.78rem' }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleSaveNote}
                  disabled={!noteTitle.trim() || !noteContent.trim()}
                  sx={{
                    fontSize: '0.78rem',
                    backgroundColor: themeTokens.colors.brandCyan,
                    '&:hover': { backgroundColor: themeTokens.colors.brandBlue },
                  }}
                >
                  Salvar Anotação
                </Button>
              </Stack>
            </Box>
          )}
        </Paper>
      </Fade>
    </Box>
  );
};
