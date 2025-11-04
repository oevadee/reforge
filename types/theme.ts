export interface ColorPalette {
  primary: string;
  primaryHover: string;
  secondary: string;
  secondaryHover: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  background: string;
  surface: string;
  surfaceHover: string;
  border: string;
  text: {
    primary: string;
    secondary: string;
    disabled: string;
    inverse: string;
  };
}

export interface Spacing {
  xs: string;    // 4px
  sm: string;    // 8px
  md: string;    // 16px
  lg: string;    // 24px
  xl: string;    // 32px
  xxl: string;   // 48px
}

export interface Typography {
  fontFamily: {
    primary: string;
    monospace: string;
  };
  fontSize: {
    xs: string;   // 12px
    sm: string;   // 14px
    md: string;   // 16px
    lg: string;   // 18px
    xl: string;   // 24px
    xxl: string;  // 32px
  };
  fontWeight: {
    light: number;     // 300
    regular: number;   // 400
    medium: number;    // 500
    semibold: number;  // 600
    bold: number;      // 700
  };
  lineHeight: {
    tight: number;    // 1.25
    normal: number;   // 1.5
    relaxed: number;  // 1.75
  };
}

export interface Theme {
  colors: ColorPalette;
  spacing: Spacing;
  typography: Typography;
  borderRadius: {
    sm: string;   // 4px
    md: string;   // 8px
    lg: string;   // 12px
    full: string; // 9999px
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
  transitions: {
    fast: string;   // 150ms
    normal: string; // 300ms
    slow: string;   // 500ms
  };
}

export type ThemeMode = 'light' | 'dark';

export interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  toggleTheme: () => void;
}
