import Link from 'next/link';
import Filters from '@/components/Filters';

export default function EventsListPage() {
  return (
    <main className="container-default py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-[var(--font-heading)] font-bold">Evenimente viitoare</h1>
        <div className="flex gap-2">
          <button className="btn-outline">Listă</button>
          <button className="btn-outline">Grid</button>
        </div>
      </div>
      <div className="mt-4">
        <Filters />
      </div>

      <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1,2,3,4,5,6].map((i) => (
          <div key={i} className="rounded-xl border border-gray-200 p-4 bg-white">
            <h3 className="font-semibold">Eveniment #{i}</h3>
            <p className="text-sm text-gray-600">Cluj-Napoca • 12 Nov 2025 • 18:30</p>
            <div className="mt-4 flex gap-2">
              <Link href={`/evenimente/${i}`} className="btn-secondary">Vezi detalii</Link>
              <Link href={`/evenimente/${i}#inscriere`} className="btn-outline">Participă</Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

