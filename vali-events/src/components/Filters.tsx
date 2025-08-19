"use client";
import { useState } from 'react';

export default function Filters() {
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');

  return (
    <div className="grid md:grid-cols-4 gap-3">
      <input className="rounded-md border border-gray-300 px-3 py-2" placeholder="Categorie" value={category} onChange={(e) => setCategory(e.target.value)} />
      <input className="rounded-md border border-gray-300 px-3 py-2" placeholder="Locație" value={location} onChange={(e) => setLocation(e.target.value)} />
      <input type="date" className="rounded-md border border-gray-300 px-3 py-2" value={date} onChange={(e) => setDate(e.target.value)} />
      <button className="btn-secondary">Filtrează</button>
    </div>
  );
}

