import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { IconArrowRight } from "@/components/ui/icons";

interface SectionHeadProps {
  /** 编号，如 "01" */
  index: string;
  /** 英文栏目名（视觉装饰） */
  en: string;
  /** 中文标题（信息主体） */
  zh: string;
  /** 右侧可选的「查看全部」入口 */
  more?: { href: string; label: string };
}

/**
 * 统一的章节标头：编号 + 英文栏目 + 中文标题。
 * 全站的编号系统由此组件保证一致。
 */
export function SectionHead({ index, en, zh, more }: SectionHeadProps) {
  return (
    <Reveal as="header" className="hairline-t pt-5">
      <div className="flex items-baseline justify-between gap-4">
        <p className="type-label text-fg-muted">
          <span aria-hidden="true">{index}</span>
          <span className="mx-3" aria-hidden="true">
            /
          </span>
          <span lang="en">{en}</span>
        </p>
        {more ? (
          <Link
            href={more.href}
            className="type-label link-slide inline-flex items-center gap-1.5 text-fg-muted transition-colors hover:text-fg"
          >
            {more.label}
            <IconArrowRight width={12} height={12} />
          </Link>
        ) : null}
      </div>
      <h2 className="type-headline mt-6 text-[clamp(1.75rem,3.5vw,2.75rem)]">
        {zh}
      </h2>
    </Reveal>
  );
}
