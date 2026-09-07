"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/components/motion/gsap";
import { profile } from "@/lib/profile";

/**
 * 首屏：全屏真人视频背景（HeroMedia，经 props 注入的服务端组件）+
 * 身份信息作为网页内容覆盖其上。
 * 巨型 KANG 字标不在前景渲染 —— 由正式视频内合成（与人物的遮挡关系在片内完成）。
 * 第二幕「核心观点」以贴覆（sticky cover）方式滑入，
 * GSAP 负责入场与滚动联动；移动端与减少动态环境退化为普通文档流。
 *
 * 文字布局刻意只占顶部一行与底部信息条，中部留给画面中的人物；
 * 正式视频到位后若构图冲突，优先调 HeroMedia 的 objectPosition。
 */
export function HomeHero({ media, viewpoint }: { media: ReactNode; viewpoint: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const vpRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // 入场：元信息级联浮现（字标已移入视频，不再有逐字动画）。
      // 首访时加载动画覆盖在上层，等它开始揭开（kang:preloader-done）再播放。
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const entrance = gsap
          .timeline({ paused: true, defaults: { ease: "power4.out" } })
          .from(".hero-fade", {
            y: 22,
            autoAlpha: 0,
            duration: 0.8,
            stagger: 0.08,
            delay: 0.2,
          });

        const play = () => entrance.play();
        if (document.getElementById("kang-preload-gate")) {
          window.addEventListener("kang:preloader-done", play, { once: true });
        } else {
          play();
        }
        return () => {
          window.removeEventListener("kang:preloader-done", play);
        };
      });

      // 桌面端滚动联动：观点面板贴覆时，首幕（含视频背景）整体后退、观点逐行揭示
      mm.add(
        "(prefers-reduced-motion: no-preference) and (min-width: 768px)",
        () => {
          gsap.to(".hero-stage", {
            scale: 0.965,
            yPercent: -5,
            autoAlpha: 0,
            ease: "none",
            scrollTrigger: {
              trigger: vpRef.current,
              start: "top bottom",
              end: "top 20%",
              scrub: true,
            },
          });

        },
      );
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(".vp-char", { opacity: 0.3 }, {
          opacity: 1, stagger: 0.035, ease: "none",
          scrollTrigger: { trigger: vpRef.current, start: "top 80%", end: "top 25%", scrub: 0.6 },
        });
        gsap.utils.toArray<HTMLElement>(".vp-principle").forEach((item, i) => {
          gsap.from(item, {
            autoAlpha: 0, y: 20, duration: 0.7, delay: i * 0.09, ease: "power2.out",
            scrollTrigger: { trigger: item, start: "top 90%", once: true },
          });
        });
      });

    },
    { scope: root },
  );

  return (
    <div ref={root}>
      {/* 第一幕 —— 全屏视频 Hero，桌面端 sticky，被第二幕贴覆 */}
      <section
        aria-label="李康 · 个人介绍"
        className="relative overflow-hidden motion-safe:md:sticky motion-safe:md:top-0 motion-safe:md:h-svh"
      >
        <h1 className="sr-only">KANG · 李康 — 正在进化的 AI 产品经理</h1>

        <div className="hero-stage relative flex min-h-svh flex-col will-change-transform">
          {/* 背景媒体层：视频 / poster / DEMO 占位（HeroMedia 服务端组件） */}
          <div className="absolute inset-0 z-0">{media}</div>

          {/* 内容层 */}
          <div className="container-k relative z-10 flex flex-1 flex-col pt-24">
            <div className="hero-fade flex items-baseline justify-between gap-4">
              <p className="type-label text-fg-muted" lang="en">
                AI PRODUCT MANAGER
              </p>
              <p className="type-label hidden text-fg-faint sm:block" lang="en">
                OPERATING FROM CN · UTC+8
              </p>
            </div>

            {/* 底部信息条：身份与定位（巨型 KANG 字标由视频内合成，前景不渲染） */}
            <div className="hairline-t mt-auto grid gap-6 pb-10 pt-6 md:grid-cols-12 md:gap-8">
              <div className="hero-fade md:col-span-6">
                <p className="type-headline text-xl">李康 · 正在进化的 AI 产品经理</p>
                <p className="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-fg-muted">
                  {profile.positioning}
                </p>
              </div>

              <div className="hero-fade flex items-end justify-between md:col-span-6 md:justify-end md:gap-12">
                <p className="type-label text-fg-faint" lang="en">
                  ARCHIVE SINCE 2023
                </p>
                <p
                  className="type-label flex items-center gap-3 text-fg-muted"
                  aria-hidden="true"
                >
                  SCROLL
                  <span className="relative h-px w-10 overflow-hidden bg-line-strong">
                    <span className="absolute inset-0 origin-left animate-pulse bg-fg" />
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 首页深色观点面板，首屏视频与内容保持原样。 */}
      <section
        ref={vpRef}
        aria-label="核心观点"
        data-theme="dark"
        className="relative z-10 bg-bg text-fg"
      >
        {viewpoint}
      </section>
    </div>
  );
}
