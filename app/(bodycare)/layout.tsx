import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { getContent } from '@/lib/store';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent();
  return {
    title: c.seo.title,
    description: c.seo.description,
    openGraph: {
      title: c.seo.title,
      description: c.seo.description,
      type: 'website',
      locale: 'ko_KR',
      images: c.hero.image ? [c.hero.image] : undefined,
    },
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#F7F3EC',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Hahmlet:wght@300;400;500&family=Noto+Sans+KR:wght@300;400;500;600&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
