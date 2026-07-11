import fs from "node:fs";
import path from "node:path";

/**
 * 头像：构建时检测 public/images/portrait.{jpg,png,webp} 是否存在，
 * 存在返回其站内路径，否则返回 null（调用方回退为「康」字圆标）。
 * 放入照片文件即自动启用，无需改代码。
 */
export function resolvePortrait(): string | null {
  for (const ext of ["jpg", "jpeg", "png", "webp"]) {
    const rel = `/images/portrait.${ext}`;
    if (fs.existsSync(path.join(process.cwd(), "public", rel))) return rel;
  }
  return null;
}
