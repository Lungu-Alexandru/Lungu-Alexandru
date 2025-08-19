import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const data = await req.json();
  const enrollment = await prisma.enrollment.create({ data });
  return NextResponse.json({ enrollment }, { status: 201 });
}

