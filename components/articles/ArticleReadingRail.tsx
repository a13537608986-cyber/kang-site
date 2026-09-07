"use client";

import { useEffect, useRef } from "react";

/** 正文左侧的轻量阅读刻度；只在宽屏展示，不占用正文阅读宽度。 */
export function ArticleReadingRail({ minutes }: { minutes: number }) {
  const fillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fill = fillRef.current;
    if (!fill) return;

    let raf = 0;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      fill.style.transform = `scaleY(${ratio})`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="sticky top-28 flex flex-col items-center" aria-label={`预计阅读 ${minutes} 分钟`}>
      <span aria-hidden="true" className="relative block h-24 w-px bg-line">
        <span
          ref={fillRef}
          className="absolute inset-0 block origin-top bg-fg"
          style={{ transform: "scaleY(0)" }}
        />
      </span>
      <span className="type-label mt-4 whitespace-nowrap text-fg-faint">
        {minutes} MIN
      </span>
    </div>
  );
}
