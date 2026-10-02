import type { Metadata } from 'next';
import { generateOgImageUrl } from '@/utils/og-image';
// Structured data is built server-side from the same JSON the client page
// renders from, and injected here in the layout — the page itself is
// 'use client', so anything it renders is only visible to Googlebot after
// hydration. See app/holidays/layout.tsx for the same pattern.
import packagesRaw from '@/data/internet-packages.json';
import { InternetPackagesData } from '@/types/internet-package';

const data = packagesRaw as InternetPackagesData;
const { isps, packages } = data;

// ─── Structured Data Helpers ──────────────────────────────────────────────────

function ispName(ispId: string): string {
  return isps.find(i => i.id === ispId)?.name ?? ispId;
}

function ispWebsite(ispId: string): string | undefined {
  return isps.find(i => i.id === ispId)?.website;
}

/** "SLT, Dialog and Starlink" — grammatical, and stays correct as ISPs are added or removed. */
function joinNatural(items: string[]): string {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

const ispList = joinNatural(isps.map(i => i.shortName));

/**
 * The most recent `lastVerified` date across every package. Using this
 * instead of "today" means the page's dateModified reflects when the data
 * actually changed — Google explicitly warns against pages that imply
 * fresher content than they have, so this should only move when the JSON
 * does.
 */
function latestVerifiedDate(): string | undefined {
  const dates = packages.map(p => p.lastVerified).filter((d): d is string => d != null);
  return dates.length ? dates.slice().sort().at(-1) : undefined;
}

/**
 * One ItemList entry per package. Each wraps a Service/Offer rather than a
 * bare name+description — the Offer's `url` points at wherever someone can
 * actually sign up (the plan's own page if we have it, else the ISP's
 * homepage), so the markup describes something a visitor can act on instead
 * of only describing itself.
 */
function buildItemListSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Sri Lanka Home Broadband Packages",
    "description": "Home broadband packages from Sri Lankan ISPs, unlimited and data-bundle plans across Fiber, Satellite, ADSL, 4G and 5G.",
    "url": "https://utils.lk/internet-packages",
    "numberOfItems": packages.length,
    "itemListElement": packages.map((p, i) => {
      const actionUrl = p.planUrl ?? ispWebsite(p.ispId);
      return {
        "@type": "ListItem",
        "position": i + 1,
        "item": {
          "@type": "Service",
          "name": `${ispName(p.ispId)} ${p.name}`,
          "description": p.kind === 'unlimited'
            ? `${p.name} — unlimited data, ${p.connectionType} (${p.billingType})`
            : `${p.name} — ${(p as { dataCapGB: number }).dataCapGB}GB, ${p.connectionType} (${p.billingType})`,
          "provider": { "@type": "Organization", "name": ispName(p.ispId) },
          "areaServed": { "@type": "Country", "name": "Sri Lanka", "addressCountry": "LK" },
          ...(actionUrl ? { "url": actionUrl } : {}),
          "offers": {
            "@type": "Offer",
            "price": p.price,
            "priceCurrency": "LKR",
            ...(actionUrl ? { "url": actionUrl } : {}),
          },
        },
      };
    }),
  };
}

