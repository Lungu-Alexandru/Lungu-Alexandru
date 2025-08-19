export default function OrganizerLanding() {
  return (
    <main className="max-w-5xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard organizator</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <a href="/organizer/events/new" className="p-4 bg-white rounded-xl shadow">Creează eveniment</a>
        <a href="/organizer/promotions" className="p-4 bg-white rounded-xl shadow">Promovare eveniment</a>
        <a href="/organizer/seating" className="p-4 bg-white rounded-xl shadow">Plan sală (seating)</a>
        <a href="/organizer/analytics" className="p-4 bg-white rounded-xl shadow">Statistici</a>
      </div>
    </main>
  );
}

