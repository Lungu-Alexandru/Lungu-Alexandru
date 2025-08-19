import Link from 'next/link';

export default function ExplorePage() {
  return (
    <main className="max-w-7xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Explorează evenimente</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          'Muzică', 'Teatru', 'Film', 'Sport', 'Conferințe', 'Târguri', 'Nightlife', 'Familie', 'Outdoor', 'Culturale'
        ].map(cat => (
          <Link key={cat} href={`/explore/${encodeURIComponent(cat.toLowerCase())}`} className="p-4 rounded-xl bg-white shadow hover:shadow-md transition">
            {cat}
          </Link>
        ))}
      </div>
    </main>
  );
}

