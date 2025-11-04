import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-utils";
import { HabitLogRepository } from "@/lib/repositories/habit-log.repository";
import { ChartData, CompletionDataPoint } from "@/types/charts";

export async function GET(_request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();

    // Get logs from the last 30 days for completion trend
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    // Get all logs for the user in the last 30 days
    const logs: any[] = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      const dateStr = current.toISOString().split("T")[0];
      const dayLogs = await HabitLogRepository.findByUserAndDate(
        user.id,
        dateStr,
      );
      logs.push(...dayLogs);
      current.setDate(current.getDate() + 1);
    }

    // Group logs by date and count completions
    const completionMap = new Map<string, number>();

    // Initialize all dates with 0
    const initCurrent = new Date(startDate);
    while (initCurrent <= endDate) {
      const dateStr = initCurrent.toISOString().split("T")[0];
      completionMap.set(dateStr, 0);
      initCurrent.setDate(initCurrent.getDate() + 1);
    }

    // Count completions
    logs.forEach((log) => {
      if (log.status === "COMPLETED") {
        const dateStr = new Date(log.date).toISOString().split("T")[0];
        completionMap.set(dateStr, (completionMap.get(dateStr) || 0) + 1);
      }
    });

    // Convert to array format for charts
    const completionTrend: CompletionDataPoint[] = Array.from(
      completionMap.entries(),
    ).map(([date, count]) => ({
      date,
      count,
      formattedDate: new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    }));

    const chartData: ChartData = {
      completionTrend,
      streakHistory: [], // Not implementing streak history in this basic version
    };

    return NextResponse.json({ success: true, data: chartData });
  } catch (error) {
    console.error("Error fetching chart data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch chart data" },
      { status: 500 },
    );
  }
}
