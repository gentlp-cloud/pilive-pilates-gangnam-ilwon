import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import { bookingReady } from '@/lib/brand';
import { Rich } from '@/components/Rich';

/** 사진: 사이트 안 사진과 관리자에서 올린 사진 모두 최적화해서 보여줍니다. */
export function Pic({
  src,
  alt,
  sizes = '100vw',
  priority,
  className = '',
  style,
}: {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  if (!src) {
    return (
      <div
        role="img"
        aria-label={alt || '사진 준비 중'}
        className={`absolute inset-0 grid place-items-center bg-linear-to-br from-sand to-gold-light ${className}`}
      >
        <span className="font-latin text-xl tracking-[0.4em] text-green/30">PILIVE</span>
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={src.endsWith('.svg')}
      className={`object-cover ${className}`}
      style={style}
    />
  );
}

/** 제목: 엔터는 줄바꿈, *단어*는 금색 강조 */
export function Title({ text, className = '' }: { text: string; className?: string }) {
  return (
    <span className={`rich ${className}`}>
      <Rich text={text} />
    </span>
  );
}

export function SectionHead({
  eyebrow,
  title,
  body,
  center,
  dark,
  id,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  center?: boolean;
  dark?: boolean;
  id?: string;
}) {
  return (
    <div className={`grid gap-5 ${center ? 'justify-items-center text-center' : ''}`}>
      {eyebrow ? <p className={`eyebrow ${center ? 'center' : ''} ${dark ? 'text-gold-light!' : ''}`}>{eyebrow}</p> : null}
      <h2
        id={id}
        className={`text-[clamp(27px,7vw,44px)] leading-[1.34] font-normal ${dark ? 'text-cream on-dark' : 'text-green'}`}
      >
        <Title text={title} />
      </h2>
      {center ? <GoldWave /> : null}
      {body ? (
        <p className={`max-w-[34em] text-[15.5px] leading-[1.9] ${dark ? 'text-cream/80' : 'text-muted'}`}>
          <Rich text={body} />
        </p>
      ) : null}
    </div>
  );
}

export function GoldWave({ className = '' }: { className?: string }) {
  return (
    <svg className={`gold-wave ${className}`} viewBox="0 0 120 14" fill="none" aria-hidden="true">
      <path d="M1 9.5C22 2 40 2 60 7s38 5.5 59-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ light, className = '' }: { light?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-[3px] leading-none ${className}`} aria-label="PILIVE PILATES">
      <span
        className={`px-[5px] py-[3px] font-latin text-[15px] font-semibold tracking-[0.18em] ${
          light ? 'bg-cream text-green' : 'bg-green text-cream'
        }`}
      >
        PILIVE
      </span>
      <span className={`font-latin text-[15px] font-semibold tracking-[0.18em] ${light ? 'text-cream' : 'text-green'}`}>
        PILATES
      </span>
    </span>
  );
}

type Variant = 'green' | 'gold' | 'light' | 'outline' | 'outline-light';

const VARIANT: Record<Variant, string> = {
  green: 'bg-green text-cream hover:bg-green-deep',
  gold: 'bg-gold text-white hover:bg-[#967748]',
  light: 'bg-cream text-green hover:bg-white',
  outline: 'border border-green/40 text-green hover:bg-green hover:text-cream',
  'outline-light': 'border border-cream/60 text-cream hover:bg-cream hover:text-green',
};

export function btnClass(variant: Variant = 'green', extra = '') {
  return `inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full px-7 py-3 text-center text-[15px] leading-snug font-medium transition-colors duration-300 ${VARIANT[variant]} ${extra}`;
}

export function LinkButton({
  href,
  children,
  variant = 'outline',
  className = '',
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  const external = /^https?:\/\//.test(href);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={btnClass(variant, className)}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={btnClass(variant, className)}>
      {children}
    </Link>
  );
}

export function Arrow() {
  return (
    <span aria-hidden="true" className="font-latin text-lg leading-none">
      →
    </span>
  );
}

/**
 * 네이버 상담예약 버튼.
 * 예약 주소가 비어 있거나 잘못되면 다른 곳으로 보내지 않고 '예약 링크 준비 중'으로 표시합니다.
 */
export function BookingButton({
  url,
  label,
  variant = 'green',
  className = '',
  phone,
}: {
  url: string;
  label: string;
  variant?: Variant;
  className?: string;
  phone?: string;
}) {
  if (!bookingReady(url)) {
    return (
      <span className={`${className.includes('w-full') ? 'grid w-full' : 'inline-grid'} justify-items-center gap-1`}>
        <span
          aria-disabled="true"
          title="관리자 페이지에서 네이버 예약 주소를 입력하면 버튼이 활성화됩니다."
          className={`${btnClass(variant, className)} cursor-not-allowed opacity-60`}
        >
          예약 링크 준비 중
        </span>
        {phone ? (
          <a href={`tel:${phone.replace(/[^0-9]/g, '')}`} className="text-[13px] underline underline-offset-4 opacity-80">
            전화 상담 {phone}
          </a>
        ) : null}
      </span>
    );
  }
  return (
    <a
      href={url.trim()}
      target="_blank"
      rel="noopener noreferrer"
      className={btnClass(variant, className)}
      aria-label={`${label} (네이버 예약, 새 창)`}
    >
      {label} <Arrow />
    </a>
  );
}
