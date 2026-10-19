'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// 분석 화면을 누르면 크게 열어 보는 확대 보기. 글씨가 작은 화면도 손가락으로 확대해 읽을 수 있습니다.
// - 닫기: 배경·닫기 버튼 누르기 또는 Esc
// - 크게 보기: 이미지를 두 번 누르면 원본 크기(스크롤로 이동), 다시 두 번 누르면 화면에 맞춤
export default function Zoom({
  src,
  alt,
  width,
  height,
  caption,
  className,
  lazy = true,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  className?: string;
  lazy?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [full, setFull] = useState(false);
  const opener = useRef<HTMLButtonElement>(null);
  const closer = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setFull(false);
    opener.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closer.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  return (
    <>
      <button
        ref={opener}
        type="button"
        className={`zoom-open ${className ?? ''}`}
        onClick={() => setOpen(true)}
        aria-label={`${alt} — 크게 보기`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} width={width} height={height} loading={lazy ? 'lazy' : undefined} decoding="async" />
        <span className="zoom-hint" aria-hidden="true">
          크게 보기 +
        </span>
      </button>
      {open ? (
        <div className="zoom-modal" role="dialog" aria-modal="true" aria-label={alt}>
          <button type="button" className="zoom-bg" onClick={close} aria-label="닫기" tabIndex={-1} />
          <button ref={closer} type="button" className="zoom-close" onClick={close} aria-label="크게 보기 닫기">
            ×
          </button>
          <div className={`zoom-stage${full ? ' is-full' : ''}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              width={width}
              height={height}
              onDoubleClick={() => setFull((v) => !v)}
              draggable={false}
            />
          </div>
          <p className="zoom-cap">{caption ?? alt}{' · '}<span>두 번 누르면 원본 크기</span></p>
        </div>
      ) : null}
    </>
  );
}
