import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import test from "node:test";
import ts from "typescript";
import { parse } from "yaml";

const schemaPath = new URL("../lib/content/schema.ts", import.meta.url);
const pagePath = new URL(
  "../app/(dark)/projects/[slug]/page.tsx",
  import.meta.url,
);
const seoPath = new URL("../lib/seo.ts", import.meta.url);
const contentPath = new URL("../content/projects/murmur.mdx", import.meta.url);

test("metadata supports download actions with compatible defaults", async () => {
  const source = await readFile(schemaPath, "utf8");
  assert.match(
    source,
    /downloadUrl:\s*z\.string\(\)\.url\(\)\.nullable\(\)\.default\(null\)/,
  );
  assert.match(
    source,
    /downloadLabel:\s*z\.string\(\)\.min\(1\)\.default\("下载应用"\)/,
  );
  assert.match(
    source,
    /actionNote:\s*z\.string\(\)\.min\(1\)\.nullable\(\)\.default\(null\)/,
  );
  assert.match(
    source,
    /repositoryLabel:\s*z\.string\(\)\.min\(1\)\.default\("看源码"\)/,
  );
});

test("detail renders data-driven actions and an optional note without Murmur special cases", async () => {
  const source = await readFile(pagePath, "utf8");
  assert.match(source, /project\.downloadUrl/);
  assert.match(
    source,
    /href=\{project\.downloadUrl\}[^>]*>\s*\{project\.downloadLabel\}/,
  );
  assert.doesNotMatch(source, /下载 Murmur/);
  assert.doesNotMatch(source, /project\.slug\s*===\s*["']murmur["']/);
  assert.match(source, /project\.repositoryLabel/);
  assert.ok(
    source.indexOf("project.downloadUrl") < source.indexOf("project.demoUrl"),
  );
  assert.match(source, /href=\{project\.demoUrl\}[\s\S]*?去用一下/);
  assert.match(
    source,
    /href=\{project\.repositoryUrl\}[\s\S]*?project\.repositoryLabel/,
  );
  assert.match(
    source,
    /\{project\.actionNote\s*\?\s*\(\s*<p\b[^>]*>\s*\{project\.actionNote\}\s*<\/p>\s*\)\s*:\s*null\}/,
  );
  assert.ok(
    source.indexOf("{project.actionNote") >
      source.indexOf("project.repositoryLabel"),
  );
  assert.match(source, /"源码（占位链接）"/);
  assert.doesNotMatch(source, /macOS 14\+ · Apple 芯片 · 需自备 API Key/);
});

test("detail hero uses its own cover and falls back to the list cover", async () => {
  const source = await readFile(pagePath, "utf8");
  assert.match(source, /const heroCover = project\.detailCover \?\? project\.cover/);
  assert.match(source, /<CoverImage\s+src=\{heroCover\}/);
});

test("structured data prefers a downloadable installer", async () => {
  const source = await readFile(seoPath, "utf8");
  assert.match(source, /project\.downloadUrl \?\? project\.demoUrl/);
});

test("Murmur exposes download requirements and accessible media", async () => {
  const source = await readFile(contentPath, "utf8");
  assert.match(
    source,
    /downloadUrl: "https:\/\/github\.com\/a13537608986-cyber\/murmur\/releases\/latest"/,
  );
  assert.match(source, /repositoryLabel: "查看 GitHub"/);
  assert.match(
    source,
    /<video[\s\S]*controls[\s\S]*muted[\s\S]*preload="metadata"/,
  );
  assert.match(source, /当前仅提供 macOS 版本/);
  assert.match(source, /macOS 14\+/);
  assert.match(source, /Apple 芯片/);
  assert.match(source, /自备 API Key/);
  assert.doesNotMatch(
    source,
    /支持 Windows|支持 iOS|支持 Android|源码开源|全应用兼容|在线体验|去用一下|看源码/,
  );
});

async function murmurBody() {
  const source = await readFile(contentPath, "utf8");
  return source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
}

test("Murmur introduces the product through everyday value and core capabilities", async () => {
  const body = await murmurBody();
  const headings = body.match(/^## .+$/gm)?.join("\n") ?? "";
  assert.match(headings, /开口.*输入.*翻译/);
  assert.match(headings, /少一点敲打.*多一点表达/);
  assert.match(headings, /说话.*输入/);
  assert.match(headings, /表达.*场景/);
  assert.match(headings, /翻译.*内容/);
  assert.match(body, /常驻.*Mac.*菜单栏/);
  assert.match(body, /当前输入框/);
  assert.match(body, /不需要.*另一个编辑器/);
  for (const capability of [
    /改口/,
    /重复/,
    /口头语/,
    /日常模式/,
    /自然语气/,
    /长文模式/,
    /段落/,
    /列表/,
    /划词翻译/,
    /框选翻译/,
    /图片/,
    /PDF/,
  ]) {
    assert.match(body, capability);
  }
});

test("Murmur identifies all three shortcuts as configurable defaults", async () => {
  const body = await murmurBody();
  for (const entry of [
    /语音输入[^\n]*`Home`/,
    /划词翻译[^\n]*`⌥S`/,
    /框选翻译[^\n]*`⌘E`/,
  ]) {
    assert.match(body, entry);
  }
  assert.match(body, /`Home`[^\n]*`⌥S`[^\n]*`⌘E`[^\n]*默认快捷键/);
  assert.match(body, /默认快捷键[^\n]*设置[^\n]*(?:修改|调整)/);
});

test("Murmur explains model choice and the essential download information", async () => {
  const body = await murmurBody();
  assert.match(body, /^## .*习惯.*模型/m);
  assert.match(body, /翻译、语音识别、文字整理[^\n]*分别[^\n]*模型/);
  assert.match(body, /自己的 API Key/);
  assert.match(body, /API Key[^\n]*macOS 钥匙串/);
  for (const requirement of [/macOS 14\+/, /Apple 芯片/, /需自备 API Key/]) {
    assert.match(body, requirement);
  }
  assert.match(body, /下载 Murmur[^\n]*最新 Release/);
  assert.match(body, /查看 GitHub[^\n]*说明[^\n]*反馈/);
});

test("Murmur keeps defensive copy and unconfirmed features out of the introduction", async () => {
  const source = await readFile(contentPath, "utf8");
  assert.doesNotMatch(
    source,
    /影片中的速度对比|宣传表达|实测效率承诺|这不等于替你操作外部应用|识别、翻译和改写都可能出错|使用前应了解|数据处理规则|涉及敏感信息时|输入前需要授予相应系统权限|当前内测限制/,
  );
  assert.doesNotMatch(
    source,
    /一段宣传片，六种表达场景|模型与隐私边界|免责声明|临时签名|系统权限|辅助功能权限|麦克风权限|屏幕录制权限|兼容保证|不是所有输入框|并非所有输入框|版本信息|中转服务器|Murmur 服务端/,
  );
  assert.doesNotMatch(
    source,
    /选中文字后口述改写|选中文字语音改写|自动办理|替你操作外部应用/,
  );
});

// Execute the actual TS modules in memory, without generated files or alias loaders.
const require = createRequire(import.meta.url);
async function loadModule(path, aliases = {}) {
  const source = await readFile(path, "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  });
  const exports = {};
  runInNewContext(
    outputText,
    {
      exports,
      require: (id) => aliases[id] ?? require(id),
      process,
      URL,
    },
    { filename: path.pathname },
  );
  return exports;
}
const dates = await loadModule(new URL("../lib/dates.ts", import.meta.url));
const { projectSchema } = await loadModule(schemaPath, {
  "@/lib/dates": dates,
});
const site = await loadModule(new URL("../lib/site.ts", import.meta.url));
const { projectJsonLd } = await loadModule(seoPath, { "@/lib/site": site });
const projectsDir = new URL("../content/projects/", import.meta.url);
async function metadata(path) {
  const source = await readFile(path, "utf8");
  return parse(source.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]);
}

test("Murmur frontmatter parses with exact public links and publishing boundaries", async () => {
  const meta = projectSchema.parse(await metadata(contentPath));
  assert.equal(meta.slug, "murmur");
  assert.equal(meta.title, "Murmur");
  assert.equal(meta.type, "product");
  assert.equal(meta.date, "2026-09-18T17:53:09+08:00");
  assert.equal(
    meta.downloadUrl,
    "https://github.com/a13537608986-cyber/murmur/releases/latest",
  );
  assert.equal(
    meta.repositoryUrl,
    "https://github.com/a13537608986-cyber/murmur",
  );
  assert.equal(meta.repositoryLabel, "查看 GitHub");
  assert.equal(meta.downloadLabel, "下载 Murmur");
  assert.equal(meta.actionNote, "macOS 14+ · Apple 芯片 · 需自备 API Key");
  assert.equal(meta.demoUrl, null);
  assert.equal(meta.featured, false);
  assert.equal(meta.draft, false);
  assert.equal(meta.cover, "/images/projects/murmur/cover-laptop-v1.webp");
  assert.equal(meta.detailCover, "/images/projects/murmur/cover-detail-v1.webp");
  assert.deepEqual(meta.tags, ["macOS", "语音输入", "翻译工具", "Vibe Coding"]);
});

test("all existing projects preserve default actions and Murmur sorts newest by date", async () => {
  const all = [];
  for (const name of await readdir(projectsDir)) {
    if (!name.endsWith(".mdx")) continue;
    const original = await metadata(new URL(name, projectsDir));
    const parsed = projectSchema.parse(original);
    assert.equal(parsed.slug, name.slice(0, -4));
    if (name !== "murmur.mdx") {
      assert.equal(parsed.downloadUrl, null);
      assert.equal(parsed.downloadLabel, "下载应用");
      assert.equal(parsed.actionNote, null);
      assert.equal(parsed.repositoryLabel, "看源码");
      assert.equal(parsed.detailCover, null);
      assert.equal(parsed.demoUrl, original.demoUrl ?? null);
      assert.equal(parsed.repositoryUrl, original.repositoryUrl ?? null);
    }
    if (!parsed.draft) all.push(parsed);
  }
  assert.equal(all.sort(dates.byDateDesc)[0].slug, "murmur");
});

test("strict metadata rejects unknown fields, invalid downloads and empty labels", async () => {
  const meta = await metadata(contentPath);
  for (const patch of [
    { unknown: true },
    { downloadUrl: "not-a-url" },
    { repositoryLabel: "" },
    { repositoryLabel: null },
    { downloadLabel: "" },
    { downloadLabel: null },
    { actionNote: "" },
    { actionNote: 14 },
    { detailCover: "https://example.com/remote.jpg" },
  ]) {
    assert.equal(projectSchema.safeParse({ ...meta, ...patch }).success, false);
  }
  assert.equal(
    projectSchema.parse({ ...meta, downloadUrl: null }).downloadUrl,
    null,
  );
  assert.equal(
    projectSchema.parse({ ...meta, actionNote: null }).actionNote,
    null,
  );
  const defaults = projectSchema.parse({
    ...meta,
    downloadLabel: undefined,
    actionNote: undefined,
  });
  assert.equal(defaults.downloadLabel, "下载应用");
  assert.equal(defaults.actionNote, null);
});

test("JSON-LD uses download first, preserves demo fallback and omits absent installers", async () => {
  const meta = projectSchema.parse(await metadata(contentPath));
  const demoUrl = "https://example.com/demo";
  const download = projectJsonLd({ ...meta, demoUrl });
  assert.equal(download["@type"], "SoftwareApplication");
  assert.equal(download.installUrl, meta.downloadUrl);
  assert.equal(download.applicationCategory, "UtilitiesApplication");
  const legacy = projectJsonLd({ ...meta, downloadUrl: null, demoUrl });
  assert.equal(legacy.installUrl, demoUrl);
  assert.equal(legacy.applicationCategory, "WebApplication");
  assert.equal(
    "installUrl" in
      projectJsonLd({ ...meta, downloadUrl: null, demoUrl: null }),
    false,
  );
  assert.equal(
    "installUrl" in projectJsonLd({ ...meta, type: "case-study" }),
    false,
  );
});

test("video is local, user-controlled and responsive with a valid WebP poster", async () => {
  const source = await readFile(contentPath, "utf8");
  const video = source.match(/<video\b[\s\S]*?<\/video>/)?.[0];
  assert.ok(video);
  assert.doesNotMatch(video, /\b(?:autoPlay|autoplay|loop)\b/);
  assert.match(video, /\bplaysInline\b/);
  assert.match(video, /aria-label="Murmur 场景宣传片"/);
  assert.match(video, /className="[^"]*h-auto w-full/);
  assert.match(video, /width="1920"\s+height="1080"/);
  assert.match(
    video,
    /poster="\/images\/projects\/murmur\/cover-laptop-v1.webp"/,
  );
  assert.match(
    video,
    /src="\/videos\/projects\/murmur\/Murmur-teaser-v3-fast-bgm.mp4" type="video\/mp4"/,
  );
  const cover = await readFile(
    new URL(
      "../public/images/projects/murmur/cover-laptop-v1.webp",
      import.meta.url,
    ),
  );
  assert.equal(cover.toString("ascii", 0, 4), "RIFF");
  assert.equal(cover.toString("ascii", 8, 12), "WEBP");
  const detailCover = await readFile(
    new URL(
      "../public/images/projects/murmur/cover-detail-v1.webp",
      import.meta.url,
    ),
  );
  assert.equal(detailCover.toString("ascii", 0, 4), "RIFF");
  assert.equal(detailCover.toString("ascii", 8, 12), "WEBP");
  const film = await stat(
    new URL(
      "../public/videos/projects/murmur/Murmur-teaser-v3-fast-bgm.mp4",
      import.meta.url,
    ),
  );
  assert.ok(film.size > 0);
});
