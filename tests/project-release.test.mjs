import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");

test("project detail preserves production labels and honest tool links", () => {
  const page = read("app/(dark)/projects/[slug]/page.tsx");
  assert.match(page, /PROJECT_PAGE_TYPE_LABEL\[project.type\]/);
  assert.match(page, /在线体验（占位链接）/);
  assert.match(page, /源码（占位链接）/);
  assert.match(page, /去用一下/);
  for (const [slug, url] of [
    ["zhijian", "https://zhijian-zeta.vercel.app/"],
    ["product-doc-assistant", "https://product-doc-assistant.vercel.app/"],
  ]) {
    const project = read(`content/projects/${slug}.mdx`);
    assert.ok(project.includes(`demoUrl: "${url}"`));
    assert.match(project, /draft: false/);
    assert.ok(readFileSync(new URL(`../public/images/projects/${slug}/workspace.png`, import.meta.url)).length > 0);
  }
});

test("project layout keeps grid suppression and mobile containment scoped", () => {
  assert.match(read("app/(dark)/projects/layout.tsx"), /projectScope/);
  assert.match(read("app/(dark)/projects/projectScope.module.css"), /grid-lines/);
  const grid = read("components/projects/ProjectGrid.tsx");
  assert.match(grid, /min-w-0/);
  assert.match(grid, /PROJECT_PAGE_TYPE_LABEL/);
  assert.match(read("app/(dark)/projects/[slug]/detail.module.css"), /\.detail :global\(\.prose\)/);
});
