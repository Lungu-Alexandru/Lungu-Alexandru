import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="max-w-7xl mx-auto p-4 space-y-10">
      <header className="flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-brand-blue rounded" />
          <span className="text-xl font-semibold">gettiks</span>
        </div>
        <nav className="flex items-center gap-3">
          <Link href="/auth" className="btn-primary">Autentificare</Link>
          <Link href="/events" className="btn-accent">Caută evenimente</Link>
        </nav>
      </header>

      <section className="bg-white rounded-xl p-6 shadow-sm">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Bilete la evenimente, rapid și sigur
        </h1>
        <p className="text-gray-600 max-w-2xl">
          Descoperă concerte, festivaluri, teatru și multe altele. Cumpără bilete în siguranță cu Stripe.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/events" className="btn-primary">Exploră evenimente</Link>
          <Link href="/organizer" className="btn-accent">Creează un eveniment</Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['Concerte', 'Teatru & Arte', 'Sport'].map((cat) => (
          <div key={cat} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold mb-2">{cat}</h3>
            <p className="text-gray-600 text-sm">Evenimente populare din categoria {cat}.</p>
          </div>
        ))}
      </section>
    </main>
  )
}

