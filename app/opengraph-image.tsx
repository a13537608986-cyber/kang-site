import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * 站点默认分享图（构建时静态生成）。
 * 仅使用英文字形以控制字体体积；中文标题由各页 metadata 承担。
 */
export const alt = "KANG — AI PRODUCT MANAGER";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const fontData = await readFile(
    path.join(process.cwd(), "assets/fonts/IBMPlexMono-SemiBold.ttf"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0d0d0c",
          color: "#f3f2ed",
          padding: 56,
          fontFamily: "IBM Plex Mono",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: 6,
            color: "#9d9d99",
            borderBottom: "1px solid #2a2a28",
            paddingBottom: 24,
          }}
        >
          <span>PERSONAL ARCHIVE</span>
          <span>ARCHIVE SINCE 2023</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div style={{ fontSize: 232, letterSpacing: -6, lineHeight: 1 }}>
            KANG
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 24,
            letterSpacing: 6,
            color: "#9d9d99",
            borderTop: "1px solid #2a2a28",
            paddingTop: 24,
          }}
        >
          <span>AI PRODUCT MANAGER</span>
          <span>JUDGMENT · EVALS · CONTEXT</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "IBM Plex Mono",
          data: fontData,
          weight: 600,
          style: "normal",
        },
      ],
    },
  );
}
