import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { getBrandContent } from '@/lib/store';
import './site.css';

export async function generateMetadata(): Promise<Metadata> {
  const c = await getBrandContent();
  return {
    metadataBase: new URL(
      process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : 'https://pilive-pilates-gangnam-ilwon.vercel.app',
    ),
    title: c.seo.title,
    description: c.seo.description,
    openGraph: {
      title: c.seo.title,
      description: c.seo.description,
      type: 'website',
      locale: 'ko_KR',
      siteName: 'PILIVE PILATES 필라이브필라테스',
      images: c.seo.ogImage ? [{ url: c.seo.ogImage, width: 1200, height: 630 }] : undefined,
    },
    twitter: { card: 'summary_large_image', title: c.seo.title, description: c.seo.description },
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#FCFAF5',
};

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Hahmlet:wght@300;400;500;600&family=Noto+Sans+KR:wght@300;400;500;600&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
