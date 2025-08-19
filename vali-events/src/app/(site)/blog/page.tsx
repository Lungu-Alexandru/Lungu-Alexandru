import Link from 'next/link';

export default function BlogPage() {
  return (
    <main className="container-default py-10">
      <h1 className="text-3xl font-[var(--font-heading)] font-bold">Blog / Noutăți</h1>
      <div className="mt-6 space-y-6">
        {[1,2,3].map((i) => (
          <article key={i} className="rounded-xl border border-gray-200 p-4 bg-white">
            <h3 className="font-semibold text-xl">Articol #{i}</h3>
            <p className="text-gray-600 mt-2">Sfaturi pentru participanți și noutăți despre evenimente.</p>
            <Link href={`/blog/${i}`} className="text-brand-lightBlue font-semibold mt-2 inline-block">Citește</Link>
          </article>
        ))}
      </div>
    </main>
  );
}

