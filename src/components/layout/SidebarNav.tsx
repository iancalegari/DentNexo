import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Divider,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Stack,
  Paper,
  useMediaQuery,
  useTheme,
} from '@mui/material';

// EXCLUSIVAMENTE ÍCONES DO MATERIAL UI (@mui/icons-material)
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PsychologyIcon from '@mui/icons-material/Psychology';
import HealingIcon from '@mui/icons-material/Healing';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import QuizIcon from '@mui/icons-material/Quiz';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ScienceIcon from '@mui/icons-material/Science';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import HandymanIcon from '@mui/icons-material/Handyman';
import GavelIcon from '@mui/icons-material/Gavel';
import CloseIcon from '@mui/icons-material/Close';
import SchoolIcon from '@mui/icons-material/School';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import SecurityIcon from '@mui/icons-material/Security';
import EmailIcon from '@mui/icons-material/Email';

import { useAnatomyStore } from '@/stores/useAnatomyStore';
import { themeTokens } from '@/theme/tokens';

interface NavItem {
  id: string;
  path: string;
  label: string;
  icon: React.ReactNode;
  category?: string;
}

const LIVEPIX_WIDGET_URL = 'https://widget.livepix.gg/embed/78732588-dd3f-4bbd-9f74-e3059c34db80';
const LIVEPIX_PAGE_URL = 'https://livepix.gg/ianinsgames';

