import Link from "next/link";
import type { ArticleListItem } from "@/lib/content/articles";
import { formatDateCompact } from "@/lib/dates";
import { CoverImage } from "@/components/ui/CoverImage";

/** 文章尾部：按 Revision 的 Read Next 版式呈现三篇延伸阅读 */
export function ArticleFooterNav({
  related,
}: {
  related: ArticleListItem[];
}) {
  return (
    <footer className="container-k mt-28 mb-[120px] w-full sm:mt-36 [font-family:var(--font-dm-sans),var(--font-archivo),sans-serif]">
      <div className="mx-auto w-full max-w-[74rem]">
        <h2 className="mb-6 text-[24px] font-bold leading-[28.8px] tracking-[-0.96px] text-fg md:mb-8 md:text-[33px] md:leading-[39.6px] md:tracking-[-1.32px]">
          Read Next
        </h2>

        <ul className="grid gap-x-6 gap-y-10 lg:grid-cols-3 lg:gap-y-12">
        {related.slice(0, 3).map((article) => {
          const tags = article.tags.filter((tag) => tag !== "DEMO").slice(0, 2);

          return (
            <li key={article.slug}>
              <Link href={`/articles/${article.slug}`} className="group block">
                <div className="relative aspect-video overflow-hidden rounded-2xl bg-bg-sunken">
                  {article.cover ? (
                    <CoverImage
                      src={article.cover}
                      alt={`${article.title} 封面图`}
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="transition-transform duration-500 group-hover:scale-[1.025]"
                    />
                  ) : null}

                  <div className="absolute left-5 top-5 flex flex-wrap gap-2.5">
                    {(tags.length > 0 ? tags : [article.category]).map((tag) => (
                      <span
                        key={tag}
                        className="flex h-[33.2px] items-center rounded-md bg-white px-[11px] text-[11px] font-extrabold leading-[13.2px] tracking-[1.1px] text-black"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="mt-5 flex flex-wrap items-baseline gap-x-1.5 text-[15px] font-semibold leading-[18px] tracking-[-0.3px] text-fg-muted">
                  <time dateTime={article.date}>{formatDateCompact(article.date)}</time>
                </p>

                <h3 className="mt-2.5 line-clamp-2 min-h-[50.4px] text-[21px] font-bold leading-[25.2px] tracking-[-0.84px] text-fg">
                  {article.title}
                </h3>

                <p className="mt-[22px] line-clamp-3 min-h-[74.4px] text-[16px] font-normal leading-[24.8px] text-fg-muted">
                  {article.summary}
                </p>
              </Link>
            </li>
          );
        })}
        </ul>
      </div>
    </footer>
  );
}
