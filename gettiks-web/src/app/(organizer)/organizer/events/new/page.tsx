export default function NewEventPage() {
  return (
    <main className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Creează eveniment</h1>
      <form className="space-y-3">
        <input className="w-full border rounded px-3 py-2" placeholder="Titlu" />
        <textarea className="w-full border rounded px-3 py-2" placeholder="Descriere" rows={4} />
        <div className="grid grid-cols-2 gap-3">
          <input className="border rounded px-3 py-2" placeholder="Data" type="date" />
          <input className="border rounded px-3 py-2" placeholder="Ora" type="time" />
        </div>
        <input className="w-full border rounded px-3 py-2" placeholder="Locație" />
        <div className="grid grid-cols-3 gap-3">
          <input className="border rounded px-3 py-2" placeholder="Standard (€)" />
          <input className="border rounded px-3 py-2" placeholder="VIP (€)" />
          <input className="border rounded px-3 py-2" placeholder="Early Bird (€)" />
        </div>
        <button className="btn-primary">Salvează</button>
      </form>
    </main>
  );
}

