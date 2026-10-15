import type { MetadataRoute } from 'next';

const BASE = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'https://pilive-pilates-gangnam-ilwon.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: '*', allow: '/', disallow: '/admin' }], sitemap: `${BASE}/sitemap.xml` };
}
