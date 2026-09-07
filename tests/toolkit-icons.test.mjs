import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const profileSource = readFileSync(
  new URL("../lib/profile.ts", import.meta.url),
  "utf8",
);
const sidebarSource = readFileSync(
  new URL("../components/articles/ArticleSidebar.tsx", import.meta.url),
  "utf8",
);

test("常用工具使用本地官方品牌图标，不再显示缩写占位符", () => {
  for (const icon of [
    "/brand-icons/claude-color.svg",
    "/brand-icons/codex-color.svg",
    "/brand-icons/hermes-agent.svg",
    "/brand-icons/figma-color.svg",
    "/brand-icons/vscode.svg",
    "/brand-icons/cursor.svg",
  ]) {
    assert.ok(profileSource.includes(`icon: "${icon}"`));
  }

  assert.doesNotMatch(profileSource, /icon: "(?:CC|Cx|He|VS|Cu)"/);
  assert.match(sidebarSource, /<Image[\s\S]*src=\{tool\.icon\}/);
});

test("常用工具图标使用统一的白底圆角悬浮容器", () => {
  assert.match(
    sidebarSource,
    /h-12 w-12[\s\S]*rounded-\[14px\][\s\S]*bg-white[\s\S]*shadow-\[0_8px_20px_rgba\(15,23,42,0\.08\)\]/,
  );
  assert.match(sidebarSource, /className="h-7 w-7 object-contain"/);
});
