import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { dentNexoTheme } from '@/theme/muiTheme';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider theme={dentNexoTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
