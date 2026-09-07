import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pagePath = new URL("../app/(light)/about/page.tsx", import.meta.url);
const clonePath = new URL("../components/about/AboutClone.tsx", import.meta.url);
const dataPath = new URL("../components/about/aboutData.ts", import.meta.url);
const stylesPath = new URL(
  "../components/about/AboutPage.module.css",
  import.meta.url,
);
const lenisPath = new URL(
  "../components/motion/LenisProvider.tsx",
  import.meta.url,
);

test("about page delegates its complete personal story to the measured clone", async () => {
  const source = await readFile(pagePath, "utf8");
  assert.match(source, /<AboutClone articles=\{articles\}/);
  assert.doesNotMatch(source, /AboutTraits|AboutFavorites|AboutWhy/);
});

test("favorite rows preserve pointer, keyboard, and mobile image states", async () => {
  const source = await readFile(clonePath, "utf8");

  assert.match(source, /onMouseMove/);
  assert.match(source, /onFocus/);
  assert.match(source, /awardThumb/);
  assert.match(source, /awardPreview/);
});

test("first favorite presents the two approved games", async () => {
  const source = await readFile(dataPath, "utf8");

  assert.match(
    source,
    /date: "01", title: "INSIDE \/ 黑神话：悟空", note: "游戏爱好", meta: "喜欢的游戏"/,
  );
  assert.match(source, /games\/inside-wukong\.png/);
});

test("music favorite uses one combined cover for both image states", async () => {
  const source = await readFile(dataPath, "utf8");

  assert.match(source, /src: "\/images\/about\/music\/music-pair\.png"/);
  assert.match(source, /preview: "\/images\/about\/music\/music-pair\.png"/);
});

test("all favorites lead with specifics and place the interest type below", async () => {
  const source = await readFile(dataPath, "utf8");

  for (const row of [
    ["02", "李志 / 港乐 / 民谣", "音乐偏好", "听得很杂"],
    ["03", "科幻 / 动漫 / 推理", "追番爱好", "科幻、动漫、推理"],
    ["04", "人工智能 / 数码科技", "AI / 手机 / 硬件", ""],
    ["05", "INTP / 逻辑学家", "性格类型", ""],
  ]) {
    const [date, title, note, meta] = row;
    assert.match(
      source,
      new RegExp(
        `date: "${date}", title: "${title}", note: "${note}", meta: "${meta}"`,
      ),
    );
  }
});

test("about clone follows the measured Orisa section and interaction model", async () => {
  const pageSource = await readFile(pagePath, "utf8");
  const interactionSource = await readFile(clonePath, "utf8");

  assert.match(pageSource, /<AboutClone articles=\{articles\}/);
  for (const marker of [
    "data-about-hero",
    "data-about-slider",
    "data-about-stats",
    "data-about-journey",
    "data-about-awards",
    "data-about-manifesto",
    "data-about-team",
    "data-about-contact",
    "data-about-journal",
  ]) {
    assert.match(interactionSource, new RegExp(marker));
  }

  assert.match(interactionSource, /quickTo/);
  assert.match(interactionSource, /rotation:\s*-15/);
  assert.match(interactionSource, /dragStart/);
});

test("hero cards and journey rows are driven by scroll like the reference", async () => {
  const source = await readFile(clonePath, "utf8");

  assert.match(source, /data-hero-scroll-card/);
  assert.match(source, /xPercent:\s*35/);
  assert.match(source, /xPercent:\s*-200/);
  assert.match(source, /data-journey-row/);
  assert.match(source, /data-journey-line/);
  assert.match(source, /scrollItems\.forEach/);
});

