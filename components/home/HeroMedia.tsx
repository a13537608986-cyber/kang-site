import fs from "node:fs";
import path from "node:path";
import { HeroMediaClient } from "@/components/home/HeroMediaClient";

/**
 * 首屏媒体素材配置 —— 路径与人物构图集中在此，不散落到其他组件。
 *
 * 启用方式：把素材放入 public 下对应路径即可，构建时自动检测，无需改代码。
 *   桌面横版视频（1920×1030）：public/videos/kang-hero.mp4
 *   桌面 poster（与视频同构图）：public/images/kang-hero-poster.jpg
 *   移动竖版 poster：           public/images/kang-hero-mobile.jpg
 *   移动竖版视频（可选）：       public/videos/kang-hero-mobile.mp4
 *
 * 素材到位前渲染明确标注的 DEMO 占位层。
 *
 * 分层说明：当前方案是「全屏视频背景 + 网页文字覆盖」。
 * 若要实现人物位于巨型 KANG 字母前方的穿插遮挡（Alaric 风格），
 * 普通背景视频做不到，需要透明背景人物视频 / 人物抠像视频 /
 * alpha 遮罩序列 / 已合成好的成片，届时在本组件上叠加人物前景层即可，
 * 页面其余结构无需变动。
 */
const MEDIA = {
  desktopVideo: "/videos/kang-hero.mp4",
  mobileVideo: "/videos/kang-hero-mobile.mp4",
  desktopPoster: "/images/kang-hero-poster.jpg",
  mobilePoster: "/images/kang-hero-mobile.jpg",
  /**
   * 人物主体在画面中的位置（object-position）。
   * 正式视频到位后按实际构图调整，保证不裁掉人物头部与主体，
   * 例如人物偏右时改为 "70% center"。
   */
  objectPosition: "center 30%",
} as const;

function inPublic(relPath: string): boolean {
  return fs.existsSync(path.join(process.cwd(), "public", relPath));
}

/** 首屏背景媒体层：视频 / poster / DEMO 占位 + 可读性渐变 */
export function HeroMedia() {
  const desktopVideo = inPublic(MEDIA.desktopVideo) ? MEDIA.desktopVideo : null;
  const mobileVideo = inPublic(MEDIA.mobileVideo) ? MEDIA.mobileVideo : null;
  const desktopPoster = inPublic(MEDIA.desktopPoster) ? MEDIA.desktopPoster : null;
  const mobilePoster = inPublic(MEDIA.mobilePoster) ? MEDIA.mobilePoster : null;
  const hasAnyMedia = Boolean(desktopVideo || desktopPoster || mobilePoster);

  return (
    <div className="absolute inset-0 overflow-hidden bg-bg">
      {hasAnyMedia ? (
        <HeroMediaClient
          desktopVideo={desktopVideo}
          mobileVideo={mobileVideo}
          desktopPoster={desktopPoster}
          mobilePoster={mobilePoster}
          objectPosition={MEDIA.objectPosition}
        />
      ) : (
        <HeroMediaPlaceholder />
      )}

      {/* 可读性渐变：克制的顶部渐暗 + 底部渐隐 + 轻暗角，不用厚重整层遮罩 */}
      <div aria-hidden="true">
        <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[color-mix(in_srgb,var(--gray-0)_72%,transparent)] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[36%] bg-gradient-to-t from-[var(--gray-1)] via-[color-mix(in_srgb,var(--gray-1)_50%,transparent)] to-transparent" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 38%, transparent 58%, color-mix(in srgb, var(--gray-0) 42%, transparent) 100%)",
          }}
        />
      </div>
    </div>
  );
}

/** 素材未提供时的 DEMO 占位层（放入正式素材后自动消失） */
function HeroMediaPlaceholder() {
  return (
    <div aria-hidden="true" className="absolute inset-0">
      <div className="blueprint-grid absolute inset-0 opacity-70" />
      <div className="scan-line motion-reduce:hidden" />

      <span className="absolute left-6 top-24 h-4 w-4 border-l border-t border-line-strong" />
      <span className="absolute right-6 top-24 h-4 w-4 border-r border-t border-line-strong" />
      <span className="absolute bottom-6 left-6 h-4 w-4 border-b border-l border-line-strong" />
      <span className="absolute bottom-6 right-6 h-4 w-4 border-b border-r border-line-strong" />

      <div className="absolute inset-x-0 top-[30%] flex justify-center">
        <p className="type-label text-center leading-loose text-fg-faint">
          HERO VIDEO PLACEHOLDER · DEMO
          <br />
          横版视频占位 · 1920×1030
          <br />
          放入 public{MEDIA.desktopVideo} 与 poster 后自动启用
        </p>
      </div>
    </div>
  );
}
