"use client";

import { useEffect, useMemo, useState, type MouseEvent } from "react";
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
  const chapters = useMemo(() => items.filter((item) => item.depth === 2), [items]);

  useEffect(() => {
    const headings = chapters
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
  }, [chapters]);

  return (
    <nav aria-label="文章章节" className="text-sm">
      <TocList items={chapters} activeId={activeId} numbered />
    </nav>
  );
}

function TocList({
  items,
  activeId,
  className = "",
  numbered = false,
}: {
  items: TocItem[];
  activeId: string | null;
  className?: string;
  numbered?: boolean;
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
      {items.map((item, index) => {
        const active = item.id === activeId;
        return (
          <li key={item.id} className={item.depth === 3 ? "pl-4" : ""}>
            <a
              href={`#${item.id}`}
              onClick={(e) => onClick(e, item.id)}
              aria-current={active ? "true" : undefined}
              className={`leading-snug transition-colors ${
                numbered ? "grid grid-cols-[1.5rem_1fr] gap-2" : "block border-l-2 pl-3"
              } ${active ? "border-fg text-fg" : "border-transparent text-fg-muted hover:text-fg"}`}
            >
              {numbered ? (
                <span className="type-label text-fg-faint" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
              ) : null}
              <span>{item.text}</span>
            </a>
          </li>
        );
      })}
    </ol>
  );
}
