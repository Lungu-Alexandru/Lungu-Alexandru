"use client";
import { useEffect, useState } from 'react';

type Event = {
  id: string;
  title: string;
  startDate: string;
  location: string;
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch('/api/events').then(r => r.json()).then(d => setEvents(d.events)).finally(() => setLoading(false));
  }, []);

  async function addEvent() {
    const res = await fetch('/api/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, description: '', category: 'general', startDate: new Date(), location: 'București', images: [] }) });
    const d = await res.json();
    setEvents([d.event, ...events]);
    setTitle('');
  }

  return (
    <div>
      <h1 className="text-2xl font-[var(--font-heading)] font-bold">Evenimente</h1>
      <div className="mt-4 flex gap-2">
        <input className="rounded-md border border-gray-300 px-3 py-2" placeholder="Titlu nou" value={title} onChange={(e) => setTitle(e.target.value)} />
        <button className="btn-primary" onClick={addEvent}>Adaugă</button>
      </div>
      <div className="mt-6 border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-brand-lightGray">
            <tr>
              <th className="text-left p-2">Titlu</th>
              <th className="text-left p-2">Dată</th>
              <th className="text-left p-2">Locație</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="p-2" colSpan={3}>Se încarcă...</td></tr>
            ) : events.map(ev => (
              <tr key={ev.id} className="border-t">
                <td className="p-2">{ev.title}</td>
                <td className="p-2">{new Date(ev.startDate).toLocaleString('ro-RO')}</td>
                <td className="p-2">{ev.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

