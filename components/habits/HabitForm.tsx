"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styled from "@emotion/styled";
import { createHabitSchema, CreateHabitSchema } from "@/lib/validations/habit";
import { Input } from "@/components/forms/Input";
import { Button } from "@/components/forms/Button";
import { HABIT_COLORS, HABIT_ICONS, DayOfWeek } from "@/types/habits";

interface HabitFormProps {
  onSubmit: (data: CreateHabitSchema) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function HabitForm({
  onSubmit,
  onCancel,
  isLoading,
}: HabitFormProps): React.JSX.Element {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateHabitSchema>({
    resolver: zodResolver(createHabitSchema),
    defaultValues: {
      type: "BUILD",
      frequency: "DAILY",
      color: HABIT_COLORS[0],
      icon: HABIT_ICONS[0],
    },
  });

  const frequency = watch("frequency");
  const selectedColor = watch("color");
  const selectedIcon = watch("icon");
  const selectedDays =
    watch("schedule")?.type === "weekly"
      ? (watch("schedule") as any)?.days || []
      : [];

  const handleDayToggle = (day: DayOfWeek): void => {
    const current = selectedDays;
    const updated = current.includes(day)
      ? current.filter((d: DayOfWeek) => d !== day)
      : [...current, day];

    setValue("schedule", { type: "weekly", days: updated });
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Habit Name"
        {...register("name")}
        error={errors.name?.message}
        placeholder="e.g., Morning Meditation"
        disabled={isLoading}
      />

      <Input
        label="Description (optional)"
        {...register("description")}
        error={errors.description?.message}
        placeholder="Why is this habit important?"
        disabled={isLoading}
      />

      <FormRow>
        <FormGroup>
          <Label>Type</Label>
          <Select {...register("type")} disabled={isLoading}>
            <option value="BUILD">Build (Good Habit)</option>
            <option value="BREAK">Break (Bad Habit)</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Frequency</Label>
          <Select {...register("frequency")} disabled={isLoading}>
            <option value="DAILY">Daily</option>
            <option value="WEEKLY">Weekly</option>
          </Select>
        </FormGroup>
      </FormRow>

      {frequency === "WEEKLY" && (
        <FormGroup>
          <Label>Days of Week</Label>
          <DaysGrid>
            {(
              ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as DayOfWeek[]
            ).map((day) => (
              <DayButton
                key={day}
                type="button"
                $isSelected={selectedDays.includes(day)}
                onClick={() => handleDayToggle(day)}
                disabled={isLoading}
              >
                {day}
              </DayButton>
            ))}
          </DaysGrid>
        </FormGroup>
      )}

      <FormGroup>
        <Label>Color</Label>
        <ColorGrid>
          {HABIT_COLORS.map((color) => (
            <ColorOption
              key={color}
              type="button"
              $color={color}
              $isSelected={selectedColor === color}
              onClick={() => setValue("color", color)}
              disabled={isLoading}
            />
          ))}
        </ColorGrid>
      </FormGroup>

      <FormGroup>
        <Label>Icon</Label>
        <IconGrid>
          {HABIT_ICONS.map((icon) => (
            <IconOption
              key={icon}
              type="button"
              $isSelected={selectedIcon === icon}
              onClick={() => setValue("icon", icon)}
              disabled={isLoading}
            >
              {icon}
            </IconOption>
          ))}
        </IconGrid>
      </FormGroup>

      <Actions>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" isLoading={isLoading}>
          Create Habit
        </Button>
      </Actions>
    </Form>
  );
}

// Styled components
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: ${({ theme }) => theme.spacing.xs};
`;

const DayButton = styled.button<{ $isSelected: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid
    ${({ theme, $isSelected }) =>
      $isSelected ? theme.colors.primary : theme.colors.border};
  background-color: ${({ theme, $isSelected }) =>
    $isSelected ? theme.colors.primary : "transparent"};
  color: ${({ theme, $isSelected }) =>
    $isSelected ? theme.colors.text.inverse : theme.colors.text.primary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover:not(:disabled) {
    background-color: ${({ theme, $isSelected }) =>
      $isSelected ? theme.colors.primaryHover : theme.colors.surfaceHover};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ColorGrid = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;

const ColorOption = styled.button<{ $color: string; $isSelected: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ $color }) => $color};
  border: 3px solid
    ${({ theme, $isSelected }) =>
      $isSelected ? theme.colors.text.primary : "transparent"};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover:not(:disabled) {
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const IconGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
`;

const IconOption = styled.button<{ $isSelected: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid
    ${({ theme, $isSelected }) =>
      $isSelected ? theme.colors.primary : theme.colors.border};
  background-color: ${({ theme, $isSelected }) =>
    $isSelected ? theme.colors.primary + "20" : "transparent"};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover:not(:disabled) {
    background-color: ${({ theme, $isSelected }) =>
      $isSelected ? theme.colors.primary + "30" : theme.colors.surfaceHover};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing.md};
`;
