import Link from 'next/link';

export default function EventDetailPage({ params }: { params: { eventId: string } }) {
  const { eventId } = params;
  return (
    <main className="max-w-5xl mx-auto p-4 space-y-6">
      <div className="aspect-video bg-white rounded-xl shadow" />
      <h1 className="text-3xl font-bold">Eveniment #{eventId}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <p>Descriere eveniment...</p>
          <div className="h-64 bg-white rounded-xl shadow" />
        </div>
        <aside className="space-y-4">
          <div className="p-4 bg-white rounded-xl shadow">
            <div className="flex items-center justify-between">
              <span>De la</span>
              <strong>€29</strong>
            </div>
            <Link className="btn-primary w-full mt-4 inline-flex" href={`/checkout/${eventId}`}>Cumpără bilete</Link>
          </div>
        </aside>
      </div>
    </main>
  );
}

