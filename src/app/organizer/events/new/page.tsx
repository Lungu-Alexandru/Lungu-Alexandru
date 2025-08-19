"use client"
import { useForm } from 'react-hook-form'

type TicketTier = { name: string; price: number; stock: number }
type FormValues = {
  title: string
  description: string
  date: string
  city: string
  address: string
  category: string
  tiers: TicketTier[]
}

export default function NewEventPage() {
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      tiers: [
        { name: 'Standard', price: 79, stock: 100 },
        { name: 'VIP', price: 199, stock: 50 }
      ]
    }
  })

  return (
    <main className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Creează eveniment</h1>
      <form className="bg-white rounded-lg p-4 shadow space-y-3" onSubmit={handleSubmit(async () => {})}>
        <input className="w-full border rounded px-3 py-2" placeholder="Titlu" {...register('title', { required: true })} />
        <textarea className="w-full border rounded px-3 py-2" placeholder="Descriere" rows={5} {...register('description')} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="w-full border rounded px-3 py-2" placeholder="Data și ora" type="datetime-local" {...register('date', { required: true })} />
          <input className="w-full border rounded px-3 py-2" placeholder="Oraș" {...register('city')} />
        </div>
        <input className="w-full border rounded px-3 py-2" placeholder="Adresă" {...register('address')} />
        <select className="w-full border rounded px-3 py-2" {...register('category')}>
          <option>Muzică</option>
          <option>Teatru & Arte</option>
          <option>Sport</option>
          <option>Conferințe & Educație</option>
          <option>Târguri & Expoziții</option>
        </select>
        <button className="btn-primary w-full">Salvează</button>
      </form>
    </main>
  )
}

