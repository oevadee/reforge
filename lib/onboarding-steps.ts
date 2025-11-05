import { OnboardingStep } from "@/types/onboarding";

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Welcome to Reforge! 👋",
    description:
      "Transform your life by building better habits, one day at a time.",
    icon: "🔥",
  },
  {
    id: "habits",
    title: "Track Your Habits",
    description:
      "Create habits you want to build or break, and track your daily progress.",
    icon: "✨",
  },
  {
    id: "checkin",
    title: "Daily Check-Ins",
    description:
      "Log your progress each day to build momentum and maintain streaks.",
    icon: "📊",
  },
  {
    id: "ai",
    title: "AI-Powered Insights",
    description:
      "Get personalized motivation and insights to keep you on track.",
    icon: "🤖",
  },
];
