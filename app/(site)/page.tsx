import type { Metadata } from 'next';
import { fillStat, type BrandContent, type Feature } from '@/lib/brand';
import { getBrandContent } from '@/lib/store';
import { Rich } from '@/components/Rich';
import Shell from '@/components/site/Shell';
import Instructors from '@/components/site/Instructors';
import Schedule from '@/components/site/Schedule';
import { Arrow, BookingButton, GoldWave, LinkButton, Pic, SectionHead, Title, btnClass } from '@/components/site/ui';

// 한 시간마다 새로 만들고, 관리자 페이지에서 저장하면 즉시 다시 만듭니다.
export const revalidate = 3600;

export const metadata: Metadata = { alternates: { canonical: '/' } };

export default async function Home() {
  const c = await getBrandContent();

  return (
    <Shell c={c} onHome>
      <Hero c={c} />
      {c.intro.visible ? <About c={c} /> : null}
      {c.why.visible ? <Why c={c} /> : null}
      {c.privateTeaser.visible ? <PrivateTeaser c={c} /> : null}
      {c.bodycare.visible ? <Bodycare c={c} /> : null}
      {c.schedule.visible ? <ScheduleSection c={c} /> : null}
      {c.instructors.visible ? <InstructorsSection c={c} /> : null}
      <Notices c={c} />
      <Contact c={c} />
    </Shell>
  );
}

/* 1. 메인 비주얼 */
function Hero({ c }: { c: BrandContent }) {
  const h = c.hero;
  return (
    <section id="top" aria-labelledby="hero-title" className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-sand">
      <Pic
        src={h.image}
        alt={h.imageAlt}
        priority
        sizes="100vw"
        className="object-[var(--fx)_center] md:object-center"
        style={{ ['--fx' as string]: `${h.focusX}%` }}
      />
      {/* 사진은 밝게 두고, 글씨가 놓이는 아래쪽만 부드럽게 어둡게 */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_top,rgb(15_46_35/0.88)_0%,rgb(15_46_35/0.66)_34%,rgb(15_46_35/0.48)_52%,rgb(15_46_35/0.22)_66%,transparent_80%)] md:bg-[linear-gradient(to_top,rgb(15_46_35/0.78)_0%,rgb(15_46_35/0.35)_38%,transparent_62%)]"
      />
      <div className="wrap relative z-10 grid gap-6 pt-28 pb-[calc(112px+env(safe-area-inset-bottom))] text-cream [text-shadow:0_1px_14px_rgb(15_46_35/0.35)] md:pb-20">
        <p className="font-latin text-[13px] font-semibold tracking-[0.3em] text-cream">{h.slogan}</p>
        <h1 id="hero-title" className="text-[clamp(32px,8.8vw,64px)] leading-[1.28] font-normal">
          <Title text={h.title} className="on-dark" />
        </h1>
        <GoldWave className="text-gold-light" />
        <p className="max-w-[30em] text-[15.5px] leading-[1.85] text-cream/90 md:text-[17px]">
          <Rich text={h.subtitle} />
        </p>
        <div className="mt-2 flex flex-wrap gap-3">
          <a href="#about" className={btnClass('light')}>
            {h.exploreLabel}
          </a>
          <BookingButton url={c.booking.url} label={c.booking.heroLabel} variant="outline-light" phone={c.location.phone} />
        </div>
      </div>
    </section>
  );
}

