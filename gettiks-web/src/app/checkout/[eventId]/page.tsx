"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function CheckoutPage({ params }: { params: { eventId: string } }) {
  const { eventId } = params;
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState('standard');

  return (
    <main className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Finalizare comandă</h1>
      <div className="p-4 bg-white rounded-xl shadow space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1">
            <span>Categoria</span>
            <select value={category} onChange={e => setCategory(e.target.value)} className="border rounded px-3 py-2">
              <option value="standard">Standard</option>
              <option value="vip">VIP</option>
              <option value="early">Early Bird</option>
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span>Număr bilete</span>
            <input type="number" min={1} value={quantity} onChange={e => setQuantity(parseInt(e.target.value || '1'))} className="border rounded px-3 py-2" />
          </label>
        </div>
        <Link href={`/checkout/${eventId}/pay`} className="btn-primary inline-flex">Continuă la plată</Link>
      </div>
    </main>
  );
}

