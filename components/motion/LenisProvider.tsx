"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/components/motion/gsap";

declare global {
  interface Window {
    /** 供目录等组件复用的平滑滚动实例（仅首页桌面端存在） */
    __lenis?: Lenis;
  }
}

/**
 * 平滑滚动。仅在【首页】桌面端启用 —— 首页有与 GSAP ScrollTrigger 联动的
 * 钉住/贴覆转场，需要 Lenis 统一时钟。
 *
 * 文章等阅读页刻意使用原生滚动：长文阅读对可靠性的要求高于「平滑感」，
 * 且这些页面没有滚动联动动画，Lenis 在此只带来风险（惯性/边界卡顿）而无收益。
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

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
  }, [pathname]);

  return <>{children}</>;
}
