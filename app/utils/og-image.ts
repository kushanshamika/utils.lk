/**
 * Generate Open Graph image URL for social media previews
 * 
 * @param title - Main title (e.g., "Postal Code Finder")
 * @param description - Short description (e.g., "Find postal codes for Sri Lankan cities")
 * @param icon - Emoji icon (e.g., "📮")
 * @param category - Category badge (e.g., "Location")
 * @returns Full absolute URL to the dynamically generated OG image
 */
export function generateOgImageUrl({
  title,
  description,
  icon,
  category,
}: {
  title: string;
  description: string;
  icon?: string;
  category?: string;
}): string {
  const params = new URLSearchParams();

  params.set('title', title);
  params.set('description', description);
  if (icon) params.set('icon', icon);
  if (category) params.set('category', category);

  // Get base URL from Vercel environment variables
  // VERCEL_URL is automatically set by Vercel
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
                  'http://localhost:3000';

  return `${baseUrl}/api/og?${params.toString()}`;
}