import { getAllArticles } from "@/lib/content/articles";
import { formatDateRfc822 } from "@/lib/dates";
import { absoluteUrl, siteConfig } from "@/lib/site";

/** RSS 2.0，构建时静态生成 */
export const dynamic = "force-static";

function cdata(text: string): string {
  return `<![CDATA[${text.replaceAll("]]>", "]]]]><![CDATA[>")}]]>`;
}

export function GET() {
  const articles = getAllArticles();

  const items = articles
    .map((article) => {
      const url = absoluteUrl(`/articles/${article.slug}`);
      return [
        "    <item>",
        `      <title>${cdata(article.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <pubDate>${formatDateRfc822(article.date)}</pubDate>`,
        `      <category>${cdata(article.category)}</category>`,
        `      <description>${cdata(article.summary)}</description>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${cdata(siteConfig.title)}</title>
    <link>${siteConfig.url}</link>
    <atom:link href="${absoluteUrl("/rss.xml")}" rel="self" type="application/rss+xml"/>
    <description>${cdata(siteConfig.description)}</description>
    <language>zh-cn</language>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
