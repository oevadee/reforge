import { WebAIMessage } from "./client";
import { AIPromptContext } from "@/types/ai";

export class WebAIPromptBuilder {
  /**
   * System prompt for AI coach personality - keep it minimal for TinyLlama
   */
  private static readonly SYSTEM_PROMPT = `You are a friendly habit coach. Write short, encouraging messages.`;

  /**
   * Build daily summary prompt
   */
  static buildDailySummary(context: AIPromptContext): WebAIMessage[] {
    console.log("context", context);
    const { habitData, userData } = context;
    const userName = userData?.name || "champ";

    // Safely access stats if available (extended context from dashboard)
    const stats = (context as any).stats;
    const todayProgress = stats?.todayProgress;
    const completed = todayProgress?.completed || 0;

    // Very simple, direct prompts for TinyLlama
    if (!habitData || habitData.length === 0 || completed === 0) {
      return [
        { role: "system", content: this.SYSTEM_PROMPT },
        {
          role: "user",
          content: `Write a short encouraging message to ${userName} about starting fresh today.`,
        },
      ];
    }

    return [
      { role: "system", content: this.SYSTEM_PROMPT },
      {
        role: "user",
        content: `Write a short encouraging message to ${userName} about completing ${completed} ${completed === 1 ? "habit" : "habits"} today.`,
      },
    ];
  }

  /**
   * Build weekly summary prompt
   */
  static buildWeeklySummary(context: AIPromptContext): WebAIMessage[] {
    const { habitData, userData } = context;

    if (!habitData || habitData.length === 0) {
      return [
        { role: "system", content: this.SYSTEM_PROMPT },
        {
          role: "user",
          content:
            "No habit data for the week. Encourage the user to start tracking.",
        },
      ];
    }

    const userMessage = `
${userData?.name || "User"}'s weekly habit summary:
${habitData.map((h) => `- ${h.name}: ${h.completions} completions, ${h.streak} day streak`).join("\n")}

Provide a weekly summary with:
1. Key achievements
2. Patterns or insights
3. One actionable tip for next week
    `.trim();

    return [
      { role: "system", content: this.SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ];
  }

  /**
   * Build motivation prompt
   */
  static buildMotivation(context: AIPromptContext): WebAIMessage[] {
    const { habitData, userData } = context;
    const userName = userData?.name || "there";

    // Safely access stats if available (extended context from dashboard)
    const stats = (context as any).stats;
    const strongHabits = habitData?.filter((h) => h.streak > 7) || [];
    const activeStreaks = stats?.totalActiveStreaks || 0;

    // Very simple, direct prompts for TinyLlama
    if (strongHabits.length > 0) {
      const habitName = strongHabits[0].name;
      return [
        { role: "system", content: this.SYSTEM_PROMPT },
        {
          role: "user",
          content: `Write a short motivational message to ${userName} about doing well with ${habitName}.`,
        },
      ];
    }

    if (activeStreaks > 0) {
      return [
        { role: "system", content: this.SYSTEM_PROMPT },
        {
          role: "user",
          content: `Write a short motivational message to ${userName} about maintaining ${activeStreaks} ${activeStreaks === 1 ? "streak" : "streaks"}.`,
        },
      ];
    }

    return [
      { role: "system", content: this.SYSTEM_PROMPT },
      {
        role: "user",
        content: `Write a short motivational message to ${userName} about building good habits.`,
      },
    ];
  }

  /**
   * Build daily summary with mood context
   */
  static buildDailySummaryWithMood(
    context: AIPromptContext & { mood?: string; reflection?: string },
  ): WebAIMessage[] {
    const { habitData, userData, mood, reflection } = context;

    let userMessage = `${userData?.name || "User"} has ${habitData?.length || 0} active habits.\n\n`;

    if (mood) {
      userMessage += `Today's mood: ${mood}\n`;
    }

    if (reflection) {
      userMessage += `Today's reflection: "${reflection}"\n\n`;
    }

    if (habitData && habitData.length > 0) {
      userMessage += `Habit progress:\n${habitData
        .map(
          (h) =>
            `- ${h.name}: ${h.completions} completions, ${h.streak} day streak`,
        )
        .join("\n")}\n\n`;
    }

    userMessage += `Provide a brief summary that:
1. Acknowledges their mood
2. Connects it to their habits (if applicable)
3. Offers encouragement based on their progress`;

    return [
      { role: "system", content: this.SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ];
  }
}
