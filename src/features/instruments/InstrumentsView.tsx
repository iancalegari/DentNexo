import React, { useState, useEffect, useCallback, Suspense } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Tabs,
  Tab,
  Button,
  Stack,
  Divider,
  CircularProgress,
  IconButton,
  Tooltip,
  useMediaQuery,
} from '@mui/material';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

// EXCLUSIVAMENTE ÍCONES DO MATERIAL UI
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import HandymanIcon from '@mui/icons-material/Handyman';
import DiamondIcon from '@mui/icons-material/Diamond';
import ShieldIcon from '@mui/icons-material/Shield';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import StopIcon from '@mui/icons-material/Stop';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SyncIcon from '@mui/icons-material/Sync';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import CleanHandsIcon from '@mui/icons-material/CleanHands';
import PanToolIcon from '@mui/icons-material/PanTool';

import {
  DENTAL_INSTRUMENTS,
  INSTRUMENT_CATEGORIES,
} from '@/data/clinical/instrumentsData';
import { InstrumentCategory } from '@/types/instruments';
import { DentalInstrument3D } from '@/components/3d/models/DentalInstrument3D';
import { ttsService } from '@/services/ttsService';
import { themeTokens } from '@/theme/tokens';

export const InstrumentsView: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 900px)');

  const [activeCategory, setActiveCategory] = useState<InstrumentCategory>('exame_clinico');
  const [selectedInstrumentId, setSelectedInstrumentId] = useState<string>('espelho_bucal');
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [ttsLoading, setTtsLoading] = useState<boolean>(false);

  const activeInstrument = DENTAL_INSTRUMENTS[selectedInstrumentId] || DENTAL_INSTRUMENTS['espelho_bucal'];

  // Filtrar materiais por categoria
  const instrumentsInCategory = Object.values(DENTAL_INSTRUMENTS).filter(
    (item) => item.category === activeCategory
  );

  // Parar áudio ao trocar de material ou desmontar
  useEffect(() => {
    ttsService.stop();
    setIsSpeaking(false);
    setTtsLoading(false);
  }, [selectedInstrumentId]);

  useEffect(() => {
    return () => {
      ttsService.stop();
    };
  }, []);

  // Ao trocar de categoria, selecionar automaticamente o primeiro item da categoria
  const handleCategoryChange = (_: React.SyntheticEvent, newCategory: InstrumentCategory) => {
    setActiveCategory(newCategory);
    const firstInCat = Object.values(DENTAL_INSTRUMENTS).find((item) => item.category === newCategory);
    if (firstInCat) {
      setSelectedInstrumentId(firstInCat.id);
    }
  };

  const handleListenAudio = useCallback(() => {
    if (isSpeaking) {
      ttsService.stop();
      setIsSpeaking(false);
      setTtsLoading(false);
      return;
    }

    const textToSpeak = [
      `${activeInstrument.name}.`,
      activeInstrument.description,
      `Função principal: ${activeInstrument.primaryFunction}`,
      activeInstrument.indications?.length ? `Indicações clínicas: ${activeInstrument.indications.join('; ')}.` : '',
      `Modo de empunhadura e aplicação: ${activeInstrument.handlingTechnique}`,
      `Biossegurança e esterilização: ${activeInstrument.biosafety}`,
      activeInstrument.clinicalTips ? `Dica clínica: ${activeInstrument.clinicalTips}` : '',
    ].filter(Boolean).join(' ');

    setTtsLoading(true);
    ttsService.speak({
      audioId: `material_${activeInstrument.id}`,
      text: textToSpeak,
      onStart: () => {
        setIsSpeaking(true);
        setTtsLoading(false);
      },
      onEnd: () => {
        setIsSpeaking(false);
        setTtsLoading(false);
      },
      onError: () => {
        setIsSpeaking(false);
        setTtsLoading(false);
      },
    });
  }, [activeInstrument, isSpeaking]);

  const getCategoryIcon = (catId: InstrumentCategory) => {
    switch (catId) {
      case 'exame_clinico':
        return <MedicalServicesIcon fontSize="small" />;
      case 'rotatorios_operatoria':
        return <HandymanIcon fontSize="small" />;
      case 'dentistica_restauradora':
        return <DiamondIcon fontSize="small" />;
      case 'isolamento_absoluto':
        return <ShieldIcon fontSize="small" />;
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: { xs: 'column-reverse', md: 'row' },
        overflow: 'hidden',
        backgroundColor: themeTokens.colors.bgMain,
      }}
    >
      {/* 1. Coluna Esquerda: Catálogo Científico e Ficha Técnica do Material */}
      <Box
        sx={{
          width: { xs: '100%', md: 380, lg: 440, xl: 480 },
          flexShrink: 0,
          height: { xs: 'auto', md: '100%' },
          maxHeight: { xs: '55%', md: '100%' },
          overflowY: 'auto',
          backgroundColor: themeTokens.colors.bgSecondary,
          borderRight: { xs: 'none', md: `1px solid ${themeTokens.colors.borderSubtle}` },
          p: { xs: 1.6, sm: 2.2 },
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {/* Cabeçalho da Seção */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <HandymanIcon sx={{ color: themeTokens.colors.brandCyan, fontSize: 24 }} />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                color: themeTokens.colors.textPrimary,
                fontSize: { xs: '1.15rem', sm: '1.3rem' },
                letterSpacing: '-0.02em',
              }}
            >
              Instrumentais & Materiais
            </Typography>
          </Box>
          <Typography
            sx={{
              fontSize: '0.78rem',
              color: themeTokens.colors.textSecondary,
              lineHeight: 1.35,
            }}
          >
            Guia 3D cirúrgico de empunhadura, indicações clínicas e protocolos de biossegurança
          </Typography>
        </Box>

        {/* Abas dos 4 Kits Clínicos Oficiais */}
        <Tabs
          value={activeCategory}
          onChange={handleCategoryChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            minHeight: 40,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            borderRadius: '10px',
            p: 0.4,
            '& .MuiTabs-indicator': {
              backgroundColor: themeTokens.colors.brandCyan,
              height: 3,
              borderRadius: '3px',
            },
            '& .MuiTab-root': {
              minHeight: 36,
              fontSize: '0.76rem',
              fontWeight: 700,
              color: themeTokens.colors.textSecondary,
              textTransform: 'none',
              px: 1.4,
              '&.Mui-selected': {
                color: themeTokens.colors.brandCyan,
              },
            },
          }}
        >
          {INSTRUMENT_CATEGORIES.map((cat) => (
            <Tab
              key={cat.id}
              value={cat.id}
              icon={getCategoryIcon(cat.id)}
              iconPosition="start"
              label={cat.label}
            />
          ))}
        </Tabs>

        {/* Seleção Rápida de Instrumentais do Kit Ativo */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.7 }}>
          {instrumentsInCategory.map((item) => {
            const isSel = item.id === selectedInstrumentId;
            return (
              <Chip
                key={item.id}
                label={item.name}
                onClick={() => setSelectedInstrumentId(item.id)}
                size="small"
                sx={{
                  backgroundColor: isSel
                    ? `${item.colorAccent}25`
                    : 'rgba(30, 41, 59, 0.65)',
                  border: isSel
                    ? `1.5px solid ${item.colorAccent}`
                    : `1px solid ${themeTokens.colors.borderSubtle}`,
                  color: isSel ? '#F8FAFC' : themeTokens.colors.textSecondary,
                  fontWeight: isSel ? 800 : 600,
                  fontSize: '0.74rem',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  '&:hover': {
                    backgroundColor: `${item.colorAccent}35`,
                    borderColor: item.colorAccent,
                  },
                }}
              />
            );
          })}
        </Box>

        <Divider sx={{ borderColor: themeTokens.colors.borderSubtle }} />

        {/* Ficha Técnica Detalhada do Instrumental Ativo */}
        <Paper
          elevation={2}
          sx={{
            p: { xs: 1.8, sm: 2.2 },
            borderRadius: '14px',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            border: `1px solid ${themeTokens.colors.borderSubtle}`,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.6,
          }}
        >
          {/* Título e Categoria */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
            <Box>
              <Chip
                label={activeInstrument.categoryLabel}
                size="small"
                sx={{
                  backgroundColor: `${activeInstrument.colorAccent}20`,
                  color: activeInstrument.colorAccent,
                  fontWeight: 700,
                  fontSize: '0.68rem',
                  mb: 0.6,
                }}
              />
              <Typography
                sx={{
                  fontSize: { xs: '1.05rem', sm: '1.2rem' },
                  fontWeight: 800,
                  color: '#F8FAFC',
                  lineHeight: 1.25,
                }}
              >
                {activeInstrument.name}
              </Typography>
            </Box>

            {/* Botão de Áudio Kokoro TTS */}
            <Button
              variant="contained"
              size="small"
              onClick={handleListenAudio}
              disabled={ttsLoading}
              startIcon={
                ttsLoading ? (
                  <CircularProgress size={16} color="inherit" />
                ) : isSpeaking ? (
                  <StopIcon />
                ) : (
                  <VolumeUpIcon />
                )
              }
              sx={{
                flexShrink: 0,
                backgroundColor: isSpeaking ? '#EF4444' : themeTokens.colors.brandCyan,
                color: isSpeaking ? '#FFFFFF' : '#080C11',
                fontWeight: 800,
                fontSize: '0.72rem',
                textTransform: 'none',
                borderRadius: '8px',
                px: 1.4,
                '&:hover': {
                  backgroundColor: isSpeaking ? '#DC2626' : '#38BDF8',
                },
              }}
            >
              {isSpeaking ? 'Parar' : 'Ouvir Explicação'}
            </Button>
          </Box>

          <Typography
            sx={{
              fontSize: '0.82rem',
              color: '#CBD5E1',
              lineHeight: 1.45,
            }}
          >
            {activeInstrument.description}
          </Typography>

          {/* 1. Função Principal */}
          <Box>
            <Typography
              sx={{
                fontSize: '0.74rem',
                fontWeight: 800,
                color: activeInstrument.colorAccent,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                mb: 0.4,
              }}
            >
              Função Principal
            </Typography>
            <Typography sx={{ fontSize: '0.80rem', color: '#F1F5F9', lineHeight: 1.4 }}>
              {activeInstrument.primaryFunction}
            </Typography>
          </Box>

          {/* 2. Indicações Clínicas */}
          {activeInstrument.indications?.length > 0 && (
            <Box>
              <Typography
                sx={{
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  color: activeInstrument.colorAccent,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  mb: 0.6,
                }}
              >
                Indicações Clínicas
              </Typography>
              <Stack spacing={0.6}>
                {activeInstrument.indications.map((ind, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.8 }}>
                    <CheckCircleOutlineIcon
                      sx={{ fontSize: 15, color: activeInstrument.colorAccent, flexShrink: 0, mt: 0.2 }}
                    />
                    <Typography sx={{ fontSize: '0.78rem', color: '#CBD5E1', lineHeight: 1.35 }}>
                      {ind}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {/* 3. Empunhadura e Técnica de Aplicação */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 0.4 }}>
              <PanToolIcon sx={{ fontSize: 16, color: activeInstrument.colorAccent }} />
              <Typography
                sx={{
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  color: activeInstrument.colorAccent,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Modo de Empunhadura & Aplicação
              </Typography>
            </Box>
            <Typography sx={{ fontSize: '0.78rem', color: '#CBD5E1', lineHeight: 1.4 }}>
              {activeInstrument.handlingTechnique}
            </Typography>
          </Box>

          {/* 4. Biossegurança e Esterilização */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 0.4 }}>
              <CleanHandsIcon sx={{ fontSize: 16, color: '#10B981' }} />
              <Typography
                sx={{
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  color: '#10B981',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Biossegurança & Esterilização
              </Typography>
            </Box>
            <Typography sx={{ fontSize: '0.78rem', color: '#CBD5E1', lineHeight: 1.4 }}>
              {activeInstrument.biosafety}
            </Typography>
          </Box>

          {/* 5. Dica Clínica Prática DentNexo */}
          {activeInstrument.clinicalTips && (
            <Box
              sx={{
                p: 1.2,
                borderRadius: '8px',
                backgroundColor: 'rgba(2, 132, 199, 0.12)',
                border: '1px solid rgba(2, 132, 199, 0.3)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 0.8,
              }}
            >
              <LightbulbOutlinedIcon sx={{ fontSize: 18, color: '#38BDF8', mt: 0.1, flexShrink: 0 }} />
              <Typography sx={{ fontSize: '0.75rem', color: '#E0F2FE', lineHeight: 1.35 }}>
                <strong style={{ color: '#38BDF8' }}>Dica Prática:</strong> {activeInstrument.clinicalTips}
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>

      {/* 2. Visualizador 3D Interativo Central (Estúdio Cirúrgico 360°) */}
      <Box
        sx={{
          flex: 1,
          height: { xs: '45%', md: '100%' },
          position: 'relative',
          backgroundColor: '#070B10',
          overflow: 'hidden',
        }}
      >
        {/* Selo Informativo Superior */}
        <Paper
          elevation={4}
          sx={{
            position: 'absolute',
            top: { xs: 10, md: 16 },
            left: { xs: 10, md: 16 },
            zIndex: 10,
            px: 1.5,
            py: 0.8,
            borderRadius: '12px',
            backgroundColor: 'rgba(15, 23, 42, 0.88)',
            backdropFilter: 'blur(12px)',
            border: `1px solid ${themeTokens.colors.borderSubtle}`,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            pointerEvents: 'none',
          }}
        >
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: activeInstrument.colorAccent,
              boxShadow: `0 0 10px ${activeInstrument.colorAccent}`,
            }}
          />
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 800, color: '#F8FAFC' }}>
            {activeInstrument.name}
          </Typography>
        </Paper>

        {/* Controles Flutuantes da Câmera */}
        <Box
          sx={{
            position: 'absolute',
            top: { xs: 10, md: 16 },
            right: { xs: 10, md: 16 },
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 0.8,
          }}
        >
          <Tooltip title={isAutoRotating ? 'Pausar Rotação 360°' : 'Girar Automaticamente'} arrow>
            <IconButton
              size="small"
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              sx={{
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                color: isAutoRotating ? themeTokens.colors.brandCyan : '#94A3B8',
                border: `1px solid ${themeTokens.colors.borderSubtle}`,
                backdropFilter: 'blur(8px)',
                '&:hover': { backgroundColor: 'rgba(30, 41, 59, 0.95)' },
              }}
            >
              <SyncIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Dica de Manipulação no Rodapé */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 12,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          <Typography
            sx={{
              fontSize: '0.70rem',
              color: 'rgba(148, 163, 184, 0.7)',
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              px: 1.4,
              py: 0.4,
              borderRadius: '999px',
              border: '1px solid rgba(148, 163, 184, 0.15)',
            }}
          >
            Arraste para girar • Roda do mouse ou pinça para zoom
          </Typography>
        </Box>

        {/* Canvas 3D Three.js */}
        <Canvas
          camera={{ position: [0, 0, 5.2], fov: 45 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
          {/* Iluminação de Estúdio Cirúrgico Polido com Múltiplos Pontos de Preenchimento */}
          <ambientLight intensity={1.35} />
          <hemisphereLight groundColor="#334155" color="#FFFFFF" intensity={1.1} />
          <directionalLight position={[4, 6, 5]} intensity={1.8} castShadow />
          <directionalLight position={[-4, 4, 3]} intensity={1.4} color="#E0F2FE" />
          <directionalLight position={[0, -3, 3]} intensity={0.9} color="#F8FAFC" />
          <directionalLight position={[0, 4, -4]} intensity={1.1} color="#CBD5E1" />
          <pointLight position={[2, 3, 2]} intensity={0.8} color="#FFFFFF" />

          <Suspense fallback={null}>
            <DentalInstrument3D instrumentId={selectedInstrumentId} />
          </Suspense>

          <OrbitControls
            enableDamping
            dampingFactor={0.06}
            autoRotate={isAutoRotating}
            autoRotateSpeed={1.8}
            minDistance={2.0}
            maxDistance={9.0}
          />
        </Canvas>
      </Box>
    </Box>
  );
};
