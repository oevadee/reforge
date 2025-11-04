'use client';

import styled from '@emotion/styled';

interface GlobalLayoutProps {
  children: React.ReactNode;
}

export function GlobalLayout({ children }: GlobalLayoutProps): React.JSX.Element {
  return (
    <AppContainer>
      {children}
    </AppContainer>
  );
}

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};
`;

