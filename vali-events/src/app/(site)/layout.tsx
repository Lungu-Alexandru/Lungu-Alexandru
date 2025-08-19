import Link from 'next/link';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header className="border-b border-gray-200">
        <div className="container-default py-4 flex items-center justify-between">
          <Link href="/" className="text-brand-darkBlue font-bold text-xl">Vali Events</Link>
          <nav className="flex gap-6 text-sm">
            <Link href="/evenimente" className="hover:text-brand-lightBlue">Evenimente</Link>
            <Link href="/blog" className="hover:text-brand-lightBlue">Blog</Link>
            <Link href="/despre" className="hover:text-brand-lightBlue">Despre</Link>
            <Link href="/contact" className="hover:text-brand-lightBlue">Contact</Link>
            <Link href="/admin" className="btn-outline">Admin</Link>
          </nav>
        </div>
      </header>
      {children}
      <footer className="mt-16 border-t border-gray-200">
        <div className="container-default py-8 text-sm text-gray-600 flex flex-col md:flex-row items-center justify-between gap-3">
          <div>© {new Date().getFullYear()} Vali Events</div>
          <div className="flex gap-4">
            <a href="#" aria-label="Facebook" className="hover:text-brand-lightBlue">Facebook</a>
            <a href="#" aria-label="Instagram" className="hover:text-brand-lightBlue">Instagram</a>
            <a href="#" aria-label="YouTube" className="hover:text-brand-lightBlue">YouTube</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

