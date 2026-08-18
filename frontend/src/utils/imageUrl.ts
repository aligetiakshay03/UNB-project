/**
 * Helper to resolve backend media URLs and handle fallbacks for placeholder or missing images.
 */
const BACKEND_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');

export function resolveImageUrl(
  url?: string | null,
  fallback = '/images/unb-reference/home-about.jpg'
): string {
  if (!url || typeof url !== 'string' || url.includes('PLACEHOLDER') || url.includes('placeholder')) {
    return fallback;
  }
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  if (url.startsWith('/uploads/')) {
    return `${BACKEND_BASE}${url}`;
  }
  if (url.startsWith('/')) {
    return url;
  }
  return `${BACKEND_BASE}/uploads/${url}`;
}
