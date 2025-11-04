import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('Start seeding...');

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123', 10);

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@reforge.app' },
    update: {},
    create: {
      email: 'demo@reforge.app',
      name: 'Demo User',
      password: hashedPassword,
    },
  });

  console.log(`Created demo user: ${demoUser.email}`);

  // Create sample habits
  await prisma.habit.createMany({
    data: [
      {
        userId: demoUser.id,
        name: 'Morning Meditation',
        description: '10 minutes of mindfulness',
        type: 'BUILD',
        frequency: 'DAILY',
        color: '#6366f1',
        icon: 'meditation',
      },
      {
        userId: demoUser.id,
        name: 'Exercise',
        description: 'At least 30 minutes',
        type: 'BUILD',
        frequency: 'WEEKLY',
        schedule: ['MON', 'WED', 'FRI'],
        color: '#10b981',
        icon: 'fitness',
      },
      {
        userId: demoUser.id,
        name: 'No Social Media Scrolling',
        description: 'Avoid mindless scrolling',
        type: 'BREAK',
        frequency: 'DAILY',
        color: '#ef4444',
        icon: 'phone-off',
      },
    ],
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

