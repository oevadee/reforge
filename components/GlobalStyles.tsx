'use client';

import { Global } from '@emotion/react';
import { useTheme } from '@/components/ThemeProvider';
import { globalStyles } from '@/styles/global';

export function GlobalStyles(): React.JSX.Element {
  const { theme } = useTheme();
  return <Global styles={globalStyles(theme)} />;
}
