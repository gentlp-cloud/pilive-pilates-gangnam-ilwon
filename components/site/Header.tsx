'use client';

import Link from 'next/link';
import { useEffect, useState, type ReactNode } from 'react';
import { bookingReady } from '@/lib/brand';
import { Logo } from './ui';

export type NavItem = { label: string; href: string };

// 같은 페이지 안(#섹션)은 일반 링크로 부드럽게 스크롤, 다른 페이지는 Next.js 이동
function NavLink({ href, className, onClick, children }: { href: string; className: string; onClick?: () => void; children: ReactNode }) {
  if (href.startsWith('#')) {
    return (
      <a href={href} className={className} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

/**
 * 상단 메뉴. 같은 페이지의 섹션은 부드럽게 스크롤하고(#링크),
 * 개인레슨처럼 독립된 페이지는 정상적으로 이동합니다.
 */
export default function Header({ nav, bookingUrl, bookingLabel }: { nav: NavItem[]; bookingUrl: string; bookingLabel: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const ready = bookingReady(bookingUrl);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-[background-color,border-color,box-shadow] duration-300 ${
        scrolled || open ? 'border-b border-line bg-cream/95 backdrop-blur-md' : 'border-b border-transparent bg-cream/80 backdrop-blur-sm'
      }`}
    >
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="필라이브필라테스 홈" onClick={() => setOpen(false)} className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="주요 메뉴" className="hidden items-center gap-7 text-[14px] text-muted lg:flex">
          {nav.map((n) => (
            <NavLink key={n.href} href={n.href} className="transition-colors hover:text-green">
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {ready ? (
            <a
              href={bookingUrl.trim()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center rounded-full bg-green px-4 text-[13px] font-medium text-cream transition-colors hover:bg-green-deep"
            >
              {bookingLabel}
            </a>
          ) : (
            <span className="inline-flex h-10 items-center rounded-full bg-green/50 px-4 text-[13px] text-cream" aria-disabled="true">
              예약 준비 중
            </span>
          )}
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full text-green lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-3.5 w-6" aria-hidden="true">
              <span
                className={`absolute left-0 h-px w-6 bg-current transition-transform duration-300 ${open ? 'top-1.5 rotate-45' : 'top-0'}`}
              />
              <span className={`absolute top-1.5 left-0 h-px w-6 bg-current transition-opacity ${open ? 'opacity-0' : ''}`} />
              <span
                className={`absolute left-0 h-px w-6 bg-current transition-transform duration-300 ${open ? 'top-1.5 -rotate-45' : 'top-3'}`}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        hidden={!open}
        className="h-[calc(100dvh-4rem-env(safe-area-inset-top))] overflow-y-auto border-t border-line bg-cream lg:hidden"
      >
        <nav aria-label="모바일 메뉴" className="wrap grid py-4">
          {nav.map((n, i) => (
            <NavLink
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="flex items-baseline gap-4 border-b border-line py-5 font-display text-[21px] text-green"
            >
              <span className="font-latin text-sm text-gold tabular-nums">{String(i + 1).padStart(2, '0')}</span>
              {n.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
