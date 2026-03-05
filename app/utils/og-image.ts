/**
 * Generate Open Graph image URL for social media previews
 * 
 * @param title - Main title (e.g., "Postal Code Finder")
 * @param description - Short description (e.g., "Find postal codes for Sri Lankan cities")
 * @param icon - Emoji icon (e.g., "📮")
 * @param category - Category badge (e.g., "Location")
 * @returns Full URL to the dynamically generated OG image
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
  const baseUrl = 'https://utils.lk';
  const params = new URLSearchParams();

  params.set('title', title);
  params.set('description', description);
  if (icon) params.set('icon', icon);
  if (category) params.set('category', category);

  return `${baseUrl}/api/og?${params.toString()}`;
}