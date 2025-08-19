import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="max-w-7xl mx-auto p-4">
      <header className="flex items-center justify-between py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-blue" />
          <span className="text-xl font-semibold">gettiks</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link className="btn-primary" href="/explore">Explorează</Link>
          <Link className="btn-secondary" href="/auth">Autentificare</Link>
        </nav>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-6 space-y-5">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">Descoperă evenimente. Cumpără bilete. Trăiește experiențe.</h1>
          <p className="text-lg text-neutral-700">Concerte, festivaluri, teatru, sport și multe altele. Rapid, sigur și ușor.</p>
          <div className="flex gap-3">
            <Link className="btn-primary" href="/explore">Caută evenimente</Link>
            <Link className="btn-secondary" href="/organizer">Sunt organizator</Link>
          </div>
        </div>
        <div className="md:col-span-6 h-72 bg-white rounded-xl shadow-sm" />
      </section>
    </main>
  );
}

