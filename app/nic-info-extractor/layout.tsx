import type { Metadata } from "next";
import { generateOgImageUrl } from '@/utils/og-image';

const ogImage = generateOgImageUrl({
  title: 'Sri Lankan NIC Information Extractor',
  description: 'Extract information from Sri Lankan NIC numbers instantly',
  icon: '🪪',
  category: 'Identity',
});

export const metadata: Metadata = {
  title: "Sri Lankan NIC Information Extractor | Extract Birth Date, Age & Gender from NIC",
  description: "Extract birth date, age, and gender from Sri Lankan NIC numbers instantly. Supports both old (9 digits + V/X) and new (12 digits) NIC formats. Free online calculator.",
  keywords: ["sri lanka nic", "nic information", "sri lankan identity card", "nic birth date", "nic age calculator", "old nic format", "new nic format", "extract nic information"],
  openGraph: {
    title: "Sri Lankan NIC Information Extractor",
    description: "Extract birth date, age, and gender from Sri Lankan NIC numbers instantly",
    url: "https://utils.lk/nic-info-extractor",
    siteName: "utils.lk",
    locale: "en_LK",
    type: "website",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'Sri Lankan NIC Information Extractor',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sri Lankan NIC Information Extractor",
    description: "Extract information from Sri Lankan NIC numbers instantly",
    images: [ogImage],
  },
  alternates: {
    canonical: "https://utils.lk/nic-info-extractor",
  },
};

export default function NICInfoExtractorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}