export default function BlogPostPage({ params }: { params: { id: string }}) {
  return (
    <main className="container-default py-10">
      <h1 className="text-3xl font-[var(--font-heading)] font-bold">Articol #{params.id}</h1>
      <div className="prose mt-6 max-w-none">
        <p>Conținutul articolului. Integrare cu CMS sau editor din Admin.</p>
      </div>
    </main>
  );
}

