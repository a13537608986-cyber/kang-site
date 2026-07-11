import Image from "next/image";
import { resolvePortrait } from "@/lib/portrait";
import { profile } from "@/lib/profile";

/** 圆形头像：有照片显示照片，否则回退「康」字圆标 */
export function Avatar({ size = 56 }: { size?: number }) {
  const portrait = resolvePortrait();
  if (portrait) {
    return (
      <Image
        src={portrait}
        alt={`${profile.name}的照片`}
        width={size}
        height={size}
        className="shrink-0 rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="flex shrink-0 items-center justify-center rounded-full bg-fg font-bold text-bg"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      康
    </span>
  );
}
