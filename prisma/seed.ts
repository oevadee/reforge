import { PrismaClient, HabitType, LogStatus, MoodLevel } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log("Start seeding...");

  // Create demo user
  const hashedPassword = await bcrypt.hash("demo123", 12);

  const demoUser = await prisma.user.upsert({
    where: { email: "demo@reforge.app" },
    update: {},
    create: {
      email: "demo@reforge.app",
      name: "Demo User",
      password: hashedPassword,
      aiEnabled: true,
      onboardingCompleted: true,
    },
  });

  console.log(`Created demo user: ${demoUser.email}`);

  // Clean up existing data for demo user
  await prisma.habitLog.deleteMany({ where: { userId: demoUser.id } });
  await prisma.habit.deleteMany({ where: { userId: demoUser.id } });
  await prisma.reflection.deleteMany({ where: { userId: demoUser.id } });
  console.log("Cleaned up existing demo data");

  // Create habits
  const habits = await Promise.all([
    prisma.habit.create({
      data: {
        userId: demoUser.id,
        name: "Morning Meditation",
        description: "10 minutes of mindfulness to start the day",
        type: "BUILD" as HabitType,
        frequency: "DAILY",
        color: "#6366f1",
        icon: "🧘",
      },
    }),
    prisma.habit.create({
      data: {
        userId: demoUser.id,
        name: "Exercise",
        description: "At least 30 minutes of physical activity",
        type: "BUILD" as HabitType,
        frequency: "DAILY",
        color: "#10b981",
        icon: "💪",
      },
    }),
    prisma.habit.create({
      data: {
        userId: demoUser.id,
        name: "Reading",
        description: "Read for 20 minutes before bed",
        type: "BUILD" as HabitType,
        frequency: "DAILY",
        color: "#8b5cf6",
        icon: "📚",
      },
    }),
    prisma.habit.create({
      data: {
        userId: demoUser.id,
        name: "No Social Media Scrolling",
        description: "Avoid mindless scrolling during work hours",
        type: "BREAK" as HabitType,
        frequency: "DAILY",
        color: "#ef4444",
        icon: "📱",
      },
    }),
  ]);

  console.log(`Created ${habits.length} habits`);

  // Create habit logs for the last 14 days
  const today = new Date();
  const logs = [];

  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Meditation (high compliance ~80%)
    if (Math.random() > 0.2) {
      logs.push({
        habitId: habits[0].id,
        userId: demoUser.id,
        date,
        status: "COMPLETED" as LogStatus,
      });
    }

    // Exercise (moderate compliance ~60%)
    if (Math.random() > 0.4) {
      logs.push({
        habitId: habits[1].id,
        userId: demoUser.id,
        date,
        status: "COMPLETED" as LogStatus,
      });
    }

    // Reading (moderate compliance ~65%)
    if (Math.random() > 0.35) {
      logs.push({
        habitId: habits[2].id,
        userId: demoUser.id,
        date,
        status: "COMPLETED" as LogStatus,
      });
    }

    // Social media (good compliance ~75%)
    if (Math.random() > 0.25) {
      logs.push({
        habitId: habits[3].id,
        userId: demoUser.id,
        date,
        status: "COMPLETED" as LogStatus,
      });
    } else if (Math.random() > 0.5) {
      logs.push({
        habitId: habits[3].id,
        userId: demoUser.id,
        date,
        status: "FAILED" as LogStatus,
      });
    }
  }

  await prisma.habitLog.createMany({ data: logs });
  console.log(`Created ${logs.length} habit logs`);

  // Create reflections for the last 7 days
  const moods: MoodLevel[] = [
    "VERY_GOOD",
    "GOOD",
    "NEUTRAL",
    "GOOD",
    "VERY_GOOD",
    "GOOD",
    "NEUTRAL",
  ];
  const reflections = [
    "Great start to the week! Feeling energized and motivated.",
    "Made good progress on my habits today. The meditation really helps.",
    "Struggled a bit with staying focused, but still got things done.",
    "Feeling accomplished. Exercise gave me a big energy boost.",
    "Excellent day! Everything just clicked.",
    "Good momentum continuing. Really seeing the benefits of these habits.",
    "Reflective mood today. Thinking about what else I want to improve.",
  ];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    await prisma.reflection.create({
      data: {
        userId: demoUser.id,
        date,
        mood: moods[i],
        content: reflections[i],
      },
    });
  }

  console.log("Created 7 reflections");
  console.log("✅ Seeding finished successfully!");
  console.log("\nDemo Account Credentials:");
  console.log("Email: demo@reforge.app");
  console.log("Password: demo123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
