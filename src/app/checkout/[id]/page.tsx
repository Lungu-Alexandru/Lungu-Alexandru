"use client"
import { useState } from 'react'

export default function CheckoutPage({ params }: { params: { id: string } }) {
  const { id } = params
  const [quantity, setQuantity] = useState(1)
  const [category, setCategory] = useState<'standard' | 'vip'>('standard')

  const price = category === 'standard' ? 79 : 199
  const total = price * quantity

  return (
    <main className="max-w-3xl mx-auto p-4 space-y-6">
      <div className="bg-white rounded-lg p-4 shadow">
        <h1 className="text-2xl font-semibold">Checkout pentru eveniment #{id}</h1>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="block">Categorie</label>
            <select className="w-full border rounded px-3 py-2" value={category} onChange={(e) => setCategory(e.target.value as any)}>
              <option value="standard">Standard</option>
              <option value="vip">VIP</option>
            </select>
            <label className="block">Număr bilete</label>
            <input className="w-full border rounded px-3 py-2" type="number" min={1} max={10} value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value || '1'))} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Preț unitar</span>
              <span className="font-semibold">{price} RON</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Total</span>
              <span className="font-semibold">{total} RON</span>
            </div>
            <button className="btn-primary w-full mt-3">Plătește</button>
          </div>
        </div>
      </div>
    </main>
  )
}

