export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-[240px_1fr]">
      <aside className="border-r border-gray-200 p-4">
        <div className="font-bold text-brand-darkBlue">Admin</div>
        <nav className="mt-4 grid gap-2 text-sm">
          <a href="/admin" className="hover:text-brand-lightBlue">Dashboard</a>
          <a href="/admin/evenimente" className="hover:text-brand-lightBlue">Evenimente</a>
          <a href="/admin/articole" className="hover:text-brand-lightBlue">Articole</a>
          <a href="/admin/plati" className="hover:text-brand-lightBlue">Plăți</a>
          <a href="/admin/statistici" className="hover:text-brand-lightBlue">Statistici</a>
        </nav>
      </aside>
      <main className="p-6">
        {children}
      </main>
    </div>
  );
}

