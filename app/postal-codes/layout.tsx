import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sri Lanka Postal Code Finder | Find Postal Codes by City & Area",
  description: "Find postal codes for all cities and areas in Sri Lanka. Free, fast, and accurate postal code search with 20,000+ locations. Search by city name instantly.",
  keywords: ["sri lanka postal code", "postal code finder", "sri lanka post code", "colombo postal code", "kandy postal code", "galle postal code", "sri lanka zip code"],
  openGraph: {
    title: "Sri Lanka Postal Code Finder",
    description: "Find postal codes for all cities and areas in Sri Lanka instantly. Free online tool with 20,000+ locations.",
    url: "https://utils.lk/postal-codes",
    siteName: "utils.lk",
    locale: "en_LK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sri Lanka Postal Code Finder",
    description: "Find postal codes for all cities and areas in Sri Lanka",
  },
  alternates: {
    canonical: "https://utils.lk/postal-codes",
  },
};

export default function PostalCodesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}