/* 2. 필라이브 소개 */
function About({ c }: { c: BrandContent }) {
  const a = c.intro;
  return (
    <section id="about" aria-labelledby="about-title" className="bg-cream py-[clamp(84px,13vw,140px)]">
      <div className="wrap grid gap-12 md:grid-cols-[1fr_1.05fr] md:items-center md:gap-16">
        <div className="grid gap-10">
          <SectionHead id="about-title" eyebrow={a.eyebrow} title={a.title} body={a.body} />
          <ol className="grid gap-px overflow-hidden rounded-xl border border-line bg-line">
            {a.services.map((sv, i) => (
              <li key={sv.title} className="flex gap-5 bg-cream p-5">
                <span className="font-latin text-[22px] leading-none text-gold lining-nums tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                <span className="grid gap-1">
                  <span className="font-display text-[18px] text-green">{sv.title}</span>
                  <span className="text-[14px] leading-relaxed text-muted">{sv.body}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
        <div className="relative grid grid-cols-[1fr_0.62fr] items-end gap-3">
          <div className="relative aspect-[3/4] overflow-hidden rounded-t-[999px] rounded-b-md bg-sand">
            <Pic src={a.image} alt={a.imageAlt} sizes="(min-width:768px) 340px, 60vw" />
          </div>
          <div className="relative mb-10 aspect-[4/5] overflow-hidden rounded-md bg-sand">
            <Pic src={a.image2} alt={a.image2Alt} sizes="(min-width:768px) 220px, 38vw" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* 3. 필라이브의 특별함 */
function Why({ c }: { c: BrandContent }) {
  const w = c.why;
  const features = w.features.filter((f) => f.visible);
  return (
    <section id="why" aria-labelledby="why-title" className="bg-ivory py-[clamp(84px,13vw,140px)]">
      <div className="wrap grid gap-12 md:gap-16">
        <SectionHead id="why-title" center eyebrow={w.eyebrow} title={w.title} body={w.body} />
        <ul className="grid gap-5 md:grid-cols-2 md:gap-6">
          {features.map((f) => (
            <FeatureCard key={f.id} f={f} c={c} />
          ))}
        </ul>
        {w.note ? <p className="text-center text-[12.5px] text-muted">{w.note}</p> : null}
      </div>
    </section>
  );
}

function FeatureCard({ f, c }: { f: Feature; c: BrandContent }) {
  const stat = fillStat(f.statValue, c);
  const isLevels = f.id === 'levels';
  return (
    <li className="group grid overflow-hidden rounded-2xl bg-cream shadow-[0_24px_60px_-40px_rgb(15_46_35/0.45)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-sand">
        <Pic
          src={f.image}
          alt={f.imageAlt}
          sizes="(min-width:768px) 560px, 100vw"
          className="transition-transform duration-[1200ms] ease-soft group-hover:scale-[1.03]"
        />
        <span className="absolute top-4 left-4 rounded-full bg-cream/90 px-3 py-1 font-latin text-[13px] tracking-[0.2em] text-green backdrop-blur">
          {f.kicker}
        </span>
      </div>
      <div className="grid content-start gap-4 p-6 md:p-8">
        {stat ? (
          <p className="flex items-baseline gap-2 text-green">
            <span className="font-latin text-[46px] leading-none font-medium lining-nums tabular-nums">{stat}</span>
            <span className="text-[13px] text-muted">{f.statLabel}</span>
          </p>
        ) : null}
        <h3 className="text-[22px] leading-snug font-medium text-green">{f.title}</h3>
        <p className="text-[15px] leading-[1.85] text-muted">{f.body}</p>
        {isLevels ? <LevelSteps /> : null}
        {f.points.length ? (
          <ul className="flex flex-wrap gap-2 pt-1">
            {f.points.map((p) => (
              <li key={p} className="rounded-full border border-gold-soft px-3 py-1.5 text-[13px] text-green">
                {p}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </li>
  );
}

function LevelSteps() {
  const steps = ['Lv.0', 'Lv.1', 'Lv.2', 'Lv.3'];
  return (
    <div className="grid gap-2 pt-1" aria-label="레벨 0단계부터 3단계까지">
      <div className="grid grid-cols-4 items-end gap-1.5">
        {steps.map((s, i) => (
          <div key={s} className="grid gap-1.5">
            <span
              className="rounded-t-md bg-green"
              style={{ height: `${14 + i * 12}px`, opacity: 0.35 + i * 0.2 }}
              aria-hidden="true"
            />
            <span className="text-center font-latin text-[14px] text-green">{s}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-[12px] text-muted">
        <span>입문</span>
        <span>숙련</span>
      </div>
    </div>
  );
}

/* 4. 1:1 개인레슨 */
function PrivateTeaser({ c }: { c: BrandContent }) {
  const p = c.privateTeaser;
  return (
    <section id="private" aria-labelledby="private-title" className="overflow-hidden bg-green text-cream">
      <div className="grid md:grid-cols-2">
        <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[560px]">
          <Pic src={p.image} alt={p.imageAlt} sizes="(min-width:768px) 50vw, 100vw" />
        </div>
        <div className="wrap grid content-center gap-8 py-16 md:max-w-[560px] md:px-14 md:py-20">
          <SectionHead id="private-title" dark eyebrow={p.eyebrow} title={p.title} body={p.body} />
          <div className="flex flex-wrap gap-3">
            <LinkButton href="/private" variant="light">
              {p.linkLabel} <Arrow />
            </LinkButton>
            <BookingButton url={c.booking.url} label={c.booking.privateLabel} variant="outline-light" phone={c.location.phone} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* 5. PILIVE BODY CARE SYSTEM */
function Bodycare({ c }: { c: BrandContent }) {
  const b = c.bodycare;
  return (
    <section id="bodycare" aria-labelledby="bodycare-title" className="bg-cream py-[clamp(84px,13vw,140px)]">
      <div className="wrap grid gap-12 md:grid-cols-[0.9fr_1fr] md:items-center md:gap-16">
        <div className="relative mx-auto aspect-[3/4] w-full max-w-[420px] overflow-hidden rounded-t-[999px] rounded-b-md bg-sand">
          <Pic src={b.image} alt={b.imageAlt} sizes="(min-width:768px) 420px, 90vw" />
        </div>
        <div className="grid gap-9">
          <SectionHead id="bodycare-title" eyebrow={b.eyebrow} title={b.title} body={b.body} />
          <ol className="grid">
            {b.items.map((it, i) => (
              <li key={it} className="flex items-center gap-5 border-b border-line py-4 first:border-t">
                <span className="font-latin text-[15px] text-gold lining-nums tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-[16px] text-green">{it}</span>
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap gap-3">
            {b.link ? (
              <LinkButton href={b.link} variant="green">
                {b.linkLabel} <Arrow />
              </LinkButton>
            ) : (
              <span className="inline-flex min-h-[52px] items-center rounded-full border border-dashed border-gold px-6 text-sm text-muted">
                바디케어 페이지 주소 준비 중
              </span>
            )}
            <BookingButton url={c.booking.url} label={c.booking.bodycareLabel} variant="outline" phone={c.location.phone} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* 6. 그룹레슨 시간표 */
function ScheduleSection({ c }: { c: BrandContent }) {
  const s = c.schedule;
  return (
    <section id="schedule" aria-labelledby="schedule-title" className="bg-ivory py-[clamp(84px,13vw,140px)]">
      <div className="wrap grid max-w-[880px] gap-10">
        <SectionHead id="schedule-title" center eyebrow={s.eyebrow} title={s.title} body={s.body} />
        <Schedule image={s.image} alt={s.imageAlt} classes={s.classes} />
        <div className="grid justify-items-center gap-5 text-center">
          <p className="font-display text-[clamp(20px,5vw,26px)] text-green">{s.caption}</p>
          <BookingButton url={c.booking.url} label={c.booking.scheduleLabel} variant="green" phone={c.location.phone} />
        </div>
      </div>
    </section>
  );
}

/* 7. 전문 강사진 */
function InstructorsSection({ c }: { c: BrandContent }) {
  const s = c.instructors;
  return (
    <section id="instructors" aria-labelledby="instructors-title" className="bg-cream py-[clamp(84px,13vw,140px)]">
      <div className="wrap grid gap-12">
        <SectionHead id="instructors-title" center eyebrow={s.eyebrow} title={s.title} body={s.body} />
        <Instructors list={s.list} />
        <div className="grid justify-items-center">
          <BookingButton url={c.booking.url} label={c.booking.instructorsLabel} variant="outline" phone={c.location.phone} />
        </div>
      </div>
    </section>
  );
}

/* 공지사항 (공개된 공지가 있을 때만) */
function Notices({ c }: { c: BrandContent }) {
  const items = c.notices.items.filter((n) => n.visible && n.title.trim());
  if (!c.notices.visible || !items.length) return null;
  return (
    <section id="notice" aria-labelledby="notice-title" className="bg-ivory py-16">
      <div className="wrap grid max-w-[880px] gap-6">
        <h2 id="notice-title" className="text-[24px] font-normal text-green">
          {c.notices.title}
        </h2>
        <ul className="grid divide-y divide-line border-y border-line">
          {items.map((n) => (
            <li key={n.id}>
              <details className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                  <span className="grid gap-1">
                    {n.date ? <span className="text-[12px] text-gold lining-nums tabular-nums">{n.date}</span> : null}
                    <span className="text-[16px] text-green">{n.title}</span>
                  </span>
                  <span aria-hidden="true" className="text-gold transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                {n.body ? (
                  <p className="pt-3 text-[14.5px] leading-[1.85] whitespace-pre-line text-muted">{n.body}</p>
                ) : null}
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* 8. 상담예약 + 9. 지점 정보 */
function Contact({ c }: { c: BrandContent }) {
  const k = c.cta;
  const loc = c.location;
  const mapUrl = `https://map.naver.com/p/search/${encodeURIComponent(loc.address)}`;
  return (
    <section id="contact" aria-labelledby="contact-title">
      {k.visible ? (
        <div className="relative isolate overflow-hidden bg-green-deep">
          <Pic src={k.image} alt={k.imageAlt} sizes="100vw" className="-z-10 opacity-45" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(15_46_35/0.92),rgb(15_46_35/0.55))]" />
          <div className="wrap grid justify-items-center gap-8 py-[clamp(96px,15vw,150px)] text-center text-cream">
            <SectionHead id="contact-title" center dark eyebrow={k.eyebrow} title={k.title} body={k.body} />
            <BookingButton url={c.booking.url} label={c.booking.stickyLabel} variant="gold" className="px-9" phone={loc.phone} />
          </div>
        </div>
      ) : (
        <h2 id="contact-title" className="sr-only">
          상담예약 및 오시는 길
        </h2>
      )}

      <div className="bg-cream py-[clamp(64px,10vw,110px)]">
        <div className="wrap grid gap-10 md:grid-cols-[1fr_1.3fr] md:items-start">
          <div className="grid gap-5">
            <p className="eyebrow">Visit Us</p>
            <h3 className="text-[26px] leading-snug font-normal text-green">{loc.name}</h3>
            <dl className="grid gap-3 text-[15px]">
              <div className="grid grid-cols-[64px_1fr] gap-2">
                <dt className="text-muted">주소</dt>
                <dd className="text-ink">
                  {loc.address}
                  {loc.detail ? <span className="block text-[13.5px] text-muted">{loc.detail}</span> : null}
                </dd>
              </div>
              {loc.phone ? (
                <div className="grid grid-cols-[64px_1fr] gap-2">
                  <dt className="text-muted">전화</dt>
                  <dd>
                    <a href={`tel:${loc.phone.replace(/[^0-9]/g, '')}`} className="text-green underline underline-offset-4">
                      {loc.phone}
                    </a>
                  </dd>
                </div>
              ) : null}
            </dl>
            <div className="flex flex-wrap gap-3 pt-2">
              <a href={mapUrl} target="_blank" rel="noopener noreferrer" className={btnClass('outline')}>
                네이버 지도에서 보기 <Arrow />
              </a>
            </div>
          </div>
          {loc.gallery.length ? (
            <ul className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 md:mx-0 md:grid md:grid-cols-3 md:px-0">
              {loc.gallery.map((g) => (
                <li key={g.src} className="relative aspect-[4/5] w-[68vw] shrink-0 snap-start overflow-hidden rounded-md bg-sand md:w-auto">
                  <Pic src={g.src} alt={g.alt} sizes="(min-width:768px) 220px, 68vw" />
                  {g.alt ? (
                    <span className="absolute bottom-0 left-0 m-3 rounded-full bg-cream/90 px-3 py-1 text-[12px] text-green">{g.alt}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}