export const SidebarNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobileDrawer = useMediaQuery(theme.breakpoints.down('md'));
  const { sidebarExpanded, setSidebarExpanded } = useAnatomyStore();
  const [termsOpen, setTermsOpen] = useState<boolean>(false);
  const [supportOpen, setSupportOpen] = useState<boolean>(false);

  const navItems: NavItem[] = [
    {
      id: 'atlas',
      path: '/atlas',
      label: 'Atlas 3D Interativo',
      icon: <ViewInArIcon fontSize="small" />,
      category: 'Exploração 3D',
    },
    {
      id: 'dental',
      path: '/dental',
      label: 'Anatomia Dental & FDI',
      icon: <MedicalServicesIcon fontSize="small" />,
      category: 'Exploração 3D',
    },
    {
      id: 'skeletal',
      path: '/skeletal',
      label: 'Ossos & Crânio',
      icon: <AccessibilityNewIcon fontSize="small" />,
      category: 'Sistemas Anatômicos',
    },
    {
      id: 'muscular',
      path: '/muscular',
      label: 'Músculos',
      icon: <FitnessCenterIcon fontSize="small" />,
      category: 'Sistemas Anatômicos',
    },
    {
      id: 'nervous',
      path: '/nervous',
      label: 'Nervos Cranianos',
      icon: <PsychologyIcon fontSize="small" />,
      category: 'Sistemas Anatômicos',
    },
    {
      id: 'vascular',
      path: '/vascular',
      label: 'Vasos Sanguíneos',
      icon: <BloodtypeIcon fontSize="small" />,
      category: 'Sistemas Anatômicos',
    },
    {
      id: 'periodontal',
      path: '/periodontal',
      label: 'Gengiva, Língua & Periodonto',
      icon: <ScienceIcon fontSize="small" />,
      category: 'Sistemas Anatômicos',
    },
    {
      id: 'pathologies',
      path: '/pathologies',
      label: 'Patologias Odontológicas',
      icon: <HealingIcon fontSize="small" />,
      category: 'Estudo Clínico',
    },
    {
      id: 'anesthesia',
      path: '/anesthesia',
      label: 'Bloqueios Anestésicos 3D',
      icon: <VaccinesIcon fontSize="small" />,
      category: 'Estudo Clínico',
    },
    {
      id: 'instruments',
      path: '/instruments',
      label: 'Instrumentais & Materiais',
      icon: <HandymanIcon fontSize="small" />,
      category: 'Estudo Clínico',
    },
    {
      id: 'quiz',
      path: '/quiz',
      label: 'Questionários & Quiz 3D',
      icon: <QuizIcon fontSize="small" />,
      category: 'Aprendizado',
    },
    {
      id: 'favorites',
      path: '/favorites',
      label: 'Favoritos & Anotações',
      icon: <BookmarkBorderIcon fontSize="small" />,
      category: 'Aprendizado',
    },
  ];

  const showLabels = isMobileDrawer || sidebarExpanded;

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobileDrawer) {
      setSidebarExpanded(false);
    }
  };

  const navContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        overflowX: 'hidden',
        backgroundColor: themeTokens.colors.bgSecondary,
      }}
    >
      {isMobileDrawer && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            py: 1.4,
            borderBottom: `1px solid ${themeTokens.colors.borderSubtle}`,
            flexShrink: 0,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box component="img" src="/logo_pura.svg" alt="DentNexo" sx={{ width: 24, height: 24 }} />
            <Typography sx={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '0.02em' }}>
              <span>DENT</span>
              <span style={{ color: themeTokens.colors.brandCyan }}>NEXO</span>
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setSidebarExpanded(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      <List
        sx={{
          py: 0.8,
          px: 0.8,
          '@media (max-height: 780px)': {
            py: 0.4,
          },
        }}
      >
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path || (item.path === '/atlas' && location.pathname === '/');
          const isFirstOfCategory = index === 0 || navItems[index - 1].category !== item.category;

          return (
            <React.Fragment key={item.id}>
              {showLabels && isFirstOfCategory && item.category && (
                <Typography
                  variant="caption"
                  sx={{
                    px: 1.4,
                    pt: index === 0 ? 0.4 : 1.4,
                    pb: 0.4,
                    '@media (max-height: 780px)': {
                      pt: index === 0 ? 0.2 : 0.8,
                      pb: 0.2,
                    },
                    fontSize: '0.64rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: themeTokens.colors.textMuted,
                    display: 'block',
                  }}
                >
                  {item.category}
                </Typography>
              )}

              <Tooltip title={!showLabels ? item.label : ''} placement="right" arrow>
                <ListItem disablePadding sx={{ mb: 0.3, '@media (max-height: 780px)': { mb: 0.15 } }}>
                  <ListItemButton
                    onClick={() => handleNavigate(item.path)}
                    selected={isActive}
                    sx={{
                      minHeight: 38,
                      '@media (max-height: 780px)': {
                        minHeight: 33,
                        py: 0.35,
                      },
                      borderRadius: `${themeTokens.borderRadius.sm}px`,
                      px: 1.3,
                      justifyContent: showLabels ? 'initial' : 'center',
                      backgroundColor: isActive ? 'rgba(0, 201, 246, 0.12)' : 'transparent',
                      borderLeft: isActive ? `3px solid ${themeTokens.colors.brandCyan}` : '3px solid transparent',
                      '&:hover': {
                        backgroundColor: isActive
                          ? 'rgba(0, 201, 246, 0.18)'
                          : 'rgba(255, 255, 255, 0.04)',
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: showLabels ? 1.3 : 'auto',
                        justifyContent: 'center',
                        color: isActive ? themeTokens.colors.brandCyan : themeTokens.colors.textSecondary,
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {showLabels && (
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontSize: '0.8rem',
                          fontWeight: isActive ? 700 : 500,
                          color: isActive ? themeTokens.colors.textPrimary : themeTokens.colors.textSecondary,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              </Tooltip>
            </React.Fragment>
          );
        })}
      </List>

      {/* Rodapé da Barra Lateral: Termos de Uso & Apoio ao Desenvolvimento */}
      <Box
        sx={{
          mt: 'auto',
          p: 0.9,
          pt: 0.4,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.6,
          flexShrink: 0,
        }}
      >
        <Divider sx={{ mb: 0.2, borderColor: themeTokens.colors.borderSubtle }} />
        <Tooltip title={!showLabels ? 'Termos de Uso & Privacidade' : ''} placement="right" arrow>
          <ListItemButton
            onClick={() => {
              if (isMobileDrawer) setSidebarExpanded(false);
              setTermsOpen(true);
            }}
            sx={{
              minHeight: 34,
              '@media (max-height: 780px)': { minHeight: 30, py: 0.4 },
              borderRadius: `${themeTokens.borderRadius.sm}px`,
              px: 1.3,
              py: 0.6,
              justifyContent: showLabels ? 'initial' : 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              '&:hover': {
                backgroundColor: 'rgba(0, 201, 246, 0.08)',
                borderColor: 'rgba(0, 201, 246, 0.25)',
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: showLabels ? 1.1 : 'auto',
                justifyContent: 'center',
                color: themeTokens.colors.textMuted,
              }}
            >
              <GavelIcon sx={{ fontSize: 16 }} />
            </ListItemIcon>
            {showLabels && (
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: themeTokens.colors.textSecondary,
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                Termos & Privacidade
              </Typography>
            )}
          </ListItemButton>
        </Tooltip>

        {/* Caixa Discreta Clicável: Apoie o Desenvolvimento (abaixo de Termos de Uso) */}
        <Tooltip title={!showLabels ? 'Apoie o Desenvolvimento' : ''} placement="right" arrow>
          <ListItemButton
            onClick={() => {
              if (isMobileDrawer) setSidebarExpanded(false);
              setSupportOpen(true);
            }}
            sx={{
              minHeight: 34,
              '@media (max-height: 780px)': { minHeight: 30, py: 0.4 },
              borderRadius: `${themeTokens.borderRadius.sm}px`,
              px: 1.3,
              py: 0.6,
              justifyContent: showLabels ? 'initial' : 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.015)',
              border: '1px solid rgba(255, 255, 255, 0.04)',
              '&:hover': {
                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                borderColor: 'rgba(16, 185, 129, 0.28)',
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: showLabels ? 1.1 : 'auto',
                justifyContent: 'center',
                color: themeTokens.colors.textMuted,
              }}
            >
              <VolunteerActivismIcon sx={{ fontSize: 16 }} />
            </ListItemIcon>
            {showLabels && (
              <Typography
                sx={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: themeTokens.colors.textSecondary,
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                Apoie o Desenvolvimento
              </Typography>
            )}
          </ListItemButton>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <>
      {isMobileDrawer ? (
        <Drawer
          anchor="left"
          variant="temporary"
          open={sidebarExpanded}
          onClose={() => setSidebarExpanded(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            zIndex: 1300,
            '& .MuiDrawer-paper': {
              width: 260,
              maxWidth: '82vw',
              height: '100dvh',
              backgroundColor: themeTokens.colors.bgSecondary,
              borderRight: `1px solid ${themeTokens.colors.borderSubtle}`,
              backgroundImage: 'none',
            },
          }}
        >
          {navContent}
        </Drawer>
      ) : (
        <Box
          component="nav"
          sx={{
            width: sidebarExpanded ? { md: 208, xl: 238 } : 58,
            flexShrink: 0,
            backgroundColor: themeTokens.colors.bgSecondary,
            borderRight: `1px solid ${themeTokens.colors.borderSubtle}`,
            height: '100%',
            overflow: 'hidden',
            transition: 'width 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {navContent}
        </Box>
      )}

      {/* Modal de Termos de Uso, Autoria e Modelos 3D */}
      <Dialog
        open={termsOpen}
        onClose={() => setTermsOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: themeTokens.colors.bgSecondary,
            border: `1px solid ${themeTokens.colors.borderSubtle}`,
            borderRadius: 2.5,
            backgroundImage: 'none',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 3,
            py: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
            <GavelIcon sx={{ color: themeTokens.colors.brandCyan, fontSize: 22 }} />
            <Typography variant="h6" sx={{ fontWeight: 800, color: themeTokens.colors.textPrimary }}>
              Termos de Uso, Privacidade & LGPD
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setTermsOpen(false)} sx={{ color: themeTokens.colors.textMuted }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            px: 3,
            pt: '24px !important',
            pb: 2.8,
            borderColor: themeTokens.colors.borderSubtle,
          }}
        >
          <Stack spacing={2.2}>
            {/* Seção LGPD & Privacidade */}
            <Paper
              elevation={0}
              sx={{
                p: 2.2,
                backgroundColor: 'rgba(0, 201, 246, 0.04)',
                border: '1px solid rgba(0, 201, 246, 0.25)',
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <SecurityIcon sx={{ color: themeTokens.colors.brandCyan, fontSize: 20 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: themeTokens.colors.brandCyan }}>
                  Privacidade, Proteção de Dados & LGPD
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: themeTokens.colors.textSecondary, fontSize: '0.84rem', lineHeight: 1.6, mb: 1.2 }}>
                O <strong>DentNexo</strong> foi desenvolvido sob os princípios de <em>Privacy by Design</em> e <em>Privacy by Default</em> (Art. 46 da LGPD):
              </Typography>
              <Box component="ul" sx={{ pl: 2.5, m: 0, color: themeTokens.colors.textSecondary, fontSize: '0.82rem', lineHeight: 1.6 }}>
                <li>
                  <strong>100% Client-Side & Sem Banco Centralizado</strong>: Não realizamos coleta de cadastros e não possuímos servidores de banco de dados em nuvem com informações dos estudantes.
                </li>
                <li>
                  <strong>Armazenamento Estritamente Local</strong>: Suas anotações clínicas, estruturas favoritas e resultados de questionários residem exclusivamente no <code>localStorage</code> do seu próprio navegador.
                </li>
                <li>
                  <strong>Ausência de Rastreamento</strong>: Não utilizamos Google Analytics, Meta Pixel, Hotjar ou rastreadores invasivos de comportamento.
                </li>
                <li>
                  <strong>Enquadramento Legal</strong>: Projeto acadêmico sem fins lucrativos classificado como Agente de Tratamento de Pequeno Porte (Resolução CD/ANPD nº 2/2022) e compatível por design com o ECA Digital (Lei nº 15.211/2025).
                </li>
              </Box>
              <Box
                sx={{
                  mt: 1.5,
                  p: 1.2,
                  borderRadius: 1.5,
                  backgroundColor: 'rgba(0, 0, 0, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <EmailIcon sx={{ fontSize: 16, color: themeTokens.colors.brandCyan }} />
                <Typography sx={{ fontSize: '0.78rem', color: themeTokens.colors.textSecondary }}>
                  Canal de Privacidade & Atendimento ao Titular:{' '}
                  <Box
                    component="a"
                    href="mailto:insprompts@gmail.com"
                    sx={{ color: themeTokens.colors.brandCyan, fontWeight: 700, textDecoration: 'underline' }}
                  >
                    insprompts@gmail.com
                  </Box>
                </Typography>
              </Box>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 2.2,
                backgroundColor: themeTokens.colors.bgElevated,
                border: `1px solid ${themeTokens.colors.borderSubtle}`,
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <VolunteerActivismIcon sx={{ color: '#10B981', fontSize: 19 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: themeTokens.colors.textPrimary }}>
                  Acesso 3D Gratuito & Sustentação do Projeto
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: themeTokens.colors.textSecondary, fontSize: '0.84rem', lineHeight: 1.6 }}>
                O <strong>DentNexo</strong> é uma plataforma interativa de anatomia odontológica 3D disponibilizada de forma{' '}
                <strong>gratuita</strong>. No futuro, poderão ser exibidos alguns anúncios discretos na interface exclusivamente
                para ajudar a custear a hospedagem e manter o projeto de pé e acessível para todos.
              </Typography>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 2.2,
                backgroundColor: themeTokens.colors.bgElevated,
                border: `1px solid ${themeTokens.colors.borderSubtle}`,
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <AutoAwesomeIcon sx={{ color: themeTokens.colors.brandCyan, fontSize: 19 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: themeTokens.colors.textPrimary }}>
                  Desenvolvimento & Finalidade Educacional
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: themeTokens.colors.textSecondary, fontSize: '0.84rem', lineHeight: 1.6 }}>
                Este projeto foi idealizado e desenvolvido por{' '}
                <Box
                  component="a"
                  href="https://github.com/iancalegari"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: themeTokens.colors.brandCyan,
                    fontWeight: 800,
                    textDecoration: 'underline',
                    textUnderlineOffset: '3px',
                    '&:hover': { color: '#7DD3FC' },
                  }}
                >
                  Ian Calegari
                </Box>{' '}
                com o auxílio de <strong>Inteligência Artificial</strong>, voltado estritamente para{' '}
                <strong>propósitos de estudo, revisão e aprendizado acadêmico</strong>. O conteúdo tem caráter didático e não
                substitui avaliação clínica, diagnóstico ou conduta odontológica profissional.
              </Typography>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 2.2,
                backgroundColor: themeTokens.colors.bgElevated,
                border: `1px solid ${themeTokens.colors.borderSubtle}`,
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <SchoolIcon sx={{ color: '#A855F7', fontSize: 19 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: themeTokens.colors.textPrimary }}>
                  Modelos Anatômicos 3D & Licenciamento
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: themeTokens.colors.textSecondary, fontSize: '0.84rem', lineHeight: 1.6 }}>
                As malhas tridimensionais craniofaciais, dentárias, musculares e neurovasculares utilizadas no visualizador derivam dos acervos científicos abertos{' '}
                <Box
                  component="a"
                  href="https://github.com/Yoosseph/dental-scope"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: themeTokens.colors.brandCyan,
                    fontWeight: 800,
                    textDecoration: 'underline',
                    textUnderlineOffset: '3px',
                    '&:hover': { color: '#7DD3FC' },
                  }}
                >
                  Dental Scope
                </Box>
                ,{' '}
                <Box
                  component="a"
                  href="https://lifesciencedb.jp/bp3d/"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: themeTokens.colors.brandCyan,
                    fontWeight: 800,
                    textDecoration: 'underline',
                    textUnderlineOffset: '3px',
                    '&:hover': { color: '#7DD3FC' },
                  }}
                >
                  BodyParts3D
                </Box>{' '}
                (The Database Center for Life Science) e{' '}
                <Box
                  component="a"
                  href="https://github.com/Z-Anatomy/Models-of-human-anatomy"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: themeTokens.colors.brandCyan,
                    fontWeight: 800,
                    textDecoration: 'underline',
                    textUnderlineOffset: '3px',
                    '&:hover': { color: '#7DD3FC' },
                  }}
                >
                  Z-Anatomy
                </Box>
                , distribuídos sob licença aberta{' '}
                <strong>Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)</strong>, com adaptações de materiais, paleta clínica e interatividade didática.
              </Typography>
            </Paper>

            {/* Seção Apoie o Desenvolvimento dentro de Termos de Uso */}
            <Paper
              elevation={0}
              sx={{
                p: 2.2,
                backgroundColor: 'rgba(16, 185, 129, 0.05)',
                border: '1px solid rgba(16, 185, 129, 0.22)',
                borderRadius: 2,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  justifyContent: 'space-between',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 1.5,
                }}
              >
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.6 }}>
                    <QrCode2Icon sx={{ color: '#10B981', fontSize: 20 }} />
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 800,
                        letterSpacing: '0.03em',
                        textTransform: 'uppercase',
                        color: themeTokens.colors.textPrimary,
                      }}
                    >
                      Apoie o Desenvolvimento
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{ color: themeTokens.colors.textSecondary, fontSize: '0.83rem', lineHeight: 1.55 }}
                  >
                    Doação totalmente espontânea e opcional para apoiar o desenvolvimento contínuo e novos recursos!
                  </Typography>
                </Box>

                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<VolunteerActivismIcon fontSize="small" />}
                  onClick={() => {
                    setTermsOpen(false);
                    setSupportOpen(true);
                  }}
                  sx={{
                    flexShrink: 0,
                    fontWeight: 700,
                    textTransform: 'none',
                    color: '#34D399',
                    borderColor: 'rgba(16, 185, 129, 0.45)',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    px: 2,
                    '&:hover': {
                      borderColor: '#10B981',
                      backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    },
                  }}
                >
                  Apoiar
                </Button>
              </Box>
            </Paper>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 1.8 }}>
          <Button
            variant="contained"
            size="small"
            onClick={() => setTermsOpen(false)}
            sx={{ fontWeight: 700, textTransform: 'none' }}
          >
            Entendi
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Apoio ao Desenvolvimento (QR Code LivePix) */}
      <Dialog
        open={supportOpen}
        onClose={() => setSupportOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: themeTokens.colors.bgSecondary,
            border: `1px solid ${themeTokens.colors.borderSubtle}`,
            borderRadius: 2.5,
            backgroundImage: 'none',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2.5,
            py: 1.8,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <VolunteerActivismIcon sx={{ color: '#10B981', fontSize: 21 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: themeTokens.colors.textPrimary }}>
              Apoie o Desenvolvimento
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setSupportOpen(false)} sx={{ color: themeTokens.colors.textMuted }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            px: 2.5,
            pt: '20px !important',
            pb: 2.2,
            borderColor: themeTokens.colors.borderSubtle,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1.8,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: themeTokens.colors.textSecondary,
              fontSize: '0.83rem',
              lineHeight: 1.5,
              textAlign: 'center',
            }}
          >
            Doação totalmente espontânea e opcional para apoiar o desenvolvimento contínuo e novos recursos!
          </Typography>

          <Box
            sx={{
              width: '100%',
              height: { xs: 340, sm: 390 },
              '@media (max-height: 760px)': {
                height: 315,
              },
              borderRadius: 2,
              overflow: 'hidden',
              border: `1px solid ${themeTokens.colors.borderSubtle}`,
              backgroundColor: '#FFFFFF',
            }}
          >
            <Box
              component="iframe"
              src={LIVEPIX_WIDGET_URL}
              title="QR Code LivePix - Apoie o Desenvolvimento do DentNexo"
              sx={{
                width: '100%',
                height: '100%',
                border: 'none',
                display: 'block',
              }}
            />
          </Box>

          <Box
            component="a"
            href={LIVEPIX_PAGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.7,
              color: themeTokens.colors.brandCyan,
              fontSize: '0.83rem',
              fontWeight: 700,
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              '&:hover': {
                color: '#7DD3FC',
              },
            }}
          >
            Abrir no navegador
            <OpenInNewIcon sx={{ fontSize: 15 }} />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 2.5, py: 1.5 }}>
          <Button
            variant="contained"
            size="small"
            onClick={() => setSupportOpen(false)}
            sx={{ fontWeight: 700, textTransform: 'none' }}
          >
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