/** Signals this is structured, authoritative comparison data. */
function buildDatasetSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": "Sri Lanka Home Broadband Packages Dataset",
    "description": `Comparison dataset of ${packages.length} home broadband packages from ${isps.length} Sri Lankan ISPs, covering Fiber, Satellite, ADSL, 4G and 5G connections, prepaid and postpaid billing, unlimited and data-bundle plans.`,
    "url": "https://utils.lk/internet-packages",
    "keywords": [
      "sri lanka broadband packages",
      "sri lanka internet packages comparison",
      "sri lanka fiber packages",
      "sri lanka unlimited broadband",
      "SLT vs Dialog broadband",
      "starlink sri lanka price",
      "sri lanka home wifi packages",
    ],
    "creator": {
      "@type": "Organization",
      "name": "utils.lk",
      "url": "https://utils.lk",
    },
    "spatialCoverage": {
      "@type": "Country",
      "name": "Sri Lanka",
      "addressCountry": "LK",
    },
  };
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What's the difference between an unlimited and a data bundle broadband package?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Unlimited packages have no monthly data cap — you pick a plan by speed instead (e.g. 100 Mbps vs 300 Mbps), and that speed is what you get all month. Data bundle packages instead give you a fixed monthly data allowance (e.g. 100GB) at a set speed, and either slow down or charge extra once you use it up.",
      },
    },
    {
      "@type": "Question",
      "name": "Which connection types are available for home broadband in Sri Lanka?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The main options are Fiber (fastest, most widely available in cities and expanding elsewhere), 4G home routers (widely available, no cabling needed), ADSL (older copper-line technology, being phased out in most areas), 5G fixed wireless (limited to select areas so far), and satellite internet via Starlink (available nationwide, including areas with no fixed-line or cellular coverage).",
      },
    },
    {
      "@type": "Question",
      "name": "Should I choose a prepaid or postpaid broadband package?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Prepaid packages are paid upfront with no contract, which suits short-term needs or unstable income. Postpaid packages are billed monthly, often need a fixed-term contract, and typically work out cheaper per GB or per Mbps for regular, long-term use.",
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://utils.lk" },
    { "@type": "ListItem", "position": 2, "name": "Internet Packages Comparison", "item": "https://utils.lk/internet-packages" },
  ],
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": `Sri Lanka Internet Packages Comparison | ${ispList}`,
  "description": `Compare home broadband packages from ${ispList} — unlimited and data bundle plans across Fiber, Satellite, 4G and ADSL, prepaid and postpaid.`,
  "url": "https://utils.lk/internet-packages",
  "inLanguage": "en-LK",
  "isPartOf": { "@type": "WebSite", "name": "utils.lk", "url": "https://utils.lk" },
  "about": {
    "@type": "Thing",
    "name": "Sri Lanka Home Broadband Packages",
    "description": "Home internet packages offered by Sri Lankan internet service providers",
  },
  ...(latestVerifiedDate() ? { "dateModified": latestVerifiedDate() } : {}),
};

// ─── Metadata ─────────────────────────────────────────────────────────────────

const ogImage = generateOgImageUrl({
  title: 'Sri Lanka Internet Packages',
  description: 'Compare home broadband packages from Sri Lankan ISPs — unlimited & data bundle plans.',
  icon: '📶',
  category: 'Internet',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://utils.lk'),

  title: `Sri Lanka Internet Packages Comparison | ${ispList}`,
  description: `Compare home broadband packages from ${ispList} — unlimited and data bundle plans across Fiber, Satellite, 4G and ADSL, prepaid and postpaid, with real per-GB and per-Mbps pricing.`,

  keywords: [
    'sri lanka internet packages',
    'sri lanka broadband comparison',
    'sri lanka fiber packages',
    'sri lanka unlimited broadband',
    'sri lanka home wifi packages',
    'SLT broadband packages',
    'dialog broadband packages',
    'starlink sri lanka',
    'satellite internet sri lanka',
    'sri lanka adsl packages',
    'sri lanka 4g home broadband',
    'sri lanka 5g broadband',
    'sri lanka data bundle packages',
  ],

  openGraph: {
    title: `Sri Lanka Internet Packages Comparison | ${ispList}`,
    description: 'Compare home broadband packages from Sri Lanka\'s ISPs — unlimited and data bundle plans across every connection type, with real per-GB and per-Mbps pricing.',
    url: 'https://utils.lk/internet-packages',
    siteName: 'utils.lk',
    locale: 'en_LK',
    type: 'website',
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'Sri Lanka Internet Packages Comparison — utils.lk',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Sri Lanka Internet Packages Comparison | utils.lk',
    description: 'Compare home broadband packages from Sri Lanka\'s ISPs — unlimited & data bundle plans.',
    images: [ogImage],
  },

  alternates: {
    canonical: 'https://utils.lk/internet-packages',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
};

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function InternetPackagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/*
       * All JSON-LD is injected here in the server-rendered layout — see the
       * comment at the top of this file for why.
       *
       * Schemas used:
       *  1. WebPage        — page identity and metadata for Google
       *  2. BreadcrumbList — shows utils.lk > Internet Packages in results
       *  3. FAQPage        — enables FAQ rich results (expandable dropdowns)
       *  4. ItemList       — every package currently listed
       *  5. Dataset        — signals this is structured, authoritative data
       */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildItemListSchema()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildDatasetSchema()) }} />
      {children}
    </>
  );
}