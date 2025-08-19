import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Gettiks - Descoperă și cumpără bilete la evenimente',
  description: 'Platforma modernă de ticketing pentru evenimente: concerte, teatru, sport, conferințe și multe altele.',
  metadataBase: new URL('https://gettiks.com'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}

