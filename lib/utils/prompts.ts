import { AIPromptContext } from "@/types/ai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

export class PromptBuilder {
  /**
   * System prompt for AI coach personality
   */
  private static readonly SYSTEM_PROMPT = `You are a supportive and motivational habit coach.
Your role is to help users build good habits and break bad ones through encouragement,
insights, and actionable advice. Be concise, positive, and specific. Use emojis sparingly
but effectively. Keep responses under 150 words.`;

  /**
   * Build daily summary prompt
   */
  static buildDailySummary(
    context: AIPromptContext,
  ): ChatCompletionMessageParam[] {
    const { habitData, userData } = context;

    if (!habitData || habitData.length === 0) {
      return [
        { role: "system", content: this.SYSTEM_PROMPT },
        {
          role: "user",
          content: `${userData?.name || "User"} hasn't logged any habits today.
          Provide gentle encouragement to get started.`,
        },
      ];
    }

    const userMessage = `
${userData?.name || "User"} has ${habitData.length} active habits.
Today's progress:
${habitData.map((h) => `- ${h.name} (${h.type}): ${h.completions} completions, ${h.streak} day streak`).join("\n")}

Provide a brief daily summary highlighting achievements and offering encouragement.
    `.trim();

    return [
      { role: "system", content: this.SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ];
  }

  /**
   * Build weekly summary prompt
   */
  static buildWeeklySummary(
    context: AIPromptContext,
  ): ChatCompletionMessageParam[] {
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
  static buildMotivation(
    context: AIPromptContext,
  ): ChatCompletionMessageParam[] {
    const { habitData, userData } = context;

    const strugglingHabits =
      habitData?.filter((h) => h.streak === 0 && h.completions < 3) || [];
    const strongHabits = habitData?.filter((h) => h.streak > 7) || [];

    let userMessage = `Generate a personalized motivational message for ${userData?.name || "the user"}.`;

    if (strugglingHabits.length > 0) {
      userMessage += `\nThey're working on: ${strugglingHabits.map((h) => h.name).join(", ")}.`;
      userMessage += `\nProvide encouragement to stay consistent.`;
    } else if (strongHabits.length > 0) {
      userMessage += `\nThey have strong streaks in: ${strongHabits.map((h) => h.name).join(", ")}.`;
      userMessage += `\nCelebrate their consistency and encourage them to keep going.`;
    } else {
      userMessage += `\nProvide general motivation for habit building.`;
    }

    return [
      { role: "system", content: this.SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ];
  }

  /**
   * Build habit insight prompt
   */
  static buildHabitInsight(
    habitName: string,
    completions: number,
    streak: number,
    completionRate: number,
  ): ChatCompletionMessageParam[] {
    const userMessage = `
Provide insights for the habit "${habitName}":
- Total completions: ${completions}
- Current streak: ${streak} days
- Completion rate: ${completionRate}%

Give one specific, actionable tip to improve consistency.
    `.trim();

    return [
      { role: "system", content: this.SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ];
  }

  /**
   * Build reflection analysis prompt
   */
  static buildReflectionAnalysis(
    mood: string,
    reflectionText: string,
    habitData?: AIPromptContext["habitData"],
  ): ChatCompletionMessageParam[] {
    let userMessage = `
User's reflection:
Mood: ${mood}
Thoughts: ${reflectionText}
`;

    if (habitData && habitData.length > 0) {
      userMessage += `\nToday's habit progress:\n${habitData.map((h) => `- ${h.name}: completed`).join("\n")}`;
    }

    userMessage += `\n\nProvide a supportive response that:
1. Acknowledges their mood
2. Connects it to their habits (if applicable)
3. Offers gentle encouragement`;

    return [
      { role: "system", content: this.SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ];
  }
}
