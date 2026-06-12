import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef } from "react";
import Image from "next/image";
import Link from "next/link";

/**
 * 全局 MDX 组件映射（Next.js 官方约定文件）。
 * 正文版式由 globals.css 的 .prose 负责，这里只处理语义与行为。
 */

function MdxImage(props: ComponentPropsWithoutRef<"img">) {
  // Markdown 图片不带可靠尺寸，统一交给 next/image 的固定基准 + height:auto
  const { src, alt = "", width, height, ...rest } = props;
  void width;
  void height;
  if (typeof src !== "string") return null;
  return (
    <Image
      src={src}
      alt={alt}
      // 基准比例与 public/images 占位图一致（1600×1000，16:10），避免加载后高度跳动；
      // 正文使用其他比例的图片时建议同样保持 16:10，或改用 <figure> 包裹真实尺寸
      width={1600}
      height={1000}
      sizes="(max-width: 768px) 100vw, 720px"
      // SVG 占位图无需经过优化管线；位图沿用默认优化
      unoptimized={src.endsWith(".svg")}
      style={{ width: "100%", height: "auto" }}
      {...rest}
    />
  );
}

function MdxLink(props: ComponentPropsWithoutRef<"a">) {
  const { href = "", children, ...rest } = props;
  const isExternal = /^https?:\/\//.test(href);
  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}

function MdxTable(props: ComponentPropsWithoutRef<"table">) {
  return (
    <div className="table-wrap">
      <table {...props} />
    </div>
  );
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    img: MdxImage,
    a: MdxLink,
    table: MdxTable,
    ...components,
  };
}
