'use client';

import { useEffect } from 'react';

// 페이지의 움직이는 부분: 헤더 테두리, 관리 과정 타임라인, 등장 애니메이션.
export default function Interactions() {
  useEffect(() => {
    const top = document.getElementById('top');
    const tl = document.getElementById('timeline');
    const fill = tl?.querySelector<HTMLElement>('.fill');
    const steps = tl ? Array.from(tl.querySelectorAll<HTMLElement>('.t-step')) : [];
    const onScroll = () => {
      top?.classList.toggle('scrolled', window.scrollY > 8);
      if (tl && fill) {
        const r = tl.getBoundingClientRect();
        const mid = window.innerHeight * 0.6;
        const p = Math.max(0, Math.min(1, (mid - r.top) / r.height));
        fill.style.height = `${p * 100}%`;
        steps.forEach((s) => s.classList.toggle('on', s.getBoundingClientRect().top < mid));
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    let io: IntersectionObserver | undefined;
    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      io = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('in');
              io?.unobserve(e.target);
            }
          }),
        { rootMargin: '0px 0px -8% 0px' },
      );
      document.querySelectorAll('.reveal').forEach((el) => {
        if (el.getBoundingClientRect().top > window.innerHeight) io?.observe(el);
      });
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      io?.disconnect();
    };
  }, []);

  return null;
}
