import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';

export const metadata: Metadata = {
  title: 'Jeff Dorchester — Founder, CTO, CPO',
  description:
    'Industrial designer turned founder, CTO, and CPO. 27 years, six companies, one exit, one near IPO. I build regulated software, and I fix what others have walked away from.',
  openGraph: {
    title: 'Jeff Dorchester — Founder, CTO, CPO',
    description:
      'Industrial designer turned founder, CTO, and CPO. 27 years, six companies, one exit, one near IPO.',
    url: 'https://jeffdorchester.com',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jeff Dorchester — Founder, CTO, CPO',
    description:
      'Industrial designer turned founder, CTO, and CPO. 27 years, six companies, one exit, one near IPO.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
