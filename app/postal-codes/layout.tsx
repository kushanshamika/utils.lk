import type { Metadata } from "next";
import { generateOgImageUrl } from '@/utils/og-image';

// ─── Structured Data ──────────────────────────────────────────────────────────
//
// The page component is 'use client', so ALL JSON-LD must live here in the
// server-rendered layout to guarantee Googlebot sees it in the initial HTML.
//
// Schemas used:
//  1. WebApplication  — free tool declaration, price, category
//  2. Dataset         — signals authoritative structured data (20,000+ locations)
//  3. SearchAction    — enables Google's Sitelinks Search Box directly in SERPs
//  4. ItemList        — top Sri Lankan cities for rich result indexing
//  5. FAQPage         — expandable FAQ dropdowns in Google search results
//  6. BreadcrumbList  — shows utils.lk > Postal Code Finder in snippet URLs

// ── 1. WebApplication ─────────────────────────────────────────────────────────
const webApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Sri Lanka Postal Code Finder",
  "url": "https://utils.lk/postal-codes",
  "description":
    "Find postal codes for all cities and areas in Sri Lanka. Free online tool with 20,000+ locations. Search by city or area name instantly.",
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
  "featureList": [
    "Search 20,000+ Sri Lanka postal codes",
    "Search by city or area name",
    "One-click copy to clipboard",
    "Instant results, no page reload",
    "Free to use, no registration required",
  ],
};

// ── 2. Dataset ────────────────────────────────────────────────────────────────
const datasetSchema = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  "name": "Sri Lanka Postal Codes Database",
  "description":
    "Comprehensive dataset of 20,000+ postal codes for all cities, towns, and areas across Sri Lanka, maintained by utils.lk.",
  "url": "https://utils.lk/postal-codes",
  "keywords": [
    "Sri Lanka postal codes",
    "Sri Lanka post codes",
    "Sri Lanka zip codes",
    "Colombo postal code",
    "Kandy postal code",
    "Galle postal code",
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
  "variableMeasured": "Postal Code",
  "measurementTechnique": "Official Sri Lanka Post data",
};

// ── 3. SearchAction (Sitelinks Search Box) ────────────────────────────────────
// This tells Google that utils.lk/postal-codes supports a search action.
// Google may display a search box directly under the utils.lk result in SERPs.
const searchActionSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "utils.lk — Sri Lanka Postal Code Finder",
  "url": "https://utils.lk/postal-codes",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://utils.lk/postal-codes?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

// ── 4. ItemList — top Sri Lankan cities ───────────────────────────────────────
// Hardcoded top cities with known postal codes.
// Gives Google concrete named entities to index — much stronger than just
// "we have 20,000 locations" with no specifics in the HTML.
const topCities = [
  { name: "Colombo", code: "00100" },
  { name: "Kandy", code: "20000" },
  { name: "Galle", code: "80000" },
  { name: "Negombo", code: "11500" },
  { name: "Jaffna", code: "40000" },
  { name: "Batticaloa", code: "30000" },
  { name: "Matara", code: "81000" },
  { name: "Kurunegala", code: "60000" },
  { name: "Anuradhapura", code: "50000" },
  { name: "Ratnapura", code: "70000" },
  { name: "Badulla", code: "90000" },
  { name: "Trincomalee", code: "31000" },
];

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Sri Lanka Major City Postal Codes",
  "description": "Postal codes for major cities and towns in Sri Lanka",
  "url": "https://utils.lk/postal-codes",
  "numberOfItems": topCities.length,
  "itemListElement": topCities.map((city, i) => ({
    "@type": "ListItem",
    "position": i + 1,
    "name": `${city.name} Postal Code`,
    "description": `The postal code for ${city.name}, Sri Lanka is ${city.code}.`,
    "url": `https://utils.lk/postal-codes?q=${encodeURIComponent(city.name)}`,
  })),
};

