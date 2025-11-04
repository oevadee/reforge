"use client";

import styled from "@emotion/styled";
import { DailyCheckInHabit } from "@/types/habit-logs";
import { LogStatus } from "@prisma/client";

interface CheckInCardProps {
  habit: DailyCheckInHabit;
  onLog: (habitId: string, status: LogStatus) => Promise<void>;
  isLoading?: boolean;
}

export function CheckInCard({
  habit,
  onLog,
  isLoading,
}: CheckInCardProps): React.JSX.Element {
  const currentStatus = habit.todayLog?.status;

  return (
    <Card $color={habit.color || "#6366f1"}>
      <CardHeader>
        <Icon>{habit.icon}</Icon>
        <HabitInfo>
          <HabitName>{habit.name}</HabitName>
          {habit.description && (
            <HabitDescription>{habit.description}</HabitDescription>
          )}
        </HabitInfo>
      </CardHeader>

      <StatusButtons>
        <StatusButton
          $status="COMPLETED"
          $isActive={currentStatus === "COMPLETED"}
          onClick={() => onLog(habit.id, "COMPLETED")}
          disabled={isLoading}
        >
          ✓ Done
        </StatusButton>
        <StatusButton
          $status="SKIPPED"
          $isActive={currentStatus === "SKIPPED"}
          onClick={() => onLog(habit.id, "SKIPPED")}
          disabled={isLoading}
        >
          → Skip
        </StatusButton>
        <StatusButton
          $status="FAILED"
          $isActive={currentStatus === "FAILED"}
          onClick={() => onLog(habit.id, "FAILED")}
          disabled={isLoading}
        >
          ✗ Failed
        </StatusButton>
      </StatusButtons>
    </Card>
  );
}

const Card = styled.div<{ $color: string }>`
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.surface};
  border-left: 4px solid ${({ $color }) => $color};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const CardHeader = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Icon = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
`;

const HabitInfo = styled.div`
  flex: 1;
`;

const HabitName = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const HabitDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: ${({ theme }) => theme.spacing.xs};
  margin-bottom: 0;
`;

const StatusButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};
`;

const StatusButton = styled.button<{ $status: LogStatus; $isActive: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 2px solid
    ${({ theme, $status, $isActive }) => {
      if (!$isActive) return theme.colors.border;
      if ($status === "COMPLETED") return theme.colors.success;
      if ($status === "SKIPPED") return theme.colors.warning;
      return theme.colors.error;
    }};
  background-color: ${({ theme, $status, $isActive }) => {
    if (!$isActive) return "transparent";
    if ($status === "COMPLETED") return theme.colors.success + "20";
    if ($status === "SKIPPED") return theme.colors.warning + "20";
    return theme.colors.error + "20";
  }};
  color: ${({ theme, $status, $isActive }) => {
    if (!$isActive) return theme.colors.text.secondary;
    if ($status === "COMPLETED") return theme.colors.success;
    if ($status === "SKIPPED") return theme.colors.warning;
    return theme.colors.error;
  }};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
