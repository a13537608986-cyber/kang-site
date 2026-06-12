import type { MetadataRoute } from "next";
import { absoluteUrl, isProduction } from "@/lib/site";

/**
 * 收录控制：只有 Vercel production 环境开放抓取，
 * Preview / 开发环境一律 disallow（页面级 metadata 同步 noindex）。
 */
export default function robots(): MetadataRoute.Robots {
  if (!isProduction) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