// ── 5. FAQPage ────────────────────────────────────────────────────────────────
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the postal code for Colombo, Sri Lanka?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The main postal code for Colombo, Sri Lanka is 00100. Different areas within Colombo have specific codes — for example, Colombo 2 is 00200, Colombo 3 is 00300, and so on up to Colombo 15 (00150). You can find the exact postal code for any Colombo area using this tool.",
      },
    },
    {
      "@type": "Question",
      "name": "What is the postal code for Kandy, Sri Lanka?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The postal code for Kandy, Sri Lanka is 20000. Kandy is the capital of the Central Province and one of Sri Lanka's most important cities.",
      },
    },
    {
      "@type": "Question",
      "name": "How do Sri Lanka postal codes work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sri Lanka postal codes are 5-digit numbers managed by Sri Lanka Post. The first two digits generally indicate the postal district or province, while the remaining digits identify the specific delivery area. For example, codes starting with 00 are in the Colombo district, 20 in the Kandy/Central region, and 80 in the Galle/Southern region.",
      },
    },
    {
      "@type": "Question",
      "name": "Does Sri Lanka use ZIP codes?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sri Lanka uses 5-digit postal codes, not ZIP codes. ZIP codes are specific to the United States (USPS). Sri Lanka's postal codes serve the same purpose — identifying specific delivery areas — but are managed by Sri Lanka Post.",
      },
    },
    {
      "@type": "Question",
      "name": "How many postal codes does Sri Lanka have?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sri Lanka has over 20,000 postal codes covering cities, towns, villages, and rural areas across all nine provinces. This tool provides a searchable database of all of them.",
      },
    },
    {
      "@type": "Question",
      "name": "What is the postal code for Galle, Sri Lanka?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The postal code for Galle, Sri Lanka is 80000. Galle is the capital of the Southern Province.",
      },
    },
  ],
};

// ── 6. BreadcrumbList ─────────────────────────────────────────────────────────
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
      "name": "Sri Lanka Postal Code Finder",
      "item": "https://utils.lk/postal-codes",
    },
  ],
};

// ─── OG Image ─────────────────────────────────────────────────────────────────

const ogImage = generateOgImageUrl({
  title: 'Sri Lanka Postal Code Finder',
  description: 'Find postal codes for 20,000+ locations in Sri Lanka',
  icon: '📮',
  category: 'Location',
});

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  metadataBase: new URL("https://utils.lk"),

  title: "Sri Lanka Postal Code Finder | Search 20,000+ Postal Codes by City & Area",
  description:
    "Find postal codes for any city or area in Sri Lanka instantly. Free online tool with 20,000+ locations. Colombo postal code: 00100 · Kandy: 20000 · Galle: 80000. Search by city name.",

  keywords: [
    "sri lanka postal code",
    "postal code finder sri lanka",
    "sri lanka post code",
    "sri lanka zip code",
    "colombo postal code",
    "kandy postal code",
    "galle postal code",
    "negombo postal code",
    "jaffna postal code",
    "batticaloa postal code",
    "sri lanka postal code search",
    "find postal code sri lanka",
    "postal code by city sri lanka",
    "5 digit postal code sri lanka",
    "sri lanka post office code",
  ],

  openGraph: {
    title: "Sri Lanka Postal Code Finder | 20,000+ Locations",
    description:
      "Find postal codes for any city or area in Sri Lanka instantly. Colombo: 00100 · Kandy: 20000 · Galle: 80000. Free tool with 20,000+ locations.",
    url: "https://utils.lk/postal-codes",
    siteName: "utils.lk",
    locale: "en_LK",
    type: "website",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Sri Lanka Postal Code Finder — utils.lk",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Sri Lanka Postal Code Finder | utils.lk",
    description:
      "Find postal codes for any city or area in Sri Lanka. Colombo: 00100, Kandy: 20000, Galle: 80000. Free, 20,000+ locations.",
    images: [ogImage],
  },

  alternates: {
    canonical: "https://utils.lk/postal-codes",
  },

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

export default function PostalCodesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(searchActionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
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