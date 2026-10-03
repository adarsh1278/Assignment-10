import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean existing data
  await prisma.dayStatus.deleteMany();
  await prisma.user.deleteMany();

  // Create demo user
  const passwordHash = await bcrypt.hash('Demo1234!', 12);
  const demoUser = await prisma.user.create({
    data: {
      email: 'demo@example.com',
      passwordHash,
    },
  });

  console.log(`Created demo user: ${demoUser.email}`);

  // Create sample day statuses for 2026
  const sampleStatuses = [
    { date: new Date('2026-01-05'), status: 'Office' },
    { date: new Date('2026-01-12'), status: 'Work from home' },
    { date: new Date('2026-01-19'), status: 'Meeting' },
    { date: new Date('2026-02-02'), status: 'Leave' },
    { date: new Date('2026-02-14'), status: 'Holiday' },
    { date: new Date('2026-03-08'), status: 'Office' },
    { date: new Date('2026-04-15'), status: 'Work from home' },
    { date: new Date('2026-05-01'), status: 'Holiday' },
    { date: new Date('2026-06-21'), status: 'Office' },
    { date: new Date('2026-10-03'), status: 'Project work' },
  ];

  for (const item of sampleStatuses) {
    await prisma.dayStatus.create({
      data: {
        ...item,
        updatedById: demoUser.id,
      },
    });
  }

  console.log(`Created ${sampleStatuses.length} sample day statuses`);
  console.log('\nDemo credentials:');
  console.log('  Email:    demo@example.com');
  console.log('  Password: Demo1234!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
