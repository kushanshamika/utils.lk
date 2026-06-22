import type { Metadata } from "next";
import { generateOgImageUrl } from '@/utils/og-image';

// ─── Structured Data ──────────────────────────────────────────────────────────
//
// The page is 'use client' — ALL JSON-LD must be here in the server-rendered
// layout so Googlebot sees it in the initial HTML, before any JS hydration.
//
// Schemas used:
//  1. WebApplication        — free tool, EducationApplication category
//  2. GovernmentService     — signals authoritative administrative data
//  3. Dataset               — 20,000+ villages + GN divisions dataset
//  4. SearchAction          — Google Sitelinks Search Box in SERPs
//  5. ItemList (provinces)  — all 9 provinces as named entities
//  6. ItemList (districts)  — all 25 districts as named entities
//  7. FAQPage               — expandable FAQ rich results in Google SERPs
//  8. BreadcrumbList        — utils.lk > Admin Division Finder in snippet URLs

// ── Sri Lanka administrative data ─────────────────────────────────────────────
const SRI_LANKA_PROVINCES = [
  { name: "Western Province",      capital: "Colombo",       districts: ["Colombo", "Gampaha", "Kalutara"] },
  { name: "Central Province",      capital: "Kandy",         districts: ["Kandy", "Matale", "Nuwara Eliya"] },
  { name: "Southern Province",     capital: "Galle",         districts: ["Galle", "Matara", "Hambantota"] },
  { name: "Northern Province",     capital: "Jaffna",        districts: ["Jaffna", "Kilinochchi", "Mannar", "Mullaitivu", "Vavuniya"] },
  { name: "Eastern Province",      capital: "Trincomalee",   districts: ["Ampara", "Batticaloa", "Trincomalee"] },
  { name: "North Western Province",capital: "Kurunegala",    districts: ["Kurunegala", "Puttalam"] },
  { name: "North Central Province",capital: "Anuradhapura",  districts: ["Anuradhapura", "Polonnaruwa"] },
  { name: "Uva Province",          capital: "Badulla",       districts: ["Badulla", "Monaragala"] },
  { name: "Sabaragamuwa Province", capital: "Ratnapura",     districts: ["Ratnapura", "Kegalle"] },
];

const ALL_DISTRICTS = SRI_LANKA_PROVINCES.flatMap(p =>
  p.districts.map(d => ({ name: d, province: p.name }))
);

// Well-known GN/village lookups — concrete named entities for Google to index.
// Matches the static HTML table in page.tsx.
const NOTABLE_LOCATIONS = [
  { village: "Kollupitiya",   gn: "Kollupitiya GN Division",    ds: "Colombo",         district: "Colombo",     province: "Western" },
  { village: "Nugegoda",      gn: "Nugegoda GN Division",       ds: "Colombo",         district: "Colombo",     province: "Western" },
  { village: "Kotte",         gn: "Sri Jayawardenepura Kotte",   ds: "Sri Jayawardenepura", district: "Colombo", province: "Western" },
  { village: "Peradeniya",    gn: "Peradeniya GN Division",     ds: "Gangawata Korale", district: "Kandy",       province: "Central" },
  { village: "Unawatuna",     gn: "Unawatuna GN Division",      ds: "Galle",           district: "Galle",       province: "Southern" },
  { village: "Nuwara Eliya",  gn: "Nuwara Eliya GN Division",   ds: "Nuwara Eliya",    district: "Nuwara Eliya",province: "Central" },
  { village: "Trincomalee",   gn: "Trincomalee GN Division",    ds: "Trincomalee",     district: "Trincomalee", province: "Eastern" },
  { village: "Jaffna",        gn: "Jaffna GN Division",         ds: "Jaffna",          district: "Jaffna",      province: "Northern" },
];

// ── 1. WebApplication ─────────────────────────────────────────────────────────
const webApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Sri Lanka Administrative Division Finder",
  "alternateName": ["Grama Niladhari Division Finder", "GN Division Finder Sri Lanka"],
  "url": "https://utils.lk/admin-divisions",
  "description":
    "Find the complete administrative hierarchy — Grama Niladhari Division, Divisional Secretariat, District, and Province — for any village or location in Sri Lanka. Covers 20,000+ villages and GN divisions.",
  "applicationCategory": "GovernmentApplication",
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
    "Search 20,000+ Sri Lanka villages and GN divisions",
    "Full 5-tier administrative hierarchy: Village → GN Division → DS Office → District → Province",
    "Find Divisional Secretariat (Pradeshiya Lekam Karyalaya) for any village",
    "Instant results, no page reload",
    "Free to use, no registration required",
  ],
};

