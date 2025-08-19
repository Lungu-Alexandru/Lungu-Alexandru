"use client";
import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default function PayPage({ params }: { params: { eventId: string } }) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Placeholder: would call our functions endpoint to create a Checkout Session
  }, []);

  async function handlePay() {
    setIsLoading(true);
    const response = await fetch('/api/checkout/session', { method: 'POST' });
    const data = await response.json();
    const stripe = await stripePromise;
    if (!stripe) return;
    await stripe.redirectToCheckout({ sessionId: data.id });
  }

  return (
    <main className="max-w-md mx-auto p-4">
      <button className="btn-primary w-full" disabled={isLoading} onClick={handlePay}>
        {isLoading ? 'Se încarcă...' : 'Plătește cu cardul'}
      </button>
    </main>
  );
}

