"use client";

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CATEGORIES } from '@/lib/content/schema';
import { safeReturnHref } from '@/lib/article-navigation';

const className = 'link-slide hover:text-fg';

function ReturnLink() {
  const params = useSearchParams();
  return <Link href={safeReturnHref(params.get('from'), CATEGORIES)} className={className}>文章</Link>;
}

export function ArticleReturnLink() {
  return <Suspense fallback={<Link href="/articles" className={className}>文章</Link>}><ReturnLink /></Suspense>;
}
