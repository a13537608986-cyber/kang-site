"use client";

import { useEffect, useRef, useState } from "react";

interface HeroMediaClientProps {
  /** 桌面横版视频（1920×1030），无则为 null */
  desktopVideo: string | null;
  /** 移动竖版视频（可选素材），无则为 null —— 移动端绝不回退播放横版 */
  mobileVideo: string | null;
  desktopPoster: string | null;
  mobilePoster: string | null;
  objectPosition: string;
}

/**
 * 首屏媒体播放器。加载与降级策略：
 * 1. poster 随 SSR 输出，先于一切显示（无 JS / 无视频时即最终状态）；
 * 2. 按断点选择视频源：桌面用横版，移动端只在有竖版视频时才播放；
 * 3. 视频 canplay 后淡入覆盖 poster，加载失败或 autoplay 被拒则停留在 poster；
 * 4. prefers-reduced-motion 下不加载视频，只显示 poster；
 * 5. 所有层 absolute 定位，加载过程零布局偏移。
 */
export function HeroMediaClient({
  desktopVideo,
  mobileVideo,
  desktopPoster,
  mobilePoster,
  objectPosition,
}: HeroMediaClientProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // 按挂载时的断点决定一次视频源；跨断点 resize 属边缘场景，不动态切换
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    const src = isDesktop ? desktopVideo : mobileVideo;
    if (!src) return;

    // 只有 play() 真正成功才淡入；autoplay 被拒或加载失败一律停留在 poster
    const tryPlay = () => {
      video.play().then(
        () => setPlaying(true),
        () => setPlaying(false),
      );
    };
    const onError = () => setPlaying(false);
    // 后台标签页中 autoplay 会被拒，回到前台时重试
    const onVisibilityChange = () => {
      if (!document.hidden && video.paused) tryPlay();
    };

    video.addEventListener("error", onError);
    document.addEventListener("visibilitychange", onVisibilityChange);
    video.src = src;
    tryPlay();

    return () => {
      video.removeEventListener("error", onError);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [desktopVideo, mobileVideo]);

  const posterSrc = desktopPoster ?? mobilePoster;

  return (
    <>
      {posterSrc ? (
        <picture>
          {mobilePoster ? (
            <source media="(max-width: 767px)" srcSet={mobilePoster} />
          ) : null}
          {/* 原生 picture + img：断点级 art direction（桌面横版 / 移动竖版各自下载） */}
          <img
            src={posterSrc}
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition }}
          />
        </picture>
      ) : null}

      <video
        ref={videoRef}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 motion-reduce:hidden ${
          playing ? "opacity-100" : "opacity-0"
        }`}
        style={{ objectPosition }}
      />
    </>
  );
}
