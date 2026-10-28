import { createTheme } from '@mui/material/styles';
import { themeTokens } from './tokens';

export const dentNexoTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: themeTokens.colors.brandCyan,
      light: '#60E1FF',
      dark: '#0090B3',
      contrastText: '#0B0F14',
    },
    secondary: {
      main: themeTokens.colors.clinicalBlue,
      light: '#80BDFF',
      dark: '#2E7DDB',
      contrastText: '#FFFFFF',
    },
    background: {
      default: themeTokens.colors.bgMain,
      paper: themeTokens.colors.bgSecondary,
    },
    text: {
      primary: themeTokens.colors.textPrimary,
      secondary: themeTokens.colors.textSecondary,
    },
    divider: themeTokens.colors.borderSubtle,
    error: {
      main: themeTokens.colors.accentRed,
    },
    warning: {
      main: themeTokens.colors.accentGold,
    },
    success: {
      main: themeTokens.colors.accentGreen,
    },
    info: {
      main: themeTokens.colors.brandCyan,
    },
  },
  typography: {
    fontFamily: themeTokens.typography.fontFamily,
    h1: {
      fontWeight: 700,
      fontSize: '2.25rem',
      letterSpacing: '-0.02em',
      color: themeTokens.colors.textPrimary,
    },
    h2: {
      fontWeight: 700,
      fontSize: '1.75rem',
      letterSpacing: '-0.015em',
      color: themeTokens.colors.textPrimary,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.35rem',
      letterSpacing: '-0.01em',
      color: themeTokens.colors.textPrimary,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.15rem',
      letterSpacing: '-0.005em',
      color: themeTokens.colors.textPrimary,
    },
    subtitle1: {
      fontSize: '0.95rem',
      fontWeight: 500,
      color: themeTokens.colors.textSecondary,
    },
    subtitle2: {
      fontSize: '0.85rem',
      fontWeight: 600,
      letterSpacing: '0.02em',
      textTransform: 'uppercase',
      color: themeTokens.colors.textMuted,
    },
    body1: {
      fontSize: '0.925rem',
      lineHeight: 1.6,
      color: themeTokens.colors.textPrimary,
    },
    body2: {
      fontSize: '0.825rem',
      lineHeight: 1.5,
      color: themeTokens.colors.textSecondary,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: themeTokens.borderRadius.md,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: themeTokens.colors.bgMain,
          color: themeTokens.colors.textPrimary,
          fontFamily: themeTokens.typography.fontFamily,
          overflowX: 'hidden',
          scrollbarColor: `${themeTokens.colors.borderSubtle} ${themeTokens.colors.bgMain}`,
          '&::-webkit-scrollbar': {
            width: 8,
            height: 8,
          },
          '&::-webkit-scrollbar-track': {
            background: themeTokens.colors.bgMain,
          },
          '&::-webkit-scrollbar-thumb': {
            background: themeTokens.colors.borderSubtle,
            borderRadius: 4,
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#3A485A',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: themeTokens.colors.bgSecondary,
          border: `1px solid ${themeTokens.colors.borderSubtle}`,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: themeTokens.borderRadius.sm,
          padding: '6px 14px',
          transition: 'all 0.2s ease-in-out',
        },
        containedPrimary: {
          backgroundColor: themeTokens.colors.brandCyan,
          color: '#071018',
          fontWeight: 700,
          '&:hover': {
            backgroundColor: '#38DDF8',
            boxShadow: themeTokens.shadows.glowCyan,
          },
        },
        outlinedPrimary: {
          borderColor: 'rgba(0, 201, 246, 0.4)',
          color: themeTokens.colors.brandCyan,
          '&:hover': {
            borderColor: themeTokens.colors.brandCyan,
            backgroundColor: 'rgba(0, 201, 246, 0.08)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: themeTokens.colors.textSecondary,
          transition: 'all 0.15s ease',
          '&:hover': {
            color: themeTokens.colors.brandCyan,
            backgroundColor: 'rgba(0, 201, 246, 0.08)',
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: themeTokens.colors.bgElevated,
          color: themeTokens.colors.textPrimary,
          border: `1px solid ${themeTokens.colors.borderSubtle}`,
          fontSize: '0.78rem',
          borderRadius: themeTokens.borderRadius.sm,
          boxShadow: themeTokens.shadows.elevated,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: themeTokens.borderRadius.xs,
          fontWeight: 600,
          fontSize: '0.75rem',
        },
      },
    },
  },
});
