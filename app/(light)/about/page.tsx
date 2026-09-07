import type { Metadata } from "next";
import { AboutClone } from "@/components/about/AboutClone";
import { JsonLd } from "@/components/ui/JsonLd";
import { getAllArticles, toListItem } from "@/lib/content/articles";
import { breadcrumbJsonLd, ogBase, personJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "关于我",
  description:
    "关于李康：一些喜欢的事、走过的路，以及为什么做这个个人网站。",
  alternates: { canonical: "/about" },
  openGraph: { ...ogBase, type: "profile", url: "/about", title: "关于我" },
};

export default function AboutPage() {
  const articles = getAllArticles().slice(0, 3).map(toListItem);

  return (
    <>
      <JsonLd data={personJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "首页", path: "/" },
          { name: "关于我", path: "/about" },
        ])}
      />

      <AboutClone articles={articles} />
    </>
  );
}
