"use client";

import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { LogStatus } from "@prisma/client";
import { MainContent } from "@/components/MainContent";
import { CheckInCard } from "@/components/checkin/CheckInCard";
import { Loading } from "@/components/Loading";
import { checkinApi } from "@/lib/api/checkin";
import { habitLogsApi } from "@/lib/api/habit-logs";
import { getTodayISO, formatDate } from "@/lib/utils/date";
import { DailyCheckInHabit } from "@/types/habit-logs";
import { staggerChildren, slideUp } from "@/lib/animations";

export default function CheckInPage(): React.JSX.Element {
  const [habits, setHabits] = useState<DailyCheckInHabit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loggingHabitId, setLoggingHabitId] = useState<string | null>(null);

  useEffect(() => {
    loadCheckInData();
  }, []);

  const loadCheckInData = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const data = await checkinApi.getToday();
      setHabits(data);
    } catch (error) {
      console.error("Failed to load check-in data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLog = async (
    habitId: string,
    status: LogStatus,
  ): Promise<void> => {
    try {
      setLoggingHabitId(habitId);
      await habitLogsApi.upsert({
        habitId,
        date: getTodayISO(),
        status,
      });
      await loadCheckInData();
    } catch (error) {
      console.error("Failed to log habit:", error);
      alert("Failed to log habit");
    } finally {
      setLoggingHabitId(null);
    }
  };

  const completedCount = habits.filter(
    (h) => h.todayLog?.status === "COMPLETED",
  ).length;
  const totalCount = habits.length;

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
        <div>
          <Title>Daily Check-In</Title>
          <DateText>{formatDate(new Date(), "long")}</DateText>
        </div>
        <Progress>
          <ProgressText>
            {completedCount} / {totalCount} completed
          </ProgressText>
          <ProgressBar>
            <ProgressFill
              $percentage={
                totalCount > 0 ? (completedCount / totalCount) * 100 : 0
              }
            />
          </ProgressBar>
        </Progress>
      </Header>

      {habits.length === 0 ? (
        <EmptyState>
          <EmptyText>No habits scheduled for today!</EmptyText>
        </EmptyState>
      ) : (
        <HabitsGrid
          as={motion.div}
          variants={staggerChildren}
          initial="hidden"
          animate="visible"
        >
          {habits.map((habit) => (
            <motion.div key={habit.id} variants={slideUp}>
              <CheckInCard
                habit={habit}
                onLog={handleLog}
                isLoading={loggingHabitId === habit.id}
              />
            </motion.div>
          ))}
        </HabitsGrid>
      )}
    </MainContent>
  );
}

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const DateText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

const Progress = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const ProgressText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${({ theme }) => theme.colors.surfaceHover};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $percentage: number }>`
  height: 100%;
  width: ${({ $percentage }) => $percentage}%;
  background-color: ${({ theme }) => theme.colors.success};
  transition: width ${({ theme }) => theme.transitions.normal};
`;

const HabitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
`;

const EmptyText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;
