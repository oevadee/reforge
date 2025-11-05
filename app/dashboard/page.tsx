"use client";

import { useState, useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MainContent } from "@/components/MainContent";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { CompletionChart } from "@/components/charts/CompletionChart";
import { CoachMessage } from "@/components/coach/CoachMessage";
import { Loading } from "@/components/Loading";
import { Button } from "@/components/forms/Button";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";
import { DashboardData } from "@/types/dashboard";
import { ChartData } from "@/types/charts";
import { ApiResponse } from "@/types/forms";
import { UserSettings } from "@/types/settings";
import { coachApi } from "@/lib/api/coach";
import { settingsApi } from "@/lib/api/settings";
import { WebAI } from "@/lib/webai/client";
import { WebAICoach } from "@/lib/webai/coach";
import Link from "next/link";

export default function DashboardPage(): React.JSX.Element {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dailySummary, setDailySummary] = useState<string>("");
  const [motivation, setMotivation] = useState<string>("");
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);
  const [isLoadingMotivation, setIsLoadingMotivation] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const aiLoadedRef = useRef(false);

  useEffect(() => {
    // Redirect if not authenticated
    if (status === "unauthenticated") {
      console.warn("[Dashboard] unauthenticated → redirect signin");
      router.push("/auth/signin");
      return;
    }

    // Only load data if user is authenticated
    if (status === "authenticated") {
      console.info("[Dashboard] authenticated → load data");
      loadDashboardData();
      loadChartData();
      loadSettings();
    }
  }, [status, router]);

  useEffect(() => {
    // Only load AI messages if AI is enabled and not already loaded (avoid StrictMode double-call)
    if (settings?.aiEnabled && !aiLoadedRef.current) {
      console.info("[Dashboard] AI enabled → loadAIMessages once");
      aiLoadedRef.current = true;
      loadAIMessages();
    }
  }, [settings]);

  const loadDashboardData = async (): Promise<void> => {
    try {
      setIsLoading(true);
      console.info("[Dashboard] loadDashboardData: start");
      const response = await fetch("/api/dashboard");
      const data: ApiResponse<DashboardData> = await response.json();

      if (data.success && data.data) {
        setDashboardData(data.data);
      }
    } catch (error) {
      console.error("[Dashboard] loadDashboardData: error", error);
    } finally {
      console.info("[Dashboard] loadDashboardData: done");
      setIsLoading(false);
    }
  };

  const loadChartData = async (): Promise<void> => {
    try {
      console.info("[Dashboard] loadChartData: start");
      const response = await fetch("/api/charts");
      const data: ApiResponse<ChartData> = await response.json();

      if (data.success && data.data) {
        setChartData(data.data);
      }
    } catch (error) {
      console.error("[Dashboard] loadChartData: error", error);
    }
  };

  const loadSettings = async (): Promise<void> => {
    try {
      console.info("[Dashboard] loadSettings: start");
      const data = await settingsApi.get();
      setSettings(data);
      // Show onboarding if not completed
      if (!data.onboardingCompleted) {
        setShowOnboarding(true);
      }
    } catch (error) {
      console.error("[Dashboard] loadSettings: error", error);
      // Default to AI enabled if settings fail to load
      setSettings({ aiEnabled: true });
    }
  };

  const handleOnboardingComplete = async (): Promise<void> => {
    try {
      await fetch("/api/onboarding/complete", { method: "POST" });
      setShowOnboarding(false);
      setSettings((prev) =>
        prev ? { ...prev, onboardingCompleted: true } : null,
      );
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
    }
  };

  const loadAIMessages = async (refresh: boolean = false): Promise<void> => {
    console.info("[Dashboard] loadAIMessages: start", { refresh });
    // Load summary (from cache or placeholder)
    try {
      setIsLoadingSummary(true);
      const summaryData = await coachApi.getSummary("daily", refresh);
      setDailySummary(summaryData.content);
    } catch (error) {
      console.error("[Dashboard] loadAIMessages: summary error", error);
      setDailySummary("Unable to load daily summary. Please try again later.");
    } finally {
      setIsLoadingSummary(false);
    }

    // Load motivation (from cache or placeholder)
    try {
      setIsLoadingMotivation(true);
      const motivationData = await coachApi.getMotivation(undefined, refresh);
      setMotivation(motivationData.content);
    } catch (error) {
      console.error("[Dashboard] loadAIMessages: motivation error", error);
      setMotivation(
        "Unable to load motivation message. Please try again later.",
      );
    } finally {
      setIsLoadingMotivation(false);
    }
    console.info("[Dashboard] loadAIMessages: done");
  };

  const generateSummary = async (): Promise<void> => {
    try {
      console.info("[Dashboard] generateSummary: start");
      setIsLoadingSummary(true);
      // Initialize WebAI if not already initialized
      const { initialized, reason } = await WebAI.initialize();
      if (!initialized) {
        console.error("[Dashboard] generateSummary: init error", reason);
        throw new Error(reason || "Failed to initialize WebAI");
      }

      // Require WebGPU for a smooth experience
      if (typeof navigator === "undefined" || !("gpu" in navigator)) {
        throw new Error(
          "WebGPU not available. Please use a browser that supports WebGPU (Chrome/Edge).",
        );
      }

      // Build context from dashboard data
      const context = {
        userId: session?.user?.id || "",
        stats: dashboardData?.stats || null,
        recentActivity: dashboardData?.recentActivity || [],
        habits: [],
        userData: {
          name: session?.user?.name || "User",
        },
      };

      // Generate summary using client-side AI (short output to avoid long blocking)
      const content = await WebAICoach.generateDailySummary({
        ...context,
        maxTokens: 40,
      } as any);
      console.info("[Dashboard] generateSummary: generated", {
        length: content.length,
      });
      setDailySummary(content);
    } catch (error: any) {
      console.error("[Dashboard] generateSummary: error", error);
      setDailySummary(
        `Failed to generate summary: ${error.message || "Unknown error"}`,
      );
    } finally {
      console.info("[Dashboard] generateSummary: done");
      setIsLoadingSummary(false);
    }
  };

  const generateMotivation = async (): Promise<void> => {
    try {
      console.info("[Dashboard] generateMotivation: start");
      setIsLoadingMotivation(true);
      // Initialize WebAI if not already initialized
      const { initialized, reason } = await WebAI.initialize();
      if (!initialized) {
        console.error("[Dashboard] generateMotivation: init error", reason);
        throw new Error(reason || "Failed to initialize WebAI");
      }

      // Require WebGPU for a smooth experience
      if (typeof navigator === "undefined" || !("gpu" in navigator)) {
        throw new Error(
          "WebGPU not available. Please use a browser that supports WebGPU (Chrome/Edge).",
        );
      }

      // Build context from dashboard data
      const context = {
        userId: session?.user?.id || "",
        stats: dashboardData?.stats || null,
        recentActivity: dashboardData?.recentActivity || [],
        habits: [],
        userData: {
          name: session?.user?.name || "User",
        },
      };

      // Generate motivation using client-side AI (short output to avoid long blocking)
      const content = await WebAICoach.generateMotivation({
        ...context,
        maxTokens: 32,
      } as any);
      console.info("[Dashboard] generateMotivation: generated", {
        length: content.length,
      });
      setMotivation(content);
    } catch (error: any) {
      console.error("[Dashboard] generateMotivation: error", error);
      setMotivation(
        `Failed to generate motivation: ${error.message || "Unknown error"}`,
      );
    } finally {
      console.info("[Dashboard] generateMotivation: done");
      setIsLoadingMotivation(false);
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
      <OnboardingModal
        isOpen={showOnboarding}
        onComplete={handleOnboardingComplete}
      />

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

      {settings?.aiEnabled && (
        <AISection>
          <CoachMessage
            title="Your Daily Summary"
            content={dailySummary}
            isLoading={isLoadingSummary}
            onRefresh={() => loadAIMessages(true)}
            onGenerate={generateSummary}
          />

          <CoachMessage
            title="Motivation of the Day"
            content={motivation}
            isLoading={isLoadingMotivation}
            onRefresh={() => loadAIMessages(true)}
            onGenerate={generateMotivation}
          />
        </AISection>
      )}

      {chartData && chartData.completionTrend.length > 0 && (
        <ChartSection>
          <CompletionChart data={chartData.completionTrend} />
        </ChartSection>
      )}
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
  justify-content: flex-end;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: stretch;
    margin-top: ${({ theme }) => theme.spacing.md};

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
  margin-bottom: ${({ theme }) => theme.spacing.xxl};

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.lg};
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

const AISection = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ChartSection = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
  /* Prevent Recharts width=-1 when inside grid */
  min-width: 0;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
`;
