import type { Metadata } from "next";
import { generateOgImageUrl } from '@/utils/og-image';

const ogImage = generateOgImageUrl({
  title: 'Sri Lankan NIC Information Extractor',
  description: 'Extract information from Sri Lankan NIC numbers instantly',
  icon: '🪪',
  category: 'Identity',
});

// ─── Structured Data (server-rendered JSON-LD) ────────────────────────────────

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Sri Lankan NIC Information Extractor",
  "url": "https://utils.lk/nic-info-extractor",
  "description":
    "Extract birth date, age, and gender from Sri Lankan National Identity Card (NIC) numbers. Supports both old (9-digit + V/X) and new (12-digit) NIC formats.",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Web",
  "browserRequirements": "Requires JavaScript",
  "inLanguage": "en-LK",
  "isAccessibleForFree": true,
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "LKR",
  },
  "provider": {
    "@type": "Organization",
    "name": "utils.lk",
    "url": "https://utils.lk",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What information can be extracted from a Sri Lankan NIC number?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "A Sri Lankan NIC number encodes the holder's date of birth, day of year, and gender. For females, 500 is added to the day of year value. This tool extracts the date of birth, current age, and gender from both old and new NIC formats.",
      },
    },
    {
      "@type": "Question",
      "name": "What is the difference between old and new Sri Lankan NIC formats?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "The old Sri Lankan NIC format consists of 9 digits followed by the letter V or X (e.g., 911042754V). The new NIC format introduced after 2016 consists of 12 digits (e.g., 199119202757). Both formats encode the same birth information.",
      },
    },
    {
      "@type": "Question",
      "name": "How do I read a Sri Lankan NIC number?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "In the old format, the first two digits represent the birth year, the next three digits represent the day of year (add 500 for females), and the remaining digits are a serial number. In the new 12-digit format, the first four digits are the full birth year, followed by the same day-of-year encoding.",
      },
    },
    {
      "@type": "Question",
      "name": "Is this NIC extractor tool free to use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "Yes, the Sri Lankan NIC Information Extractor on utils.lk is completely free. The extraction runs entirely in your browser — no data is sent to any server.",
      },
    },
    {
      "@type": "Question",
      "name": "What does V or X mean at the end of a Sri Lankan NIC?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "In the old NIC format, 'V' stands for 'Voter' and is used for Sri Lankan citizens eligible to vote. 'X' is used for Sri Lankan citizens residing abroad (non-resident). Both are valid old-format NICs.",
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://utils.lk",
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "NIC Information Extractor",
      "item": "https://utils.lk/nic-info-extractor",
    },
  ],
};

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  // metadataBase is needed so Next.js resolves relative OG image URLs correctly.
  // Set this in your root layout too; doing it here as a safeguard.
  metadataBase: new URL("https://utils.lk"),

  title:
    "Sri Lankan NIC Information Extractor | Extract Birth Date, Age & Gender",
  description:
    "Extract birth date, age, and gender from Sri Lankan NIC numbers instantly. Supports both old (9-digit + V/X) and new 12-digit NIC formats. Free, runs in your browser — no data sent to any server.",

  keywords: [
    "sri lanka nic extractor",
    "sri lankan nic information",
    "nic birth date extractor",
    "nic age calculator sri lanka",
    "old nic format sri lanka",
    "new nic format sri lanka",
    "12 digit nic sri lanka",
    "national identity card sri lanka",
    "nic gender extractor",
    "nic number decoder",
    "sri lanka nic calculator",
    "nic dob calculator",
  ],

  openGraph: {
    title: "Sri Lankan NIC Information Extractor | utils.lk",
    description:
      "Extract birth date, age, and gender from any Sri Lankan NIC number. Supports old (9-digit + V/X) and new (12-digit) formats. Free and instant.",
    url: "https://utils.lk/nic-info-extractor",
    siteName: "utils.lk",
    locale: "en_LK",
    type: "website",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Sri Lankan NIC Information Extractor — utils.lk",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Sri Lankan NIC Information Extractor | utils.lk",
    description:
      "Extract birth date, age, and gender from Sri Lankan NIC numbers instantly. Free online tool.",
    images: [ogImage],
  },

  alternates: {
    canonical: "https://utils.lk/nic-info-extractor",
  },

  // Allows search engines to index and follow links on this page
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function NICInfoExtractorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/*
       * JSON-LD structured data injected server-side here in the layout so it is
       * present in the initial HTML response that Googlebot crawls — regardless of
       * whether the page component itself is a client component.
       */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}