import { createTheme, Theme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    accent: Palette['primary'];
    adminPrimary: Palette['primary'];
    overlay: {
      main: string;
      light: string;
    };
  }
  interface PaletteOptions {
    accent?: PaletteOptions['primary'];
    adminPrimary?: PaletteOptions['primary'];
    overlay?: {
      main?: string;
      light?: string;
    };
  }
}

const sharedTypography = {
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  h1: {
    fontSize: '3.5rem',
    fontWeight: 700,
    lineHeight: 1.2,
  },
  h2: {
    fontSize: '2.5rem',
    fontWeight: 700,
    lineHeight: 1.3,
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: 600,
  },
  h4: {
    fontSize: '1.25rem',
    fontWeight: 600,
  },
  body1: {
    fontSize: '1rem',
    lineHeight: 1.6,
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.5,
  },
};

const sharedComponents = {
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontWeight: 600,
        padding: '12px 32px',
      },
    },
  },
};

const lightPalette = {
  palette: {
    mode: 'light' as const,
    primary: {
      main: '#16A34A',
      light: '#4ADE80',
      dark: '#15803D',
      contrastText: '#FFFFFF',
    },
    adminPrimary: {
      main: '#DC2626',
      light: '#F87171',
      dark: '#B91C1C',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#64748B',
      light: '#94A3B8',
      dark: '#475569',
    },
    accent: {
      main: '#22C55E',
      light: '#4ADE80',
      dark: '#16A34A',
    },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1E293B',
      secondary: '#64748B',
    },
    overlay: {
      main: 'rgba(250, 250, 250, 0)',
      light: 'rgba(250, 250, 250, 0.5)',
    },
  },
  typography: sharedTypography,
  shape: {
    borderRadius: 8,
  },
  components: sharedComponents,
};

const darkPalette = {
  palette: {
    mode: 'dark' as const,
    primary: {
      main: '#4ADE80',
      light: '#86EFAC',
      dark: '#22C55E',
      contrastText: '#0F172A',
    },
    adminPrimary: {
      main: '#EF4444',
      light: '#FCA5A5',
      dark: '#F87171',
      contrastText: '#0F172A',
    },
    secondary: {
      main: '#94A3B8',
      light: '#CBD5E1',
      dark: '#64748B',
    },
    accent: {
      main: '#86EFAC',
      light: '#BBF7D0',
      dark: '#4ADE80',
    },
    background: {
      default: '#0F172A',
      paper: '#1E293B',
    },
    text: {
      primary: '#F8FAFC',
      secondary: '#94A3B8',
    },
    overlay: {
      main: 'rgba(15, 23, 42, 0.5)',
      light: 'rgba(15, 23, 42, 0)',
    },
  },
  typography: sharedTypography,
  shape: {
    borderRadius: 8,
  },
  components: sharedComponents,
};

export const createAppTheme = (mode: 'light' | 'dark'): Theme => {
  return createTheme(mode === 'light' ? lightPalette : darkPalette);
};

export const lightTheme = createTheme(lightPalette);
export const darkTheme = createTheme(darkPalette);

export const getTheme = (mode: 'light' | 'dark') => {
  return mode === 'light' ? lightTheme : darkTheme;
};