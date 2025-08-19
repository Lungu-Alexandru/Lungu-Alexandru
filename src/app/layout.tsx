import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gettiks — Bilete la evenimente, rapid și sigur',
  description: 'Descoperă evenimente, cumpără bilete și gestionează rezervările. Organizează-ți evenimentele cu ușurință pe gettiks.com.',
  icons: {
    icon: '/favicon.ico'
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro">
      <body className="min-h-screen antialiased font-sans">{children}</body>
    </html>
  )
}

