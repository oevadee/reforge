import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-utils";
import { HabitStatsService } from "@/lib/services/habit-stats.service";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  _request: NextRequest,
  context: RouteContext,
): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();
    const params = await context.params;
    const habitWithStats = await HabitStatsService.getHabitWithStats(
      params.id,
      user.id,
    );

    if (!habitWithStats) {
      return NextResponse.json(
        { success: false, error: "Habit not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: habitWithStats });
  } catch (error) {
    console.error("Error fetching habit stats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch habit statistics" },
      { status: 500 },
    );
  }
}
