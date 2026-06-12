import Image from "next/image";

interface CoverImageProps {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

/**
 * 封面图。调用方负责相对定位与宽高比容器（fill 模式），
 * 因此不会产生布局偏移。SVG 占位图跳过优化管线。
 */
export function CoverImage({
  src,
  alt,
  sizes,
  priority = false,
  className = "",
}: CoverImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={src.endsWith(".svg")}
      className={`object-cover ${className}`}
    />
  );
}
