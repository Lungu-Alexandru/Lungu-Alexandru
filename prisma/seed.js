/* eslint-disable no-console */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const now = new Date();

  const user = await prisma.user.upsert({
    where: { email: 'admin@vali-events.local' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@vali-events.local',
      passwordHash: '$2b$10$UeOPJi8Vd5w7k9n3o7Skte3rfd0bD4Qb7Lz4O1YvA9mYfYwKx2u8a', // bcrypt hash for "admin123" (placeholder)
      role: 'ADMIN',
    },
  });

  const event1 = await prisma.event.create({
    data: {
      title: 'Concert Vali & Friends',
      description: 'Seară specială cu muzică live și networking.',
      category: 'Muzică',
      startDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7),
      location: 'București',
      status: 'UPCOMING',
      images: { create: [{ url: '/images/concert.jpg', alt: 'Concert' }] },
    },
  });

  const event2 = await prisma.event.create({
    data: {
      title: 'Workshop Leadership',
      description: 'Dezvoltă-ți abilitățile de leadership.',
      category: 'Educație',
      startDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 14),
      location: 'Cluj-Napoca',
      status: 'UPCOMING',
      images: { create: [{ url: '/images/workshop.jpg', alt: 'Workshop' }] },
    },
  });

  await prisma.article.create({
    data: {
      title: 'Cum să te pregătești pentru un eveniment',
      content: 'Sfaturi practice pentru participanți...',
      images: { create: [{ url: '/images/blog-1.jpg', alt: 'Blog' }] },
    },
  });

  console.log('Seed complete:', { admin: user.email, events: [event1.title, event2.title] });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

