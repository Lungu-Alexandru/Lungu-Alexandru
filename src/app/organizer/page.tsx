export default function OrganizerDashboardPage() {
  return (
    <main className="max-w-7xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard Organizator</h1>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a href="/organizer/events/new" className="bg-white p-4 rounded-lg shadow border hover:shadow-md transition">
          Creează eveniment
        </a>
        <a href="/organizer/promotions" className="bg-white p-4 rounded-lg shadow border hover:shadow-md transition">
          Promovare evenimente
        </a>
        <a href="/organizer/seating" className="bg-white p-4 rounded-lg shadow border hover:shadow-md transition">
          Hartă locuri (teatru/opera)
        </a>
      </section>
    </main>
  )
}

