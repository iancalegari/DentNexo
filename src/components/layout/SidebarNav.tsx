import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Divider,
  Typography,
} from '@mui/material';

// EXCLUSIVAMENTE ÍCONES DO MATERIAL UI (@mui/icons-material)
import DashboardIcon from '@mui/icons-material/Dashboard';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PsychologyIcon from '@mui/icons-material/Psychology';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HealingIcon from '@mui/icons-material/Healing';
import HubIcon from '@mui/icons-material/Hub';
import QuizIcon from '@mui/icons-material/Quiz';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ScienceIcon from '@mui/icons-material/Science';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';

import { useAnatomyStore } from '@/stores/useAnatomyStore';
import { themeTokens } from '@/theme/tokens';

interface NavItem {
  id: string;
  path: string;
  label: string;
  icon: React.ReactNode;
  category?: string;
}

export const SidebarNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sidebarExpanded } = useAnatomyStore();

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
      label: 'Músculos da Mastigação',
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
      label: 'Gengiva & Periodonto',
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

  return (
    <Box
      component="nav"
      sx={{
        width: sidebarExpanded ? 240 : 64,
        flexShrink: 0,
        backgroundColor: themeTokens.colors.bgSecondary,
        borderRight: `1px solid ${themeTokens.colors.borderSubtle}`,
        height: 'calc(100vh - 60px)',
        overflowY: 'auto',
        overflowX: 'hidden',
        transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <List sx={{ py: 1, px: 0.8 }}>
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path || (item.path === '/atlas' && location.pathname === '/');
          const isFirstOfCategory = index === 0 || navItems[index - 1].category !== item.category;

          return (
            <React.Fragment key={item.id}>
              {sidebarExpanded && isFirstOfCategory && item.category && (
                <Typography
                  variant="caption"
                  sx={{
                    px: 1.5,
                    pt: index === 0 ? 0.5 : 1.8,
                    pb: 0.5,
                    fontSize: '0.66rem',
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

              <Tooltip title={!sidebarExpanded ? item.label : ''} placement="right" arrow>
                <ListItem disablePadding sx={{ mb: 0.4 }}>
                  <ListItemButton
                    onClick={() => navigate(item.path)}
                    selected={isActive}
                    sx={{
                      minHeight: 40,
                      borderRadius: `${themeTokens.borderRadius.sm}px`,
                      px: sidebarExpanded ? 1.5 : 1.5,
                      justifyContent: sidebarExpanded ? 'initial' : 'center',
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
                        mr: sidebarExpanded ? 1.5 : 'auto',
                        justifyContent: 'center',
                        color: isActive ? themeTokens.colors.brandCyan : themeTokens.colors.textSecondary,
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {sidebarExpanded && (
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontSize: '0.825rem',
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
    </Box>
  );
};
