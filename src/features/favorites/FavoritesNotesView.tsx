import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Button,
  TextField,
  IconButton,
  Chip,
  Stack,
  Tooltip,
} from '@mui/material';

// EXCLUSIVAMENTE ÍCONES DO MATERIAL UI
import BookmarkIcon from '@mui/icons-material/Bookmark';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddIcon from '@mui/icons-material/Add';
import HistoryIcon from '@mui/icons-material/History';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';

import { storageService } from '@/services/storageService';
import { anatomicalStructures } from '@/data/anatomy/structures';
import { useAnatomyStore } from '@/stores/useAnatomyStore';
import { UserNote } from '@/types/study';
import { themeTokens } from '@/theme/tokens';

export const FavoritesNotesView: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedStructure, isolateStructure, setInfoPanelOpen } = useAnatomyStore();
  const [activeTab, setActiveTab] = useState<'favorites' | 'notes' | 'recents'>('favorites');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [notes, setNotes] = useState<UserNote[]>([]);
  const [recents, setRecents] = useState<string[]>([]);

  // Estado para nova anotação rápida
  const [newNoteTitle, setNewNoteTitle] = useState<string>('');
  const [newNoteContent, setNewNoteContent] = useState<string>('');
  const [isCreatingNote, setIsCreatingNote] = useState<boolean>(false);

  useEffect(() => {
    setFavorites(storageService.getFavorites());
    setNotes(storageService.getNotes());
    setRecents(storageService.getRecentStructures());
  }, []);

  const handleRemoveFavorite = (id: string) => {
    const updated = storageService.toggleFavorite(id);
    setFavorites(updated);
  };

  const handleDeleteNote = (id: string) => {
    storageService.deleteNote(id);
    setNotes(storageService.getNotes());
  };

  const handleCreateNote = () => {
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;

    storageService.saveNote({
      structureId: 'mandibula',
      structureName: 'Anotação Geral de Anatomia',
      title: newNoteTitle,
      content: newNoteContent,
      tags: ['Odontologia', 'Estudo'],
    });

    setNotes(storageService.getNotes());
    setNewNoteTitle('');
    setNewNoteContent('');
    setIsCreatingNote(false);
  };

  const handleSelectAndNavigate = (structureId: string) => {
    setSelectedStructure(structureId);
    navigate('/atlas');
  };

  /**
   * Ao clicar em uma anotação, navega para "Ossos & Crânio" (skeletal),
   * isola a estrutura anotada e abre o painel de detalhes à direita
   */
  const handleNoteClick = (note: UserNote) => {
    const structureId = note.structureId;
    const structure = anatomicalStructures[structureId];
    
    if (structure) {
      setSelectedStructure(structureId);
      isolateStructure(structureId);
      setInfoPanelOpen(true);
      
      // Navegar para a view correta com base na categoria da estrutura
      switch (structure.category) {
        case 'skeletal':
          navigate('/skeletal');
          break;
        case 'dental':
          navigate('/dental');
          break;
        case 'muscular':
          navigate('/muscular');
          break;
        case 'nervous':
          navigate('/nervous');
          break;
        case 'vascular':
          navigate('/vascular');
          break;
        case 'oral_tissue':
          navigate('/periodontal');
          break;
        default:
          navigate('/skeletal');
          break;
      }
    } else {
      // Fallback para o skeletal view
      setSelectedStructure(structureId);
      isolateStructure(structureId);
      setInfoPanelOpen(true);
      navigate('/skeletal');
    }
  };

  return (
    <Box sx={{ width: '100%', height: '100%', overflowY: 'auto', p: 3, backgroundColor: themeTokens.colors.bgMain }}>
      <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: themeTokens.colors.textPrimary }}>
            Favoritos & Anotações de Estudo
          </Typography>
          <Typography variant="body2" sx={{ color: themeTokens.colors.textMuted, mt: 0.5 }}>
            Seu acervo pessoal de estruturas salvas, observações clínicas e histórico recente. Tudo persiste no cache do navegador — só apaga se limpar o cache.
          </Typography>
        </Box>

        <Paper sx={{ mb: 3, backgroundColor: themeTokens.colors.bgSecondary, border: `1px solid ${themeTokens.colors.borderSubtle}` }}>
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            sx={{
              px: 2,
              '& .MuiTab-root': {
                fontWeight: 700,
                fontSize: '0.85rem',
                minHeight: 48,
              },
            }}
          >
            <Tab
              value="favorites"
              label={`Estruturas Favoritas (${favorites.length})`}
              icon={<BookmarkIcon fontSize="small" />}
              iconPosition="start"
            />
            <Tab
              value="notes"
              label={`Minhas Anotações (${notes.length})`}
              icon={<NoteAltIcon fontSize="small" />}
              iconPosition="start"
            />
            <Tab
              value="recents"
              label={`Histórico Recente (${recents.length})`}
              icon={<HistoryIcon fontSize="small" />}
              iconPosition="start"
            />
          </Tabs>
        </Paper>

        {/* ABA: FAVORITOS */}
        {activeTab === 'favorites' && (
          <Box>
            {favorites.length > 0 ? (
              <Stack spacing={1.5}>
                {favorites.map((favId) => {
                  const s = anatomicalStructures[favId];
                  if (!s) return null;
                  return (
                    <Paper
                      key={favId}
                      sx={{
                        p: 2,
                        backgroundColor: themeTokens.colors.bgSecondary,
                        border: `1px solid ${themeTokens.colors.borderSubtle}`,
                        borderRadius: 1.5,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'border-color 0.2s ease',
                        '&:hover': {
                          borderColor: themeTokens.colors.brandCyan,
                        },
                      }}
                    >
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: themeTokens.colors.textPrimary }}>
                          {s.name}
                        </Typography>
                        <Typography variant="body2" sx={{ fontStyle: 'italic', color: themeTokens.colors.brandCyan }}>
                          {s.scientificName} • Região: {s.region}
                        </Typography>
                        <Typography variant="body2" sx={{ color: themeTokens.colors.textSecondary, mt: 0.5, fontSize: '0.82rem' }}>
                          {s.description.slice(0, 140)}...
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="contained"
                          size="small"
                          endIcon={<ArrowForwardIcon />}
                          onClick={() => handleSelectAndNavigate(favId)}
                          sx={{
                            backgroundColor: themeTokens.colors.brandCyan,
                            '&:hover': { backgroundColor: themeTokens.colors.brandBlue },
                          }}
                        >
                          Ver no 3D
                        </Button>
                        <IconButton size="small" onClick={() => handleRemoveFavorite(favId)}>
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Paper>
                  );
                })}
              </Stack>
            ) : (
              <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: themeTokens.colors.bgSecondary }}>
                <BookmarkIcon sx={{ fontSize: 44, color: themeTokens.colors.textMuted, mb: 1 }} />
                <Typography variant="body1" sx={{ color: themeTokens.colors.textMuted }}>
                  Você ainda não possui estruturas favoritas salvas.
                </Typography>
                <Typography variant="body2" sx={{ color: themeTokens.colors.textMuted, mt: 0.5 }}>
                  Clique com o botão <strong>direito</strong> sobre uma estrutura no modelo 3D → "Adicionar aos Favoritos", ou use o ícone de marcador no painel direito.
                </Typography>
              </Paper>
            )}
          </Box>
        )}

        {/* ABA: ANOTAÇÕES PESSOAIS */}
        {activeTab === 'notes' && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                size="small"
                onClick={() => setIsCreatingNote(!isCreatingNote)}
                sx={{
                  backgroundColor: '#F59E0B',
                  '&:hover': { backgroundColor: '#D97706' },
                }}
              >
                {isCreatingNote ? 'Cancelar' : 'Nova Anotação'}
              </Button>
            </Box>

            {isCreatingNote && (
              <Paper
                sx={{
                  p: 2.5,
                  mb: 2.5,
                  backgroundColor: themeTokens.colors.bgSecondary,
                  border: `1px solid #F59E0B`,
                  borderRadius: 1.5,
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1.5, color: '#F59E0B' }}>
                  Criar Nova Anotação de Estudo
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  label="Título da anotação"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  sx={{ mb: 1.5 }}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Conteúdo da anotação (ex: marcos anatômicos, dicas para prova prática)"
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleCreateNote}
                  sx={{
                    backgroundColor: '#F59E0B',
                    '&:hover': { backgroundColor: '#D97706' },
                  }}
                >
                  Salvar Anotação
                </Button>
              </Paper>
            )}

            <Stack spacing={1.5}>
              {notes.length > 0 ? (
                notes.map((note) => (
                  <Paper
                    key={note.id}
                    sx={{
                      p: 2,
                      backgroundColor: themeTokens.colors.bgSecondary,
                      border: `1px solid ${themeTokens.colors.borderSubtle}`,
                      borderRadius: 1.5,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: '#F59E0B',
                        backgroundColor: 'rgba(245, 158, 11, 0.04)',
                        transform: 'translateY(-1px)',
                      },
                    }}
                    onClick={() => handleNoteClick(note)}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: themeTokens.colors.textPrimary }}>
                          {note.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: themeTokens.colors.brandCyan, fontWeight: 600 }}>
                          {note.structureName} • {new Date(note.updatedAt).toLocaleDateString('pt-BR')}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Ver estrutura isolada no 3D">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNoteClick(note);
                            }}
                            sx={{ color: themeTokens.colors.brandCyan }}
                          >
                            <CenterFocusStrongIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNote(note.id);
                          }}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    <Typography variant="body2" sx={{ color: themeTokens.colors.textSecondary, mt: 1.2, whiteSpace: 'pre-wrap' }}>
                      {note.content}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.8, mt: 1.5, alignItems: 'center' }}>
                      {note.tags.map((tag) => (
                        <Chip key={tag} label={tag} size="small" sx={{ fontSize: '0.68rem', height: 20 }} />
                      ))}
                      <Typography variant="caption" sx={{ color: themeTokens.colors.textMuted, ml: 'auto', fontSize: '0.68rem' }}>
                        Clique para ver isolado →
                      </Typography>
                    </Box>
                  </Paper>
                ))
              ) : (
                <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: themeTokens.colors.bgSecondary }}>
                  <NoteAltIcon sx={{ fontSize: 44, color: themeTokens.colors.textMuted, mb: 1 }} />
                  <Typography variant="body1" sx={{ color: themeTokens.colors.textMuted }}>
                    Nenhuma anotação criada ainda.
                  </Typography>
                  <Typography variant="body2" sx={{ color: themeTokens.colors.textMuted, mt: 0.5 }}>
                    Clique com o botão <strong>direito</strong> sobre uma estrutura no modelo 3D → "Criar Anotação", ou use o botão no painel direito.
                  </Typography>
                </Paper>
              )}
            </Stack>
          </Box>
        )}

        {/* ABA: HISTÓRICO RECENTE */}
        {activeTab === 'recents' && (
          <Box>
            <Stack spacing={1.5}>
              {recents.map((recId) => {
                const s = anatomicalStructures[recId];
                if (!s) return null;
                return (
                  <Paper
                    key={recId}
                    sx={{
                      p: 1.8,
                      backgroundColor: themeTokens.colors.bgSecondary,
                      border: `1px solid ${themeTokens.colors.borderSubtle}`,
                      borderRadius: 1.5,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'border-color 0.2s ease',
                      '&:hover': {
                        borderColor: themeTokens.colors.brandCyan,
                      },
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {s.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: themeTokens.colors.textMuted }}>
                        {s.scientificName} • {s.category}
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      size="small"
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => handleSelectAndNavigate(recId)}
                    >
                      Acessar
                    </Button>
                  </Paper>
                );
              })}
            </Stack>
          </Box>
        )}
      </Box>
    </Box>
  );
};
