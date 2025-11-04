import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-utils";
import { HabitStatsService } from "@/lib/services/habit-stats.service";

export async function GET(_request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();
    const habitsWithStats = await HabitStatsService.getAllHabitsWithStats(
      user.id,
    );

    return NextResponse.json({ success: true, data: habitsWithStats });
  } catch (error) {
    console.error("Error fetching habits stats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch habits statistics" },
      { status: 500 },
    );
  }
}
