import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "School Census Number Finder Sri Lanka | Find School Census Numbers",
  description: "Find school census numbers for 8,000+ schools in Sri Lanka. Search by school name or address. Official school census numbers from the Ministry of Education.",
  keywords: ["school census number sri lanka", "school census finder", "sri lanka school census", "ministry of education school census", "school registration number", "school code sri lanka"],
  openGraph: {
    title: "Sri Lanka School Census Number Finder",
    description: "Find school census numbers for 8,000+ schools in Sri Lanka instantly",
    url: "https://utils.lk/school-census-finder",
    siteName: "utils.lk",
    locale: "en_LK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sri Lanka School Census Number Finder",
    description: "Find school census numbers for any school in Sri Lanka",
  },
  alternates: {
    canonical: "https://utils.lk/school-census-finder",
  },
};

export default function SchoolCensusFinderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}