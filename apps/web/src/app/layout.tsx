import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';
import EmergencyBanner from '@/components/EmergencyBanner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DisclaimerBanner from '@/components/DisclaimerBanner';

export const metadata: Metadata = {
  title: 'Aarogya Multi-Specialty Hospital | Advanced Care, Compassionate Healing',
  description:
    'Tertiary care multi-specialty hospital in India. Find specialist doctors, book OPD appointments, download diagnostic reports, and pay medical bills online.',
  keywords: [
    'Aarogya Hospital',
    'Multi-specialty hospital India',
    'Doctor appointment booking',
    'Cardiology hospital Bengaluru',
    'Online lab reports',
    'DPDP compliant healthcare'
  ]
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Providers>
          <EmergencyBanner />
          <Navbar />
          <main className="flex-1">{children}</main>
          <DisclaimerBanner />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
