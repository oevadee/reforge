"use client";

import styled from "@emotion/styled";
import { HabitWithStats } from "@/types/habits";

interface HabitCardProps {
  habit: HabitWithStats;
  onEdit?: (habit: HabitWithStats) => void;
  onDelete?: (habit: HabitWithStats) => void;
  onClick?: (habit: HabitWithStats) => void;
}

export function HabitCard({
  habit,
  onEdit,
  onDelete,
  onClick,
}: HabitCardProps): React.JSX.Element {
  return (
    <Card $color={habit.color || "#6366f1"} onClick={() => onClick?.(habit)}>
      <CardHeader>
        <IconContainer $color={habit.color || "#6366f1"}>
          <Icon>{habit.icon}</Icon>
        </IconContainer>
        <HabitInfo>
          <HabitName>{habit.name}</HabitName>
          {habit.description && (
            <HabitDescription>{habit.description}</HabitDescription>
          )}
        </HabitInfo>
      </CardHeader>

      <StatsGrid>
        <StatItem>
          <StatIcon>🔥</StatIcon>
          <StatValue>{habit.currentStreak}</StatValue>
          <StatLabel>Current Streak</StatLabel>
        </StatItem>

        <StatItem>
          <StatIcon>🏆</StatIcon>
          <StatValue>{habit.longestStreak}</StatValue>
          <StatLabel>Best Streak</StatLabel>
        </StatItem>

        <StatItem>
          <StatIcon>📊</StatIcon>
          <StatValue>{habit.completionRate}%</StatValue>
          <StatLabel>Completion</StatLabel>
        </StatItem>

        <StatItem>
          <StatIcon>✓</StatIcon>
          <StatValue>{habit.totalCompletions}</StatValue>
          <StatLabel>Total</StatLabel>
        </StatItem>
      </StatsGrid>

      <CardFooter>
        <BadgeGroup>
          <Badge $variant={habit.type === "BUILD" ? "success" : "warning"}>
            {habit.type === "BUILD" ? "✓ Build" : "✗ Break"}
          </Badge>
          <Badge>{habit.frequency}</Badge>
        </BadgeGroup>

        <ActionGroup>
          {onEdit && (
            <ActionButton
              onClick={(e) => {
                e.stopPropagation();
                onEdit(habit);
              }}
            >
              Edit
            </ActionButton>
          )}
          {onDelete && (
            <ActionButton
              onClick={(e) => {
                e.stopPropagation();
                onDelete(habit);
              }}
              $danger
            >
              Delete
            </ActionButton>
          )}
        </ActionGroup>
      </CardFooter>
    </Card>
  );
}

const Card = styled.div<{ $color: string }>`
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.surface};
  border-left: 4px solid ${({ $color }) => $color};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-2px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const IconContainer = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ $color }) => $color}20;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const Icon = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
`;

const HabitInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const HabitName = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const HabitDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: ${({ theme }) => theme.spacing.xs};
  margin-bottom: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const StatIcon = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
`;

const StatValue = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StatLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BadgeGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;

const Badge = styled.span<{ $variant?: "success" | "warning" }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme, $variant }) =>
    $variant === "success"
      ? theme.colors.success + "20"
      : $variant === "warning"
        ? theme.colors.warning + "20"
        : theme.colors.surfaceHover};
  color: ${({ theme, $variant }) =>
    $variant === "success"
      ? theme.colors.success
      : $variant === "warning"
        ? theme.colors.warning
        : theme.colors.text.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-transform: capitalize;
`;

const ActionGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ActionButton = styled.button<{ $danger?: boolean }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background: none;
  border: 1px solid
    ${({ theme, $danger }) =>
      $danger ? theme.colors.error : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme, $danger }) =>
    $danger ? theme.colors.error : theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme, $danger }) =>
      $danger ? theme.colors.error + "10" : theme.colors.surfaceHover};
  }
`;
