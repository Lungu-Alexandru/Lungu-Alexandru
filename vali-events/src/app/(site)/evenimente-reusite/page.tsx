import Image from 'next/image';

export default function PastEventsPage() {
  return (
    <main className="container-default py-10">
      <h1 className="text-3xl font-[var(--font-heading)] font-bold">Evenimente reușite</h1>
      <div className="mt-6 grid md:grid-cols-3 gap-6">
        {[1,2,3,4,5,6].map((i) => (
          <article key={i} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            <div className="relative h-40">
              <Image src={`https://picsum.photos/seed/past-${i}/800/400`} alt="eveniment" fill className="object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold">Eveniment trecut #{i}</h3>
              <p className="text-sm text-gray-600">Galerie foto și recenzii</p>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

