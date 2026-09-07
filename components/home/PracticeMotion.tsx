"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/components/motion/gsap";
import s from "./PracticeMotion.module.css";

const labels = [
  ["Codex", "openai"], ["Claude Code", "claude"], ["VS Code", "vscode"],
  ["Pi Agent", "pi"], ["Hermes Agent", ""], ["OpenCode", "opencode"],
  ["DeepSeek", "deepseek"], ["Qwen 千问", "qwen"], ["Harness", ""],
];

export function PracticeMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const arena = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = root.current!;
    const box = arena.current!;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
      element.querySelectorAll("details").forEach(card => {
        gsap.fromTo(card, { rotationX: 75, transformPerspective: 1200, transformOrigin: "50% 100%" }, {
          rotationX: 0, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "top 30%", scrub: true, invalidateOnRefresh: true },
        });
      });
    });
    mm.add("(prefers-reduced-motion: no-preference) and (min-width: 992px)", () => {
      const heading = element.querySelector<HTMLElement>("[data-practice-heading]");
      const grid = heading?.parentElement;
      if (!heading || !grid) return;
      // Stop beside the last card row, before the toolbox arena.
      const travel = () => Math.max(0,
        grid.getBoundingClientRect().bottom + 80
        - heading.getBoundingClientRect().top
        + Number(gsap.getProperty(heading, "y"))
        - heading.offsetHeight,
      );
      gsap.to(heading, {
        y: travel,
        ease: "none",
        scrollTrigger: { trigger: heading, start: "top 25%", end: () => `+=${Math.max(1, travel())}`, scrub: true, invalidateOnRefresh: true },
      });
    });
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => mm.revert();
    let disposed = false;
    let cleanup = () => {};
    const observer = new IntersectionObserver(async ([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const { Engine, Bodies, Body, Composite, Constraint } = await import("matter-js");
      if (disposed) return;
      const engine = Engine.create();
      engine.gravity.y = 0.8;
      const chips = [...box.querySelectorAll<HTMLDivElement>("[data-chip]")];
      const width = box.clientWidth, height = box.clientHeight;
      const walls = [Bodies.rectangle(width / 2, height + 10, width + 120, 60, { isStatic: true }), Bodies.rectangle(-30, height / 2, 60, height * 4, { isStatic: true }), Bodies.rectangle(width + 30, height / 2, 60, height * 4, { isStatic: true })];
      const chipSizes = chips.map(chip => ({ width: chip.offsetWidth, height: chip.offsetHeight }));
      const bodies = chips.map((chip, i) => {
        const w = chip.offsetWidth, h = chip.offsetHeight;
        const body = Bodies.rectangle(w / 2 + (width - w) * ((i * .37 + .1) % 1), -70 - i * 85, w, h, { chamfer: { radius: h / 2 - 1 }, restitution: .35, friction: .35, frictionAir: .014, angle: (i % 3 - 1) * .22 });
        return body;
      });
      Composite.add(engine.world, [...walls, ...bodies]);
      box.dataset.active = "true";
      let frame = 0, last = 0;
      let visible = true;
      const visibility = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
      visibility.observe(element);
      const tick = (time: number) => {
        if (visible) {
          Engine.update(engine, Math.min(time - (last || time), 1000 / 60));
          bodies.forEach((body, i) => {
            const halfWidth = (Math.abs(Math.cos(body.angle)) * chips[i].offsetWidth + Math.abs(Math.sin(body.angle)) * chips[i].offsetHeight) / 2;
            const boundedX = Math.max(halfWidth, Math.min(box.clientWidth - halfWidth, body.position.x));
            if (boundedX !== body.position.x) Body.setPosition(body, { x: boundedX, y: body.position.y });
            chips[i].style.transform = `translate(${body.position.x - chips[i].offsetWidth / 2}px, ${body.position.y - chips[i].offsetHeight / 2}px) rotate(${body.angle}rad)`; });
        }
        last = time; frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
      let drag: ReturnType<typeof Constraint.create> | null = null;
      const point = (e: PointerEvent) => { const r = box.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
      const down = (e: PointerEvent) => {
        const chip = (e.target as HTMLElement).closest<HTMLElement>("[data-chip]");
        if (!chip) return;
        const i = Number(chip.dataset.chip);
        drag = Constraint.create({ pointA: point(e), bodyB: bodies[i], length: 0, stiffness: .18, damping: .12 });
        Composite.add(engine.world, drag); box.setPointerCapture(e.pointerId);
      };
      const move = (e: PointerEvent) => { if (drag) drag.pointA = point(e); };
      const up = () => { if (drag) Composite.remove(engine.world, drag); drag = null; };
      box.addEventListener("pointerdown", down); box.addEventListener("pointermove", move); box.addEventListener("pointerup", up); box.addEventListener("pointercancel", up);
      const resize = new ResizeObserver(() => {
        const w = box.clientWidth, h = box.clientHeight;
        Body.setPosition(walls[0], { x: w / 2, y: h + 10 });
        Body.scale(walls[0], (w + 120) / (walls[0].bounds.max.x - walls[0].bounds.min.x), 1);
        Body.setPosition(walls[2], { x: w + 30, y: h / 2 });
        bodies.forEach((b, i) => {
          const next = { width: chips[i].offsetWidth, height: chips[i].offsetHeight };
          Body.scale(b, next.width / chipSizes[i].width, next.height / chipSizes[i].height);
          chipSizes[i] = next;
          Body.setPosition(b, { x: Math.max(next.width / 2, Math.min(w - next.width / 2, b.position.x)), y: Math.min(h - 20 - next.height / 2, b.position.y) });
        });
      }); resize.observe(box);
      cleanup = () => { cancelAnimationFrame(frame); visibility.disconnect(); resize.disconnect(); box.removeEventListener("pointerdown", down); box.removeEventListener("pointermove", move); box.removeEventListener("pointerup", up); box.removeEventListener("pointercancel", up); Composite.clear(engine.world, false); Engine.clear(engine); delete box.dataset.active; chips.forEach(c => c.style.removeProperty("transform")); };
      ScrollTrigger.refresh();
    }, { threshold: .15 });
    observer.observe(box);
    return () => { disposed = true; observer.disconnect(); cleanup(); mm.revert(); };
  }, []);
  return <div ref={root}>{children}<div className={s.tools}>
    <p className={s.caption}>日常工具箱 <span>拖动试试 ↗</span></p>
    <div className={s.arena} ref={arena} aria-label="日常 AI 工具">
      {labels.map(([label, icon], i) => <div data-chip={i} className={s.chip} key={label}>{icon === "vscode" ? <span className={`${s.icon} ${s.vscodeIcon}`} aria-hidden="true" /> : icon && <span className={s.icon} style={{ maskImage: `url(/images/home/tools/${icon === "vscode" ? "vscode.png" : `${icon}.svg`})` }} aria-hidden="true" />}{label}</div>)}
    </div>
  </div></div>;
}
