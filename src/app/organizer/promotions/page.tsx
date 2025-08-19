"use client"
import { useState } from 'react'

type PromotionOption = {
  key: string
  label: string
  pricing: string
  price: number
}

const options: PromotionOption[] = [
  { key: 'press-upto10', label: 'Articole/Comunicate (până la 10)', pricing: '5 € + TVA / articol', price: 5 },
  { key: 'press-over10', label: 'Articole/Comunicate (peste 10)', pricing: '3 € + TVA / articol', price: 3 },
  { key: 'video-package', label: 'Link video – pachet nelimitat', pricing: '20 € + TVA / pachet', price: 20 },
  { key: 'video-per-link', label: 'Link video – per link', pricing: '5 € + TVA / link', price: 5 },
  { key: 'banner-video', label: 'Banner video (3x10s, carousel)', pricing: '30 € + TVA / pachet', price: 30 },
  { key: 'banner-graphic', label: 'Banner grafic (3x, carousel)', pricing: '20 € + TVA / pachet', price: 20 },
  { key: 'social-links-package', label: 'Link-uri social media – pachet nelimitat', pricing: '15 € + TVA / pachet', price: 15 },
  { key: 'social-per-link', label: 'Link social – per link', pricing: '3 € + TVA / link', price: 3 }
]

export default function PromotionsPage() {
  const [selected, setSelected] = useState<Record<string, number>>({})
  const VAT = 0.21
  const subtotal = Object.entries(selected).reduce((sum, [key, qty]) => {
    const opt = options.find(o => o.key === key)
    return sum + (opt ? opt.price * qty : 0)
  }, 0)
  const vatAmount = subtotal * VAT
  const total = subtotal + vatAmount

  return (
    <main className="max-w-5xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Promovare evenimente</h1>
      <div className="bg-white rounded-lg p-4 shadow divide-y">
        {options.map((opt) => (
          <div key={opt.key} className="py-4 grid grid-cols-1 md:grid-cols-3 items-center gap-3">
            <div>
              <div className="font-medium">{opt.label}</div>
              <div className="text-sm text-gray-600">{opt.pricing}</div>
            </div>
            <div className="md:col-span-2 flex items-center gap-3 justify-end">
              <input
                type="number"
                min={0}
                className="w-24 border rounded px-3 py-2"
                value={selected[opt.key] || 0}
                onChange={(e) => setSelected((s) => ({ ...s, [opt.key]: Math.max(0, Number(e.target.value || 0)) }))}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg p-4 shadow space-y-2 md:w-1/2 ml-auto">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span className="font-medium">€ {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>TVA (21%)</span>
          <span className="font-medium">€ {vatAmount.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-lg">
          <span>Total</span>
          <span className="font-semibold">€ {total.toFixed(2)}</span>
        </div>
        <button className="btn-primary w-full">Plătește promovarea</button>
      </div>
    </main>
  )
}

