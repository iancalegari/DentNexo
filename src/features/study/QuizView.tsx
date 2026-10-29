import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  LinearProgress,
  Stack,
  Chip,
  Divider,
} from '@mui/material';

// EXCLUSIVAMENTE ÍCONES DO MATERIAL UI
import QuizIcon from '@mui/icons-material/Quiz';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

import {
  quizQuestions,
  QUIZ_LEVEL_META,
  QUIZ_QUESTIONS_PER_ROUND,
  drawQuizQuestionsByLevel,
} from '@/data/quiz/quizQuestions';
import { anatomicalStructures } from '@/data/anatomy/structures';
import { QuizDifficulty, QuizQuestion, QuizResult } from '@/types/study';
import { useAnatomyStore } from '@/stores/useAnatomyStore';
import { storageService } from '@/services/storageService';
import { themeTokens } from '@/theme/tokens';
import { AnatomyViewer3D } from '@/components/3d/AnatomyViewer3D';
import { CameraControls } from '@/components/controls/CameraControls';

export const QuizView: React.FC = () => {
  // Se activeLevel === null, exibe a Tela Inicial de Seleção dos 3 Níveis
  const [activeLevel, setActiveLevel] = useState<QuizDifficulty | null>(null);
  const [roundQuestions, setRoundQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [clickedStructureBeforeAnswer, setClickedStructureBeforeAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [recordedAnswers, setRecordedAnswers] = useState<QuizResult['answers']>([]);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [history, setHistory] = useState<QuizResult[]>(() => storageService.getQuizHistory());

  const {
    selectedStructureId,
    setSelectedStructure,
    isolateStructure,
    setInfoPanelOpen,
    resetVisibility,
    resetCamera,
    setCameraPreset,
  } = useAnatomyStore();

  // Ao entrar/sair da aba Questionários, limpar estados visuais
  useEffect(() => {
    resetVisibility();
    resetCamera();
    setSelectedStructure(null);
    isolateStructure(null);
    setInfoPanelOpen(false);

    return () => {
      setSelectedStructure(null);
      isolateStructure(null);
      setInfoPanelOpen(false);
    };
  }, [resetVisibility, resetCamera, setSelectedStructure, isolateStructure, setInfoPanelOpen]);

  const currentQ = roundQuestions[currentIdx] || null;
  const isTeethLineupQuestion =
    Boolean(activeLevel && !quizFinished && currentQ?.sceneMode === 'teeth_lineup');

  // Instrumento ativo no visualizador 3D (para questões de ferramentas e instrumentais 3D)
  const activeInstrumentFor3D = (() => {
    if (currentQ?.sceneMode !== 'instrument_3d') return null;
    if (selectedOption && currentQ.options) {
      const match = currentQ.options.find((opt) => opt.id === selectedOption);
      if (match?.instrumentId) return match.instrumentId;
    }
    return currentQ.instrumentId || 'sonda_periodontal';
  })();

  // Ajustar enquadramento da câmera e camadas quando a questão atual mudar
  useEffect(() => {
    if (!activeLevel || quizFinished || !currentQ) return;

    useAnatomyStore.setState({
      selectedStructureId: null,
      hoveredStructureId: null,
      isolatedStructureId: null,
      infoPanelOpen: false,
    });

    if (currentQ.sceneMode === 'teeth_lineup') {
      setCameraPreset('frontal');
    } else if (currentQ.sceneMode === 'instrument_3d') {
      setCameraPreset('frontal');
    } else if (currentQ.type === 'structure_identification') {
      if (currentQ.targetStructureId) {
        const struct = anatomicalStructures[currentQ.targetStructureId];
        if (struct) {
          if (struct.category === 'skeletal') {
            useAnatomyStore.setState({
              layers: {
                skeletal: true,
                dental: true,
                muscular: false,
                nervous: false,
                vascular: false,
                oral_tissue: false,
                pathologies: false,
              },
            });
          } else if (struct.category === 'muscular') {
            useAnatomyStore.setState({
              layers: {
                skeletal: true,
                dental: false,
                muscular: true,
                nervous: false,
                vascular: false,
                oral_tissue: false,
                pathologies: false,
              },
            });
          } else if (struct.category === 'nervous') {
            useAnatomyStore.setState({
              layers: {
                skeletal: true,
                dental: true,
                muscular: false,
                nervous: true,
                vascular: false,
                oral_tissue: false,
                pathologies: false,
              },
            });
          } else if (struct.id === 'lingua' || struct.category === 'oral_tissue') {
            useAnatomyStore.setState({
              layers: {
                skeletal: true,
                dental: true,
                muscular: false,
                nervous: false,
                vascular: false,
                oral_tissue: true,
                pathologies: false,
              },
            });
          }
        }
      }
      setCameraPreset('frontal');
    } else {
      resetCamera();
    }
  }, [activeLevel, currentIdx, quizFinished]);

  const startLevel = (level: QuizDifficulty) => {
    const drawn = drawQuizQuestionsByLevel(level, QUIZ_QUESTIONS_PER_ROUND);
    resetVisibility();
    useAnatomyStore.setState({
      selectedStructureId: null,
      hoveredStructureId: null,
      isolatedStructureId: null,
      infoPanelOpen: false,
    });

    setActiveLevel(level);
    setRoundQuestions(drawn);
    setCurrentIdx(0);
    setSelectedOption('');
    setClickedStructureBeforeAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setRecordedAnswers([]);
    setQuizFinished(false);
  };

  const handleReturnToLevels = () => {
    resetVisibility();
    resetCamera();
    useAnatomyStore.setState({
      selectedStructureId: null,
      hoveredStructureId: null,
      isolatedStructureId: null,
      infoPanelOpen: false,
    });
    setActiveLevel(null);
    setRoundQuestions([]);
    setCurrentIdx(0);
    setSelectedOption('');
    setClickedStructureBeforeAnswer(null);
    setIsAnswered(false);
    setQuizFinished(false);
  };

  const handleConfirmAnswer = () => {
    if (isAnswered || !currentQ) return;

    let isCorrect = false;
    let userAnswer = '';

    if (currentQ.type === 'multiple_choice') {
      if (!selectedOption) return;
      userAnswer = selectedOption;
      isCorrect = selectedOption === currentQ.correctOptionId;
    } else if (currentQ.type === 'structure_identification') {
      if (!selectedStructureId) return;
      userAnswer = selectedStructureId;
      setClickedStructureBeforeAnswer(selectedStructureId);
      isCorrect = selectedStructureId === currentQ.targetStructureId;

      // No modo de crânio completo, destacar a estrutura correta após confirmar
      if (currentQ.sceneMode !== 'teeth_lineup' && currentQ.targetStructureId) {
        useAnatomyStore.setState({
          selectedStructureId: currentQ.targetStructureId,
          infoPanelOpen: false,
        });
      }
    }

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setRecordedAnswers((prev) => [
      ...prev,
      {
        questionId: currentQ.id,
        userAnswer,
        correct: isCorrect,
      },
    ]);

    setIsAnswered(true);
  };

  const handleNextQuestion = () => {
    if (!currentQ) return;

    useAnatomyStore.setState({
      selectedStructureId: null,
      hoveredStructureId: null,
      isolatedStructureId: null,
      infoPanelOpen: false,
    });
    setClickedStructureBeforeAnswer(null);

    if (currentIdx + 1 < roundQuestions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption('');
      setIsAnswered(false);
    } else {
      const total = roundQuestions.length;
      const pct = Math.round((score / total) * 100);
      const result: QuizResult = {
        difficulty: activeLevel || undefined,
        totalQuestions: total,
        correctAnswers: score,
        percentage: pct,
        date: new Date().toISOString(),
        answers: recordedAnswers,
      };
      storageService.saveQuizResult(result);
      setHistory(storageService.getQuizHistory());
      setQuizFinished(true);
      resetCamera();
    }
  };

  const getBestScoreForLevel = (level: QuizDifficulty): number | null => {
    const levelResults = history.filter((r) => r.difficulty === level);
    if (levelResults.length === 0) return null;
    return Math.max(...levelResults.map((r) => r.percentage));
  };

  const answeredCorrectly = (() => {
    if (!isAnswered || !currentQ) return false;
    if (currentQ.type === 'multiple_choice') {
      return selectedOption === currentQ.correctOptionId;
    }
    const evaluatedId = clickedStructureBeforeAnswer || selectedStructureId;
    return evaluatedId === currentQ.targetStructureId;
  })();

  const progress =
    roundQuestions.length > 0 ? Math.round(((currentIdx + 1) / roundQuestions.length) * 100) : 0;

  const showMobile3D = Boolean(activeLevel && !quizFinished);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: { xs: 'column-reverse', md: 'row' },
        overflow: 'hidden',
      }}
    >
      {/* Coluna Esquerda: Seleção de Níveis ou Rodada Ativa */}
      <Box
        sx={{
          width: { xs: '100%', md: 375, lg: 430, xl: 500 },
          flex: { xs: 1, md: 'none' },
          minHeight: 0,
          height: { xs: 'auto', md: '100%' },
          overflowY: 'auto',
          backgroundColor: themeTokens.colors.bgSecondary,
          borderRight: { xs: 'none', md: `1px solid ${themeTokens.colors.borderSubtle}` },
          p: { xs: 1.6, sm: 2.2, lg: 3 },
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 1.6, md: 2.2 },
        }}
      >
        {/* ==================== TELA 1: SELEÇÃO DE NÍVEL ==================== */}
        {!activeLevel ? (
          <>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <QuizIcon sx={{ color: themeTokens.colors.brandCyan, fontSize: 28 }} />
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  Questionários & Desafios 3D
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: themeTokens.colors.textSecondary, mt: 0.8, lineHeight: 1.5 }}>
                Escolha um nível abaixo para iniciar. Cada rodada sorteia <strong>5 desafios dinâmicos e balanceados</strong> —
                incluindo <strong>Instrumentais 3D Interativos</strong>, <strong>Ossos, Músculos & Nervos no Crânio 3D</strong>,
                <strong>Língua & Mucosa Oral</strong> e <strong>Dentes Enfileirados 3D</strong>, a partir de um banco com mais de <strong>90 questões</strong>.
              </Typography>

              <Stack direction="row" spacing={1} sx={{ mt: 1.5 }} flexWrap="wrap" useFlexGap>
                <Chip
                  icon={<AutoAwesomeIcon sx={{ fontSize: '15px !important' }} />}
                  label={`${quizQuestions.length} Questões no Banco`}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    backgroundColor: 'rgba(0, 201, 246, 0.12)',
                    color: themeTokens.colors.brandCyan,
                  }}
                />
                <Chip
                  icon={<ViewInArIcon sx={{ fontSize: '15px !important' }} />}
                  label={`${quizQuestions.filter((q) => q.type === 'structure_identification' || q.sceneMode === 'instrument_3d').length} Desafios Práticos 3D (Ossos, Músculos & Instrumentos)`}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    backgroundColor: 'rgba(16, 185, 129, 0.12)',
                    color: '#34D399',
                  }}
                />
              </Stack>
            </Box>

            <Divider sx={{ borderColor: themeTokens.colors.borderSubtle }} />

            <Stack spacing={2}>
              {(['basico', 'intermediario', 'avancado'] as QuizDifficulty[]).map((lvlKey) => {
                const meta = QUIZ_LEVEL_META[lvlKey];
                const totalInLevel = quizQuestions.filter((q) => q.difficulty === lvlKey).length;
                const interactiveInLevel = quizQuestions.filter(
                  (q) => q.difficulty === lvlKey && q.type === 'structure_identification'
                ).length;
                const bestPct = getBestScoreForLevel(lvlKey);

                return (
                  <Paper
                    key={lvlKey}
                    elevation={2}
                    onClick={() => startLevel(lvlKey)}
                    sx={{
                      p: 2.2,
                      backgroundColor: themeTokens.colors.bgElevated,
                      border: `1px solid ${themeTokens.colors.borderSubtle}`,
                      borderLeft: `4px solid ${meta.badgeColor}`,
                      borderRadius: 2,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: meta.badgeColor,
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                      <Box>
                        <Typography
                          variant="overline"
                          sx={{
                            color: meta.badgeColor,
                            fontWeight: 800,
                            letterSpacing: '0.08em',
                            lineHeight: 1.2,
                            display: 'block',
                          }}
                        >
                          {meta.title}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: themeTokens.colors.textPrimary, mt: 0.2 }}>
                          {meta.subtitle}
                        </Typography>
                      </Box>

                      {bestPct !== null && (
                        <Chip
                          icon={<EmojiEventsIcon sx={{ fontSize: '14px !important', color: '#FBBF24 !important' }} />}
                          label={`Recorde: ${bestPct}%`}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontSize: '0.68rem',
                            backgroundColor: 'rgba(245, 158, 11, 0.14)',
                            color: '#FCD34D',
                          }}
                        />
                      )}
                    </Box>

                    <Typography variant="body2" sx={{ color: themeTokens.colors.textSecondary, mt: 0.8, fontSize: '0.82rem' }}>
                      {meta.description}
                    </Typography>

                    <Stack direction="row" spacing={0.8} sx={{ mt: 1.4 }} flexWrap="wrap" useFlexGap>
                      {meta.topics.map((topic) => (
                        <Chip
                          key={topic}
                          label={topic}
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: '0.68rem',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            color: themeTokens.colors.textSecondary,
                          }}
                        />
                      ))}
                    </Stack>

                    <Box
                      sx={{
                        mt: 1.8,
                        pt: 1.4,
                        borderTop: '1px solid rgba(255,255,255,0.06)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant="caption" sx={{ color: themeTokens.colors.textMuted, fontWeight: 600 }}>
                        Banco: <strong>{totalInLevel} perguntas</strong> ({interactiveInLevel} no 3D) • Sorteia{' '}
                        <strong>{QUIZ_QUESTIONS_PER_ROUND}</strong>
                      </Typography>

                      <Button
                        variant="contained"
                        size="small"
                        endIcon={<PlayArrowIcon fontSize="small" />}
                        onClick={(e) => {
                          e.stopPropagation();
                          startLevel(lvlKey);
                        }}
                        sx={{
                          fontWeight: 800,
                          fontSize: '0.74rem',
                          textTransform: 'none',
                          backgroundColor: meta.badgeColor,
                          color: '#0B0F14',
                          '&:hover': {
                            backgroundColor: meta.badgeColor,
                            filter: 'brightness(1.1)',
                          },
                        }}
                      >
                        Iniciar
                      </Button>
                    </Box>
                  </Paper>
                );
              })}
            </Stack>
          </>
        ) : (
          /* ==================== TELA 2 & 3: RODADA ATIVA OU RESULTADO ==================== */
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                size="small"
                startIcon={<ArrowBackIcon fontSize="small" />}
                onClick={handleReturnToLevels}
                sx={{
                  color: themeTokens.colors.textSecondary,
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                }}
              >
                Trocar Nível
              </Button>

              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  label={QUIZ_LEVEL_META[activeLevel].title}
                  size="small"
                  sx={{
                    fontWeight: 800,
                    fontSize: '0.7rem',
                    backgroundColor: `${QUIZ_LEVEL_META[activeLevel].badgeColor}22`,
                    color: QUIZ_LEVEL_META[activeLevel].badgeColor,
                  }}
                />
                {!quizFinished && (
                  <Chip
                    label={`Questão ${currentIdx + 1} de ${roundQuestions.length}`}
                    size="small"
                    sx={{ fontWeight: 700, backgroundColor: themeTokens.colors.bgElevated }}
                  />
                )}
              </Stack>
            </Box>

            {!quizFinished && (
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: QUIZ_LEVEL_META[activeLevel].badgeColor,
                  },
                }}
              />
            )}

            {!quizFinished && currentQ ? (
              <Paper
                elevation={2}
                sx={{
                  p: 2.5,
                  backgroundColor: themeTokens.colors.bgElevated,
                  border: `1px solid ${themeTokens.colors.borderSubtle}`,
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label={currentQ.category.replace(/_/g, ' ')}
                    size="small"
                    sx={{
                      textTransform: 'uppercase',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      backgroundColor: 'rgba(0, 201, 246, 0.1)',
                      color: themeTokens.colors.brandCyan,
                    }}
                  />
                  {currentQ.sceneMode === 'instrument_3d' ? (
                    <Chip
                      icon={<ViewInArIcon sx={{ fontSize: '14px !important' }} />}
                      label="Desafio 3D • Instrumental Odontológico Interativo"
                      size="small"
                      sx={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        backgroundColor: 'rgba(236, 72, 153, 0.15)',
                        color: '#F472B6',
                      }}
                    />
                  ) : currentQ.type === 'structure_identification' ? (
                    <Chip
                      icon={<ViewInArIcon sx={{ fontSize: '14px !important' }} />}
                      label={
                        currentQ.sceneMode === 'teeth_lineup'
                          ? 'Desafio Interativo • Dentes Enfileirados 3D'
                          : 'Desafio Interativo • Clique no Crânio 3D'
                      }
                      size="small"
                      sx={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        backgroundColor: 'rgba(16, 185, 129, 0.15)',
                        color: '#34D399',
                      }}
                    />
                  ) : null}
                </Box>

                <Typography variant="h6" sx={{ fontWeight: 700, color: themeTokens.colors.textPrimary, lineHeight: 1.4 }}>
                  {currentQ.question}
                </Typography>

                {currentQ.sceneMode === 'instrument_3d' && (
                  <Box
                    sx={{
                      p: 1.2,
                      borderRadius: 1.5,
                      backgroundColor: 'rgba(236, 72, 153, 0.08)',
                      border: '1px solid rgba(236, 72, 153, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <TouchAppIcon sx={{ fontSize: 20, color: '#F472B6' }} />
                    <Typography variant="caption" sx={{ color: '#FBCFE8', fontWeight: 600 }}>
                      Gire e dê zoom no modelo 3D ao lado para inspecionar os detalhes do instrumental.
                      {currentQ.options?.some((o) => o.instrumentId) && ' Ao selecionar uma opção, o modelo 3D é atualizado em tempo real!'}
                    </Typography>
                  </Box>
                )}

                {/* Pergunta de Múltipla Escolha */}
                {currentQ.type === 'multiple_choice' && currentQ.options && (
                  <RadioGroup
                    value={selectedOption}
                    onChange={(e) => !isAnswered && setSelectedOption(e.target.value)}
                  >
                    <Stack spacing={1}>
                      {currentQ.options.map((opt) => {
                        const isOptionSelected = selectedOption === opt.id;
                        const isCorrectOption = opt.id === currentQ.correctOptionId;

                        let borderColor = themeTokens.colors.borderSubtle;
                        let bgColor = 'transparent';

                        if (isAnswered) {
                          if (isCorrectOption) {
                            borderColor = '#10B981';
                            bgColor = 'rgba(16, 185, 129, 0.12)';
                          } else if (isOptionSelected) {
                            borderColor = '#EF4444';
                            bgColor = 'rgba(239, 68, 68, 0.12)';
                          }
                        } else if (isOptionSelected) {
                          borderColor = themeTokens.colors.brandCyan;
                          bgColor = 'rgba(0, 201, 246, 0.08)';
                        }

                        return (
                          <Paper
                            key={opt.id}
                            onClick={() => !isAnswered && setSelectedOption(opt.id)}
                            sx={{
                              p: 1.2,
                              px: 1.8,
                              backgroundColor: bgColor,
                              border: `1px solid ${borderColor}`,
                              borderRadius: 1.5,
                              cursor: isAnswered ? 'default' : 'pointer',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            <FormControlLabel
                              value={opt.id}
                              control={<Radio size="small" sx={{ color: themeTokens.colors.brandCyan }} />}
                              label={<Typography variant="body2">{opt.text}</Typography>}
                              disabled={isAnswered}
                              sx={{ m: 0, width: '100%' }}
                            />
                          </Paper>
                        );
                      })}
                    </Stack>
                  </RadioGroup>
                )}

                {/* Pergunta Prática de Identificação no 3D */}
                {currentQ.type === 'structure_identification' && (
                  <Box
                    sx={{
                      p: 2.2,
                      backgroundColor: 'rgba(0, 201, 246, 0.06)',
                      border: `1px dashed ${themeTokens.colors.brandCyan}`,
                      borderRadius: 1.5,
                      textAlign: 'center',
                    }}
                  >
                    <TouchAppIcon sx={{ fontSize: 36, color: themeTokens.colors.brandCyan, mb: 0.5 }} />
                    <Typography variant="body2" sx={{ fontWeight: 700, color: themeTokens.colors.textPrimary }}>
                      {currentQ.sceneMode === 'teeth_lineup'
                        ? 'Clique diretamente no dente correspondente na vitrine 3D de 32 dentes enfileirados ao lado.'
                        : 'Gire o crânio/face 3D se necessário e clique diretamente na estrutura anatômica (osso, músculo, nervo ou língua) ao lado.'}
                    </Typography>

                    {!isAnswered ? (
                      <Typography
                        variant="caption"
                        sx={{
                          color: selectedStructureId ? '#34D399' : themeTokens.colors.textMuted,
                          display: 'block',
                          mt: 1,
                          fontWeight: 700,
                        }}
                      >
                        {selectedStructureId
                          ? '✓ Estrutura marcada no 3D! Clique em "Confirmar Resposta" (ou clique em outra peça para alterar).'
                          : 'Nenhuma peça marcada ainda — clique no modelo 3D à direita.'}
                      </Typography>
                    ) : (
                      <Typography
                        variant="caption"
                        sx={{
                          color: answeredCorrectly ? '#34D399' : '#FCA5A5',
                          display: 'block',
                          mt: 1,
                          fontWeight: 700,
                        }}
                      >
                        Você selecionou:{' '}
                        {anatomicalStructures[clickedStructureBeforeAnswer || '']?.name ||
                          clickedStructureBeforeAnswer}
                        {!answeredCorrectly &&
                          currentQ.targetStructureId &&
                          ` • Correta: ${
                            anatomicalStructures[currentQ.targetStructureId]?.name ||
                            currentQ.targetStructureId
                          }`}
                      </Typography>
                    )}
                  </Box>
                )}

                {/* Feedback e Justificativa Científica */}
                {isAnswered && (
                  <Box sx={{ mt: 0.5 }}>
                    <Alert
                      severity={answeredCorrectly ? 'success' : 'error'}
                      icon={
                        answeredCorrectly ? (
                          <CheckCircleIcon fontSize="inherit" />
                        ) : (
                          <CancelIcon fontSize="inherit" />
                        )
                      }
                      sx={{ fontSize: '0.8rem' }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                        {answeredCorrectly ? 'Resposta Correta!' : 'Resposta Incorreta'}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5, fontSize: '0.82rem' }}>
                        {currentQ.explanation}
                      </Typography>
                      {currentQ.referenceTitle && (
                        <Typography
                          variant="caption"
                          sx={{ color: themeTokens.colors.textMuted, display: 'block', mt: 0.8 }}
                        >
                          Fonte: {currentQ.referenceTitle}
                        </Typography>
                      )}
                    </Alert>
                  </Box>
                )}

                {/* Botões de Ação */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  {!isAnswered ? (
                    <Button
                      variant="contained"
                      onClick={handleConfirmAnswer}
                      disabled={
                        (currentQ.type === 'multiple_choice' && !selectedOption) ||
                        (currentQ.type === 'structure_identification' && !selectedStructureId)
                      }
                      size="small"
                      sx={{ fontWeight: 700 }}
                    >
                      Confirmar Resposta
                    </Button>
                  ) : (
                    <Button variant="contained" onClick={handleNextQuestion} size="small" sx={{ fontWeight: 700 }}>
                      {currentIdx + 1 < roundQuestions.length ? 'Próxima Questão' : 'Ver Resultado Final'}
                    </Button>
                  )}
                </Box>
              </Paper>
            ) : (
              /* Tela de Resultados do Nível */
              <Paper
                elevation={3}
                sx={{
                  p: 3.5,
                  backgroundColor: themeTokens.colors.bgElevated,
                  border: `1px solid ${themeTokens.colors.borderSubtle}`,
                  borderRadius: 2,
                  textAlign: 'center',
                }}
              >
                <EmojiEventsIcon sx={{ fontSize: 56, color: '#FBBF24', mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 800, color: themeTokens.colors.textPrimary }}>
                  {QUIZ_LEVEL_META[activeLevel].title} Concluído!
                </Typography>
                <Typography variant="body2" sx={{ color: themeTokens.colors.textMuted, mt: 0.5 }}>
                  Resultado das {roundQuestions.length} questões sorteadas neste nível:
                </Typography>

                <Box sx={{ my: 2.8 }}>
                  <Typography variant="h2" sx={{ fontWeight: 900, color: themeTokens.colors.brandCyan }}>
                    {Math.round((score / Math.max(1, roundQuestions.length)) * 100)}%
                  </Typography>
                  <Typography variant="body1" sx={{ color: themeTokens.colors.textPrimary, mt: 0.5, fontWeight: 700 }}>
                    {score} de {roundQuestions.length} questões corretas
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1.2} justifyContent="center" flexWrap="wrap" useFlexGap>
                  <Button
                    variant="contained"
                    startIcon={<RestartAltIcon />}
                    onClick={() => startLevel(activeLevel)}
                    size="small"
                    sx={{ fontWeight: 700, textTransform: 'none' }}
                  >
                    Sortear Novas 5 deste Nível
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleReturnToLevels}
                    size="small"
                    sx={{ fontWeight: 700, textTransform: 'none' }}
                  >
                    Escolher Outro Nível
                  </Button>
                </Stack>
              </Paper>
            )}
          </>
        )}
      </Box>

      {/* Coluna Direita (Topo no Mobile durante rodada ativa): Visualizador 3D Interativo */}
      <Box
        sx={{
          flex: { xs: 'none', md: 1 },
          width: { xs: '100%', md: 'auto' },
          height: {
            xs: currentQ?.type === 'structure_identification' ? '45%' : '36%',
            sm: '45%',
            md: '100%',
          },
          minWidth: 0,
          flexShrink: 0,
          position: 'relative',
          display: { xs: showMobile3D ? 'block' : 'none', md: 'block' },
          borderBottom: { xs: `1px solid ${themeTokens.colors.borderSubtle}`, md: 'none' },
        }}
      >
        <AnatomyViewer3D
          teethLineupMode={isTeethLineupQuestion}
          quizSceneMode={currentQ?.sceneMode || 'full_anatomy'}
          quizInstrumentId={activeInstrumentFor3D}
          quizTargetId={currentQ?.targetStructureId || null}
          quizAnswered={isAnswered}
          hideSelectionBadge={Boolean(activeLevel && !isAnswered)}
        />
        <CameraControls />
      </Box>
    </Box>
  );
};
