'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as RPointerEvent,
  type WheelEvent as RWheelEvent,
} from 'react';
import { createPortal } from 'react-dom';

type Pt = { x: number; y: number };
const MIN = 1;
const MAX = 5;

/**
 * 이미지 확대 보기 (시간표, 강사 프로필 전체 이미지).
 * - 두 손가락으로 확대/축소, 한 손가락으로 끌어서 이동
 * - 두 번 탭하면 확대, 다시 두 번 탭하면 원래 크기
 * - 원본 비율을 유지하고, 원본 해상도 그대로 확대해 글씨가 흐려지지 않습니다.
 */
export default function ZoomViewer({
  src,
  alt,
  open,
  onClose,
  title,
}: {
  src: string;
  alt: string;
  open: boolean;
  onClose: () => void;
  title?: string;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const pointers = useRef(new Map<number, Pt>());
  const pinch = useRef<{ dist: number; mid: Pt; s: number; t: Pt } | null>(null);
  const drag = useRef<{ start: Pt; t: Pt; moved: boolean } | null>(null);
  const lastTap = useRef(0);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [s, setS] = useState(1);
  const [t, setT] = useState<Pt>({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  const [, setTick] = useState(0);

  useEffect(() => setMounted(true), []);

  // 화면 회전·창 크기 변경 시 다시 맞춤
  useEffect(() => {
    if (!open) return;
    const onResize = () => {
      setTick((n) => n + 1);
      setS(1);
      setT({ x: 0, y: 0 });
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [open]);

  // 열릴 때: 배경 스크롤 잠금, 닫기 버튼에 초점, Esc로 닫기
  useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      prevFocus?.focus?.();
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setS(1);
      setT({ x: 0, y: 0 });
    }
  }, [open]);

  // 화면에 맞춰 보이는 이미지 크기 (확대 전)
  const fitSize = useCallback(() => {
    const el = stage.current;
    if (!el || !natural) return { w: 0, h: 0, cw: 0, ch: 0 };
    const cw = el.clientWidth;
    const ch = el.clientHeight;
    const k = Math.min(cw / natural.w, ch / natural.h);
    return { w: natural.w * k, h: natural.h * k, cw, ch };
  }, [natural]);

  const clamp = useCallback(
    (scale: number, tr: Pt): Pt => {
      const { w, h, cw, ch } = fitSize();
      const mx = Math.max(0, (w * scale - cw) / 2);
      const my = Math.max(0, (h * scale - ch) / 2);
      return { x: Math.min(mx, Math.max(-mx, tr.x)), y: Math.min(my, Math.max(-my, tr.y)) };
    },
    [fitSize],
  );

  // 화면의 한 점(m, 화면 중심 기준)을 고정한 채로 배율을 바꿉니다.
  const zoomAt = useCallback(
    (next: number, m: Pt, base: { s: number; t: Pt }) => {
      const ns = Math.min(MAX, Math.max(MIN, next));
      const q = { x: (m.x - base.t.x) / base.s, y: (m.y - base.t.y) / base.s };
      const nt = clamp(ns, { x: m.x - ns * q.x, y: m.y - ns * q.y });
      setS(ns);
      setT(ns === 1 ? { x: 0, y: 0 } : nt);
    },
    [clamp],
  );

  const local = (e: { clientX: number; clientY: number }): Pt => {
    const r = stage.current!.getBoundingClientRect();
    return { x: e.clientX - r.left - r.width / 2, y: e.clientY - r.top - r.height / 2 };
  };

  function onDown(e: RPointerEvent<HTMLDivElement>) {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, local(e));
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = {
        dist: Math.hypot(a.x - b.x, a.y - b.y) || 1,
        mid: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
        s,
        t,
      };
      drag.current = null;
    } else if (pointers.current.size === 1) {
      drag.current = { start: local(e), t, moved: false };
    }
  }

  function onMove(e: RPointerEvent<HTMLDivElement>) {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, local(e));
    if (pinch.current && pointers.current.size >= 2) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      const p = pinch.current;
      // 확대 + 두 손가락 중심 이동을 함께 반영
      const base = { s: p.s, t: { x: p.t.x + (mid.x - p.mid.x), y: p.t.y + (mid.y - p.mid.y) } };
      zoomAt(p.s * (dist / p.dist), mid, base);
    } else if (drag.current) {
      const cur = local(e);
      const dx = cur.x - drag.current.start.x;
      const dy = cur.y - drag.current.start.y;
      if (Math.abs(dx) + Math.abs(dy) > 4) drag.current.moved = true;
      if (s > 1) setT(clamp(s, { x: drag.current.t.x + dx, y: drag.current.t.y + dy }));
    }
  }

  function onUp(e: RPointerEvent<HTMLDivElement>) {
    const wasDrag = drag.current;
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    if (pointers.current.size === 1) {
      const [only] = [...pointers.current.values()];
      drag.current = { start: only, t, moved: true };
      return;
    }
    drag.current = null;
    // 두 번 탭: 확대 ↔ 원래 크기
    if (wasDrag && !wasDrag.moved) {
      const now = Date.now();
      if (now - lastTap.current < 300) {
        lastTap.current = 0;
        if (s > 1.05) {
          setS(1);
          setT({ x: 0, y: 0 });
        } else zoomAt(2.6, local(e), { s, t });
      } else lastTap.current = now;
    }
  }

  function onWheel(e: RWheelEvent<HTMLDivElement>) {
    const factor = Math.exp(-e.deltaY * 0.0022);
    zoomAt(s * factor, local(e), { s, t });
  }

  const step = (k: number) => zoomAt(s * k, { x: 0, y: 0 }, { s, t });

  if (!open || !mounted) return null;

  const { w, h } = fitSize();

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title ?? alt}
      className="fixed inset-0 z-[100] flex flex-col bg-[#101a16]/95 text-cream"
    >
      <div className="flex items-center justify-between gap-3 px-4 pt-[max(12px,env(safe-area-inset-top))] pb-3">
        <p className="truncate text-sm text-cream/80">{title ?? alt}</p>
        <button
          ref={closeBtn}
          type="button"
          onClick={onClose}
          className="grid size-11 shrink-0 place-items-center rounded-full bg-white/10 text-2xl leading-none hover:bg-white/20"
          aria-label="닫기"
        >
          ×
        </button>
      </div>

      <div
        ref={stage}
        className="relative flex-1 touch-none overflow-hidden select-none"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onWheel={onWheel}
        style={{ cursor: s > 1 ? 'grab' : 'zoom-in' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          draggable={false}
          onLoad={(e) => setNatural({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })}
          className="pointer-events-none absolute top-1/2 left-1/2 max-w-none"
          style={{
            width: w || undefined,
            height: h || undefined,
            maxWidth: w ? undefined : '100%',
            maxHeight: h ? undefined : '100%',
            transform: `translate(-50%, -50%) translate(${t.x}px, ${t.y}px) scale(${s})`,
            transformOrigin: 'center center',
            transition: pinch.current || drag.current ? 'none' : 'transform 180ms ease-out',
          }}
        />
      </div>

      <div className="flex items-center justify-center gap-2 px-4 pt-3 pb-[max(14px,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={() => step(1 / 1.6)}
          className="grid size-11 place-items-center rounded-full bg-white/10 text-xl hover:bg-white/20"
          aria-label="축소"
        >
          −
        </button>
        <button
          type="button"
          onClick={() => {
            setS(1);
            setT({ x: 0, y: 0 });
          }}
          className="h-11 min-w-20 rounded-full bg-white/10 px-4 text-sm tabular-nums hover:bg-white/20"
          aria-label="원래 크기로"
        >
          {Math.round(s * 100)}%
        </button>
        <button
          type="button"
          onClick={() => step(1.6)}
          className="grid size-11 place-items-center rounded-full bg-white/10 text-xl hover:bg-white/20"
          aria-label="확대"
        >
          +
        </button>
      </div>
      <p className="sr-only">두 손가락으로 확대하거나 두 번 탭해 확대할 수 있습니다. Esc 키로 닫습니다.</p>
    </div>,
    document.body,
  );
}
