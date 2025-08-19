import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const event = await prisma.event.findUnique({ where: { id: params.id } });
  if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ event });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json();
  const event = await prisma.event.update({ where: { id: params.id }, data });
  return NextResponse.json({ event });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await prisma.event.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}

