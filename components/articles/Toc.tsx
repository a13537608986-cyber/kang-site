"use client";

import { useEffect, useState, type MouseEvent } from "react";
import type { TocItem } from "@/lib/toc";

/**
 * 文章目录。
 * 桌面端：悬浮侧栏 + 滚动高亮（IntersectionObserver scrollspy）；
 * 移动端：<details> 折叠列表（由父级用 variant 区分渲染）。
 */
export function Toc({
  items,
  variant,
}: {
  items: TocItem[];
  variant: "sidebar" | "collapsible";
}) {
  if (items.length === 0) return null;
  return variant === "sidebar" ? (
    <SidebarToc items={items} />
  ) : (
    <details className="border-y border-line py-4">
      <summary className="type-label cursor-pointer select-none text-fg-muted">
        目录 / CONTENTS
      </summary>
      <TocList items={items} activeId={null} className="mt-4" />
    </details>
  );
}

function SidebarToc({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        // 取视口上沿区域内最靠前的标题
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );
    headings.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, [items]);

  return (
    <nav aria-label="目录" className="text-sm">
      <p className="type-label mb-5 text-fg-muted">目录 / CONTENTS</p>
      <TocList items={items} activeId={activeId} />
    </nav>
  );
}

function TocList({
  items,
  activeId,
  className = "",
}: {
  items: TocItem[];
  activeId: string | null;
  className?: string;
}) {
  const onClick = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return; // 交给默认锚点行为
    e.preventDefault();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const top = el.getBoundingClientRect().top + window.scrollY - 96;
    if (window.__lenis && !reduced) {
      window.__lenis.scrollTo(top);
    } else {
      window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
    }
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <ol className={`space-y-2.5 ${className}`}>
      {items.map((item) => {
        const active = item.id === activeId;
        return (
          <li key={item.id} className={item.depth === 3 ? "pl-4" : ""}>
            <a
              href={`#${item.id}`}
              onClick={(e) => onClick(e, item.id)}
              aria-current={active ? "true" : undefined}
              className={`block border-l-2 pl-3 leading-snug transition-colors ${
                active
                  ? "border-fg text-fg"
                  : "border-transparent text-fg-muted hover:text-fg"
              }`}
            >
              {item.text}
            </a>
          </li>
        );
      })}
    </ol>
  );
}
