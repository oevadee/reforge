"use client";

import styled from "@emotion/styled";
import { Habit } from "@prisma/client";

interface HabitCardProps {
  habit: Habit;
  onEdit?: (habit: Habit) => void;
  onDelete?: (habit: Habit) => void;
}

export function HabitCard({
  habit,
  onEdit,
  onDelete,
}: HabitCardProps): React.JSX.Element {
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

      <CardBody>
        <Badge $variant={habit.type === "BUILD" ? "success" : "warning"}>
          {habit.type === "BUILD" ? "✓ Build" : "✗ Break"}
        </Badge>
        <Badge>{habit.frequency}</Badge>
      </CardBody>

      <CardFooter>
        {onEdit && (
          <ActionButton onClick={() => onEdit(habit)}>Edit</ActionButton>
        )}
        {onDelete && (
          <ActionButton onClick={() => onDelete(habit)}>Delete</ActionButton>
        )}
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

const CardBody = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
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

const CardFooter = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ActionButton = styled.button`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.surfaceHover};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;
