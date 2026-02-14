import type { Metadata } from 'next';
import { Cinzel, Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/lib/constants';

const cinzel = Cinzel({
  variable: '--font-cinzel',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '600', '700'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Fantasy Movies, Books & TV`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${inter.variable}`}
    >
      <body className="min-h-screen antialiased">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
