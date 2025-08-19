import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { to, subject = 'Biletul tău', text = 'Mulțumim pentru achiziție!' } = body;
  if (!to) return NextResponse.json({ error: 'to required' }, { status: 400 });

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT || 587),
    secure: false,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD
    }
  });

  await transporter.sendMail({ from: process.env.EMAIL_FROM, to, subject, text });
  return NextResponse.json({ ok: true });
}

