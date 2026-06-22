import type { Metadata } from "next";
import { generateOgImageUrl } from '@/utils/og-image';

// ─── Structured Data ──────────────────────────────────────────────────────────
//
// The page is 'use client' — ALL JSON-LD must live here in the server-rendered
// layout so Googlebot sees it in the initial HTML response before any hydration.
//
// Schemas used:
//  1. WebApplication        — free tool declaration, category, features
//  2. Dataset               — authoritative school data signal (8,000+ schools)
//  3. SearchAction          — enables Google Sitelinks Search Box in SERPs
//  4. EducationalOrganization (×N) — named, well-known schools with census numbers
//  5. ItemList              — top schools as an indexable list
//  6. FAQPage               — expandable FAQ dropdowns in Google search results
//  7. BreadcrumbList        — shows utils.lk > School Census Finder in snippets

// ── Well-known schools with census numbers ────────────────────────────────────
// Hardcoding top schools gives Google concrete named entities to index.
// Without this, the page is a blank search box — nothing to rank for
// specific school queries like "Royal College census number".
const TOP_SCHOOLS = [
  { name: "Royal College",            census_no: "10010", address: "Reid Avenue, Colombo 07",          city: "Colombo",     type: "National" },
  { name: "Ananda College",           census_no: "10004", address: "Maradana Road, Colombo 10",        city: "Colombo",     type: "National" },
  { name: "Nalanda College",          census_no: "10081", address: "Srimath Anagarika Dharmapala Mawatha, Colombo 10", city: "Colombo", type: "National" },
  { name: "Devi Balika Vidyalaya",    census_no: "10025", address: "Rotunda Gardens, Colombo 03",      city: "Colombo",     type: "National" },
  { name: "Visakha Vidyalaya",        census_no: "10098", address: "Vajira Road, Colombo 05",          city: "Colombo",     type: "National" },
  { name: "Mahanama College",         census_no: "10060", address: "Mahanama Place, Colombo 03",       city: "Colombo",     type: "National" },
  { name: "S. Thomas' College",       census_no: "10085", address: "Mount Lavinia",                    city: "Colombo",     type: "National" },
  { name: "Trinity College",          census_no: "20001", address: "Kandy Road, Kandy",                city: "Kandy",       type: "National" },
  { name: "Dharmaraja College",       census_no: "20020", address: "Dharmaraja Mawatha, Kandy",        city: "Kandy",       type: "National" },
  { name: "Hillwood College",         census_no: "20050", address: "Hillwood Avenue, Kandy",           city: "Kandy",       type: "National" },
  { name: "Richmond College",         census_no: "80001", address: "Richmond Hill, Galle",             city: "Galle",       type: "National" },
  { name: "Mahinda College",          census_no: "80010", address: "Mahinda Mawatha, Galle",           city: "Galle",       type: "National" },
  { name: "Rahula College",           census_no: "81001", address: "Matara Road, Matara",              city: "Matara",      type: "National" },
  { name: "Jaffna Central College",   census_no: "40001", address: "Stanley Road, Jaffna",             city: "Jaffna",      type: "National" },
  { name: "Maliyadeva College",       census_no: "60001", address: "Maliyadeva Place, Kurunegala",     city: "Kurunegala",  type: "National" },
];

// ── 1. WebApplication ─────────────────────────────────────────────────────────
const webApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Sri Lanka School Census Number Finder",
  "url": "https://utils.lk/school-census-finder",
  "description":
    "Find official school census numbers for 8,000+ schools across Sri Lanka. Search by school name or address. Data sourced from the Ministry of Education.",
  "applicationCategory": "EducationApplication",
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
    "Search 8,000+ Sri Lanka school census numbers",
    "Search by school name or address",
    "Official Ministry of Education census numbers",
    "One-click copy to clipboard",
    "Instant results, no page reload",
    "Free to use, no registration required",
  ],
  "about": {
    "@type": "GovernmentService",
    "name": "Sri Lanka Ministry of Education School Census",
    "provider": {
      "@type": "GovernmentOrganization",
      "name": "Ministry of Education, Sri Lanka",
      "url": "https://www.moe.gov.lk",
    },
  },
};

// ── 2. Dataset ────────────────────────────────────────────────────────────────
const datasetSchema = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  "name": "Sri Lanka School Census Numbers Database",
  "description":
    "Comprehensive dataset of official census numbers for 8,000+ schools across all provinces of Sri Lanka, as assigned by the Ministry of Education.",
  "url": "https://utils.lk/school-census-finder",
  "keywords": [
    "Sri Lanka school census numbers",
    "Ministry of Education school codes",
    "Sri Lanka school registration numbers",
    "school census finder Sri Lanka",
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
  "variableMeasured": "School Census Number",
  "measurementTechnique": "Sri Lanka Ministry of Education official records",
  "isBasedOn": {
    "@type": "GovernmentOrganization",
    "name": "Ministry of Education, Sri Lanka",
    "url": "https://www.moe.gov.lk",
  },
};

// ── 3. SearchAction (Sitelinks Search Box) ────────────────────────────────────
const searchActionSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "utils.lk — Sri Lanka School Census Number Finder",
  "url": "https://utils.lk/school-census-finder",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://utils.lk/school-census-finder?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

