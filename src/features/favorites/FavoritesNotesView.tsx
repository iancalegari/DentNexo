import React, { useState, useEffect, useMemo } from 'react';
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
  CircularProgress,
  Autocomplete,
  InputAdornment,
  Snackbar,
  Alert,
} from '@mui/material';

// EXCLUSIVAMENTE ÍCONES DO MATERIAL UI
import BookmarkIcon from '@mui/icons-material/Bookmark';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddIcon from '@mui/icons-material/Add';
import HistoryIcon from '@mui/icons-material/History';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SearchIcon from '@mui/icons-material/Search';

import { storageService } from '@/services/storageService';
import { anatomicalStructures } from '@/data/anatomy/structures';
import { useAnatomyStore } from '@/stores/useAnatomyStore';
import { UserNote } from '@/types/study';
import { themeTokens } from '@/theme/tokens';
import { exportNotesToPdf } from '@/services/pdfExportService';
import { getStructureIllustration } from '@/utils/anatomicalDrawings';

export const FavoritesNotesView: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedStructure, isolateStructure, setInfoPanelOpen, setFocusedSystem, selectedStructureId } = useAnatomyStore();
  const [activeTab, setActiveTab] = useState<'favorites' | 'notes' | 'recents'>('favorites');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [notes, setNotes] = useState<UserNote[]>([]);
  const [recents, setRecents] = useState<string[]>([]);

  // Estado para nova anotação rápida
  const [newNoteTitle, setNewNoteTitle] = useState<string>('');
  const [newNoteContent, setNewNoteContent] = useState<string>('');
  const [newNoteStructureId, setNewNoteStructureId] = useState<string>(selectedStructureId || 'mandibula');
  const [isCreatingNote, setIsCreatingNote] = useState<boolean>(false);

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'dental':
        return 'Dente';
      case 'skeletal':
        return 'Osso & Crânio';
      case 'muscular':
        return 'Músculo';
      case 'nervous':
        return 'Nervo';
      case 'vascular':
        return 'Vaso Sanguíneo';
      case 'oral_tissue':
        return 'Periodonto & Gengiva';
      default:
        return 'Estrutura';
    }
  };

  const normalizeText = (text: string) =>
    text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

  // Lista única e pesquisável de todas as estruturas anatômicas
  const structureOptions = useMemo(() => {
    const uniqueMap = new Map<string, (typeof anatomicalStructures)[string]>();
    Object.values(anatomicalStructures).forEach((s) => {
      if (!uniqueMap.has(s.id)) {
        uniqueMap.set(s.id, s);
      }
    });
    return Array.from(uniqueMap.values());
  }, []);

  const selectedNoteStructureOption = useMemo(() => {
    return (
      structureOptions.find((s) => s.id === newNoteStructureId) ||
      anatomicalStructures[newNoteStructureId] ||
      structureOptions[0] ||
      null
    );
  }, [structureOptions, newNoteStructureId]);

  // Estados de exportação em PDF e feedback
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [exportStatusMessage, setExportStatusMessage] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

    const structure = anatomicalStructures[newNoteStructureId];

    // Gerar ilustração médica anatômica padrão para esta estrutura
    const illustrationUrl = getStructureIllustration({
      structureId: newNoteStructureId,
      structureName: structure?.name || newNoteStructureId,
      category: structure?.category || 'skeletal',
      width: 600,
      height: 450,
    });

    storageService.saveNote({
      structureId: newNoteStructureId,
      structureName: structure?.name || newNoteStructureId,
      title: newNoteTitle,
      content: newNoteContent,
      tags: ['Anotação', structure?.category || 'Geral'],
      imageUrl: illustrationUrl,
    });

    setNotes(storageService.getNotes());
    setNewNoteTitle('');
    setNewNoteContent('');
    setIsCreatingNote(false);
  };

  const handleSelectAndNavigate = (structureId: string) => {
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
    navigate('/atlas', { state: { preserveIsolation: true } });
  };

  /**
   * Ao clicar em uma anotação, navega para o Atlas 3D com a estrutura isolada,
   * o restante com baixa opacidade de referência e o painel lateral aberto mostrando a anotação
   */
  const handleNoteClick = (note: UserNote) => {
    let cleanId = note.structureId;
    if (!isNaN(Number(cleanId))) {
      cleanId = `dente_${cleanId}`;
    } else if (cleanId.startsWith('tooth-')) {
      cleanId = cleanId.replace('tooth-', 'dente_');
    }
    setFocusedSystem(null);
    setSelectedStructure(cleanId);
    isolateStructure(cleanId, true);
    setInfoPanelOpen(true);
    navigate('/atlas', { state: { preserveIsolation: true } });
  };

  /**
   * Exporta todas as anotações compiladas em PDF com imagens anatômicas e logotipo
   */
  const handleExportAllPdf = async () => {
    if (notes.length === 0) {
      setToastMessage('Nenhuma anotação disponível para exportar.');
      return;
    }

    setIsExportingPdf(true);
    try {
      await exportNotesToPdf({
        notes,
        title: 'Dossiê Completo de Anotações & Anatomia Odontológica',
        onProgress: (_progress, message) => setExportStatusMessage(message),
      });
      setToastMessage('Dossiê em PDF exportado com sucesso com logotipo e imagens!');
    } catch (err: any) {
      console.error('Erro na exportação de PDF:', err);
      setToastMessage('Erro ao gerar PDF: ' + (err?.message || 'Tente novamente'));
    } finally {
      setIsExportingPdf(false);
      setExportStatusMessage('');
    }
  };

  /**
   * Exporta uma anotação individual em PDF
   */
  const handleExportSingleNotePdf = async (note: UserNote) => {
    setIsExportingPdf(true);
    try {
      await exportNotesToPdf({
        notes: [note],
        title: `Anotação Clínica • ${note.structureName}`,
        onProgress: (_progress, message) => setExportStatusMessage(message),
      });
      setToastMessage(`Anotação "${note.title}" exportada em PDF com sucesso!`);
    } catch (err: any) {
      console.error('Erro ao exportar PDF individual:', err);
      setToastMessage('Erro ao gerar PDF: ' + (err?.message || 'Erro'));
    } finally {
      setIsExportingPdf(false);
      setExportStatusMessage('');
    }
  };

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2.2, md: 3 }, maxWidth: 1200, margin: '0 auto', height: '100%', overflowY: 'auto' }}>
      {/* Cabeçalho */}
      <Box sx={{ mb: { xs: 2, md: 3 } }}>
        <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.15rem', sm: '1.35rem' }, color: themeTokens.colors.textPrimary, mb: 0.5 }}>
          Favoritos & Anotações de Estudo
        </Typography>
        <Typography variant="body2" sx={{ color: themeTokens.colors.textSecondary }}>
          Gerencie suas estruturas anatômicas salvas, anotações clínicas com imagens vinculadas e histórico de navegação.
        </Typography>
      </Box>

      {/* Tabs de Navegação */}
      <Paper sx={{ mb: { xs: 2, md: 3 }, backgroundColor: themeTokens.colors.bgSecondary, border: `1px solid ${themeTokens.colors.borderSubtle}` }}>
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          textColor="primary"
          indicatorColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            px: { xs: 0.5, sm: 2 },
            '& .MuiTab-root': {
              fontWeight: 600,
              textTransform: 'none',
              fontSize: { xs: '0.8rem', sm: '0.9rem' },
              py: { xs: 1.4, sm: 2 },
            },
          }}
        >
          <Tab
            value="favorites"
            icon={<BookmarkIcon fontSize="small" />}
            iconPosition="start"
            label={`Meus Favoritos (${favorites.length})`}
          />
          <Tab
            value="notes"
            icon={<NoteAltIcon fontSize="small" />}
            iconPosition="start"
            label={`Minhas Anotações (${notes.length})`}
          />
          <Tab
            value="recents"
            icon={<HistoryIcon fontSize="small" />}
            iconPosition="start"
            label={`Vistos Recentemente (${recents.length})`}
          />
        </Tabs>
      </Paper>

      {/* Conteúdo das Abas */}
      <Box sx={{ minHeight: 400 }}>
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
                        p: { xs: 1.5, sm: 2 },
                        backgroundColor: themeTokens.colors.bgSecondary,
                        border: `1px solid ${themeTokens.colors.borderSubtle}`,
                        borderRadius: 1.5,
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1.2,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'border-color 0.2s ease',
                        '&:hover': {
                          borderColor: themeTokens.colors.brandCyan,
                        },
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: themeTokens.colors.textPrimary }}>
                          {s.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: themeTokens.colors.textMuted }}>
                          {s.scientificName} • {s.category}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          endIcon={<ArrowForwardIcon />}
                          onClick={() => handleSelectAndNavigate(favId)}
                        >
                          Visualizar
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
                  Nenhum favorito salvo ainda.
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
            {/* Barra de Ações de Anotações */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
              <Typography variant="subtitle2" sx={{ color: themeTokens.colors.textSecondary, fontWeight: 600 }}>
                {notes.length === 1 ? '1 anotação vinculada' : `${notes.length} anotações vinculadas com imagens anatômicas`}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                {/* Botão de Exportação em PDF Completo */}
                <Button
                  variant="contained"
                  startIcon={isExportingPdf ? <CircularProgress size={16} color="inherit" /> : <PictureAsPdfIcon />}
                  disabled={isExportingPdf || notes.length === 0}
                  onClick={handleExportAllPdf}
                  sx={{
                    backgroundColor: '#0284C7',
                    '&:hover': { backgroundColor: '#0369A1' },
                    fontWeight: 700,
                    textTransform: 'none',
                    fontSize: '0.84rem',
                    boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)',
                  }}
                >
                  {isExportingPdf ? (exportStatusMessage || 'Gerando PDF...') : 'Exportar Tudo em PDF'}
                </Button>

                {/* Botão Nova Anotação */}
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  size="small"
                  onClick={() => setIsCreatingNote(!isCreatingNote)}
                  sx={{
                    backgroundColor: '#F59E0B',
                    '&:hover': { backgroundColor: '#D97706' },
                    fontWeight: 700,
                    textTransform: 'none',
                    fontSize: '0.84rem',
                  }}
                >
                  {isCreatingNote ? 'Cancelar' : 'Nova Anotação'}
                </Button>
              </Box>
            </Box>

            {/* Formulário de Criação de Anotação */}
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

                {/* Seletor Pesquisável de Estrutura Anatômica Vinculada (Desktop & Mobile) */}
                <Autocomplete
                  fullWidth
                  size="small"
                  openOnFocus
                  blurOnSelect
                  options={structureOptions}
                  value={selectedNoteStructureOption}
                  isOptionEqualToValue={(option, val) => option.id === val.id}
                  getOptionLabel={(option) => `${option.name} (${getCategoryLabel(option.category)})`}
                  onChange={(_, newValue) => {
                    if (newValue) {
                      setNewNoteStructureId(newValue.id);
                    }
                  }}
                  filterOptions={(options, state) => {
                    const q = normalizeText(state.inputValue.trim());
                    if (!q) return options;
                    return options.filter((opt) => {
                      const catLabel = getCategoryLabel(opt.category);
                      const searchable = normalizeText(
                        `${opt.name} ${opt.scientificName || ''} ${opt.fdiNotation || ''} ${catLabel} ${(opt.synonyms || []).join(' ')}`
                      );
                      return searchable.includes(q);
                    });
                  }}
                  noOptionsText="Nenhuma estrutura encontrada"
                  ListboxProps={{
                    sx: {
                      maxHeight: { xs: 230, sm: 290 },
                      backgroundColor: themeTokens.colors.bgElevated,
                    },
                  }}
                  renderOption={(props, option) => {
                    const { key, ...optionProps } = props as React.HTMLAttributes<HTMLLIElement> & { key: string };
                    return (
                      <Box
                        component="li"
                        key={option.id || key}
                        {...optionProps}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: 1,
                          py: 0.9,
                          px: 1.5,
                          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                        }}
                      >
                        <Box sx={{ minWidth: 0 }}>
                          <Typography sx={{ fontSize: '0.84rem', fontWeight: 700, color: themeTokens.colors.textPrimary }}>
                            {option.name}
                          </Typography>
                          {option.scientificName && (
                            <Typography sx={{ fontSize: '0.72rem', fontStyle: 'italic', color: themeTokens.colors.textMuted }}>
                              {option.scientificName}
                            </Typography>
                          )}
                        </Box>
                        <Chip
                          label={getCategoryLabel(option.category)}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            flexShrink: 0,
                            backgroundColor: 'rgba(0, 201, 246, 0.12)',
                            color: themeTokens.colors.brandCyan,
                          }}
                        />
                      </Box>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Estrutura / Osso / Dente Vinculado (Pesquisar)"
                      placeholder="Digite nome, número FDI (ex: 36), osso ou nervo..."
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <InputAdornment position="start" sx={{ pl: 0.5 }}>
                              <SearchIcon fontSize="small" sx={{ color: themeTokens.colors.brandCyan }} />
                            </InputAdornment>
                            {params.InputProps.startAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  sx={{ mb: 1.5 }}
                />

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
                  label="Conteúdo da anotação (ex: acidentes anatômicos, dicas cirúrgicas, canais radiculares)"
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
                    fontWeight: 700,
                  }}
                >
                  Salvar Anotação com Imagem
                </Button>
              </Paper>
            )}

            {/* Lista de Anotações */}
            <Stack spacing={2}>
              {notes.length > 0 ? (
                notes.map((note) => {
                  const struct = anatomicalStructures[note.structureId];
                  const previewImage =
                    note.imageUrl ||
                    getStructureIllustration({
                      structureId: note.structureId,
                      structureName: note.structureName || note.title,
                      category: struct?.category || 'skeletal',
                      width: 240,
                      height: 180,
                    });

                  return (
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
                          borderColor: '#38BDF8',
                          backgroundColor: 'rgba(56, 189, 248, 0.03)',
                          transform: 'translateY(-1px)',
                        },
                      }}
                      onClick={() => handleNoteClick(note)}
                    >
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                        {/* Imagem / Ilustração Anatômica Vinculada */}
                        <Box
                          sx={{
                            width: { xs: 80, sm: 115 },
                            height: { xs: 65, sm: 86 },
                            borderRadius: 1.2,
                            overflow: 'hidden',
                            flexShrink: 0,
                            border: '1px solid rgba(56, 189, 248, 0.35)',
                            backgroundColor: '#090D14',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                          }}
                        >
                          <img
                            src={previewImage}
                            alt={note.structureName}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              display: 'block',
                            }}
                          />
                        </Box>

                        {/* Conteúdo da Anotação */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box sx={{ minWidth: 0 }}>
                              <Typography variant="h6" sx={{ fontWeight: 700, color: themeTokens.colors.textPrimary, fontSize: '1.05rem' }}>
                                {note.title}
                              </Typography>
                              <Typography variant="caption" sx={{ color: themeTokens.colors.brandCyan, fontWeight: 700 }}>
                                {note.structureName} • {new Date(note.updatedAt || note.createdAt).toLocaleDateString('pt-BR')}
                              </Typography>
                            </Box>

                            {/* Botões de Ação na Anotação */}
                            <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
                              <Tooltip title="Ver estrutura isolada no 3D">
                                <IconButton
                                  size="small"
                                  onClick={() => handleNoteClick(note)}
                                  sx={{ color: themeTokens.colors.brandCyan }}
                                >
                                  <CenterFocusStrongIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Exportar esta anotação em PDF com logotipo">
                                <IconButton
                                  size="small"
                                  disabled={isExportingPdf}
                                  onClick={() => handleExportSingleNotePdf(note)}
                                  sx={{ color: '#0284C7' }}
                                >
                                  <PictureAsPdfIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Excluir anotação">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteNote(note.id)}
                                  sx={{ color: themeTokens.colors.textMuted, '&:hover': { color: '#EF4444' } }}
                                >
                                  <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>

                          <Typography variant="body2" sx={{ color: themeTokens.colors.textSecondary, mt: 0.8, whiteSpace: 'pre-wrap' }}>
                            {note.content}
                          </Typography>

                          <Box sx={{ display: 'flex', gap: 0.8, mt: 1.2, alignItems: 'center', flexWrap: 'wrap' }}>
                            {note.tags?.map((tag) => (
                              <Chip key={tag} label={tag} size="small" sx={{ fontSize: '0.68rem', height: 20 }} />
                            ))}
                            <Typography variant="caption" sx={{ color: themeTokens.colors.textMuted, ml: 'auto', fontSize: '0.68rem' }}>
                              Clique para navegar e isolar no 3D →
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Paper>
                  );
                })
              ) : (
                <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: themeTokens.colors.bgSecondary }}>
                  <NoteAltIcon sx={{ fontSize: 44, color: themeTokens.colors.textMuted, mb: 1 }} />
                  <Typography variant="body1" sx={{ color: themeTokens.colors.textMuted }}>
                    Nenhuma anotação criada ainda.
                  </Typography>
                  <Typography variant="body2" sx={{ color: themeTokens.colors.textMuted, mt: 0.5 }}>
                    Clique com o botão <strong>direito</strong> sobre uma estrutura no modelo 3D → "Criar Anotação", ou use o botão "Nova Anotação" acima.
                  </Typography>
                </Paper>
              )}
            </Stack>
          </Box>
        )}

        {/* ABA: HISTÓRICO RECENTE */}
        {activeTab === 'recents' && (
          <Box>
            {recents.length > 0 ? (
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
            ) : (
              <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: themeTokens.colors.bgSecondary }}>
                <HistoryIcon sx={{ fontSize: 44, color: themeTokens.colors.textMuted, mb: 1 }} />
                <Typography variant="body1" sx={{ color: themeTokens.colors.textMuted }}>
                  Nenhuma estrutura visualizada recentemente.
                </Typography>
                <Typography variant="body2" sx={{ color: themeTokens.colors.textMuted, mt: 0.5 }}>
                  Ao clicar em ossos, dentes, músculos ou nervos no Atlas 3D, seu histórico recente aparecerá aqui automaticamente.
                </Typography>
              </Paper>
            )}
          </Box>
        )}
      </Box>

      {/* Notificação Toast */}
      <Snackbar
        open={Boolean(toastMessage)}
        autoHideDuration={4000}
        onClose={() => setToastMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={toastMessage?.includes('Erro') ? 'error' : 'success'} sx={{ width: '100%', fontWeight: 600 }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};
