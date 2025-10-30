'use client';

import { useEffect, useRef, useState } from 'react';

type Opt = { rootMargin?: string; threshold?: number | number[] };

export function useInViewport<T extends Element>(opt: Opt = {}) {
  const targetRef = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = targetRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { root: null, rootMargin: opt.rootMargin ?? '200px 0px', threshold: opt.threshold ?? 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [opt.rootMargin, opt.threshold]);

  return { ref: targetRef, inView };
}
