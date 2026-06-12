"use client";

import { useEffect, useRef } from "react";

/** 阅读进度细线（顶栏下沿）。纯视觉装饰，对辅助技术隐藏。 */
export function ReadingProgress() {
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    let raf = 0;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      bar.style.transform = `scaleX(${ratio})`;
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
    <span
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-16 z-50 block h-px bg-line"
    >
      <span
        ref={barRef}
        className="block h-full origin-left bg-accent"
        style={{ transform: "scaleX(0)" }}
      />
    </span>
  );
}