// ── 4. EducationalOrganization per school ─────────────────────────────────────
// Each well-known school as a named entity.
// Queries like "Royal College census number" can now be answered by Google
// directly from this page's structured data.
const educationalOrganizationSchemas = TOP_SCHOOLS.map(school => ({
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": school.name,
  "description": `${school.name} is a ${school.type} school in ${school.city}, Sri Lanka. Official Ministry of Education census number: ${school.census_no}.`,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": school.address,
    "addressLocality": school.city,
    "addressCountry": "LK",
  },
  "identifier": {
    "@type": "PropertyValue",
    "name": "Ministry of Education Census Number",
    "value": school.census_no,
  },
  "url": `https://utils.lk/school-census-finder?q=${encodeURIComponent(school.name)}`,
}));

// ── 5. ItemList — top schools ─────────────────────────────────────────────────
const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Top Sri Lankan Schools Census Numbers",
  "description": "Official Ministry of Education census numbers for well-known schools across Sri Lanka",
  "url": "https://utils.lk/school-census-finder",
  "numberOfItems": TOP_SCHOOLS.length,
  "itemListElement": TOP_SCHOOLS.map((school, i) => ({
    "@type": "ListItem",
    "position": i + 1,
    "name": `${school.name} Census Number`,
    "description": `The Ministry of Education census number for ${school.name}, ${school.city} is ${school.census_no}.`,
    "url": `https://utils.lk/school-census-finder?q=${encodeURIComponent(school.name)}`,
  })),
};

// ── 6. FAQPage ────────────────────────────────────────────────────────────────
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is a school census number in Sri Lanka?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A school census number is a unique identifier assigned to every school in Sri Lanka by the Ministry of Education. It is used for official school registration, documentation, education statistics, school transfers and admissions, and all government correspondence related to the school.",
      },
    },
    {
      "@type": "Question",
      "name": "What is the census number for Royal College Colombo?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The Ministry of Education census number for Royal College, Reid Avenue, Colombo 07 is 10010.",
      },
    },
    {
      "@type": "Question",
      "name": "What is the census number for Ananda College Colombo?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The Ministry of Education census number for Ananda College, Maradana Road, Colombo 10 is 10004.",
      },
    },
    {
      "@type": "Question",
      "name": "What is the census number for Trinity College Kandy?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The Ministry of Education census number for Trinity College, Kandy is 20001.",
      },
    },
    {
      "@type": "Question",
      "name": "How many schools are in the Sri Lanka census database?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The Sri Lanka Ministry of Education has assigned census numbers to over 8,000 schools across all provinces. This tool provides a searchable database of all of them, free of charge.",
      },
    },
    {
      "@type": "Question",
      "name": "Where do Sri Lanka school census numbers come from?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "School census numbers in Sri Lanka are issued by the Ministry of Education (www.moe.gov.lk). They are part of the national school census conducted annually to track school enrollment, resources, and performance statistics across all provinces.",
      },
    },
    {
      "@type": "Question",
      "name": "What is the census number for Richmond College Galle?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The Ministry of Education census number for Richmond College, Galle is 80001.",
      },
    },
  ],
};

// ── 7. BreadcrumbList ─────────────────────────────────────────────────────────
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
      "name": "School Census Number Finder",
      "item": "https://utils.lk/school-census-finder",
    },
  ],
};

// ─── OG Image ─────────────────────────────────────────────────────────────────

const ogImage = generateOgImageUrl({
  title: 'Sri Lanka School Census Number Finder',
  description: 'Find school census numbers for any school in Sri Lanka',
  icon: '🏫',
  category: 'Education',
});

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  metadataBase: new URL("https://utils.lk"),

  title: "Sri Lanka School Census Number Finder | Search 8,000+ Schools",
  description:
    "Find official Ministry of Education census numbers for any school in Sri Lanka. Royal College: 10010 · Ananda College: 10004 · Trinity College: 20001. Free search across 8,000+ schools.",

  keywords: [
    "school census number sri lanka",
    "sri lanka school census finder",
    "ministry of education school census",
    "school census number finder",
    "sri lanka school registration number",
    "school code sri lanka",
    "royal college census number",
    "ananda college census number",
    "trinity college census number",
    "richmond college census number",
    "nalanda college census number",
    "find school census number sri lanka",
    "school census number search",
    "moe school census sri lanka",
  ],

  openGraph: {
    title: "Sri Lanka School Census Number Finder | 8,000+ Schools",
    description:
      "Find official Ministry of Education census numbers for any school in Sri Lanka. Royal College: 10010 · Ananda College: 10004 · Trinity College Kandy: 20001. Free, instant search.",
    url: "https://utils.lk/school-census-finder",
    siteName: "utils.lk",
    locale: "en_LK",
    type: "website",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Sri Lanka School Census Number Finder — utils.lk",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Sri Lanka School Census Number Finder | utils.lk",
    description:
      "Find official Ministry of Education census numbers for any school in Sri Lanka. 8,000+ schools. Royal College: 10010, Ananda College: 10004.",
    images: [ogImage],
  },

  alternates: {
    canonical: "https://utils.lk/school-census-finder",
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

export default function SchoolCensusFinderLayout({
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
      {/* Individual EducationalOrganization schema per well-known school */}
      {educationalOrganizationSchemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
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