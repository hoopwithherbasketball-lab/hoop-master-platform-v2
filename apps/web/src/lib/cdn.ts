export function getCdnUrl(bucket: string, path: string): string {
  // If a CDN URL is configured, use it. Otherwise, default to the CDN domain.
  // @ts-ignore - Vite env types might not be loaded in tsconfig
  const cdnBase = import.meta.env?.VITE_CDN_URL || 'https://cdn.hoopwithher.com'
  
  // The format should match how CloudFront is connected to the origin.
  // Assuming CloudFront is set up to route requests to Supabase storage buckets directly.
  return `${cdnBase}/storage/v1/object/public/${bucket}/${path}`
}
