import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find Grama Niladhari Division & DS Office by Village | Sri Lanka Administrative Finder",
  description: "Find your Grama Niladhari Division, Divisional Secretariat, District, and Province by village name. Complete administrative hierarchy for 20,000+ Sri Lankan villages.",
  keywords: ["grama niladhari division", "sri lanka GN division", "divisional secretariat", "DS office finder", "sri lanka administrative divisions", "pradeshiya lekam", "find my gn division"],
  openGraph: {
    title: "Sri Lanka Administrative Division Finder",
    description: "Find GN division, DS office, district and province for any Sri Lankan village",
    url: "https://utils.lk/admin-divisions",
    siteName: "utils.lk",
    locale: "en_LK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sri Lanka Administrative Division Finder",
    description: "Find your administrative divisions instantly",
  },
  alternates: {
    canonical: "https://utils.lk/admin-divisions",
  },
};

export default function AdminDivisionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}