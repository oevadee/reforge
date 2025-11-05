"use client";

import styled from "@emotion/styled";
import { MoodLevel } from "@prisma/client";
import { MOOD_DATA } from "@/types/reflections";

interface MoodSelectorProps {
  value: MoodLevel | null;
  onChange: (mood: MoodLevel) => void;
  disabled?: boolean;
}

export function MoodSelector({
  value,
  onChange,
  disabled,
}: MoodSelectorProps): React.JSX.Element {
  const moods: MoodLevel[] = [
    "VERY_BAD",
    "BAD",
    "NEUTRAL",
    "GOOD",
    "VERY_GOOD",
  ];

  return (
    <Container>
      <Label>How are you feeling today?</Label>
      <MoodGrid>
        {moods.map((mood) => {
          const moodInfo = MOOD_DATA[mood];
          const isSelected = value === mood;

          return (
            <MoodButton
              key={mood}
              type="button"
              onClick={() => onChange(mood)}
              disabled={disabled}
              $isSelected={isSelected}
              $color={moodInfo.color}
            >
              <MoodEmoji $isSelected={isSelected}>{moodInfo.emoji}</MoodEmoji>
              <MoodLabel $isSelected={isSelected}>{moodInfo.label}</MoodLabel>
            </MoodButton>
          );
        })}
      </MoodGrid>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const MoodGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 768px) {
    grid-template-columns: repeat(5, 1fr);
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const MoodButton = styled.button<{ $isSelected: boolean; $color: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme, $isSelected, $color }) =>
    $isSelected ? $color + "20" : theme.colors.surface};
  border: 2px solid
    ${({ theme, $isSelected, $color }) =>
      $isSelected ? $color : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover:not(:disabled) {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.sm};
  }
`;

const MoodEmoji = styled.span<{ $isSelected: boolean }>`
  font-size: 2.5rem;
  transform: scale(${({ $isSelected }) => ($isSelected ? 1.2 : 1)});
  transition: transform ${({ theme }) => theme.transitions.fast};

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const MoodLabel = styled.span<{ $isSelected: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme, $isSelected }) =>
    $isSelected
      ? theme.typography.fontWeight.semibold
      : theme.typography.fontWeight.regular};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;

  @media (max-width: 768px) {
    font-size: 0.625rem;
  }
`;
