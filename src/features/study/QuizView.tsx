import React, { useState } from 'react';
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

import { quizQuestions } from '@/data/quiz/quizQuestions';
import { useAnatomyStore } from '@/stores/useAnatomyStore';
import { storageService } from '@/services/storageService';
import { themeTokens } from '@/theme/tokens';
import { AnatomyViewer3D } from '@/components/3d/AnatomyViewer3D';
import { CameraControls } from '@/components/controls/CameraControls';

export const QuizView: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const {
    selectedStructureId,
    setSelectedStructure,
    isolateStructure,
    setInfoPanelOpen,
    resetVisibility,
    resetCamera,
  } = useAnatomyStore();

  // Ao entrar em Questionários, fechar qualquer descrição ou painel e resetar seleções
  React.useEffect(() => {
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

  const currentQ = quizQuestions[currentIdx];

  const handleConfirmAnswer = () => {
    if (isAnswered) return;

    let isCorrect = false;

    if (currentQ.type === 'multiple_choice') {
      if (!selectedOption) return;
      isCorrect = selectedOption === currentQ.correctOptionId;
    } else if (currentQ.type === 'structure_identification') {
      if (!selectedStructureId) return;
      isCorrect = selectedStructureId === currentQ.targetStructureId;
    }

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setIsAnswered(true);
  };

  const handleNextQuestion = () => {
    setSelectedStructure(null);
    isolateStructure(null);
    setInfoPanelOpen(false);

    if (currentIdx + 1 < quizQuestions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption('');
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
      storageService.saveQuizResult({
        totalQuestions: quizQuestions.length,
        correctAnswers: score + (isAnswered && (selectedOption === currentQ.correctOptionId || selectedStructureId === currentQ.targetStructureId) ? 0 : 0),
        percentage: Math.round(((score + (isAnswered && (selectedOption === currentQ.correctOptionId || selectedStructureId === currentQ.targetStructureId) ? 0 : 0)) / quizQuestions.length) * 100),
        date: new Date().toISOString(),
        answers: [],
      });
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIdx(0);
    setSelectedOption('');
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
    setSelectedStructure(null);
    isolateStructure(null);
    setInfoPanelOpen(false);
  };

  const progress = Math.round(((currentIdx + 1) / quizQuestions.length) * 100);

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', overflow: 'hidden' }}>
      {/* Coluna Esquerda: Interface do Questionário */}
      <Box
        sx={{
          width: { xs: '100%', md: 480 },
          height: '100%',
          overflowY: 'auto',
          backgroundColor: themeTokens.colors.bgSecondary,
          borderRight: `1px solid ${themeTokens.colors.borderSubtle}`,
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <QuizIcon sx={{ color: themeTokens.colors.brandCyan }} />
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Questionários de Estudo
            </Typography>
          </Box>
          <Chip
            label={`Questão ${currentIdx + 1} de ${quizQuestions.length}`}
            size="small"
            sx={{ fontWeight: 700, backgroundColor: themeTokens.colors.bgElevated }}
          />
        </Box>

        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 6,
            borderRadius: 3,
            backgroundColor: 'rgba(255,255,255,0.08)',
            '& .MuiLinearProgress-bar': { backgroundColor: themeTokens.colors.brandCyan },
          }}
        />

        {!quizFinished ? (
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
            <Box sx={{ display: 'flex', gap: 1 }}>
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
              <Chip
                label={`Dificuldade: ${currentQ.difficulty}`}
                size="small"
                sx={{ textTransform: 'capitalize', fontSize: '0.65rem' }}
              />
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 700, color: themeTokens.colors.textPrimary, lineHeight: 1.4 }}>
              {currentQ.question}
            </Typography>

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

            {/* Pergunta de Identificação no 3D */}
            {currentQ.type === 'structure_identification' && (
              <Box
                sx={{
                  p: 2,
                  backgroundColor: 'rgba(0, 201, 246, 0.06)',
                  border: `1px dashed ${themeTokens.colors.brandCyan}`,
                  borderRadius: 1.5,
                  textAlign: 'center',
                }}
              >
                <TouchAppIcon sx={{ fontSize: 36, color: themeTokens.colors.brandCyan, mb: 0.5 }} />
                <Typography variant="body2" sx={{ fontWeight: 600, color: themeTokens.colors.textPrimary }}>
                  Clique diretamente na estrutura correspondente no modelo 3D ao lado.
                </Typography>
                <Typography variant="caption" sx={{ color: themeTokens.colors.brandCyan, display: 'block', mt: 1, fontWeight: 700 }}>
                  Estrutura clicada: {selectedStructureId || 'Nenhuma (clique no 3D)'}
                </Typography>
              </Box>
            )}

            {/* Feedback e Justificativa Científica */}
            {isAnswered && (
              <Box sx={{ mt: 1 }}>
                <Alert
                  severity={
                    (currentQ.type === 'multiple_choice' && selectedOption === currentQ.correctOptionId) ||
                    (currentQ.type === 'structure_identification' && selectedStructureId === currentQ.targetStructureId)
                      ? 'success'
                      : 'error'
                  }
                  icon={
                    (currentQ.type === 'multiple_choice' && selectedOption === currentQ.correctOptionId) ||
                    (currentQ.type === 'structure_identification' && selectedStructureId === currentQ.targetStructureId)
                      ? <CheckCircleIcon fontSize="inherit" />
                      : <CancelIcon fontSize="inherit" />
                  }
                  sx={{ mb: 1.5, fontSize: '0.8rem' }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                    {(currentQ.type === 'multiple_choice' && selectedOption === currentQ.correctOptionId) ||
                    (currentQ.type === 'structure_identification' && selectedStructureId === currentQ.targetStructureId)
                      ? 'Resposta Correta!'
                      : 'Resposta Incorreta'}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, fontSize: '0.82rem' }}>
                    {currentQ.explanation}
                  </Typography>
                  {currentQ.referenceTitle && (
                    <Typography variant="caption" sx={{ color: themeTokens.colors.textMuted, display: 'block', mt: 0.8 }}>
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
                >
                  Confirmar Resposta
                </Button>
              ) : (
                <Button variant="contained" onClick={handleNextQuestion} size="small">
                  {currentIdx + 1 < quizQuestions.length ? 'Próxima Questão' : 'Ver Resultado Final'}
                </Button>
              )}
            </Box>
          </Paper>
        ) : (
          /* Tela de Resultados Reais Calculados */
          <Paper
            elevation={3}
            sx={{
              p: 4,
              backgroundColor: themeTokens.colors.bgElevated,
              border: `1px solid ${themeTokens.colors.borderSubtle}`,
              borderRadius: 2,
              textAlign: 'center',
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 56, color: '#10B981', mb: 1.5 }} />
            <Typography variant="h5" sx={{ fontWeight: 800, color: themeTokens.colors.textPrimary }}>
              Questionário Concluído!
            </Typography>
            <Typography variant="body2" sx={{ color: themeTokens.colors.textMuted, mt: 0.5 }}>
              Desempenho calculado a partir das respostas registradas:
            </Typography>

            <Box sx={{ my: 3 }}>
              <Typography variant="h2" sx={{ fontWeight: 900, color: themeTokens.colors.brandCyan }}>
                {Math.round((score / quizQuestions.length) * 100)}%
              </Typography>
              <Typography variant="body1" sx={{ color: themeTokens.colors.textPrimary, mt: 0.5 }}>
                {score} de {quizQuestions.length} questões corretas
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<RestartAltIcon />}
              onClick={handleRestartQuiz}
              size="small"
            >
              Reiniciar Questionário
            </Button>
          </Paper>
        )}
      </Box>

      {/* Coluna Direita: Visualizador 3D Interativo para Identificação */}
      <Box sx={{ flex: 1, height: '100%', position: 'relative', display: { xs: 'none', md: 'block' } }}>
        <AnatomyViewer3D />
        <CameraControls />
      </Box>
    </Box>
  );
};
