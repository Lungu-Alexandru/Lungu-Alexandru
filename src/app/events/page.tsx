import Link from 'next/link'

export default function EventsPage() {
  return (
    <main className="max-w-7xl mx-auto p-4 space-y-6">
      <div className="bg-white rounded-lg p-4 shadow">
        <h1 className="text-2xl font-semibold">Evenimente</h1>
        <p className="text-gray-600">Caută și filtrează evenimentele.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1,2,3,4,5,6].map((i) => (
          <Link key={i} href={`/events/${i}`} className="bg-white rounded-lg border p-4 hover:shadow transition">
            <div className="h-40 w-full bg-gray-100 rounded mb-3" />
            <div className="font-medium">Titlu eveniment {i}</div>
            <div className="text-sm text-gray-600">12 Oct 2025 • București</div>
          </Link>
        ))}
      </div>
    </main>
  )
}

