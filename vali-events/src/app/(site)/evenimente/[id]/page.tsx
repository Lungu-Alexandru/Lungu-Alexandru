import Image from 'next/image';
import Link from 'next/link';

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  return (
    <main className="container-default py-10">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="relative h-72 rounded-xl overflow-hidden">
            <Image src={`https://picsum.photos/seed/event${id}/1200/600`} alt="cover" fill className="object-cover" />
          </div>
          <h1 className="mt-6 text-3xl font-[var(--font-heading)] font-bold">Eveniment #{id}</h1>
          <p className="text-gray-600">București • 25 Oct 2025 • 19:00</p>
          <div className="prose max-w-none mt-4">
            <p>Descriere detaliată a evenimentului. Atmosferă, invitați, program și ce te așteaptă la fața locului.</p>
          </div>

          <section className="mt-8">
            <h2 className="text-xl font-semibold">Galerie</h2>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
              {[1,2,3,4,5,6].map((g) => (
                <div key={g} className="relative h-28 rounded overflow-hidden">
                  <Image src={`https://picsum.photos/seed/g${id}-${g}/600/400`} alt="galerie" fill className="object-cover" />
                </div>
              ))}
            </div>
          </section>
        </div>
        <aside className="space-y-4" id="inscriere">
          <div className="rounded-xl border border-gray-200 p-4 bg-white">
            <div className="text-sm text-gray-600">Dată</div>
            <div className="font-semibold">25 Oct 2025, 19:00</div>
            <div className="text-sm text-gray-600 mt-2">Locație</div>
            <div className="font-semibold">București</div>
            <div className="mt-4 flex gap-2">
              <Link href={`#/buy/${id}`} className="btn-primary w-full text-center">Cumpără bilet</Link>
              <button className="btn-outline w-full">Partajează</button>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 p-4 bg-white">
            <h3 className="font-semibold">Înscriere rapidă</h3>
            <form className="mt-3 space-y-3">
              <input className="w-full rounded-md border border-gray-300 px-3 py-2" placeholder="Nume" />
              <input type="email" className="w-full rounded-md border border-gray-300 px-3 py-2" placeholder="Email" />
              <button className="btn-secondary w-full" type="submit">Înscrie-mă</button>
            </form>
          </div>
        </aside>
      </div>
    </main>
  );
}

