import type { Metadata } from 'next';
import { getBrandContent } from '@/lib/store';
import { Rich } from '@/components/Rich';
import Shell from '@/components/site/Shell';
import Instructors from '@/components/site/Instructors';
import { BookingButton, GoldWave, Pic, SectionHead, Title } from '@/components/site/ui';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: '1:1 개인레슨 | 필라이브필라테스 강남 일원점',
  description:
    '같은 운동을 해도, 몸의 변화는 다릅니다. 체형과 움직임을 먼저 확인하고 목적에 맞춰 설계하는 필라이브필라테스 강남 일원점의 1:1 개인레슨.',
  alternates: { canonical: '/private' },
  openGraph: {
    title: '1:1 개인레슨 | 필라이브필라테스 강남 일원점',
    description: '당신의 몸은 다른 사람과 다르기에, 운동 방법도 달라야 합니다.',
    type: 'website',
    locale: 'ko_KR',
    images: [{ url: '/assets/brand/og.jpg', width: 1200, height: 630 }],
  },
};

export default async function PrivatePage() {
  const c = await getBrandContent();
  const p = c.privatePage;
  const privateInstructors = c.instructors.list.filter((i) => i.visible && (i.lessonType === 'private' || i.lessonType === 'both'));

  return (
    <Shell c={c} onHome={false} stickyLabel={c.booking.privateLabel}>
      {/* 헤드라인 */}
      <section aria-labelledby="private-hero" className="relative flex min-h-[86svh] flex-col justify-end overflow-hidden bg-green-deep">
        <Pic src={p.heroImage} alt={p.heroImageAlt} priority sizes="100vw" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_top,rgb(15_46_35/0.9)_0%,rgb(15_46_35/0.55)_38%,rgb(15_46_35/0.1)_68%)]"
        />
        <div className="wrap relative z-10 grid gap-6 pt-28 pb-[calc(112px+env(safe-area-inset-bottom))] text-cream md:pb-20">
          <p className="font-latin text-[13px] tracking-[0.3em] text-gold-light">1:1 PRIVATE LESSON</p>
          <h1 id="private-hero" className="text-[clamp(31px,8.4vw,60px)] leading-[1.3] font-normal">
            <Title text={p.title} className="on-dark" />
          </h1>
          <GoldWave className="text-gold-light" />
          <p className="max-w-[30em] text-[16px] leading-[1.85] text-cream/90 md:text-[18px]">
            <Rich text={p.subtitle} />
          </p>
        </div>
      </section>

      {/* 고객 공감 */}
      <section aria-labelledby="worries-title" className="bg-cream py-[clamp(80px,12vw,130px)]">
        <div className="wrap grid max-w-[880px] gap-10">
          <SectionHead id="worries-title" center eyebrow="Do you feel this?" title={p.worriesTitle} />
          <ul className="grid gap-3 sm:grid-cols-2">
            {p.worries.map((w) => (
              <li key={w} className="flex items-start gap-4 rounded-xl border border-line bg-white px-5 py-5">
                <span
                  aria-hidden="true"
                  className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-gold text-[12px] text-gold"
                >
                  ✓
                </span>
                <span className="text-[15.5px] leading-[1.7] text-ink">{w}</span>
              </li>
            ))}
          </ul>
          <p className="text-center font-display text-[clamp(19px,4.8vw,24px)] leading-relaxed text-green">
            하나라도 해당된다면,
            <br />
            <span className="text-gold">내 몸에 맞는 운동</span>을 제대로 배워볼 때입니다.
          </p>
        </div>
      </section>

      {/* 개인레슨의 차별화 */}
      <section aria-labelledby="points-title" className="bg-ivory py-[clamp(80px,12vw,130px)]">
        <div className="wrap grid gap-12 md:grid-cols-[0.85fr_1fr] md:gap-16">
          <div className="md:sticky md:top-28 md:self-start">
            <SectionHead id="points-title" eyebrow={p.pointsEyebrow} title={p.pointsTitle} />
          </div>
          <ol className="grid gap-4">
            {p.points.map((pt, i) => (
              <li key={pt.title} className="grid grid-cols-[auto_1fr] gap-5 rounded-2xl bg-cream p-6 md:p-7">
                <span className="font-latin text-[34px] leading-none text-gold tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                <span className="grid gap-2">
                  <span className="font-display text-[19px] leading-snug text-green">{pt.title}</span>
                  {pt.body ? <span className="text-[14.5px] leading-[1.8] text-muted">{pt.body}</span> : null}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 그룹 vs 개인 */}
      <section aria-labelledby="compare-title" className="bg-cream py-[clamp(80px,12vw,130px)]">
        <div className="wrap grid gap-12">
          <SectionHead id="compare-title" center eyebrow="Group & Private" title={p.compareTitle} body={p.compareBody} />
          <div className="grid gap-4 md:grid-cols-2 md:gap-6">
            <div className="grid content-start gap-5 rounded-2xl border border-line bg-white p-7 md:p-9">
              <p className="font-latin text-[13px] tracking-[0.24em] text-gold">GROUP</p>
              <h3 className="text-[24px] font-normal text-green">{p.group.title}</h3>
              <ul className="grid gap-3">
                {p.group.points.map((x) => (
                  <li key={x} className="flex gap-3 text-[15px] leading-relaxed text-ink/85">
                    <span className="mt-[10px] size-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid content-start gap-5 rounded-2xl bg-green p-7 text-cream md:p-9">
              <p className="font-latin text-[13px] tracking-[0.24em] text-gold-light">PRIVATE</p>
              <h3 className="text-[24px] font-normal">{p.private.title}</h3>
              <ul className="grid gap-3">
                {p.private.points.map((x) => (
                  <li key={x} className="flex gap-3 text-[15px] leading-relaxed text-cream/90">
                    <span className="mt-[10px] size-1.5 shrink-0 rounded-full bg-gold-light" aria-hidden="true" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 개인레슨 강사 */}
      {privateInstructors.length ? (
        <section aria-labelledby="pi-title" className="bg-ivory py-[clamp(80px,12vw,130px)]">
          <div className="wrap grid gap-10">
            <SectionHead id="pi-title" center eyebrow="Instructors" title={p.instructorsTitle} body={p.instructorsNote} />
            <div className="mx-auto w-full max-w-[960px]">
              <Instructors list={privateInstructors} />
            </div>
          </div>
        </section>
      ) : null}

      {/* 상담 전환 */}
      <section aria-labelledby="closing-title" className="relative isolate overflow-hidden bg-green-deep">
        <Pic src={p.closingImage} alt={p.closingImageAlt} sizes="100vw" className="-z-10 opacity-40" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(15_46_35/0.94),rgb(15_46_35/0.6))]" />
        <div className="wrap grid justify-items-center gap-8 py-[clamp(96px,15vw,150px)] text-center text-cream">
          <SectionHead id="closing-title" center dark eyebrow="Consultation" title={p.closingTitle} body={p.closingBody} />
          <BookingButton url={c.booking.url} label={c.booking.privateLabel} variant="gold" className="px-9" phone={c.location.phone} />
        </div>
      </section>

      {p.disclaimer ? (
        <div className="bg-cream">
          <p className="wrap py-8 text-center text-[12.5px] leading-relaxed text-muted">{p.disclaimer}</p>
        </div>
      ) : null}
    </Shell>
  );
}
