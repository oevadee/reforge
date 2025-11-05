import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-utils";
import { CoachSummaryService } from "@/lib/services/coach-summary.service";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();

    // Get query params
    const searchParams = request.nextUrl.searchParams;
    const timeframe = searchParams.get("timeframe") || "daily";
    const forceRefresh = searchParams.get("refresh") === "true";

    if (timeframe !== "daily" && timeframe !== "weekly") {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid timeframe. Use "daily" or "weekly".',
        },
        { status: 400 },
      );
    }

    try {
      const summary =
        timeframe === "daily"
          ? await CoachSummaryService.generateDailySummary(
              user.id,
              !forceRefresh,
            )
          : await CoachSummaryService.generateWeeklySummary(
              user.id,
              !forceRefresh,
            );

      return NextResponse.json({
        success: true,
        data: {
          content: summary.content,
          timeframe,
          tokenUsage: {
            prompt: summary.promptTokens,
            completion: summary.completionTokens,
            total: summary.totalTokens,
          },
        },
      });
    } catch {
      return NextResponse.json(
        {
          success: false,
          error:
            "No cached AI content. Enable AI insights to generate on device.",
        },
        { status: 404 },
      );
    }
  } catch (error: any) {
    console.error("Error generating summary:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to generate summary",
      },
      { status: 500 },
    );
  }
}
