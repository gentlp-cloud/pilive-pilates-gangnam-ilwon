import type { MetadataRoute } from 'next';

const BASE = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'https://pilive-pilates-gangnam-ilwon.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/private`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/bodycare`, changeFrequency: 'monthly', priority: 0.7 },
  ];
}
