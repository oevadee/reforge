"use client";

import styled from "@emotion/styled";
import { MoodLevel } from "@prisma/client";
import { MOOD_DATA } from "@/types/reflections";

interface MoodBadgeProps {
  mood: MoodLevel;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function MoodBadge({
  mood,
  size = "md",
  showLabel = true,
}: MoodBadgeProps): React.JSX.Element {
  const moodInfo = MOOD_DATA[mood];

  return (
    <Badge $size={size} $color={moodInfo.color}>
      <Emoji $size={size}>{moodInfo.emoji}</Emoji>
      {showLabel && <Label $size={size}>{moodInfo.label}</Label>}
    </Badge>
  );
}

const SIZES = {
  sm: {
    padding: "4px 8px",
    emoji: "16px",
    label: "10px",
  },
  md: {
    padding: "6px 12px",
    emoji: "20px",
    label: "12px",
  },
  lg: {
    padding: "8px 16px",
    emoji: "24px",
    label: "14px",
  },
};

const Badge = styled.div<{ $size: MoodBadgeProps["size"]; $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ $size }) => SIZES[$size!].padding};
  background-color: ${({ $color }) => $color}20;
  border: 1px solid ${({ $color }) => $color}40;
  border-radius: ${({ theme }) => theme.borderRadius.full};
`;

const Emoji = styled.span<{ $size: MoodBadgeProps["size"] }>`
  font-size: ${({ $size }) => SIZES[$size!].emoji};
`;

const Label = styled.span<{ $size: MoodBadgeProps["size"] }>`
  font-size: ${({ $size }) => SIZES[$size!].label};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;
