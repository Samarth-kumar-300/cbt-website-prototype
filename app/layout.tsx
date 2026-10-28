import type { Metadata } from 'next';
import { Nunito, Open_Sans } from 'next/font/google';
import { CookieBanner } from '@/components/shared/CookieBanner';
import { Footer } from '@/components/shared/Footer';
import { Header } from '@/components/shared/Header';
import './globals.css';

const nunito = Nunito({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-nunito', display: 'swap' });
const openSans = Open_Sans({ subsets: ['latin'], variable: '--font-open-sans', display: 'swap' });

export const metadata: Metadata = {
  title: 'CognitiveBotics | AI Powered Early Intervention',
  description: 'AI-powered early intervention, built to connect the therapist, family and school around every child.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} ${openSans.variable} font-sans`}>
        <Header />
        <main>{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
