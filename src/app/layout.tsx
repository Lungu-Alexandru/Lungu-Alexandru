import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Gettiks - Platforma de Ticketing Online',
  description: 'Descoperă evenimente unice și cumpără bilete în siguranță. Platforma modernă de ticketing online care conectează organizatorii cu participanții.',
  keywords: 'bilete, evenimente, concerte, teatru, sport, conferințe, ticketing online, România',
  authors: [{ name: 'Gettiks Team' }],
  creator: 'Gettiks',
  publisher: 'Gettiks',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://gettiks.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'ro_RO',
    url: '/',
    title: 'Gettiks - Platforma de Ticketing Online',
    description: 'Descoperă evenimente unice și cumpără bilete în siguranță.',
    siteName: 'Gettiks',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Gettiks - Platforma de Ticketing Online',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gettiks - Platforma de Ticketing Online',
    description: 'Descoperă evenimente unice și cumpără bilete în siguranță.',
    images: ['/images/twitter-image.jpg'],
    creator: '@gettiks',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro" className="h-full">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#00A3E0" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className={`${inter.className} h-full antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}