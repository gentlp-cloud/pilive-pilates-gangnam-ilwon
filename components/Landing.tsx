import type { CSSProperties, ReactNode } from 'react';
import type { Section, SiteContent } from '@/lib/content';
import { Rich } from './Rich';
import Interactions from './Interactions';

const ROMAN = ['i.', 'ii.', 'iii.', 'iv.', 'v.', 'vi.'];

function Head({ s, style }: { s: Section; style?: CSSProperties }) {
  return (
    <div className="sec-head reveal" style={style}>
      <p className="eyebrow">{s.eyebrow}</p>
      <h2>
        <Rich text={s.title} />
      </h2>
      {s.body ? (
        <p className="lead">
          <Rich text={s.body} />
        </p>
      ) : null}
    </div>
  );
}

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

// 사진이 아직 없을 때 같은 자리·같은 크기로 보이는 자리표시.
function Photo({ src, alt, eager }: { src?: string; alt?: string; eager?: boolean }) {
  if (!src) {
    return (
      <div className="ph" role="img" aria-label={alt || '사진 준비 중'}>
        <span>PILIVE</span>
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt ?? ''} loading={eager ? undefined : 'lazy'} />;
}

function Scale({ at }: { at: number }) {
  return (
    <div className="scale">
      <i style={{ left: `${at}%` }} />
    </div>
  );
}

function Metric({ name, value, unit, at }: { name: string; value: string; unit: string; at: number }) {
  return (
    <div className="metric">
      <div className="metric-top">
        <span>{name}</span>
        <strong className="num">
          {value}
          <small>{unit}</small>
        </strong>
      </div>
      <Scale at={at} />
      <div className="scale-labels">
        <span>정상</span>
        <span>주의</span>
        <span>위험</span>
      </div>
    </div>
  );
}

function renderSection(s: Section, c: SiteContent): ReactNode {
  const items = s.items ?? [];
  switch (s.type) {
    case 'question':
      return (
        <section className="question" id={s.id} key={s.id}>
          <div className="wrap">
            <Head s={s} />
            <div>
              <div className="q-list">
                {items.map((it, i) => (
                  <div className="q-item reveal" key={i}>
                    <span className="num">{ROMAN[i] ?? `${i + 1}.`}</span>
                    <p>{it.title}</p>
                  </div>
                ))}
              </div>
              {s.body2 ? (
                <p className="lead q-foot">
                  <Rich text={s.body2} />
                </p>
              ) : null}
            </div>
          </div>
        </section>
      );

    case 'system':
      return (
        <section className="system" id={s.id} key={s.id}>
          <div className="wrap">
            <Head s={s} />
            <div className="cycle">
              {items.map((it, i) => (
                <FragmentWithArrow key={i} last={i === items.length - 1}>
                  <div className="c-step reveal">
                    <span className="ko">{it.label}</span>
                    <span className="en">{it.title}</span>
                    <p>{it.body}</p>
                  </div>
                </FragmentWithArrow>
              ))}
            </div>
            {s.note ? (
              <p className="cycle-note">
                <span className="loop" aria-hidden="true">
                  ↺
                </span>
                {s.note}
              </p>
            ) : null}
          </div>
        </section>
      );

    case 'checkup':
      return (
        <section className="checkup" id={s.id} key={s.id} style={{ paddingTop: 0 }}>
          <div className="wrap grid">
            <div className="photo reveal">
              <Photo src={s.image} alt={s.imageAlt} />
            </div>
            <div>
              <Head s={s} style={{ marginBottom: 0 }} />
              <div className="moves reveal" aria-label="측정 동작">
                <div className="move">
                  <svg viewBox="0 0 44 52" aria-hidden="true">
                    <circle cx="22" cy="8" r="4.5" />
                    <path d="M22 13v18M22 31l-6 17M22 31l6 17M22 17l-9-12M22 17l9-12" />
                  </svg>
                  팔 들기
                </div>
                <div className="move">
                  <svg viewBox="0 0 44 52" aria-hidden="true">
                    <circle cx="16" cy="12" r="4.5" />
                    <path d="M19 16l7 12M26 28l-10 6-2 14M26 28l4 20M19 17l13-8" />
                  </svg>
                  스쿼트
                </div>
                <div className="move">
                  <svg viewBox="0 0 44 52" aria-hidden="true">
                    <circle cx="32" cy="28" r="4.5" />
                    <path d="M28 25L16 18M16 18l-2 30M16 18l6 30M28 30l2 14" />
                  </svg>
                  앞으로 숙이기
                </div>
              </div>
              {s.stats?.length ? (
                <div className="stat-row reveal">
                  {s.stats.map((st, i) => (
                    <div className="stat" key={i}>
                      <strong className="num">
                        {st.value}
                        {st.unit ? <sup>{st.unit}</sup> : null}
                      </strong>
                      <span>{st.label}</span>
                    </div>
                  ))}
                </div>
              ) : null}
              <div className="phases reveal">
                {items.map((it, i) => (
                  <div className="phase" key={i}>
                    <span className="num">{i + 1}</span>
                    <div>
                      <strong>{it.title}</strong>
                      <span>{it.body}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      );

    case 'trust':
      return (
        <section className="trust" id={s.id} key={s.id}>
          <div className="wrap">
            <div className="trust-head reveal">
              <p className="eyebrow">{s.eyebrow}</p>
              <h2>
                <Rich text={s.title} />
              </h2>
              {s.body ? (
                <p className="lead">
                  <Rich text={s.body} />
                </p>
              ) : null}
            </div>
            {s.stats?.length ? (
              <div className="figures reveal">
                {s.stats.map((st, i) => (
                  <div key={i}>
                    <strong className="num">
                      {st.value}
                      {st.unit ? <sup>{st.unit}</sup> : null}
                    </strong>
                    <span>{st.label}</span>
                  </div>
                ))}
              </div>
            ) : null}
            <div className="creds reveal">
              {items.map((it, i) => (
                <div className="cred" key={i}>
                  <span className="num">{it.label}</span>
                  <div>
                    <strong>{it.title}</strong>
                    <p>{it.body}</p>
                  </div>
                </div>
              ))}
            </div>
            {s.note ? <p className="sample">{s.note}</p> : null}
          </div>
        </section>
      );

    case 'report':
      return (
        <section className="report" id={s.id} key={s.id}>
          <div className="wrap">
            <Head s={s} />
            <div className="report-wrap">
              <div className="photo report-photo reveal">
                <Photo src={s.image} alt={s.imageAlt} />
              </div>
              <div className="report-grid">
                <article className="card reveal">
                  <span className="tag">{items[0]?.label}</span>
                  <h3>{items[0]?.title}</h3>
                  <Metric name="거북목" value="8" unit="°" at={40} />
                  <Metric name="둥근 어깨" value="3" unit="cm" at={48} />
                  <Metric name="골반 전위" value="3" unit="cm" at={46} />
                </article>
                <article className="card reveal">
                  <span className="tag">{items[1]?.label}</span>
                  <h3>{items[1]?.title}</h3>
                  <div className="age">
                    <strong className="num">29</strong>
                    <span>세 · 신체 나이</span>
                  </div>
                  <div className="age-grid">
                    <div>
                      자세<b className="num">+3</b>
                    </div>
                    <div>
                      유연성<b className="num">+6</b>
                    </div>
                    <div>
                      밸런스<b className="num">0</b>
                    </div>
                  </div>
                </article>
                <article className="card reveal">
                  <span className="tag">{items[2]?.label}</span>
                  <h3>{items[2]?.title}</h3>
                  <div className="muscle">
                    <div className="muscle-row">
                      <i style={{ background: '#C99A86' }} />
                      <div>
                        <b>스트레칭이 필요한 근육</b>
                        <span>긴장되어 짧아진 근육</span>
                      </div>
                    </div>
                    <div className="muscle-row">
                      <i style={{ background: '#8E9A7C' }} />
                      <div>
                        <b>강화가 필요한 근육</b>
                        <span>약해져 제 역할을 못 하는 근육</span>
                      </div>
                    </div>
                  </div>
                  {s.body2 ? <p>{s.body2}</p> : null}
                </article>
              </div>
            </div>
            {s.note ? <p className="sample">{s.note}</p> : null}
          </div>
        </section>
      );

    case 'journey':
      return (
        <section className="journey" id={s.id} key={s.id}>
          <div className="wrap">
            <Head s={s} />
            <div className="grid">
              <div>
                <div className="timeline" id="timeline">
                  <span className="fill" aria-hidden="true" />
                  {items.map((it, i) => (
                    <div className="t-step" key={i}>
                      <span className="dot">{i + 1}</span>
                      <span className="num">STEP {String(i + 1).padStart(2, '0')}</span>
                      <h3>{it.title}</h3>
                      <p>{it.body}</p>
                    </div>
                  ))}
                </div>
                {s.note ? (
                  <div className="t-loop">
                    <b aria-hidden="true">↺</b>
                    {s.note}
                  </div>
                ) : null}
              </div>
              <figure className="journey-figure reveal" style={{ margin: 0 }}>
                <div className="arch">
                  <Photo src={s.image} alt={s.imageAlt} eager />
                </div>
                {s.body2 ? <figcaption>{s.body2}</figcaption> : null}
              </figure>
            </div>
          </div>
        </section>
      );

    case 'value':
      return (
        <section className="value" id={s.id} key={s.id}>
          <div className="wrap">
            <div className="grid">
              <Head s={s} style={{ marginBottom: 0 }} />
              <div className="reveal">
                <div className="compare">
                  <div>
                    <span className="when">LAST MONTH</span>
                    <span className="big num">
                      8<small>°</small>
                    </span>
                    <span className="lbl">거북목 각도</span>
                    <Scale at={40} />
                  </div>
                  <div>
                    <span className="when">THIS MONTH</span>
                    <span className="big num">
                      5<small>°</small>
                    </span>
                    <span className="lbl">거북목 각도</span>
                    <Scale at={28} />
                  </div>
                </div>
                {s.note ? <p className="sample">{s.note}</p> : null}
              </div>
            </div>
            {s.body2 ? (
              <p className="value-quote reveal">
                <Rich text={s.body2} />
              </p>
            ) : null}
          </div>
        </section>
      );

    case 'location':
      return (
        <section className="studios" id={s.id} key={s.id}>
          <div className="wrap">
            <Head s={s} />
            <div className="studios-grid single">
              <div className="studio">
                <div className="studio-name">
                  <small>{c.location.en}</small>
                  <strong>{c.location.name}</strong>
                  {c.location.address ? <span className="addr">{c.location.address}</span> : null}
                </div>
                <BookButton url={c.location.url} label={c.booking.linkButton} variant="line" arrow={false} />
              </div>
            </div>
          </div>
        </section>
      );

    case 'cta':
      return (
        <section className="cta" id={s.id} key={s.id}>
          <div className="wrap">
            <p className="eyebrow reveal">{s.eyebrow}</p>
            <h2 className="reveal" style={{ marginTop: 22 }}>
              <Rich text={s.title} />
            </h2>
            {items.length ? (
              <div className="who reveal">
                {items.map((it, i) => (
                  <span key={i}>{it.title}</span>
                ))}
              </div>
            ) : null}
            {s.body ? (
              <p className="free reveal">
                <Rich text={s.body} />
              </p>
            ) : null}
            <div className="reveal">
              <BookButton url={c.location.url} label={s.body2 || c.booking.buttonLabel} />
            </div>
          </div>
        </section>
      );
    default:
      return null;
  }
}

function FragmentWithArrow({ children, last }: { children: ReactNode; last: boolean }) {
  return (
    <>
      {children}
      {!last && (
        <div className="c-arrow" aria-hidden="true">
          →
        </div>
      )}
    </>
  );
}

const NAV: { type: Section['type']; label: string }[] = [
  { type: 'system', label: '시스템' },
  { type: 'checkup', label: '체형분석' },
  { type: 'journey', label: '관리 과정' },
  { type: 'location', label: '오시는 길' },
];

export default function Landing({ content }: { content: SiteContent }) {
  const c = content;
  const sections = c.sections.filter((s) => s.visible);
  const firstSystem = sections.find((s) => s.type === 'system');
  const nav = NAV.map((n) => ({ ...n, section: sections.find((s) => s.type === n.type) })).filter((n) => n.section);

  return (
    <>
      <header className="top" id="top">
        <div className="wrap">
          <Logo url={c.brand.logoUrl} />
          <nav className="nav" aria-label="섹션 이동">
            {nav.map((n) => (
              <a key={n.type} href={`#${n.section!.id}`}>
                {n.label}
              </a>
            ))}
          </nav>
          <BookButton url={c.location.url} label={c.booking.headerLabel} arrow={false} />
        </div>
      </header>

      <main id="home">
        <section className="hero">
          <div className="wrap">
            <div className="hero-copy">
              <p className="eyebrow">{c.hero.eyebrow}</p>
              <h1>
                <Rich text={c.hero.title} />
              </h1>
              <p className="lead">
                <Rich text={c.hero.subtitle} />
              </p>
              <div className="hero-cta">
                <BookButton url={c.location.url} label={c.booking.buttonLabel} />
                {firstSystem && c.hero.secondaryLabel ? (
                  <a className="btn btn-line" href={`#${firstSystem.id}`}>
                    {c.hero.secondaryLabel}
                  </a>
                ) : null}
              </div>
              <div className="scroll-cue" aria-hidden="true">
                <i />
                SCROLL
              </div>
            </div>
            <figure className="hero-figure reveal" style={{ margin: 0 }}>
                <div className="arch">
                  <Photo src={c.hero.image} alt={c.hero.imageAlt} eager />
                </div>
                {c.hero.badgeBig ? (
                  <figcaption>
                    <small>{c.hero.badgeSmall}</small>
                    <strong>{c.hero.badgeBig}</strong>
                  </figcaption>
                ) : null}
              </figure>
          </div>
        </section>

        {sections.map((s) => renderSection(s, c))}
      </main>

      <footer>
        <div className="wrap">
          <Logo url={c.brand.logoUrl} />
          <p className="note">
            <Rich text={c.footerNote} />
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
