'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import type { ScheduleClass } from '@/lib/brand';
import ZoomViewer from './ZoomViewer';

const DAYS: ScheduleClass['day'][] = ['월', '화', '수', '목', '금', '토', '일'];

/**
 * 그룹레슨 시간표.
 * 지금은 시간표 이미지를 보여 주고, 누르면 확대 보기로 열립니다.
 * classes(요일별 수업 목록)에 값이 생기면 요일 필터가 자동으로 나타납니다.
 */
export default function Schedule({ image, alt, classes }: { image: string; alt: string; classes: ScheduleClass[] }) {
  const [open, setOpen] = useState(false);
  const [day, setDay] = useState<ScheduleClass['day'] | null>(null);
  const filtered = useMemo(() => (day ? classes.filter((c) => c.day === day) : classes), [classes, day]);

  return (
    <div className="grid gap-6">
      {image ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group relative block w-full overflow-hidden rounded-xl border border-line bg-white p-2 shadow-[0_18px_50px_-30px_rgb(15_46_35/0.45)] sm:p-4"
          aria-label="시간표 크게 보기"
        >
          <Image
            src={image}
            alt={alt}
            width={1229}
            height={1536}
            unoptimized
            sizes="(min-width:900px) 760px, 100vw"
            className="h-auto w-full"
          />
          <span className="absolute right-4 bottom-4 inline-flex items-center gap-2 rounded-full bg-green/90 px-4 py-2.5 text-[13px] text-cream shadow-lg backdrop-blur sm:right-6 sm:bottom-6">
            <span aria-hidden="true">⤢</span> 눌러서 크게 보기
          </span>
        </button>
      ) : (
        <p className="rounded-xl border border-dashed border-gold-soft bg-white p-8 text-center text-muted">시간표를 준비 중입니다.</p>
      )}

      {classes.length ? (
        <div className="grid gap-4">
          <div className="no-scrollbar flex gap-2 overflow-x-auto" role="group" aria-label="요일 선택">
            <button
              type="button"
              onClick={() => setDay(null)}
              aria-pressed={day === null}
              className={`min-h-10 rounded-full px-4 text-sm ${day === null ? 'bg-green text-cream' : 'border border-line text-green'}`}
            >
              전체
            </button>
            {DAYS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDay(d)}
                aria-pressed={day === d}
                className={`min-h-10 min-w-10 rounded-full px-3 text-sm ${day === d ? 'bg-green text-cream' : 'border border-line text-green'}`}
              >
                {d}
              </button>
            ))}
          </div>
          <ul className="grid gap-2 sm:grid-cols-2">
            {filtered.map((c, i) => (
              <li key={`${c.day}-${c.time}-${c.name}-${i}`} className="flex items-center justify-between rounded-lg bg-white px-4 py-3 text-sm">
                <span className="lining-nums tabular-nums text-muted">
                  {c.day} {c.time}
                </span>
                <span className="text-green">
                  {c.name} <span className="text-gold">{c.level}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {image ? <ZoomViewer open={open} onClose={() => setOpen(false)} src={image} alt={alt} title="그룹레슨 시간표" /> : null}
    </div>
  );
}
