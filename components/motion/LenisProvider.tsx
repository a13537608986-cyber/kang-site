"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/components/motion/gsap";

declare global {
  interface Window {
    /** 供目录等组件复用的平滑滚动实例（仅桌面端存在） */
    __lenis?: Lenis;
  }
}

/**
 * 桌面端平滑滚动。
 * 仅在精细指针 + ≥1024px + 未开启「减少动态」时启用；
 * 移动端与减少动态环境保持原生滚动。
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const wide = window.matchMedia("(min-width: 1024px)").matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!fine || !wide || reduced) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    window.__lenis = lenis;

    // 与 ScrollTrigger 共用一个 rAF 时钟
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return <>{children}</>;
}
