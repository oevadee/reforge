'use client';

import styled from '@emotion/styled';

interface MainContentProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const MAX_WIDTHS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  full: '100%',
};

export function MainContent({
  children,
  maxWidth = 'xl'
}: MainContentProps): React.JSX.Element {
  return <Container $maxWidth={maxWidth}>{children}</Container>;
}

const Container = styled.main<{ $maxWidth: MainContentProps['maxWidth'] }>`
  flex: 1;
  width: 100%;
  max-width: ${({ $maxWidth }) => MAX_WIDTHS[$maxWidth!]};
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
  }
`;

