import Link from 'next/link'

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  return (
    <main className="max-w-5xl mx-auto p-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-lg p-4 shadow">
          <div className="h-64 w-full bg-gray-100 rounded mb-4" />
          <h1 className="text-3xl font-bold">Titlu eveniment #{id}</h1>
          <p className="text-gray-600 mt-2">Descriere eveniment. Dată, oră, locație.</p>
        </div>
        <aside className="bg-white rounded-lg p-4 shadow h-max">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Standard</span>
              <span className="font-semibold">79 RON</span>
            </div>
            <div className="flex items-center justify-between">
              <span>VIP</span>
              <span className="font-semibold">199 RON</span>
            </div>
            <Link href={`/checkout/${id}`} className="btn-primary w-full text-center block">Cumpără bilete</Link>
          </div>
        </aside>
      </div>
      <section className="bg-white p-4 rounded-lg shadow">
        <h2 className="font-semibold mb-2">Evenimente similare</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1,2,3].map((i) => (
            <div key={i} className="bg-gray-100 h-32 rounded" />
          ))}
        </div>
      </section>
    </main>
  )
}

