import type { Metadata } from "next";
import { Oswald, JetBrains_Mono } from "next/font/google";
import { generateOgImageUrl } from '@/utils/og-image';
import rawListings from '@/data/mazda-listings.json';

type Category = 'Spare Parts' | 'Workshop' | 'Modifications';

interface Listing {
  id: string;
  name: string;
  categories: Category[];
  location: string;
  description: string;
  mapsUrl?: string;
  phone?: string;
  logoUrl?: string;
  website?: string;
  facebookUrl?: string;
}

// Raw JSON shape is looser than Listing — some entries may still use the
// older singular `category` field. Normalizing here means the schema
// generation below won't break (or fail to type-check) if the data file
// has a mix of old and new shapes.
type RawListing = {
  id: string;
  name: string;
  category?: string;
  categories?: string[];
  location: string;
  description: string;
  mapsUrl?: string;
  phone?: string;
  logoUrl?: string;
  website?: string;
  facebookUrl?: string;
};

function normalizeListing(raw: RawListing): Listing {
  const categories = (raw.categories ?? (raw.category ? [raw.category] : [])) as Category[];
  return {
    id: raw.id,
    name: raw.name,
    categories,
    location: raw.location,
    description: raw.description,
    mapsUrl: raw.mapsUrl,
    phone: raw.phone,
    logoUrl: raw.logoUrl,
    website: raw.website,
    facebookUrl: raw.facebookUrl,
  };
}

const listings: Listing[] = (rawListings as RawListing[]).map(normalizeListing);

// ─── Fonts ─────────────────────────────────────────────────────────────────
//
// Oswald: condensed industrial display face — reads like stenciled signage
// on a workshop wall or a parts-catalog cover, not a generic sans headline.
// JetBrains Mono: for entry numbers / category tags, echoing stamped part
// codes and job-docket references.

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
});

// ─── Structured Data ──────────────────────────────────────────────────────────
//
// The page component is 'use client', so ALL JSON-LD must live here in the
// server-rendered layout to guarantee Googlebot sees it in the initial HTML.
//
// Schemas used:
//  1. WebApplication  — free directory tool declaration
//  2. ItemList        — the 20 listings, each pointing at a LocalBusiness
//  3. FAQPage         — common questions about Mazda parts/service in Sri Lanka
//  4. BreadcrumbList   — shows utils.lk > Mazda Directory in snippet URLs
//
// NOTE: ItemList below is generated directly from /data/mazda-listings.json,
// so once the placeholder listings are replaced with real shops, the
// structured data updates automatically — no need to touch this file again.

const siteUrl = "https://utils.lk/mazda-directory";

const webApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Mazda Parts & Service Directory — Sri Lanka",
  "url": siteUrl,
  "description":
    "Directory of Mazda spare parts shops and service workshops across Sri Lanka. Browse by category, find locations, and get directions.",
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
    "Browse Mazda spare parts shops and workshops island-wide",
    "Filter by category — Spare Parts, Workshop, or Modifications",
    "Search by shop name or location",
    "Direct Google Maps links for directions",
    "Community-submitted shop suggestions",
  ],
};

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Mazda Parts & Service Listings — Sri Lanka",
  "description": "Spare parts shops and service workshops for Mazda vehicles across Sri Lanka",
  "url": siteUrl,
  "numberOfItems": listings.length,
  "itemListElement": listings.map((listing, i) => ({
    "@type": "ListItem",
    "position": i + 1,
    "item": {
      // Shops offering hands-on work (Workshop or Modifications) are tagged
      // AutoRepair (the broader schema.org type); pure parts sellers get
      // AutoPartsStore.
      "@type":
        listing.categories.includes("Workshop") || listing.categories.includes("Modifications")
          ? "AutoRepair"
          : "AutoPartsStore",
      "name": listing.name,
      "description": listing.description,
      "address": listing.location,
      ...(listing.mapsUrl ? { "hasMap": listing.mapsUrl } : {}),
      ...(listing.phone ? { "telephone": listing.phone } : {}),
      ...(listing.logoUrl ? { "logo": listing.logoUrl, "image": listing.logoUrl } : {}),
      ...(listing.website ? { "url": listing.website } : {}),
      ...(listing.facebookUrl ? { "sameAs": [listing.facebookUrl] } : {}),
    },
  })),
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Where can I find Mazda spare parts in Sri Lanka?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "This directory lists Mazda spare parts shops across Sri Lanka, including specialists for specific models like the Demio and Axela, general Japanese-vehicle parts stockists, and import specialists for body kits and rare components.",
      },
    },
    {
      "@type": "Question",
      "name": "How do I find a workshop that services Mazda cars near me?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Filter this directory by the Workshop category to see service centers and repair shops that work on Mazda vehicles, then use the Google Maps link on each listing to get directions.",
      },
    },
    {
      "@type": "Question",
      "name": "Where can I find Mazda body kits or styling shops in Sri Lanka?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Filter this directory by the Modifications category to see shops specializing in body kits, aero styling, custom exhaust fabrication, and other performance or cosmetic work for Mazda vehicles.",
      },
    },
    {
      "@type": "Question",
      "name": "Can I suggest a shop to add to this directory?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes — use the Suggest a Shop form linked at the bottom of the directory to submit a spare parts shop or workshop for review.",
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
      "name": "Mazda Parts & Service Directory",
      "item": siteUrl,
    },
  ],
};

// ─── OG Image ─────────────────────────────────────────────────────────────────

const ogImage = generateOgImageUrl({
  title: 'Mazda Parts & Service Directory',
  description: 'Spare parts shops and workshops for Mazda cars in Sri Lanka',
  icon: '🔧',
  category: 'Automotive',
});

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  metadataBase: new URL("https://utils.lk"),

  title: "Mazda Parts & Service Directory | Spare Parts Shops & Workshops in Sri Lanka",
  description:
    "Find Mazda spare parts shops and service workshops across Sri Lanka. Browse by category, see locations, and get directions. Community-maintained and free to use.",

  keywords: [
    "mazda spare parts sri lanka",
    "mazda workshop sri lanka",
    "mazda service center sri lanka",
    "mazda demio parts sri lanka",
    "mazda body kit sri lanka",
    "mazda modifications sri lanka",
    "mazda 3 parts sri lanka",
    "mazda mechanic sri lanka",
    "mazda parts shop colombo",
    "mazda repair sri lanka",
  ],

  openGraph: {
    title: "Mazda Parts & Service Directory | utils.lk",
    description:
      "Spare parts shops and service workshops for Mazda cars across Sri Lanka — browse by category and get directions.",
    url: siteUrl,
    siteName: "utils.lk",
    locale: "en_LK",
    type: "website",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Mazda Parts & Service Directory — utils.lk",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Mazda Parts & Service Directory | utils.lk",
    description:
      "Spare parts shops and service workshops for Mazda cars across Sri Lanka.",
    images: [ogImage],
  },

  alternates: {
    canonical: siteUrl,
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

export default function MazdaDirectoryLayout({
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
      <div className={`${oswald.variable} ${jetbrainsMono.variable}`}>
        {children}
      </div>
    </>
  );
}