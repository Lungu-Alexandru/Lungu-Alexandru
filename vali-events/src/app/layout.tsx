import type { Metadata } from 'next';
import { Montserrat, Open_Sans } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-heading', weight: ['600','700','800'] });
const openSans = Open_Sans({ subsets: ['latin'], variable: '--font-body', weight: ['400','500','600'] });

export const metadata: Metadata = {
  title: 'Vali Events',
  description: 'Evenimente organizate de Vali — înscrieri, bilete și noutăți',
  openGraph: {
    title: 'Vali Events',
    description: 'Evenimente organizate de Vali — înscrieri, bilete și noutăți'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro" className={`${montserrat.variable} ${openSans.variable}`}>
      <body className="min-h-screen font-[var(--font-body)]">
        {children}
      </body>
    </html>
  );
}

