import type { Metadata } from 'next';
import { generateOgImageUrl } from '@/utils/og-image';
// Import holiday data so we can build structured data server-side.
// The page component is 'use client' so JSON-LD MUST be injected here
// in the layout — which is always server-rendered — to guarantee Googlebot
// sees it in the initial HTML response.
import holidaysRaw from '@/data/holidays.json';
import { HolidayYear } from '@/types/holiday';

// ─── Structured Data Helpers ──────────────────────────────────────────────────

const CURRENT_YEAR = new Date().getFullYear();
const NEXT_YEAR = CURRENT_YEAR + 1;

const allYears = holidaysRaw as HolidayYear[];

/** Build an Event schema entry for each holiday */
function buildEventSchemas(year: number) {
  const yearData = allYears.find(y => y.year === year);
  if (!yearData) return [];

  return (yearData.holidays as Array<{ id: number; date: string; name: string; types: string[]; note?: string }>).map(h => ({
    "@type": "Event",
    "name": h.name,
    "startDate": h.date,
    "endDate": h.date,
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": {
      "@type": "Country",
      "name": "Sri Lanka",
      "addressCountry": "LK",
    },
    "description": `${h.name} is a ${h.types.join(' and ')} holiday in Sri Lanka on ${h.date}.${h.note ? ` ${h.note}` : ''}`,
    "organizer": {
      "@type": "GovernmentOrganization",
      "name": "Government of Sri Lanka",
      "url": "https://www.gov.lk",
    },
  }));
}