// ── 2. GovernmentService ──────────────────────────────────────────────────────
// Signals this page is about official Sri Lankan government administrative data
const governmentServiceSchema = {
  "@context": "https://schema.org",
  "@type": "GovernmentService",
  "name": "Sri Lanka Grama Niladhari Division Lookup",
  "description":
    "Official administrative division lookup for Sri Lanka. Find the Grama Niladhari (GN) Division, Divisional Secretariat (DS) Office, District, and Province for any village or location.",
  "url": "https://utils.lk/admin-divisions",
  "serviceType": "Administrative Division Information",
  "areaServed": {
    "@type": "Country",
    "name": "Sri Lanka",
    "addressCountry": "LK",
  },
  "provider": {
    "@type": "Organization",
    "name": "utils.lk",
    "url": "https://utils.lk",
  },
  "isRelatedTo": [
    {
      "@type": "GovernmentOrganization",
      "name": "Department of Census and Statistics, Sri Lanka",
      "url": "https://www.statistics.gov.lk",
    },
    {
      "@type": "GovernmentOrganization",
      "name": "Ministry of Public Administration, Sri Lanka",
    },
  ],
};

// ── 3. Dataset ────────────────────────────────────────────────────────────────
const datasetSchema = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  "name": "Sri Lanka Administrative Divisions Database",
  "description":
    "Comprehensive dataset covering 20,000+ villages and GN divisions across all 9 provinces, 25 districts, and 331 Divisional Secretariats in Sri Lanka.",
  "url": "https://utils.lk/admin-divisions",
  "keywords": [
    "Sri Lanka Grama Niladhari divisions",
    "Sri Lanka administrative divisions",
    "Sri Lanka GN divisions",
    "Sri Lanka Divisional Secretariat",
    "Sri Lanka villages database",
    "Sri Lanka district division finder",
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
  "measurementTechnique": "Department of Census and Statistics, Sri Lanka official records",
  "variableMeasured": [
    "Grama Niladhari Division",
    "Divisional Secretariat",
    "District",
    "Province",
  ],
};

// ── 4. SearchAction ───────────────────────────────────────────────────────────
const searchActionSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "utils.lk — Sri Lanka Administrative Division Finder",
  "url": "https://utils.lk/admin-divisions",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://utils.lk/admin-divisions?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

// ── 5. ItemList — provinces ───────────────────────────────────────────────────
const provincesItemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Sri Lanka Provinces",
  "description": "All 9 provinces of Sri Lanka with their capitals and districts",
  "url": "https://utils.lk/admin-divisions",
  "numberOfItems": SRI_LANKA_PROVINCES.length,
  "itemListElement": SRI_LANKA_PROVINCES.map((p, i) => ({
    "@type": "ListItem",
    "position": i + 1,
    "name": p.name,
    "description": `${p.name} — capital: ${p.capital}. Districts: ${p.districts.join(", ")}.`,
  })),
};

// ── 6. ItemList — districts ───────────────────────────────────────────────────
const districtsItemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Sri Lanka Districts",
  "description": "All 25 districts of Sri Lanka with their provinces",
  "url": "https://utils.lk/admin-divisions",
  "numberOfItems": ALL_DISTRICTS.length,
  "itemListElement": ALL_DISTRICTS.map((d, i) => ({
    "@type": "ListItem",
    "position": i + 1,
    "name": `${d.name} District`,
    "description": `${d.name} District is in ${d.province}.`,
    "url": `https://utils.lk/admin-divisions?q=${encodeURIComponent(d.name)}`,
  })),
};

