const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', (req, res) => {
  res.render('home', { title: 'Acasă' });
});

router.get('/evenimente', async (req, res) => {
  res.render('events/list', { title: 'Evenimente' });
});

router.get('/evenimente/:id', async (req, res) => {
  const id = Number(req.params.id);
  const event = await prisma.event.findUnique({ where: { id }, include: { images: true, galleries: true } });
  if (!event) return res.status(404).send('Eveniment inexistent');
  res.render('events/detail', { title: event.title, event });
});

router.get('/evenimente-reusite', async (req, res) => {
  const items = await prisma.event.findMany({ where: { status: 'EXPIRED' }, orderBy: { startDate: 'desc' }, include: { images: true } });
  res.render('events/past', { title: 'Evenimente reușite', items });
});

router.get('/blog', async (req, res) => {
  const posts = await prisma.article.findMany({ orderBy: { publishedAt: 'desc' }, include: { images: true } });
  res.render('blog/list', { title: 'Blog', posts });
});

router.get('/despre', (_req, res) => {
  res.render('about', { title: 'Despre' });
});

router.get('/contact', (_req, res) => {
  res.render('contact', { title: 'Contact' });
});

module.exports = router;
