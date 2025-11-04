"use client";

import styled from "@emotion/styled";

interface StreakBadgeProps {
  streak: number;
  size?: "sm" | "md" | "lg";
}

export function StreakBadge({
  streak,
  size = "md",
}: StreakBadgeProps): React.JSX.Element {
  return (
    <Badge $size={size} $hasStreak={streak > 0}>
      🔥 {streak}
    </Badge>
  );
}

const SIZES = {
  sm: "24px",
  md: "32px",
  lg: "48px",
};

const Badge = styled.div<{
  $size: StreakBadgeProps["size"];
  $hasStreak: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: ${({ $size }) => SIZES[$size!]};
  height: ${({ $size }) => SIZES[$size!]};
  padding: 0 ${({ theme }) => theme.spacing.xs};
  background: ${({ theme, $hasStreak }) =>
    $hasStreak
      ? `linear-gradient(135deg, ${theme.colors.warning}, ${theme.colors.error})`
      : theme.colors.surfaceHover};
  color: ${({ theme, $hasStreak }) =>
    $hasStreak ? theme.colors.text.inverse : theme.colors.text.disabled};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme, $size }) =>
    $size === "sm"
      ? theme.typography.fontSize.xs
      : $size === "md"
        ? theme.typography.fontSize.sm
        : theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  box-shadow: ${({ theme, $hasStreak }) =>
    $hasStreak ? theme.shadows.md : "none"};
`;
