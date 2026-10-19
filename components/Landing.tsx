import type { ReactNode } from 'react';
import type { SiteContent } from '@/lib/content';
import { Rich } from './Rich';
import Interactions from './Interactions';
import BodyCare from './BodyCare';

function Logo({ url }: { url: string }) {
  return (
    <a className="logo" href="#home" aria-label="필라이브필라테스 홈">
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="PILIVE PILATES" />
      ) : (
        <>
          <b>PILIVE</b>
          <span>PILATES</span>
        </>
      )}
    </a>
  );
}

// 예약 버튼: 관리자 페이지에 입력한 네이버 예약 링크로 바로 이동합니다.
function BookButton({ url, label, variant = 'dark', arrow = true }: { url: string; label: string; variant?: 'dark' | 'line'; arrow?: boolean }) {
  const cls = `btn btn-${variant}`;
  if (!/^https:\/\//.test(url)) {
    return (
      <span className={cls} aria-disabled="true">
        예약 링크 준비 중
      </span>
    );
  }
  return (
    <a className={cls} href={url} target="_blank" rel="noopener noreferrer">
      {label} {arrow ? <span className="arr">→</span> : null}
    </a>
  );
}

const NAV: { href: string; label: string }[] = [
  { href: '#assessment', label: '체형분석' },
  { href: '#analysis', label: '분석 리포트' },
  { href: '#care', label: '맞춤 지도' },
  { href: '#progress', label: '변화관리' },
];

export default function Landing({ content }: { content: SiteContent }) {
  const c = content;
  const book = (label: string, variant: 'dark' | 'line' = 'dark'): ReactNode => (
    <BookButton url={c.location.url} label={label} variant={variant} />
  );

  return (
    <>
      <header className="top" id="top">
        <div className="wrap">
          <Logo url={c.brand.logoUrl} />
          <nav className="nav" aria-label="섹션 이동">
            {NAV.map((n) => (
              <a key={n.href} href={n.href}>
                {n.label}
              </a>
            ))}
          </nav>
          <BookButton url={c.location.url} label={c.booking.headerLabel} arrow={false} />
        </div>
      </header>

      <main id="home">
        <section className="hero hero-bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="bg-img" src={c.hero.image} alt={c.hero.imageAlt} fetchPriority="high" />
          <div className="shade" aria-hidden="true" />
          <div className="wrap">
            <div className="hero-copy">
              <p className="eyebrow">PILIVE Body Care System</p>
              <h1>
                내 몸을 분석하고,
                <br />
                변화를 <em>관리</em>하는
                <br />
                필라테스.
              </h1>
              <p className="lead">
                <Rich text={'필라이브필라테스 강남일원점의 체형관리 시스템.\n분석 결과를 운동으로 연결하고, 변화까지 함께 확인합니다.'} />
              </p>
              <div className="hero-cta">
                <BookButton url={c.location.url} label="체형분석 및 상담 예약하기" />
                <a className="btn btn-line" href="#intro">
                  관리 시스템 보기
                </a>
              </div>
            </div>
          </div>
        </section>

        <BodyCare book={book} />
      </main>

      <footer>
        <div className="wrap">
          <Logo url={c.brand.logoUrl} />
          <p className="note">
            <Rich text={c.footerNote} />
            <br />
            분석 화면 이미지 출처: 피트릭스 아웃바디 공식 홈페이지(outbody.life). 상담·지도 장면의 일부 이미지는 AI로 연출한 것입니다.
            <br />© PILIVE PILATES
          </p>
        </div>
      </footer>

      <div className="dock">
        <BookButton url={c.location.url} label={c.booking.buttonLabel} />
      </div>

      <Interactions />
    </>
  );
}
