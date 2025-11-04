'use client';

import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

const SIZES = {
  sm: '24px',
  md: '40px',
  lg: '60px',
};

export function Loading({
  size = 'md',
  fullScreen = false
}: LoadingProps): React.JSX.Element {
  if (fullScreen) {
    return (
      <FullScreenContainer>
        <Spinner $size={size} />
      </FullScreenContainer>
    );
  }

  return <Spinner $size={size} />;
}

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const FullScreenContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Spinner = styled.div<{ $size: LoadingProps['size'] }>`
  width: ${({ $size }) => SIZES[$size!]};
  height: ${({ $size }) => SIZES[$size!]};
  border: 3px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

