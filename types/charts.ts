export interface CompletionDataPoint {
  date: string;
  count: number;
  formattedDate: string;
}

export interface StreakDataPoint {
  week: string;
  currentStreak: number;
  longestStreak: number;
}

export interface ChartData {
  completionTrend: CompletionDataPoint[];
  streakHistory: StreakDataPoint[];
}
