import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { amount, currency = 'RON', description = 'Bilet eveniment' } = body;
  if (!amount) return NextResponse.json({ error: 'amount required' }, { status: 400 });

  // Placeholder stub for Revolut Payments API integration
  // In production, call Revolut Orders API and return payment link
  const fakeCheckoutUrl = `https://sandbox-merchant.revolut.com/pay?amount=${amount}&currency=${currency}&desc=${encodeURIComponent(description)}`;

  return NextResponse.json({ checkoutUrl: fakeCheckoutUrl });
}

