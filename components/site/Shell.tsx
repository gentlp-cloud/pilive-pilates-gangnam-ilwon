import Link from 'next/link';
import type { ReactNode } from 'react';
import type { BrandContent } from '@/lib/brand';
import Header, { type NavItem } from './Header';
import { BookingButton, Logo } from './ui';

/** 상단 메뉴 · 하단 고정 예약 버튼 · 푸터를 두 페이지(/ , /private)가 함께 씁니다. */
export function navItems(onHome: boolean): NavItem[] {
  const h = (id: string) => (onHome ? `#${id}` : `/#${id}`);
  return [
    { label: 'PILIVE 소개', href: h('about') },
    { label: '필라이브의 특별함', href: h('why') },
    { label: '개인레슨', href: '/private' },
    { label: '바디케어', href: h('bodycare') },
    { label: '시간표', href: h('schedule') },
    { label: '강사진', href: h('instructors') },
    { label: '상담예약', href: h('contact') },
  ];
}

function telHref(phone: string) {
  return `tel:${phone.replace(/[^0-9]/g, '')}`;
}

export default function Shell({
  c,
  onHome,
  stickyLabel,
  children,
}: {
  c: BrandContent;
  onHome: boolean;
  stickyLabel?: string;
  children: ReactNode;
}) {
  const loc = c.location;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ExerciseGym',
    name: loc.name,
    alternateName: 'PILIVE PILATES',
    address: {
      '@type': 'PostalAddress',
      streetAddress: loc.address.replace(/^서울\s*강남구\s*/, ''),
      addressLocality: '강남구',
      addressRegion: '서울특별시',
      addressCountry: 'KR',
    },
    telephone: loc.phone,
    slogan: c.hero.slogan,
  };

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:rounded focus:bg-green focus:px-4 focus:py-2 focus:text-cream"
      >
        본문 바로가기
      </a>
      <Header nav={navItems(onHome)} bookingUrl={c.booking.url} bookingLabel={c.booking.headerLabel} />

      <main id="main">{children}</main>

      <footer className="bg-green-deep pb-[calc(96px+env(safe-area-inset-bottom))] text-cream/75 md:pb-0">
        <div className="wrap grid gap-10 py-14 md:grid-cols-[1.2fr_1fr_auto] md:py-16">
          <div className="grid content-start gap-4">
            <Logo light />
            <p className="font-latin text-[13px] tracking-[0.26em] text-gold-light">{c.hero.slogan}</p>
            <p className="max-w-[30em] text-[13px] leading-relaxed text-cream/55">{c.footerNote}</p>
          </div>
          <address className="grid content-start gap-2 text-[14px] not-italic">
            <p className="font-display text-[17px] text-cream">{loc.name}</p>
            <p>{loc.address}</p>
            {loc.detail ? <p>{loc.detail}</p> : null}
            {loc.phone ? (
              <a href={telHref(loc.phone)} className="underline-offset-4 hover:underline">
                전화 문의 {loc.phone}
              </a>
            ) : null}
          </address>
          <nav aria-label="바로가기" className="grid content-start gap-2 text-[14px]">
            <Link href="/private" className="hover:text-cream">
              1:1 개인레슨
            </Link>
            {c.bodycare.link ? (
              <Link href={c.bodycare.link} className="hover:text-cream">
                PILIVE BODY CARE SYSTEM
              </Link>
            ) : null}
            <a href={onHome ? '#schedule' : '/#schedule'} className="hover:text-cream">
              그룹레슨 시간표
            </a>
          </nav>
        </div>
        <div className="wrap border-t border-cream/10 py-6 text-[12px] text-cream/45">© PILIVE PILATES. All rights reserved.</div>
      </footer>

      {/* 모바일 하단 고정 상담예약 버튼 */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-cream/95 px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden">
        <BookingButton
          url={c.booking.url}
          label={stickyLabel ?? c.booking.stickyLabel}
          variant="green"
          className="w-full"
          phone={loc.phone}
        />
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
    </>
  );
}
