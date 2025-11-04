"use client";

import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { Habit } from "@prisma/client";
import { MainContent } from "@/components/MainContent";
import { HabitForm } from "@/components/habits/HabitForm";
import { HabitCard } from "@/components/habits/HabitCard";
import { Button } from "@/components/forms/Button";
import { Loading } from "@/components/Loading";
import { habitsApi } from "@/lib/api/habits";
import { CreateHabitSchema } from "@/lib/validations/habit";

export default function HabitsPage(): React.JSX.Element {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const data = await habitsApi.getAll({ isActive: true });
      setHabits(data);
    } catch (error) {
      console.error("Failed to load habits:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (data: CreateHabitSchema): Promise<void> => {
    try {
      setIsSubmitting(true);
      await habitsApi.create(data);
      await loadHabits();
      setShowForm(false);
    } catch (error) {
      console.error("Failed to create habit:", error);
      alert("Failed to create habit");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (habit: Habit): Promise<void> => {
    if (!confirm(`Delete habit "${habit.name}"?`)) return;

    try {
      await habitsApi.delete(habit.id);
      await loadHabits();
    } catch (error) {
      console.error("Failed to delete habit:", error);
      alert("Failed to delete habit");
    }
  };

  if (isLoading) {
    return (
      <MainContent>
        <Loading />
      </MainContent>
    );
  }

  return (
    <MainContent>
      <Header>
        <Title>My Habits</Title>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>+ New Habit</Button>
        )}
      </Header>

      {showForm && (
        <FormSection>
          <HabitForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
            isLoading={isSubmitting}
          />
        </FormSection>
      )}

      <HabitsGrid>
        {habits.map((habit) => (
          <HabitCard key={habit.id} habit={habit} onDelete={handleDelete} />
        ))}
      </HabitsGrid>

      {habits.length === 0 && !showForm && (
        <EmptyState>
          <EmptyText>No habits yet. Create your first one!</EmptyText>
          <Button onClick={() => setShowForm(true)}>+ Create Habit</Button>
        </EmptyState>
      )}
    </MainContent>
  );
}

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const FormSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const HabitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const EmptyText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;
