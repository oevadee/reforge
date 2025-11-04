"use client";

import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { useSession } from "next-auth/react";
import { MainContent } from "@/components/MainContent";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Loading } from "@/components/Loading";
import { Button } from "@/components/forms/Button";
import { DashboardData } from "@/types/dashboard";
import { ApiResponse } from "@/types/forms";
import Link from "next/link";

export default function DashboardPage(): React.JSX.Element {
  const { data: session } = useSession();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/dashboard");
      const data: ApiResponse<DashboardData> = await response.json();

      if (data.success && data.data) {
        setDashboardData(data.data);
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <MainContent>
        <Loading />
      </MainContent>
    );
  }

  if (!dashboardData) {
    return (
      <MainContent>
        <ErrorMessage>Failed to load dashboard data</ErrorMessage>
      </MainContent>
    );
  }

  const { stats, recentActivity } = dashboardData;

  return (
    <MainContent>
      <Header>
        <WelcomeSection>
          <WelcomeTitle>
            Welcome back, {session?.user?.name || "User"}! 👋
          </WelcomeTitle>
          <WelcomeSubtitle>Here&apos;s your progress overview</WelcomeSubtitle>
        </WelcomeSection>
        <QuickActions>
          <Link href="/check-in">
            <Button>📝 Daily Check-In</Button>
          </Link>
          <Link href="/habits">
            <Button variant="outline">⚡ My Habits</Button>
          </Link>
        </QuickActions>
      </Header>

      <StatsGrid>
        <StatsCard
          title="Total Habits"
          value={stats.totalHabits}
          icon="🎯"
          color="#6366f1"
          subtitle={`${stats.activeHabits} active`}
        />
        <StatsCard
          title="Completion Rate"
          value={`${stats.completionRate}%`}
          icon="📊"
          color="#10b981"
          subtitle="Last 90 days"
        />
        <StatsCard
          title="Active Streaks"
          value={stats.totalActiveStreaks}
          icon="🔥"
          color="#f59e0b"
          subtitle="Current streaks"
        />
        <StatsCard
          title="Today's Progress"
          value={`${stats.todayProgress.completed}/${stats.todayProgress.total}`}
          icon="✓"
          color="#8b5cf6"
          subtitle={`${stats.todayProgress.percentage}% complete`}
        />
      </StatsGrid>

      <ContentGrid>
        <TodaySection>
          <SectionTitle>Today&apos;s Summary</SectionTitle>
          <TodayCard>
            <TodayStats>
              <TodayStat>
                <TodayStatLabel>Scheduled</TodayStatLabel>
                <TodayStatValue>{stats.todayProgress.total}</TodayStatValue>
              </TodayStat>
              <TodayStat>
                <TodayStatLabel>Completed</TodayStatLabel>
                <TodayStatValue $color="#10b981">
                  {stats.todayProgress.completed}
                </TodayStatValue>
              </TodayStat>
              <TodayStat>
                <TodayStatLabel>Remaining</TodayStatLabel>
                <TodayStatValue $color="#ef4444">
                  {stats.todayProgress.total - stats.todayProgress.completed}
                </TodayStatValue>
              </TodayStat>
            </TodayStats>
            <ProgressBarContainer>
              <ProgressBar
                $percentage={stats.todayProgress.percentage}
                $isComplete={stats.todayProgress.percentage === 100}
              />
            </ProgressBarContainer>
            {stats.todayProgress.percentage === 100 &&
              stats.todayProgress.total > 0 && (
                <CompletionMessage>
                  🎉 Great job! You&apos;ve completed all your habits for today!
                </CompletionMessage>
              )}
          </TodayCard>
        </TodaySection>

        <RecentActivity activities={recentActivity} />
      </ContentGrid>
    </MainContent>
  );
}

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const WelcomeSection = styled.div`
  flex: 1;
`;

const WelcomeTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const WelcomeSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

const QuickActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 768px) {
    width: 100%;

    a,
    button {
      flex: 1;
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const TodaySection = styled.div``;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const TodayCard = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const TodayStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const TodayStat = styled.div`
  text-align: center;
`;

const TodayStatLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const TodayStatValue = styled.div<{ $color?: string }>`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme, $color }) => $color || theme.colors.text.primary};
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 12px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ProgressBar = styled.div<{ $percentage: number; $isComplete: boolean }>`
  height: 100%;
  width: ${({ $percentage }) => $percentage}%;
  background: ${({ theme, $isComplete }) =>
    $isComplete
      ? `linear-gradient(90deg, ${theme.colors.success}, ${theme.colors.primary})`
      : theme.colors.primary};
  transition: width ${({ theme }) => theme.transitions.normal};
  border-radius: ${({ theme }) => theme.borderRadius.full};
`;

const CompletionMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.success + "20"};
  color: ${({ theme }) => theme.colors.success};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
`;
