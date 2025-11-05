import { NextRequest, NextResponse } from "next/server";
import { AiCoachCacheRepository } from "@/lib/repositories/ai-coach-cache.repository";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Verify cron secret (for production)
    const authHeader = request.headers.get("authorization");
    if (
      process.env.CRON_SECRET &&
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deletedCount = await AiCoachCacheRepository.cleanExpired();

    return NextResponse.json({
      success: true,
      deletedCount,
      message: `Cleaned up ${deletedCount} expired cache entries`,
    });
  } catch (error) {
    console.error("Error cleaning cache:", error);
    return NextResponse.json(
      { success: false, error: "Failed to clean cache" },
      { status: 500 },
    );
  }
}
