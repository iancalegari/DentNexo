import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('DentNexo 3D / App ErrorBoundary capturou:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
            backgroundColor: '#0F172A',
          }}
        >
          <Paper
            elevation={4}
            sx={{
              maxWidth: 480,
              p: 3,
              borderRadius: '12px',
              backgroundColor: '#1E293B',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" sx={{ color: '#F87171', fontWeight: 700, mb: 1 }}>
              Falha ao carregar modelo 3D
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8', mb: 2 }}>
              {this.state.error?.message || 'Ocorreu uma instabilidade temporária ao carregar a malha anatômica.'}
            </Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<ReplayIcon />}
              onClick={this.handleRetry}
              sx={{
                backgroundColor: '#00C9F6',
                color: '#090D16',
                fontWeight: 700,
                textTransform: 'none',
                '&:hover': { backgroundColor: '#00B4DE' },
              }}
            >
              Tentar Novamente
            </Button>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

import { useRouteError, useNavigate } from 'react-router-dom';

export const RouteErrorElement: React.FC = () => {
  const error = useRouteError() as any;
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#090D16',
        p: 3,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          maxWidth: 500,
          p: 4,
          borderRadius: '16px',
          backgroundColor: '#0F172A',
          border: '1px solid rgba(0, 201, 246, 0.3)',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
        }}
      >
        <Typography variant="h5" sx={{ color: '#00C9F6', fontWeight: 800, mb: 1.5 }}>
          DentNexo • Atlas Odontológico
        </Typography>
        <Typography variant="body1" sx={{ color: '#E2E8F0', mb: 1, fontWeight: 600 }}>
          Recuperação de Visualização Anatômica
        </Typography>
        <Typography variant="body2" sx={{ color: '#94A3B8', mb: 3 }}>
          {error?.message || 'Ocorreu uma transição inesperada na renderização da cena.'}
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/atlas')}
          sx={{
            backgroundColor: '#00C9F6',
            color: '#090D16',
            fontWeight: 700,
            textTransform: 'none',
            px: 3,
            '&:hover': { backgroundColor: '#00B4DE' },
          }}
        >
          Retornar ao Atlas 3D
        </Button>
      </Paper>
    </Box>
  );
};

