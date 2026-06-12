"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
  type Ref,
} from "react";

type RevealTag = "div" | "section" | "article" | "li" | "span" | "header";

interface RevealProps {
  children: ReactNode;
  as?: RevealTag;
  /** 进入延迟（秒），用于同屏元素的级联节奏 */
  delay?: number;
  className?: string;
}

/**
 * 章节进入动画：IntersectionObserver 触发一次性上浮淡入。
 * 视觉由 globals.css 的 [data-reveal] 规则承担；
 * 无 JS 或减少动态时内容直接可见，不阻塞阅读。
 */
export function Reveal({ children, as = "div", delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.setAttribute("data-reveal", "in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.setAttribute("data-reveal", "in");
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as as ElementType;
  return (
    <Tag
      ref={ref as Ref<never>}
      className={className}
      data-reveal=""
      style={{ "--reveal-delay": `${delay}s` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
