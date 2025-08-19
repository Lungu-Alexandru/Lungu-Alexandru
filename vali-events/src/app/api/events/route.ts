import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const events = await prisma.event.findMany({ orderBy: { startDate: 'asc' }, take: 50 });
  return NextResponse.json({ events });
}

export async function POST(req: Request) {
  const data = await req.json();
  const event = await prisma.event.create({ data });
  return NextResponse.json({ event }, { status: 201 });
}

