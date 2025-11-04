import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-utils";
import { CoachMotivationService } from "@/lib/services/coach-motivation.service";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();

    const searchParams = request.nextUrl.searchParams;
    const habitId = searchParams.get("habitId");

    const motivation = habitId
      ? await CoachMotivationService.generateHabitInsight(habitId, user.id)
      : await CoachMotivationService.generateMotivation(user.id);

    return NextResponse.json({
      success: true,
      data: {
        content: motivation.content,
        habitId: habitId || null,
        tokenUsage: {
          prompt: motivation.promptTokens,
          completion: motivation.completionTokens,
          total: motivation.totalTokens,
        },
      },
    });
  } catch (error: any) {
    if (error.message === "Habit not found") {
      return NextResponse.json(
        { success: false, error: "Habit not found" },
        { status: 404 },
      );
    }

    console.error("Error generating motivation:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate motivation" },
      { status: 500 },
    );
  }
}
