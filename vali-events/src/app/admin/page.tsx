export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-[var(--font-heading)] font-bold">Panou de control</h1>
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-gray-200 p-4 bg-white">
          <div className="text-sm text-gray-600">Vizualizări</div>
          <div className="text-2xl font-bold">12,345</div>
        </div>
        <div className="rounded-xl border border-gray-200 p-4 bg-white">
          <div className="text-sm text-gray-600">Înscrieri</div>
          <div className="text-2xl font-bold">1,024</div>
        </div>
        <div className="rounded-xl border border-gray-200 p-4 bg-white">
          <div className="text-sm text-gray-600">Plăți</div>
          <div className="text-2xl font-bold">856</div>
        </div>
      </div>
    </div>
  );
}

