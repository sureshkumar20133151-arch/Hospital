import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: 'Aarogya HMS | Staff & Administration Portal',
  description: 'Hospital Management & Clinical Operations System for Aarogya Multi-Specialty Hospital'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-100">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