test("journey rows keep their boxes fixed while their contents move upward", async () => {
  const source = await readFile(clonePath, "utf8");
  const stylesSource = await readFile(stylesPath, "utf8");

  assert.doesNotMatch(source, /<li data-journey-row data-scroll-move-up/);
  assert.match(source, /const journeyItems = gsap\.utils\.toArray<HTMLElement>/);
  assert.match(source, /"\[data-journey-row\]"/);
  assert.match(source, /const content = Array\.from\(item\.children\)/);
  assert.match(source, /gsap\.fromTo\(\s*content,\s*\{ opacity: 0\.35, y: 80 \}/s);
  assert.match(stylesSource, /\.journeyList li\s*\{[^}]*overflow:\s*hidden/s);
});

test("about route uses the reference-like 1.35 second smooth scroll", async () => {
  const source = await readFile(lenisPath, "utf8");

  assert.match(source, /pathname === "\/about"/);
  assert.match(source, /pathname === "\/about" \? 1\.35 : 1\.05/);
});

test("about hero removes the social aside and centers the personal statement", async () => {
  const source = await readFile(clonePath, "utf8");
  const stylesSource = await readFile(stylesPath, "utf8");

  assert.doesNotMatch(source, /heroSocials/);
  assert.doesNotMatch(source, /styles\.heroAside/);
  assert.doesNotMatch(source, /在其他平台找到我/);
  assert.doesNotMatch(
    source,
    /生活在深圳。做产品、写东西、玩游戏，也喜欢研究各种新鲜玩意儿。/,
  );
  assert.match(stylesSource, /\.heroTitle\s*\{[^}]*text-align:\s*center/s);
  assert.match(stylesSource, /\.heroTitle\s*\{[^}]*margin:\s*0 auto/s);
});

test("about hero opens with personal language instead of a formal introduction", async () => {
  const source = await readFile(clonePath, "utf8");

  assert.match(source, /对世界保持好奇\s*<br \/>\s*偶尔较真，经常折腾。/);
  assert.doesNotMatch(source, /我是李康。一个认真工作，也认真生活的人。/);
});

test("about stats show three approved personal milestones with balanced labels", async () => {
  const source = await readFile(dataPath, "utf8");
  const stylesSource = await readFile(stylesPath, "utf8");

  assert.match(source, /value: "2000\+", label: "Vibe Coding 时长"/);
  assert.match(source, /value: "6年\+", label: "互联网产品经验"/);
  assert.match(source, /value: "30万\+", label: "写下的思考与复盘"/);
  assert.doesNotMatch(source, /value: "08\+", label: "年持续做产品与内容"/);
  assert.match(stylesSource, /\.statLabel\s*\{[^}]*color:\s*var\(--fg\)/s);
  assert.match(stylesSource, /\.statLabel\s*\{[^}]*font-size:\s*clamp\(20px,\s*1\.6vw,\s*24px\)/s);
  assert.match(stylesSource, /\.statLabel\s*\{[^}]*font-weight:\s*600/s);
  assert.match(stylesSource, /\.statLabel\s*\{[^}]*white-space:\s*pre-line/s);
});

test("about stats use a one-shot odometer roll while keeping suffixes static", async () => {
  const source = await readFile(clonePath, "utf8");
  const stylesSource = await readFile(stylesPath, "utf8");

  assert.match(source, /function OdometerValue/);
  assert.match(source, /data-odometer-digit/);
  assert.match(source, /data-odometer-ribbon/);
  assert.match(source, /data-odometer-suffix/);
  assert.match(source, /aria-label=\{value\}/);
  assert.match(source, /trigger:\s*"\[data-about-stats\]"/);
  assert.match(source, /once:\s*true/);
  assert.match(source, /ease:\s*"power4\.out"/);
  assert.match(stylesSource, /\.odometerDigit\s*\{[^}]*overflow:\s*hidden/s);
  assert.match(stylesSource, /\.odometerRibbon\s*\{[^}]*flex-direction:\s*column/s);
});

test("about journey tells four real turning points instead of a resume timeline", async () => {
  const dataSource = await readFile(dataPath, "utf8");
  const source = await readFile(clonePath, "utf8");

  assert.match(dataSource, /year: "2021"[\s\S]*title: "从设计走向产品"/);
  assert.match(dataSource, /year: "2023"[\s\S]*title: "开始做 AI 产品"/);
  assert.match(dataSource, /year: "2024"[\s\S]*title: "第一次把 AI 产品从 0 做到 1"/);
  assert.match(dataSource, /year: "2026"[\s\S]*title: "开始 Vibe Coding"/);
  assert.match(dataSource, /GPT · Smart Photo 启动/);
  assert.match(dataSource, /从 0 到 1 · 全量上线/);
  assert.match(dataSource, /能力边界以月为单位向前推进/);
  assert.match(dataSource, /Skill · 工具 · 小项目/);
  assert.doesNotMatch(dataSource, /开始认真工作|换了一条路|重新理解创造|继续往前走/);
  assert.match(source, /这里不是一份履历，只是几个让我改变方向的时刻/);
});
