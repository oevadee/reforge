import { describe, it, expect } from "vitest";
import { PromptBuilder } from "../prompts";

describe("PromptBuilder", () => {
  describe("buildDailySummary", () => {
    it("builds daily summary with habit data", () => {
      const messages = PromptBuilder.buildDailySummary({
        habitData: [
          { name: "Meditation", type: "BUILD", completions: 1, streak: 5 },
        ],
        userData: { name: "John", totalHabits: 1 },
      });

      expect(messages).toHaveLength(2);
      expect(messages[0].role).toBe("system");
      expect(messages[1].role).toBe("user");
      expect(messages[1].content).toContain("John");
      expect(messages[1].content).toContain("Meditation");
    });

    it("builds encouragement message when no habit data", () => {
      const messages = PromptBuilder.buildDailySummary({
        habitData: [],
        userData: { name: "Jane", totalHabits: 0 },
      });

      expect(messages).toHaveLength(2);
      expect(messages[1].content).toContain("hasn't logged any habits");
      expect(messages[1].content).toContain("Jane");
    });
  });

  describe("buildWeeklySummary", () => {
    it("builds weekly summary with habit data", () => {
      const messages = PromptBuilder.buildWeeklySummary({
        habitData: [
          { name: "Running", type: "BUILD", completions: 5, streak: 7 },
          { name: "Reading", type: "BUILD", completions: 6, streak: 10 },
        ],
        userData: { name: "Alex", totalHabits: 2 },
      });

      expect(messages).toHaveLength(2);
      expect(messages[1].content).toContain("Alex");
      expect(messages[1].content).toContain("Running");
      expect(messages[1].content).toContain("Reading");
    });

    it("handles empty habit data", () => {
      const messages = PromptBuilder.buildWeeklySummary({
        habitData: [],
        userData: { name: "User", totalHabits: 0 },
      });

      expect(messages).toHaveLength(2);
      expect(messages[1].content).toContain("No habit data");
    });
  });

  describe("buildMotivation", () => {
    it("builds motivation for struggling habits", () => {
      const messages = PromptBuilder.buildMotivation({
        habitData: [
          { name: "Exercise", type: "BUILD", completions: 1, streak: 0 },
        ],
        userData: { name: "Sam", totalHabits: 1 },
      });

      expect(messages).toHaveLength(2);
      expect(messages[1].content).toContain("Exercise");
      expect(messages[1].content).toContain("stay consistent");
    });

    it("builds motivation for strong streaks", () => {
      const messages = PromptBuilder.buildMotivation({
        habitData: [
          { name: "Meditation", type: "BUILD", completions: 10, streak: 10 },
        ],
        userData: { name: "Pat", totalHabits: 1 },
      });

      expect(messages).toHaveLength(2);
      expect(messages[1].content).toContain("strong streaks");
      expect(messages[1].content).toContain("Meditation");
    });

    it("builds general motivation when no specific patterns", () => {
      const messages = PromptBuilder.buildMotivation({
        habitData: [
          { name: "Walking", type: "BUILD", completions: 5, streak: 5 },
        ],
        userData: { name: "Robin", totalHabits: 1 },
      });

      expect(messages).toHaveLength(2);
      expect(messages[1].content).toContain("motivational message");
    });
  });

  describe("buildHabitInsight", () => {
    it("builds habit insight with stats", () => {
      const messages = PromptBuilder.buildHabitInsight(
        "Morning Yoga",
        20,
        7,
        85,
      );

      expect(messages).toHaveLength(2);
      expect(messages[1].content).toContain("Morning Yoga");
      expect(messages[1].content).toContain("20");
      expect(messages[1].content).toContain("7 days");
      expect(messages[1].content).toContain("85%");
    });
  });

  describe("buildReflectionAnalysis", () => {
    it("builds reflection analysis with mood and text", () => {
      const messages = PromptBuilder.buildReflectionAnalysis(
        "Happy",
        "Had a great day today!",
        [{ name: "Exercise", type: "BUILD", completions: 1, streak: 3 }],
      );

      expect(messages).toHaveLength(2);
      expect(messages[1].content).toContain("Happy");
      expect(messages[1].content).toContain("Had a great day");
      expect(messages[1].content).toContain("Exercise");
    });

    it("handles reflection without habit data", () => {
      const messages = PromptBuilder.buildReflectionAnalysis(
        "Tired",
        "Feeling exhausted",
      );

      expect(messages).toHaveLength(2);
      expect(messages[1].content).toContain("Tired");
      expect(messages[1].content).toContain("Feeling exhausted");
      expect(messages[1].content).not.toContain("habit progress");
    });
  });
});