// ── 7. FAQPage ────────────────────────────────────────────────────────────────
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is a Grama Niladhari Division in Sri Lanka?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A Grama Niladhari (GN) Division is the smallest administrative unit in Sri Lanka's government structure. Each GN division is managed by a Grama Niladhari officer and falls under a Divisional Secretariat (DS) office. Sri Lanka has approximately 14,000 GN divisions covering all villages and urban areas.",
      },
    },
    {
      "@type": "Question",
      "name": "What is a Divisional Secretariat (DS) office in Sri Lanka?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A Divisional Secretariat (DS) office, also known as Pradeshiya Lekam Karyalaya, is the main government office for administrative services at the divisional level in Sri Lanka. It handles civil registration, land administration, social services, and official documentation. Sri Lanka has 331 Divisional Secretariats across 25 districts.",
      },
    },
    {
      "@type": "Question",
      "name": "How many provinces does Sri Lanka have?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sri Lanka has 9 provinces: Western, Central, Southern, Northern, Eastern, North Western, North Central, Uva, and Sabaragamuwa. Each province is divided into districts, which are further divided into Divisional Secretariats and Grama Niladhari Divisions.",
      },
    },
    {
      "@type": "Question",
      "name": "How many districts does Sri Lanka have?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sri Lanka has 25 districts across 9 provinces. The districts are: Colombo, Gampaha, Kalutara (Western), Kandy, Matale, Nuwara Eliya (Central), Galle, Matara, Hambantota (Southern), Jaffna, Kilinochchi, Mannar, Mullaitivu, Vavuniya (Northern), Ampara, Batticaloa, Trincomalee (Eastern), Kurunegala, Puttalam (North Western), Anuradhapura, Polonnaruwa (North Central), Badulla, Monaragala (Uva), Ratnapura, Kegalle (Sabaragamuwa).",
      },
    },
    {
      "@type": "Question",
      "name": "What documents are issued by the Grama Niladhari officer?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The Grama Niladhari (GN) officer issues official documents including: character certificates, income certificates, residence certificates, poverty certificates, land ownership confirmations, and certifications required for school admissions, government services, and official applications.",
      },
    },
    {
      "@type": "Question",
      "name": "What is the difference between Grama Niladhari and Divisional Secretariat?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The Grama Niladhari (GN) is the village-level officer managing the smallest administrative unit. The Divisional Secretariat (DS) is the office one level above, covering multiple GN divisions. The DS office handles larger administrative functions while the GN officer handles village-level certification and first-contact government services.",
      },
    },
  ],
};

// ── 8. BreadcrumbList ─────────────────────────────────────────────────────────
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
      "name": "Sri Lanka Administrative Division Finder",
      "item": "https://utils.lk/admin-divisions",
    },
  ],
};

// ─── OG Image ─────────────────────────────────────────────────────────────────
// Was missing entirely in the original — added now
const ogImage = generateOgImageUrl({
  title: 'Sri Lanka Administrative Division Finder',
  description: 'Find GN Division, DS Office, District & Province for any Sri Lankan village',
  icon: '🗺️',
  category: 'Government',
});

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  metadataBase: new URL("https://utils.lk"),

  title: "Sri Lanka GN Division Finder | Grama Niladhari, DS Office, District & Province",
  description:
    "Find the complete administrative hierarchy for any village in Sri Lanka — Grama Niladhari (GN) Division, Divisional Secretariat (DS) office, District, and Province. Free search across 20,000+ villages and GN divisions.",

  keywords: [
    "grama niladhari division finder",
    "find my gn division sri lanka",
    "divisional secretariat finder sri lanka",
    "ds office finder sri lanka",
    "sri lanka administrative divisions",
    "grama niladhari officer",
    "pradeshiya lekam karyalaya",
    "sri lanka gn division search",
    "village to district finder sri lanka",
    "sri lanka province district finder",
    "grama sevaka division finder",
    "find grama niladhari sri lanka",
    "administrative hierarchy sri lanka",
    "sri lanka 25 districts",
    "sri lanka 9 provinces",
  ],

  openGraph: {
    title: "Sri Lanka GN Division Finder | Grama Niladhari & DS Office Search",
    description:
      "Find the Grama Niladhari (GN) Division, Divisional Secretariat (DS) office, District, and Province for any village in Sri Lanka. Free search across 20,000+ locations.",
    url: "https://utils.lk/admin-divisions",
    siteName: "utils.lk",
    locale: "en_LK",
    type: "website",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Sri Lanka Administrative Division Finder — Grama Niladhari, DS Office, District & Province",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Sri Lanka GN Division Finder | utils.lk",
    description:
      "Find Grama Niladhari Division, Divisional Secretariat, District & Province for any Sri Lankan village. Free, 20,000+ locations.",
    images: [ogImage],
  },

  alternates: {
    canonical: "https://utils.lk/admin-divisions",
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

export default function AdminDivisionsLayout({
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(governmentServiceSchema) }}
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(provincesItemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(districtsItemListSchema) }}
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