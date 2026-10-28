import React, { useState, useCallback } from 'react';
import {
  Box,
  Drawer,
  Typography,
  IconButton,
  Chip,
  Button,
  Divider,
  Stack,
  Tooltip,
  Paper,
  TextField,
  CircularProgress,
} from '@mui/material';

// EXCLUSIVAMENTE ÍCONES DO MATERIAL UI
import CloseIcon from '@mui/icons-material/Close';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import HighlightIcon from '@mui/icons-material/Highlight';
import HubIcon from '@mui/icons-material/Hub';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import StopIcon from '@mui/icons-material/Stop';
import NoteAltIcon from '@mui/icons-material/NoteAlt';

import { useAnatomyStore } from '@/stores/useAnatomyStore';
import { anatomicalStructures } from '@/data/anatomy/structures';
import { scientificReferences } from '@/data/anatomy/references';
import { storageService } from '@/services/storageService';
import { ttsService } from '@/services/ttsService';
import { themeTokens } from '@/theme/tokens';
import { useNavigate } from 'react-router-dom';

export const InfoPanel: React.FC = () => {
  const navigate = useNavigate();
  const {
    selectedStructureId,
    isolatedStructureId,
    infoPanelOpen,
    setSelectedStructure,
    isolateStructure,
    hideStructure,
    setInfoPanelOpen,
    setActivePathology,
    setSurfaceExplorationMode,
  } = useAnatomyStore();

  const [isFavorite, setIsFavorite] = useState<boolean>(() => {
    return selectedStructureId ? storageService.isFavorite(selectedStructureId) : false;
  });

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsLoading, setTtsLoading] = useState(false);

  // Inline annotation
  const [showAnnotation, setShowAnnotation] = useState(false);
  const [annotationTitle, setAnnotationTitle] = useState('');
  const [annotationContent, setAnnotationContent] = useState('');

  const structure = selectedStructureId
    ? (anatomicalStructures[selectedStructureId] || anatomicalStructures[`dente_${selectedStructureId}`] || null)
    : null;
  const isIsolated = isolatedStructureId === selectedStructureId;

  // Atualizar estado de favorito se a estrutura mudar
  React.useEffect(() => {
    if (selectedStructureId) {
      setIsFavorite(storageService.isFavorite(selectedStructureId));
    }
    // Parar TTS quando trocar de estrutura
    ttsService.stop();
    setIsSpeaking(false);
    setShowAnnotation(false);
  }, [selectedStructureId]);

  const handleToggleFavorite = () => {
    if (!selectedStructureId) return;
    const updated = storageService.toggleFavorite(selectedStructureId);
    setIsFavorite(updated.includes(selectedStructureId));
  };

  const handleListenExplanation = useCallback(() => {
    if (!structure) return;

    if (isSpeaking) {
      ttsService.stop();
      setIsSpeaking(false);
      setTtsLoading(false);
      return;
    }

    // Construir texto explicativo completo com todas as seções (sem referências)
    const textParts = [
      structure.name + '.',
      structure.description,
      structure.function ? `Função: ${structure.function}` : '',
      structure.location ? `Localização e trajeto: ${structure.location}` : '',
      structure.innervation ? `Inervação: ${structure.innervation}` : '',
      structure.vascularization ? `Vascularização: ${structure.vascularization}` : '',
      structure.tissueComposition && structure.tissueComposition.length > 0
        ? `Composição tecidual: ${structure.tissueComposition.join(', ')}.`
        : '',
      structure.clinicalRelevance ? `Importância clínica e odontológica: ${structure.clinicalRelevance}` : '',
    ].filter(Boolean).join(' ');

    setTtsLoading(true);

    ttsService.speak({
      text: textParts,
      onStart: () => {
        setIsSpeaking(true);
        setTtsLoading(false);
      },
      onEnd: () => {
        setIsSpeaking(false);
        setTtsLoading(false);
      },
      onError: (error) => {
        setIsSpeaking(false);
        setTtsLoading(false);
        console.error('TTS Error:', error);
      },
    });
  }, [structure, isSpeaking]);

  const handleSaveAnnotation = () => {
    if (!selectedStructureId || !annotationTitle.trim() || !annotationContent.trim()) return;
    storageService.saveNote({
      structureId: selectedStructureId,
      structureName: structure?.name || selectedStructureId,
      title: annotationTitle,
      content: annotationContent,
      tags: ['Anotação', structure?.category || 'Geral'],
    });
    setShowAnnotation(false);
    setAnnotationTitle('');
    setAnnotationContent('');
  };

  if (!infoPanelOpen) {
    return (
      <Box sx={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)', zIndex: 1000 }}>
        <Tooltip title="Abrir painel de informações anatômicas" placement="left">
          <Button
            variant="contained"
            size="small"
            startIcon={<CenterFocusStrongIcon />}
            onClick={() => setInfoPanelOpen(true)}
            sx={{
              backgroundColor: themeTokens.colors.bgElevated,
              borderColor: themeTokens.colors.borderSubtle,
              color: themeTokens.colors.brandCyan,
              border: `1px solid ${themeTokens.colors.borderSubtle}`,
              borderRight: 'none',
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              borderTopLeftRadius: '8px',
              borderBottomLeftRadius: '8px',
              boxShadow: '-3px 4px 16px rgba(0, 0, 0, 0.45)',
              py: 0.9,
              px: 1.4,
              fontWeight: 700,
              letterSpacing: '0.02em',
              transition: 'all 0.18s ease',
              '&:hover': {
                backgroundColor: themeTokens.colors.bgSecondary,
                borderColor: themeTokens.colors.brandCyan,
                transform: 'translateX(-2px)',
              },
            }}
          >
            Detalhes
          </Button>
        </Tooltip>
      </Box>
    );
  }

  return (
    <Drawer
      anchor="right"
      variant="persistent"
      open={infoPanelOpen}
      sx={{
        width: 380,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 380,
          top: 60,
          height: 'calc(100vh - 60px)',
          backgroundColor: themeTokens.colors.bgSecondary,
          borderLeft: `1px solid ${themeTokens.colors.borderSubtle}`,
          p: 0,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {structure ? (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Cabeçalho do Painel */}
          <Box sx={{ p: 2, borderBottom: `1px solid ${themeTokens.colors.borderSubtle}`, backgroundColor: themeTokens.colors.bgElevated }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Box>
                {structure.fdiNotation && (
                  <Chip
                    label={`FDI ${structure.fdiNotation}`}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(0, 201, 246, 0.15)',
                      color: themeTokens.colors.brandCyan,
                      border: `1px solid ${themeTokens.colors.brandCyan}`,
                      fontWeight: 700,
                      mb: 0.5,
                    }}
                  />
                )}
                <Typography variant="h4" sx={{ fontWeight: 800, color: themeTokens.colors.textPrimary }}>
                  {structure.name}
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic', color: themeTokens.colors.brandCyan }}>
                  {structure.scientificName}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Tooltip title={isFavorite ? 'Remover dos favoritos' : 'Salvar como favorito'}>
                  <IconButton size="small" onClick={handleToggleFavorite}>
                    {isFavorite ? (
                      <BookmarkIcon fontSize="small" sx={{ color: themeTokens.colors.brandCyan }} />
                    ) : (
                      <BookmarkBorderIcon fontSize="small" />
                    )}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Fechar painel">
                  <IconButton size="small" onClick={() => setInfoPanelOpen(false)}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {/* Ações Anatômicas Rápidas */}
            <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
              <Button
                variant={isIsolated ? 'contained' : 'outlined'}
                size="small"
                fullWidth
                startIcon={<HighlightIcon fontSize="small" />}
                onClick={() => isolateStructure(structure.id)}
                sx={{ fontSize: '0.75rem', py: 0.4 }}
              >
                {isIsolated ? 'Restaurar' : 'Isolar'}
              </Button>
              <Button
                variant="outlined"
                size="small"
                fullWidth
                startIcon={<VisibilityOffIcon fontSize="small" />}
                onClick={() => hideStructure(structure.id)}
                sx={{ fontSize: '0.75rem', py: 0.4 }}
              >
                Ocultar
              </Button>
            </Stack>

            {/* BOTÃO EXPLORAR ANATOMIA DE SUPERFÍCIE (DENTAL SCOPE) */}
            {(structure.category === 'dental' || structure.id.startsWith('dente_')) && (
              <Button
                variant="contained"
                size="small"
                fullWidth
                startIcon={<CenterFocusStrongIcon fontSize="small" />}
                onClick={() => {
                  const fdi = structure.id.replace('dente_', '');
                  setSurfaceExplorationMode(true, fdi);
                }}
                sx={{
                  mt: 1.2,
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  py: 0.6,
                  backgroundColor: '#818CF8',
                  color: '#FFFFFF',
                  boxShadow: '0 4px 14px rgba(129, 140, 248, 0.4)',
                  '&:hover': {
                    backgroundColor: '#6366F1',
                  },
                }}
              >
                Explorar Superfície do Dente
              </Button>
            )}

            {/* BOTÃO "OUVIR EXPLICAÇÃO" - TTS */}
            <Button
              variant={isSpeaking ? 'contained' : 'outlined'}
              size="small"
              fullWidth
              onClick={handleListenExplanation}
              disabled={ttsLoading}
              startIcon={
                ttsLoading ? (
                  <CircularProgress size={16} sx={{ color: themeTokens.colors.brandCyan }} />
                ) : isSpeaking ? (
                  <StopIcon fontSize="small" />
                ) : (
                  <VolumeUpIcon fontSize="small" />
                )
              }
              sx={{
                mt: 1,
                fontSize: '0.78rem',
                py: 0.5,
                borderColor: isSpeaking ? '#10B981' : 'rgba(0, 201, 246, 0.4)',
                color: isSpeaking ? '#FFFFFF' : themeTokens.colors.brandCyan,
                backgroundColor: isSpeaking ? '#10B981' : 'transparent',
                '&:hover': {
                  backgroundColor: isSpeaking ? '#059669' : 'rgba(0, 201, 246, 0.08)',
                  borderColor: isSpeaking ? '#10B981' : themeTokens.colors.brandCyan,
                },
                animation: isSpeaking ? 'pulse 2s ease-in-out infinite' : 'none',
                '@keyframes pulse': {
                  '0%, 100%': { boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.4)' },
                  '50%': { boxShadow: '0 0 0 6px rgba(16, 185, 129, 0)' },
                },
              }}
            >
              {ttsLoading ? 'Carregando voz...' : isSpeaking ? 'Parar Áudio' : 'Ouvir Explicação'}
            </Button>

            {/* BOTÃO "CRIAR ANOTAÇÃO" INLINE */}
            <Button
              variant="outlined"
              size="small"
              fullWidth
              onClick={() => setShowAnnotation(!showAnnotation)}
              startIcon={<NoteAltIcon fontSize="small" />}
              sx={{
                mt: 0.8,
                fontSize: '0.78rem',
                py: 0.5,
                borderColor: showAnnotation ? '#F59E0B' : themeTokens.colors.borderSubtle,
                color: showAnnotation ? '#F59E0B' : themeTokens.colors.textSecondary,
                backgroundColor: showAnnotation ? 'rgba(245, 158, 11, 0.08)' : 'transparent',
              }}
            >
              {showAnnotation ? 'Fechar Anotação' : 'Criar Anotação'}
            </Button>
          </Box>

          {/* Formulário de Anotação Inline */}
          {showAnnotation && (
            <Box
              sx={{
                p: 2,
                borderBottom: `1px solid ${themeTokens.colors.borderSubtle}`,
                backgroundColor: 'rgba(245, 158, 11, 0.04)',
              }}
            >
              <TextField
                fullWidth
                size="small"
                label="Título"
                value={annotationTitle}
                onChange={(e) => setAnnotationTitle(e.target.value)}
                sx={{ mb: 1 }}
                InputLabelProps={{ sx: { fontSize: '0.82rem' } }}
              />
              <TextField
                fullWidth
                multiline
                rows={2}
                size="small"
                label="Observações clínicas, dicas para prova..."
                value={annotationContent}
                onChange={(e) => setAnnotationContent(e.target.value)}
                sx={{ mb: 1.5 }}
                InputLabelProps={{ sx: { fontSize: '0.82rem' } }}
              />
              <Button
                variant="contained"
                size="small"
                onClick={handleSaveAnnotation}
                disabled={!annotationTitle.trim() || !annotationContent.trim()}
                sx={{
                  fontSize: '0.75rem',
                  backgroundColor: '#F59E0B',
                  '&:hover': { backgroundColor: '#D97706' },
                }}
              >
                Salvar Anotação
              </Button>
            </Box>
          )}

          {/* Conteúdo Rolável Cientificamente Fundamentado */}
          <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
            {/* Descrição Anatômica */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="subtitle2" sx={{ color: themeTokens.colors.brandCyan, mb: 0.6 }}>
                Descrição Anatômica
              </Typography>
              <Typography variant="body1" sx={{ color: themeTokens.colors.textPrimary, fontSize: '0.88rem' }}>
                {structure.description}
              </Typography>
            </Box>

            {/* Função Fisiológica */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="subtitle2" sx={{ color: themeTokens.colors.brandCyan, mb: 0.6 }}>
                Função
              </Typography>
              <Typography variant="body2" sx={{ color: themeTokens.colors.textSecondary }}>
                {structure.function}
              </Typography>
            </Box>

            {/* Localização e Relações */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="subtitle2" sx={{ color: themeTokens.colors.brandCyan, mb: 0.6 }}>
                Localização & Trajeto
              </Typography>
              <Typography variant="body2" sx={{ color: themeTokens.colors.textSecondary }}>
                {structure.location}
              </Typography>
            </Box>

            {/* Campos Contextuais por Categoria */}
            {structure.category === 'muscular' && (
              <Box sx={{ mb: 2.5, p: 1.5, backgroundColor: themeTokens.colors.bgElevated, borderRadius: 1 }}>
                <Typography variant="subtitle2" sx={{ color: '#EF4444', mb: 0.5 }}>
                  Origem Muscular
                </Typography>
                <Typography variant="body2" sx={{ mb: 1.2 }}>
                  {structure.muscularOrigin || 'Não aplicável'}
                </Typography>
                <Typography variant="subtitle2" sx={{ color: '#EF4444', mb: 0.5 }}>
                  Inserção Muscular
                </Typography>
                <Typography variant="body2">
                  {structure.muscularInsertion || 'Não aplicável'}
                </Typography>
              </Box>
            )}

            {structure.innervation && (
              <Box sx={{ mb: 2.5 }}>
                <Typography variant="subtitle2" sx={{ color: '#FACC15', mb: 0.6 }}>
                  Inervação
                </Typography>
                <Typography variant="body2" sx={{ color: themeTokens.colors.textSecondary }}>
                  {structure.innervation}
                </Typography>
              </Box>
            )}

            {structure.vascularization && (
              <Box sx={{ mb: 2.5 }}>
                <Typography variant="subtitle2" sx={{ color: '#EF4444', mb: 0.6 }}>
                  Vascularização
                </Typography>
                <Typography variant="body2" sx={{ color: themeTokens.colors.textSecondary }}>
                  {structure.vascularization}
                </Typography>
              </Box>
            )}

            {structure.tissueComposition && structure.tissueComposition.length > 0 && (
              <Box sx={{ mb: 2.5 }}>
                <Typography variant="subtitle2" sx={{ color: themeTokens.colors.brandCyan, mb: 0.6 }}>
                  Composição Tecidual
                </Typography>
                <Stack spacing={0.6}>
                  {structure.tissueComposition.map((tissue, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: themeTokens.colors.brandCyan }} />
                      <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>{tissue}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}

            {/* Importância Clínica */}
            <Box
              sx={{
                mb: 2.5,
                p: 1.8,
                backgroundColor: 'rgba(0, 201, 246, 0.05)',
                border: '1px solid rgba(0, 201, 246, 0.25)',
                borderRadius: 1,
              }}
            >
              <Typography variant="subtitle2" sx={{ color: themeTokens.colors.brandCyan, mb: 0.6, display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <CheckCircleOutlineIcon fontSize="small" />
                Importância Clínica & Odontológica
              </Typography>
              <Typography variant="body2" sx={{ color: themeTokens.colors.textPrimary, fontSize: '0.84rem' }}>
                {structure.clinicalRelevance}
              </Typography>
            </Box>

            {/* Patologias Associadas */}
            {structure.pathologyIds && structure.pathologyIds.length > 0 && (
              <Box sx={{ mb: 2.5 }}>
                <Typography variant="subtitle2" sx={{ color: '#F59E0B', mb: 0.8, display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <WarningAmberIcon fontSize="small" />
                  Patologias Relacionadas
                </Typography>
                <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap>
                  {structure.pathologyIds.map((pathId) => (
                    <Chip
                      key={pathId}
                      label={pathId.replace(/_/g, ' ')}
                      size="small"
                      clickable
                      onClick={() => {
                        setActivePathology(pathId);
                        navigate('/pathologies');
                      }}
                      sx={{
                        textTransform: 'capitalize',
                        backgroundColor: 'rgba(245, 158, 11, 0.12)',
                        color: '#F59E0B',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        fontSize: '0.72rem',
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            )}

            {/* Referências Científicas */}
            <Box sx={{ mt: 3, pt: 2, borderTop: `1px solid ${themeTokens.colors.borderSubtle}` }}>
              <Typography variant="subtitle2" sx={{ color: themeTokens.colors.textMuted, mb: 1 }}>
                Fontes Científicas Verificadas
              </Typography>
              <Stack spacing={1}>
                {structure.referenceIds.map((refId) => {
                  const ref = scientificReferences[refId];
                  if (!ref) return null;
                  return (
                    <Paper
                      key={refId}
                      sx={{
                        p: 1.2,
                        backgroundColor: themeTokens.colors.bgMain,
                        border: `1px solid ${themeTokens.colors.borderSubtle}`,
                      }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 700, color: themeTokens.colors.textPrimary, display: 'block' }}>
                        {ref.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: themeTokens.colors.textMuted, display: 'block' }}>
                        {ref.authors} ({ref.year}) • {ref.source}
                      </Typography>
                      {ref.doiOrUrl && (
                        <Typography variant="caption" sx={{ color: themeTokens.colors.brandCyan, fontSize: '0.68rem', display: 'block', mt: 0.3 }}>
                          {ref.doiOrUrl}
                        </Typography>
                      )}
                    </Paper>
                  );
                })}
              </Stack>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box sx={{ p: 3, textAlign: 'center', my: 'auto' }}>
          <CenterFocusStrongIcon sx={{ fontSize: 44, color: themeTokens.colors.textMuted, mb: 1.5 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: themeTokens.colors.textSecondary }}>
            Nenhuma estrutura selecionada
          </Typography>
          <Typography variant="body2" sx={{ color: themeTokens.colors.textMuted, mt: 1 }}>
            Clique em qualquer elemento do modelo 3D, selecione um dente no odontograma ou utilize a barra de busca para inspecionar informações anatômicas fundamentadas.
          </Typography>
        </Box>
      )}
    </Drawer>
  );
};
