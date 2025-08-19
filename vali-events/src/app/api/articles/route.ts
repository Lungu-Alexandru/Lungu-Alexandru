import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const articles = await prisma.article.findMany({ orderBy: { publishedAt: 'desc' }, take: 50 });
  return NextResponse.json({ articles });
}

export async function POST(req: Request) {
  const data = await req.json();
  const article = await prisma.article.create({ data });
  return NextResponse.json({ article }, { status: 201 });
}