/** Build an ItemList schema summarising all holidays for a year */
function buildItemListSchema(year: number) {
  const yearData = allYears.find(y => y.year === year);
  if (!yearData) return null;

  const holidays = yearData.holidays as Array<{ id: number; date: string; name: string; types: string[] }>;

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Sri Lanka Public Holidays ${year}`,
    "description": `Complete list of public, bank and mercantile holidays in Sri Lanka for ${year}.`,
    "url": "https://utils.lk/holidays",
    "numberOfItems": holidays.length,
    "itemListElement": holidays.map((h, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": h.name,
      "description": `${h.name} — ${h.date} (${h.types.join(', ')} holiday)`,
    })),
  };
}

/** Build a Dataset schema — helps Google understand this is structured holiday data */
function buildDatasetSchema(year: number) {
  const yearData = allYears.find(y => y.year === year);
  if (!yearData) return null;
  const count = (yearData.holidays as unknown[]).length;

  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": `Sri Lanka Public Holidays ${year}`,
    "description": `Complete dataset of ${count} public, bank and mercantile holidays in Sri Lanka for ${year}, including Poya days and government gazette holidays.`,
    "url": "https://utils.lk/holidays",
    "keywords": [
      `Sri Lanka holidays ${year}`,
      "Sri Lanka public holidays",
      "Sri Lanka bank holidays",
      "Sri Lanka mercantile holidays",
      "Poya days Sri Lanka",
    ],
    "license": "https://creativecommons.org/licenses/by/4.0/",
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
    "temporalCoverage": `${year}`,
  };
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": `How many public holidays are there in Sri Lanka in ${CURRENT_YEAR}?`,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": `Sri Lanka typically observes around 25 public holidays per year, including Poya (full moon) days, national holidays, and religious observances for Buddhist, Hindu, Christian, and Muslim communities. The exact count for ${CURRENT_YEAR} is listed on this page.`,
      },
    },
    {
      "@type": "Question",
      "name": "What is the difference between public, bank, and mercantile holidays in Sri Lanka?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Public holidays apply to all government offices and most businesses. Bank holidays apply specifically to all banks and financial institutions, which remain closed. Mercantile holidays apply to shops and commercial establishments covered under the Mercantile and Industrial Acts. Some dates may be one, two, or all three types simultaneously.",
      },
    },
    {
      "@type": "Question",
      "name": "What are Poya days in Sri Lanka?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Poya days are full moon days observed every month in Sri Lanka as public holidays with Buddhist religious significance. They are gazetted public holidays, meaning all government offices, banks, and most businesses are closed. Sri Lanka is one of the few countries in the world where every full moon day is a public holiday.",
      },
    },
    {
      "@type": "Question",
      "name": "Are Sri Lanka holiday dates officially gazetted?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Public holidays in Sri Lanka are officially declared through Government Gazettes published by the Department of Government Printing. Bank and mercantile holidays are additionally regulated under the Banking Act and Wages Boards Ordinance. Dates can occasionally be revised by the government mid-year.",
      },
    },
    {
      "@type": "Question",
      "name": "Does Sri Lanka observe holidays for all religions?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Sri Lanka is a multi-religious country and officially observes holidays for Buddhism (Poya days, Vesak), Hinduism (Thai Pongal, Deepavali), Islam (Id-ul-Fitr, Id-ul-Alha), and Christianity (Christmas, Good Friday). This makes Sri Lanka one of the countries with the most public holidays globally.",
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
      "name": `Sri Lanka Public Holidays ${CURRENT_YEAR}`,
      "item": "https://utils.lk/holidays",
    },
  ],
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": `Sri Lanka Public Holidays ${CURRENT_YEAR} | Bank & Mercantile Holidays`,
  "description": `Complete list of public, bank and mercantile holidays in Sri Lanka for ${CURRENT_YEAR} and ${NEXT_YEAR}. Includes Poya days and countdown to next holiday.`,
  "url": "https://utils.lk/holidays",
  "inLanguage": "en-LK",
  "isPartOf": {
    "@type": "WebSite",
    "name": "utils.lk",
    "url": "https://utils.lk",
  },
  "about": {
    "@type": "Thing",
    "name": "Sri Lanka Public Holidays",
    "description": "Official gazetted public, bank and mercantile holidays in Sri Lanka",
  },
  "dateModified": new Date().toISOString().slice(0, 10),
};

// Pre-build JSON-LD for the current and next year
const currentYearEvents = buildEventSchemas(CURRENT_YEAR);
const nextYearEvents = buildEventSchemas(NEXT_YEAR);
const allEvents = [...currentYearEvents, ...nextYearEvents];

const eventCollectionSchema = allEvents.length > 0
  ? { "@context": "https://schema.org", "@graph": allEvents }
  : null;

const currentYearItemList = buildItemListSchema(CURRENT_YEAR);
const nextYearItemList = buildItemListSchema(NEXT_YEAR);
const currentYearDataset = buildDatasetSchema(CURRENT_YEAR);

// ─── Metadata ─────────────────────────────────────────────────────────────────

const ogImage = generateOgImageUrl({
  title: `Sri Lanka Public Holidays ${CURRENT_YEAR}`,
  description: `Complete list of Sri Lanka public, bank and mercantile holidays for ${CURRENT_YEAR}. Find upcoming holidays with countdown.`,
  icon: '📅',
  category: 'General',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://utils.lk'),

  title: `Sri Lanka Public Holidays ${CURRENT_YEAR} | Bank & Mercantile Holidays`,
  description: `Complete list of Sri Lanka public, bank, and mercantile holidays for ${CURRENT_YEAR} and ${NEXT_YEAR}. Includes every Poya day, government gazette holidays, and a countdown to the next holiday. Free and always up to date.`,

  keywords: [
    `sri lanka public holidays ${CURRENT_YEAR}`,
    `sri lanka public holidays ${NEXT_YEAR}`,
    'sri lanka bank holidays',
    'mercantile holidays sri lanka',
    `poya days ${CURRENT_YEAR}`,
    `poya days ${NEXT_YEAR}`,
    'sri lanka holidays list',
    'sri lanka government holidays',
    'gazetted holidays sri lanka',
    'sri lanka holiday calendar',
    'sri lanka religious holidays',
    'vesak poya sri lanka',
    'next public holiday sri lanka',
  ],

  openGraph: {
    title: `Sri Lanka Public Holidays ${CURRENT_YEAR} | Bank & Mercantile Holidays`,
    description: `Complete official list of public, bank & mercantile holidays in Sri Lanka for ${CURRENT_YEAR} and ${NEXT_YEAR}. Includes Poya days and countdown to next holiday.`,
    url: 'https://utils.lk/holidays',
    siteName: 'utils.lk',
    locale: 'en_LK',
    type: 'website',
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        // Fixed: was incorrectly set to "Sri Lanka Postal Code Finder"
        alt: `Sri Lanka Public Holidays ${CURRENT_YEAR} — utils.lk`,
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: `Sri Lanka Public Holidays ${CURRENT_YEAR} | utils.lk`,
    description: `Official public, bank & mercantile holidays for Sri Lanka ${CURRENT_YEAR}–${NEXT_YEAR}. Includes Poya days and next holiday countdown.`,
    images: [ogImage],
  },

  alternates: {
    canonical: 'https://utils.lk/holidays',
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

export default function HolidaysLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/*
       * All JSON-LD is injected here in the server-rendered layout.
       * The page component is 'use client' so any structured data placed there
       * would NOT be in the initial HTML that Googlebot crawls.
       *
       * Schemas used:
       *  1. WebPage       — page identity and metadata for Google
       *  2. BreadcrumbList — shows utils.lk > Holidays in search result URLs
       *  3. FAQPage       — enables FAQ rich results (expandable dropdowns in SERP)
       *  4. ItemList      — holiday list for current + next year
       *  5. Event         — individual Event entries for each holiday date
       *  6. Dataset       — signals this is structured, authoritative data
       */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {currentYearItemList && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(currentYearItemList) }}
        />
      )}
      {nextYearItemList && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(nextYearItemList) }}
        />
      )}
      {eventCollectionSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventCollectionSchema) }}
        />
      )}
      {currentYearDataset && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(currentYearDataset) }}
        />
      )}
      {children}
    </>
  );
}