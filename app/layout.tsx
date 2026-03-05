import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { generateOgImageUrl } from '@/utils/og-image';

const ogImage = generateOgImageUrl({
  title: 'utils.lk',
  description: 'Free Online Tools for Sri Lankans',
  icon: '🇱🇰',
  category: 'Utilities',
});


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'utils.lk | Free Online Tools for Sri Lankans',
  description: 'Find postal codes, extract NIC info, check public holidays, find school census numbers and more. Simple, fast, and free utilities for everyday tasks in Sri Lanka.',
  keywords: [
    'sri lanka utilities',
    'sri lanka tools',
    'postal code sri lanka',
    'nic information',
    'sri lanka holidays',
    'school census sri lanka',
  ],
  openGraph: {
    title: 'utils.lk - Free Online Tools for Sri Lankans',
    description: 'Simple, fast, and free utilities for everyday tasks in Sri Lanka',
    url: 'https://utils.lk',
    siteName: 'utils.lk',
    locale: 'en_LK',
    type: 'website',
    images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: 'utils.lk - Free Online Tools for Sri Lankans',
        },
      ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'utils.lk - Free Online Tools',
    description: 'Utilities for Sri Lankans',
    images: [ogImage],
  },
  alternates: {
    canonical: 'https://utils.lk',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen bg-gray-50`}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}