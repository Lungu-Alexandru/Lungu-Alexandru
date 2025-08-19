const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function requireAdmin(req, res, next) {
  if (req.session && req.session.user && req.session.user.role === 'ADMIN') {
    return next();
  }
  return res.redirect('/admin/login');
}

router.get('/login', (req, res) => {
  res.render('admin/login', { title: 'Admin Login' });
});

router.post('/login', async (req, res) => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.role !== 'ADMIN') {
    return res.render('admin/login', { title: 'Admin Login', error: 'Acces respins' });
  }
  req.session.user = { id: user.id, role: user.role, name: user.name, email: user.email };
  res.redirect('/admin');
});

router.get('/', requireAdmin, async (req, res) => {
  const [events, articles, stats] = await Promise.all([
    prisma.event.findMany({ orderBy: { startDate: 'desc' }, take: 10 }),
    prisma.article.findMany({ orderBy: { publishedAt: 'desc' }, take: 5 }),
    (async () => {
      const [views, registrations, payments] = await Promise.all([
        prisma.interaction.count({ where: { type: 'view' } }),
        prisma.registration.count(),
        prisma.payment.count({ where: { status: 'succeeded' } }),
      ]);
      return { views, registrations, payments };
    })(),
  ]);
  res.render('admin/dashboard', { title: 'Panou Admin', events, articles, stats });
});

router.get('/events/new', requireAdmin, (req, res) => {
  res.render('admin/event-form', { title: 'Eveniment nou', event: null });
});

router.post('/events', requireAdmin, async (req, res) => {
  const { title, description, category, startDate, endDate, time, location, purchaseLink } = req.body;
  await prisma.event.create({
    data: { title, description, category, startDate: new Date(startDate), endDate: endDate ? new Date(endDate) : null, time, location, purchaseLink },
  });
  res.redirect('/admin');
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

module.exports = router;

