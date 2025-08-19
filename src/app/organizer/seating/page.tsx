"use client"
import { useState } from 'react'

type Seat = { id: string; row: string; number: number; price: number; available: boolean }

export default function SeatingBuilderPage() {
  const [seats, setSeats] = useState<Seat[]>(() =>
    Array.from({ length: 60 }).map((_, i) => ({ id: `A-${i+1}`, row: 'A', number: i + 1, price: i < 10 ? 200 : 120, available: true }))
  )

  return (
    <main className="max-w-5xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Hartă locuri</h1>
      <div className="bg-white rounded-lg p-4 shadow">
        <div className="grid grid-cols-10 gap-2">
          {seats.map((s) => (
            <button
              key={s.id}
              className={`rounded p-2 text-sm ${s.available ? 'bg-brand-blue text-white' : 'bg-gray-300 text-gray-600'}`}
              onClick={() => setSeats((prev) => prev.map(p => p.id === s.id ? { ...p, available: !p.available } : p))}
            >
              {s.row}{s.number}
              <div className="text-[10px]">{s.price} RON</div>
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}

