const express = require('express');
const session = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');
const path = require('path');
require('dotenv').config();

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3000;
const indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin');
const apiRouter = require('./routes/api');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(
  session({
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
    secret: process.env.SESSION_SECRET || 'change_this_secret',
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

app.locals.theme = {
  colors: {
    navy: '#0B3D91',
    blue: '#4A90E2',
    orange: '#F5A623',
    grayLight: '#F2F2F2',
    grayDark: '#4A4A4A',
  },
  fonts: {
    heading: 'Montserrat, Poppins, sans-serif',
    body: 'Open Sans, Lato, sans-serif',
  },
};

app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/api', apiRouter);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
