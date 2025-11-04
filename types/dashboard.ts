import { HabitLog } from "@prisma/client";

export interface DashboardStats {
  totalHabits: number;
  activeHabits: number;
  completionRate: number;
  totalActiveStreaks: number;
  todayProgress: {
    completed: number;
    total: number;
    percentage: number;
  };
}

export interface RecentActivityItem {
  id: string;
  habitName: string;
  habitColor: string | null;
  habitIcon: string | null;
  date: Date;
  status: HabitLog["status"];
}

export interface DashboardData {
  stats: DashboardStats;
  recentActivity: RecentActivityItem[];
}
