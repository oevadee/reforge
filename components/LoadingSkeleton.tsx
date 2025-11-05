"use client";

import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

interface SkeletonProps {
  height?: string;
  width?: string;
  borderRadius?: string;
}

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

export const Skeleton = styled.div<SkeletonProps>`
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.surfaceHover} 0px,
    ${({ theme }) => theme.colors.surface} 40px,
    ${({ theme }) => theme.colors.surfaceHover} 80px
  );
  background-size: 1000px 100%;
  animation: ${shimmer} 2s infinite;
  border-radius: ${({ borderRadius, theme }) =>
    borderRadius || theme.borderRadius.md};
  height: ${({ height }) => height || "20px"};
  width: ${({ width }) => width || "100%"};
`;

export const SkeletonCard = styled(Skeleton)`
  height: 150px;
`;

export const SkeletonText = styled(Skeleton)`
  height: 1em;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;
