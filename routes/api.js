const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// Events list with filters and pagination
router.get('/events', async (req, res) => {
  const { q, category, location, status, after, before, view = 'grid', page = 1, pageSize = 12 } = req.query;
  const take = Number(pageSize) || 12;
  const skip = (Number(page) - 1) * take;

  const where = {};
  if (q) where.OR = [{ title: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }];
  if (category) where.category = { contains: category, mode: 'insensitive' };
  if (location) where.location = { contains: location, mode: 'insensitive' };
  if (status) where.status = status;
  if (after || before) where.startDate = {};
  if (after) where.startDate.gte = new Date(after);
  if (before) where.startDate.lte = new Date(before);

  const [items, total] = await Promise.all([
    prisma.event.findMany({ where, orderBy: { startDate: 'asc' }, skip, take, include: { images: true } }),
    prisma.event.count({ where }),
  ]);

  res.json({ items, total, page: Number(page), pageSize: take, view });
});

// Top 3 popular events (by interactions)
router.get('/events/popular', async (_req, res) => {
  const items = await prisma.event.findMany({
    orderBy: { interactions: { _count: 'desc' } },
    take: 3,
    include: { images: true },
  });
  res.json({ items });
});

// Event details + increment view interaction
router.get('/events/:id', async (req, res) => {
  const id = Number(req.params.id);
  const event = await prisma.event.findUnique({
    where: { id },
    include: { images: true, galleries: true },
  });
  if (!event) return res.status(404).json({ error: 'Not found' });

  await prisma.interaction.create({ data: { eventId: id, type: 'view' } });
  res.json({ event });
});

// Register interest (fast form)
router.post('/events/:id/register', async (req, res) => {
  const id = Number(req.params.id);
  const { name, email } = req.body;
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({ data: { name, email, passwordHash: 'x', role: 'CLIENT' } });
  }
  const registration = await prisma.registration.create({ data: { eventId: id, userId: user.id } });
  res.json({ registrationId: registration.id });
});

// Revolut payment stub
router.post('/payments/:registrationId/revolut', async (req, res) => {
  const registrationId = Number(req.params.registrationId);
  const { amount } = req.body;
  const payment = await prisma.payment.create({
    data: {
      registrationId,
      method: 'Revolut',
      amount: Number(amount),
      status: 'succeeded',
    },
  });
  await prisma.registration.update({ where: { id: registrationId }, data: { status: 'PAID' } });
  res.json({ payment });
});

// Track button clicks
router.post('/events/:id/track', async (req, res) => {
  const id = Number(req.params.id);
  const { type } = req.body; // click_details | click_participate
  await prisma.interaction.create({ data: { eventId: id, type } });
  res.json({ ok: true });
});

module.exports = router;

