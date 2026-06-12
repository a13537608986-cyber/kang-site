"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site";
import { IconClose } from "@/components/ui/icons";

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * 全站导航。固定顶栏 + 移动端全屏菜单。
 * 颜色全部来自所在主题作用域的语义变量，深浅页面自动适配。
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // 滚动后给顶栏加底色与发丝线
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > 16));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // 路由变化时收起菜单（渲染期调整状态，避免多余一帧）
  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  // 菜单打开时锁定滚动、Escape 关闭、焦点移入面板并圈定在
  // 「切换按钮 + 菜单链接」之间（aria-modal 语义要求）
  useEffect(() => {
    if (!open) return;
    const toggle = toggleRef.current;
    document.body.style.overflow = "hidden";
    const firstLink = panelRef.current?.querySelector<HTMLElement>("a");
    firstLink?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables: HTMLElement[] = [
        ...(toggle ? [toggle] : []),
        ...panelRef.current.querySelectorAll<HTMLElement>("a"),
      ];
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      } else if (!active || !focusables.includes(active)) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      // 焦点归还给切换按钮，避免落入被遮挡的内容
      toggle?.focus();
    };
  }, [open]);

  const toggle = useCallback(() => setOpen((v) => !v), []);

  return (
    <>
      <a
        href="#main"
        className="type-label fixed left-4 top-4 z-[80] -translate-y-24 bg-fg px-4 py-3 text-bg transition-transform focus-visible:translate-y-0"
      >
        跳到正文
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
          scrolled && !open
            ? "border-b border-line bg-[color-mix(in_srgb,var(--bg)_88%,transparent)] backdrop-blur-md"
            : "border-b border-transparent"
        }`}
      >
        <div className="container-k flex h-16 items-center justify-between">
          <Link
            href="/"
            aria-label="KANG — 返回首页"
            className="type-mega text-lg leading-none"
          >
            {siteConfig.brand}
          </Link>

          <nav aria-label="主导航" className="hidden items-center gap-9 md:flex">
            {siteConfig.nav.map((item, i) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`group flex items-baseline gap-2 text-sm transition-colors ${
                    active ? "text-fg" : "text-fg-muted hover:text-fg"
                  }`}
                >
                  <span className="type-label" aria-hidden="true">
                    0{i + 1}
                  </span>
                  <span
                    className={`link-slide ${active ? "[background-size:100%_1px]" : ""}`}
                  >
                    {item.zh}
                  </span>
                </Link>
              );
            })}
          </nav>

          <button
            ref={toggleRef}
            type="button"
            onClick={toggle}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="type-label flex h-10 items-center gap-2 text-fg md:hidden"
          >
            {open ? <IconClose width={14} height={14} /> : null}
            {open ? "关闭" : "菜单"}
          </button>
        </div>
      </header>

      {/* 移动端全屏菜单 */}
      <div
        id="mobile-menu"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="导航菜单"
        hidden={!open}
        className="fixed inset-0 z-40 bg-bg pt-24 md:hidden"
      >
        <nav aria-label="移动端导航" className="container-k">
          <ul className="flex flex-col">
            {siteConfig.nav.map((item, i) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href} className="hairline-b">
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className="flex items-baseline justify-between py-6"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="type-label text-fg-muted" aria-hidden="true">
                        0{i + 1}
                      </span>
                      <span className="type-headline text-3xl">{item.zh}</span>
                    </span>
                    <span
                      className={`type-label ${active ? "text-fg" : "text-fg-faint"}`}
                      lang="en"
                    >
                      {item.en}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <p className="type-label mt-10 text-fg-faint">
            {siteConfig.brand} · AI PRODUCT MANAGER
          </p>
        </nav>
      </div>
    </>
  );
}
