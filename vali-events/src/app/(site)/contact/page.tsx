export default function ContactPage() {
  return (
    <main className="container-default py-10">
      <h1 className="text-3xl font-[var(--font-heading)] font-bold">Contact</h1>
      <div className="mt-6 grid md:grid-cols-2 gap-8">
        <form className="space-y-3">
          <input className="w-full rounded-md border border-gray-300 px-3 py-2" placeholder="Nume" />
          <input type="email" className="w-full rounded-md border border-gray-300 px-3 py-2" placeholder="Email" />
          <textarea className="w-full rounded-md border border-gray-300 px-3 py-2" rows={5} placeholder="Mesaj" />
          <button className="btn-primary" type="submit">Trimite</button>
        </form>
        <div>
          <div className="rounded-xl border border-gray-200 p-4 bg-white">
            <div className="font-semibold">Date de contact</div>
            <div className="text-gray-700 mt-2">Email: contact@vali-events.ro</div>
            <div className="text-gray-700">Telefon: +40 7xx xxx xxx</div>
            <div className="text-gray-700 mt-2">Locație: București</div>
          </div>
          <div className="mt-6">
            <div className="w-full h-64 bg-brand-lightGray rounded-xl flex items-center justify-center text-gray-600">Hartă (embed)</div>
          </div>
        </div>
      </div>
    </main>
  );
}

