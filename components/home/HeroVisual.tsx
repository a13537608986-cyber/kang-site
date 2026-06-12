/**
 * 首屏真人素材占位。
 *
 * 【替换方式】拿到真人照片 / 短视频后，把整段占位 div 换成：
 *   照片：<Image src="/images/portrait.jpg" alt="KANG 的照片" fill priority
 *               sizes="(max-width: 768px) 90vw, 38vw" className="object-cover" />
 *   视频：<video src="/videos/portrait.mp4" poster="/images/portrait-poster.jpg"
 *               muted loop playsInline autoPlay className="h-full w-full object-cover" />
 * 外层容器（宽高比 4:5、发丝边框）保持不变即可。
 */
export function HeroVisual() {
  return (
    <figure className="relative aspect-[4/5] w-full overflow-hidden border border-line bg-bg-raised">
      <span className="sr-only">真人照片或短视频占位区域</span>

      <div className="blueprint-grid absolute inset-0" aria-hidden="true" />
      <div className="scan-line motion-reduce:hidden" aria-hidden="true" />

      {/* 取景框角标 */}
      <div aria-hidden="true">
        <span className="absolute left-3 top-3 h-4 w-4 border-l border-t border-line-strong" />
        <span className="absolute right-3 top-3 h-4 w-4 border-r border-t border-line-strong" />
        <span className="absolute bottom-3 left-3 h-4 w-4 border-b border-l border-line-strong" />
        <span className="absolute bottom-3 right-3 h-4 w-4 border-b border-r border-line-strong" />
      </div>

      {/* 中心十字与标注 */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-5"
        aria-hidden="true"
      >
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="var(--fg-faint)">
          <path d="M24 8v32M8 24h32" strokeWidth="1" />
          <circle cx="24" cy="24" r="15" strokeWidth="1" strokeDasharray="3 5" />
        </svg>
        <p className="type-label text-center leading-loose text-fg-faint">
          PORTRAIT PLACEHOLDER
          <br />
          真人素材占位 · 4:5
          <br />
          ≥1280×1600 · 照片或静音短视频
        </p>
      </div>

      <figcaption className="type-label absolute inset-x-8 bottom-3 truncate text-center text-fg-faint">
        FIG.00 · 可替换占位
      </figcaption>
    </figure>
  );
}
