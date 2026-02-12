import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sri Lanka Public Holidays 2025 | Bank & Mercantile Holidays',
  description:
    'Complete list of Sri Lanka public, bank and mercantile holidays for 2025 and 2026. Find upcoming holidays with countdown.',
  keywords: [
    'sri lanka public holidays 2026',
    'sri lanka bank holidays',
    'mercantile holidays sri lanka',
    'poya days 2026',
    'sri lanka holidays list',
  ],
  openGraph: {
    title: 'Sri Lanka Public Holidays 2026',
    description: 'Official public, bank & mercantile holidays for Sri Lanka',
    url: 'https://utils.lk/holidays',
    siteName: 'utils.lk',
    locale: 'en_LK',
    type: 'website',
  },
  alternates: { canonical: 'https://utils.lk/holidays' },
};

export default function HolidaysLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}