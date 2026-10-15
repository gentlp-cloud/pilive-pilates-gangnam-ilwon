'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { LESSON_LABEL, type Instructor } from '@/lib/instructors';
import ZoomViewer from './ZoomViewer';

function Photo({ src, alt, sizes, className = '' }: { src: string; alt: string; sizes: string; className?: string }) {
  if (!src) return <div className={`absolute inset-0 bg-sand ${className}`} aria-hidden="true" />;
  return <Image src={src} alt={alt} fill sizes={sizes} className={`object-cover object-top ${className}`} unoptimized={src.endsWith('.svg')} />;
}

/** 강사 카드 목록 + 누르면 상세 프로필 */
export default function Instructors({ list }: { list: Instructor[] }) {
  const items = list.filter((i) => i.visible);
  const [active, setActive] = useState<number | null>(null);

  return (
    <>
      <ul className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-5">
        {items.map((ins, i) => (
          <li key={ins.id}>
            <button
              type="button"
              onClick={() => setActive(i)}
              className="group grid w-full gap-3 text-left"
              aria-label={`${ins.name} 강사 프로필 보기`}
            >
              <span className="relative block aspect-[3/4] overflow-hidden rounded-t-[999px] rounded-b-md bg-sand">
                <Photo
                  src={ins.photo || ins.profileImage}
                  alt=""
                  sizes="(min-width:1024px) 220px, (min-width:640px) 30vw, 46vw"
                  className="transition-transform duration-700 ease-soft group-hover:scale-[1.04]"
                />
              </span>
              <span className="grid gap-1 px-1">
                <span className="flex items-baseline justify-between gap-2">
                  <span className="font-display text-[19px] text-green">{ins.name}</span>
                  <span className="font-latin text-gold transition-transform group-hover:translate-x-1" aria-hidden="true">
                    →
                  </span>
                </span>
                <span className="text-[12.5px] leading-snug text-muted">{ins.role}</span>
                {ins.specialties.length ? (
                  <span className="line-clamp-1 text-[12px] text-gold">{ins.specialties.slice(0, 2).join(' · ')}</span>
                ) : null}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <ProfileSheet
        items={items}
        index={active}
        onClose={() => setActive(null)}
        onNav={(d) => setActive((v) => (v === null ? v : (v + d + items.length) % items.length))}
      />
    </>
  );
}

function ProfileSheet({
  items,
  index,
  onClose,
  onNav,
}: {
  items: Instructor[];
  index: number | null;
  onClose: () => void;
  onNav: (d: 1 | -1) => void;
}) {
  const [zoom, setZoom] = useState(false);
  const [mounted, setMounted] = useState(false);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const open = index !== null;
  const ins = index !== null ? items[index] : null;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtn.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      prevFocus?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    body.current?.scrollTo({ top: 0 });
  }, [index]);

  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (zoom) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNav(1);
      if (e.key === 'ArrowLeft') onNav(-1);
    },
    [zoom, onClose, onNav],
  );

  useEffect(() => {
    if (!open) return;
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onKey]);

  if (!mounted || !ins) return null;

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center" role="presentation">
      <button type="button" aria-label="닫기" className="absolute inset-0 bg-green-deep/55 backdrop-blur-[2px]" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ins-name"
        className="relative flex max-h-[92dvh] w-full max-w-[860px] flex-col overflow-hidden rounded-t-3xl bg-cream shadow-2xl sm:max-h-[88dvh] sm:rounded-2xl"
      >
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
          <p className="font-latin text-[13px] tracking-[0.24em] text-gold">INSTRUCTOR PROFILE</p>
          <button
            ref={closeBtn}
            type="button"
            onClick={onClose}
            className="grid size-10 place-items-center rounded-full text-2xl leading-none text-green hover:bg-sand"
            aria-label="닫기"
          >
            ×
          </button>
        </div>

        <div ref={body} className="overflow-y-auto overscroll-contain">
          <div className="grid gap-6 p-5 sm:grid-cols-[260px_1fr] sm:gap-8 sm:p-8">
            <div className="grid content-start gap-3">
              <div className="relative mx-auto aspect-[3/4] w-[62%] overflow-hidden rounded-t-[999px] rounded-b-md bg-sand sm:w-full">
                <Photo src={ins.photo || ins.profileImage} alt={`${ins.name} 강사`} sizes="(min-width:640px) 260px, 60vw" />
              </div>
              {ins.profileImage ? (
                <button
                  type="button"
                  onClick={() => setZoom(true)}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-green/30 px-4 text-[13.5px] text-green hover:bg-green hover:text-cream"
                >
                  프로필 이미지 전체 보기 <span aria-hidden="true">⤢</span>
                </button>
              ) : null}
            </div>

            <div className="grid content-start gap-6">
              <div className="grid gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  {ins.lessonType ? (
                    <span className="rounded-full bg-green px-3 py-1 text-[12px] text-cream">{LESSON_LABEL[ins.lessonType]}</span>
                  ) : null}
                  <span className="text-[13px] text-muted">{ins.role}</span>
                </div>
                <h3 id="ins-name" className="text-[34px] leading-tight font-medium text-green">
                  {ins.name}
                </h3>
                {ins.subtitle ? <p className="font-latin text-[13px] tracking-[0.22em] text-gold">{ins.subtitle}</p> : null}
              </div>

              {ins.specialties.length ? (
                <div className="grid gap-2.5">
                  <h4 className="text-[13px] font-medium text-green">주요 전문 분야</h4>
                  <ul className="flex flex-wrap gap-2">
                    {ins.specialties.map((sp) => (
                      <li key={sp} className="rounded-full border border-gold-soft bg-white px-3 py-1.5 text-[13px] text-green">
                        {sp}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {ins.blocks.map((b) => (
                <div key={b.title} className="grid gap-3">
                  <h4 className="flex items-center gap-3 font-display text-[18px] text-green">
                    <span className="h-4 w-px bg-gold" aria-hidden="true" />
                    {b.title}
                    <span className="h-px flex-1 bg-gold-soft/70" aria-hidden="true" />
                  </h4>
                  <ul className="grid gap-2">
                    {b.items.map((it) => (
                      <li key={it} className="flex gap-3 text-[14.5px] leading-relaxed text-ink/85">
                        <span className="mt-[9px] size-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))]">
          <button type="button" onClick={() => onNav(-1)} className="min-h-11 rounded-full px-4 text-[14px] text-green hover:bg-sand">
            <span aria-hidden="true">←</span> 이전 강사
          </button>
          <span className="text-[12px] text-muted lining-nums tabular-nums">
            {(items.indexOf(ins) ?? 0) + 1} / {items.length}
          </span>
          <button type="button" onClick={() => onNav(1)} className="min-h-11 rounded-full px-4 text-[14px] text-green hover:bg-sand">
            다음 강사 <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      <ZoomViewer
        open={zoom}
        onClose={() => setZoom(false)}
        src={ins.profileImage}
        alt={`${ins.name} 강사 프로필 전체 이미지`}
        title={`${ins.name} 강사 프로필`}
      />
    </div>,
    document.body,
  );
}
