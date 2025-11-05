import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-utils";
import { CoachSummaryService } from "@/lib/services/coach-summary.service";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type") || "daily";
    const forceRefresh = searchParams.get("refresh") === "true";

    let insights;
    if (type === "weekly") {
      insights = await CoachSummaryService.generateWeeklyReflectionAnalysis(
        user.id,
      );
    } else {
      insights = await CoachSummaryService.generateDailySummaryWithMood(
        user.id,
        !forceRefresh,
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        content: insights.content,
        type,
        model: insights.model,
        tokenUsage: insights.totalTokens,
      },
    });
  } catch (error) {
    console.error("Error generating insights:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate insights" },
      { status: 500 },
    );
  }
}
