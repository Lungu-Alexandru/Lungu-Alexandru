import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <main>
      <section className="bg-brand-darkBlue text-white">
        <div className="container-default py-16 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="font-[var(--font-heading)] text-4xl md:text-5xl font-extrabold leading-tight">Evenimente memorabile organizate de Vali</h1>
            <p className="mt-4 text-white/90 max-w-prose">Descoperă următoarele evenimente, înscrie-te rapid și alătură-te comunității care trăiește energia live.</p>
            <div className="mt-6 flex gap-3">
              <Link href="/evenimente" className="btn-primary">Vezi toate evenimentele</Link>
              <Link href="#newsletter" className="btn-outline">Abonează-te la noutăți</Link>
            </div>
          </div>
          <div className="relative h-72 md:h-96">
            <Image src="https://images.unsplash.com/photo-1515165562835-c3b8c1642450?q=80&w=1600&auto=format&fit=crop" alt="Eveniment Vali" fill className="object-cover rounded-xl" />
          </div>
        </div>
      </section>

      <section className="container-default py-12">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold font-[var(--font-heading)]">Următoarele evenimente</h2>
          <Link href="/evenimente" className="text-brand-lightBlue font-semibold">Vezi toate</Link>
        </div>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          {[1,2,3].map((i) => (
            <article key={i} className="rounded-xl border border-gray-200 overflow-hidden bg-white">
              <div className="relative h-40">
                <Image src={`https://picsum.photos/seed/ev${i}/800/400`} alt="eveniment" fill className="object-cover" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold">Eveniment popular #{i}</h3>
                <p className="text-sm text-gray-600">București • 25 Oct 2025 • 19:00</p>
                <div className="mt-4 flex gap-2">
                  <Link href={`/evenimente/${i}`} className="btn-secondary">Vezi detalii</Link>
                  <Link href={`/evenimente/${i}#inscriere`} className="btn-outline">Participă</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-brand-lightGray">
        <div className="container-default py-12">
          <h2 className="text-2xl font-semibold font-[var(--font-heading)]">Evenimente reușite</h2>
          <div className="mt-6 grid md:grid-cols-3 gap-6">
            {[1,2,3].map((i) => (
              <div key={i} className="rounded-xl overflow-hidden bg-white border border-gray-200">
                <div className="relative h-40">
                  <Image src={`https://picsum.photos/seed/past${i}/800/400`} alt="eveniment trecut" fill className="object-cover" />
                </div>
                <div className="p-4 text-sm text-gray-700">Atmosferă grozavă, oameni faini și amintiri de neuitat.</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-default py-12" id="newsletter">
        <div className="rounded-2xl bg-white border border-gray-200 p-6 md:p-8">
          <h2 className="text-2xl font-semibold font-[var(--font-heading)]">Abonează-te la noutăți</h2>
          <p className="mt-2 text-gray-600">Primește pe email următoarele evenimente și oferte.</p>
          <form className="mt-4 flex flex-col md:flex-row gap-3">
            <input type="email" className="flex-1 rounded-md border border-gray-300 px-3 py-2" placeholder="Emailul tău" />
            <button type="submit" className="btn-primary">Abonează-mă</button>
          </form>
        </div>
      </section>
    </main>
  );
}

