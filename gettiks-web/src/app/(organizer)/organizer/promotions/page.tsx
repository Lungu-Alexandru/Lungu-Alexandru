export default function PromotionsPage() {
  return (
    <main className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Promovare eveniment</h1>
      <section className="space-y-3">
        <div className="p-4 bg-white rounded-xl shadow">
          <h2 className="font-medium">Articole / Comunicate</h2>
          <p className="text-sm text-neutral-600">Până la 10 articole: 5€ + TVA; peste 10 articole: 3€ + TVA</p>
          <button className="btn-primary mt-2">Cumpără</button>
        </div>
        <div className="p-4 bg-white rounded-xl shadow">
          <h2 className="font-medium">Link către video</h2>
          <p className="text-sm text-neutral-600">Pachet nelimitat: 20€ + TVA; Per link: 5€ + TVA</p>
          <button className="btn-primary mt-2">Cumpără</button>
        </div>
        <div className="p-4 bg-white rounded-xl shadow">
          <h2 className="font-medium">Banner grafic / video (carousel)</h2>
          <p className="text-sm text-neutral-600">3 video x 10s: 30€ + TVA; 3 bannere grafice: 20€ + TVA</p>
          <button className="btn-primary mt-2">Cumpără</button>
        </div>
        <div className="p-4 bg-white rounded-xl shadow">
          <h2 className="font-medium">Link-uri social media</h2>
          <p className="text-sm text-neutral-600">Pachet nelimitat: 15€ + TVA; Per link: 3€ + TVA</p>
          <button className="btn-primary mt-2">Cumpără</button>
        </div>
      </section>
    </main>
  );
}

