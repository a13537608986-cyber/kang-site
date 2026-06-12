"use client";

import { useEffect, useRef } from "react";

const LETTERS = ["K", "A", "N", "G"];
const PLAY_MS = 1250;

/**
 * 加载动画：KANG 字标逐字上升 + 进度线，随后整层上移揭开页面。
 * 是否显示由 layout 中的内联脚本在首帧前决定（每会话一次、
 * prefers-reduced-motion 跳过）——脚本注入 #kang-preload-gate 样式节点
 * 显示覆盖层并锁定滚动，这里只负责播放与收场（移除该节点）。
 */
export function Preloader() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const gate = document.getElementById("kang-preload-gate");
    const el = ref.current;
    if (!el || !gate) return;

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      try {
        sessionStorage.setItem("kang:preloaded", "1");
      } catch {
        // 隐私模式下忽略
      }
      gate.remove();
    };

    const timer = window.setTimeout(() => {
      el.classList.add("is-done");
      // 覆盖层开始上滑的瞬间通知首屏：入场动画与揭开过程衔接
      window.dispatchEvent(new Event("kang:preloader-done"));
      el.addEventListener("transitionend", finish, { once: true });
      // 兜底：transition 被打断时也要解除滚动锁
      window.setTimeout(finish, 900);
    }, PLAY_MS);

    return () => {
      window.clearTimeout(timer);
      finish();
    };
  }, []);

  return (
    <div id="preloader" ref={ref} aria-hidden="true">
      <span
        className="type-mega overflow-hidden text-[clamp(3rem,10vw,7rem)]"
        style={{ display: "inline-flex" }}
      >
        {LETTERS.map((letter, i) => (
          <span
            key={letter}
            className="preloader-letter"
            style={{ animationDelay: `${i * 0.07}s` }}
          >
            {letter}
          </span>
        ))}
      </span>
      <span className="preloader-bar" />
    </div>
  );
}
