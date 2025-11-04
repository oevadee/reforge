'use client';

import styled from '@emotion/styled';
import { ButtonHTMLAttributes } from 'react';
import { Theme } from '@/types/theme';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  disabled,
  ...props
}: ButtonProps): React.JSX.Element {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? 'Loading...' : children}
    </StyledButton>
  );
}

const VARIANTS = {
  primary: (theme: Theme) => `
    background-color: ${theme.colors.primary};
    color: ${theme.colors.text.inverse};
    border: none;

    &:hover:not(:disabled) {
      background-color: ${theme.colors.primaryHover};
    }
  `,
  secondary: (theme: Theme) => `
    background-color: ${theme.colors.secondary};
    color: ${theme.colors.text.inverse};
    border: none;

    &:hover:not(:disabled) {
      background-color: ${theme.colors.secondaryHover};
    }
  `,
  outline: (theme: Theme) => `
    background-color: transparent;
    color: ${theme.colors.primary};
    border: 1px solid ${theme.colors.primary};

    &:hover:not(:disabled) {
      background-color: ${theme.colors.primary}10;
    }
  `,
  ghost: (theme: Theme) => `
    background-color: transparent;
    color: ${theme.colors.text.secondary};
    border: none;

    &:hover:not(:disabled) {
      background-color: ${theme.colors.surfaceHover};
      color: ${theme.colors.text.primary};
    }
  `,
};

const SIZES = {
  sm: (theme: Theme) => `
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    font-size: ${theme.typography.fontSize.sm};
  `,
  md: (theme: Theme) => `
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.typography.fontSize.md};
  `,
  lg: (theme: Theme) => `
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    font-size: ${theme.typography.fontSize.lg};
  `,
};

const StyledButton = styled.button<{
  $variant: ButtonProps['variant'];
  $size: ButtonProps['size'];
  $fullWidth: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};

  ${({ theme, $variant }) => VARIANTS[$variant!](theme)}
  ${({ theme, $size }) => SIZES[$size!](theme)}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

