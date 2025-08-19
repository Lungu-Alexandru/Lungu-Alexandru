import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const data = await req.json();
  const payment = await prisma.payment.create({ data });
  return NextResponse.json({ payment }, { status: 201 });
}

