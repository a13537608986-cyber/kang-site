export interface AboutMedia {
  src: string;
  alt: string;
}

export interface AboutSocial {
  label: string;
  iconSrc: string;
  href?: string;
}

export interface AboutStat {
  value: string;
  label: string;
}

export interface AboutJourneyRow {
  year: string;
  title: string;
  copy: string;
  meta: string;
}

export interface AboutFavorite extends AboutMedia {
  date: string;
  title: string;
  note: string;
  meta: string;
  preview: string;
}

export interface AboutFragment extends AboutMedia {
  index: string;
  title: string;
  note: string;
}

const asset = (name: string) => `/images/about/orisa/${name}`;

// DEMO_REFERENCE_ASSET：参考站素材仅用于本地视觉确认，正式发布前需替换为自有或已授权图片。
export const heroSocials: AboutSocial[] = [
  { label: "X / Twitter", iconSrc: "/icons/social/fontawesome-x-twitter.svg" },
  { label: "GitHub", iconSrc: "/icons/social/fontawesome-github.svg" },
  { label: "邮箱", iconSrc: "/icons/social/fontawesome-envelope.svg" },
  { label: "哔哩哔哩", iconSrc: "/icons/social/fontawesome-bilibili.svg" },
  { label: "抖音", iconSrc: "/icons/social/fontawesome-tiktok.svg" },
];

export const heroSlides: AboutMedia[] = [
  { src: asset("img-117.webp"), alt: "生活片段占位一" },
  { src: asset("img-118.webp"), alt: "生活片段占位二" },
  { src: asset("img-119.webp"), alt: "生活片段占位三" },
  { src: asset("img-120.webp"), alt: "生活片段占位四" },
];

export const aboutStats: AboutStat[] = [
  { value: "2000+", label: "Vibe Coding 时长" },
  { value: "6年+", label: "互联网产品经验" },
  { value: "30万+", label: "写下的思考与复盘" },
];

export const journeyRows: AboutJourneyRow[] = [
  {
    year: "2021",
    title: "从设计走向产品",
    copy: "从 UI 设计转岗成为产品经理。我开始关心的不只是界面好不好看，还有一个产品为什么值得被做出来。",
    meta: "设计 · 产品",
  },
  {
    year: "2023",
    title: "开始做 AI 产品",
    copy: "从使用 GPT，到参与启动 Smart Photo。AI 不再只是一件新鲜工具，而变成了需要放进真实场景里验证的产品。",
    meta: "GPT · Smart Photo 启动",
  },
  {
    year: "2024",
    title: "第一次把 AI 产品从 0 做到 1",
    copy: "亲身走完模型验证、产品设计、灰度到全量上线。也开始习惯 AI 的变化速度：能力边界以月为单位向前推进，很多刚刚得到的答案，很快又需要重新思考。",
    meta: "从 0 到 1 · 全量上线",
  },
  {
    year: "2026",
    title: "开始 Vibe Coding",
    copy: "开始用 Vibe Coding 做 Skill、小工具和各种小项目。想到什么就先动手试试，正在慢慢变成一种日常。",
    meta: "Skill · 工具 · 小项目",
  },
];

export const favoriteRows: AboutFavorite[] = [
  { date: "01", title: "INSIDE / 黑神话：悟空", note: "游戏爱好", meta: "喜欢的游戏", src: "/images/about/games/inside-wukong.png", preview: "/images/about/games/inside-wukong.png", alt: "INSIDE 与黑神话悟空游戏画面" },
  { date: "02", title: "李志 / 港乐 / 民谣", note: "音乐偏好", meta: "听得很杂", src: "/images/about/music/music-pair.png", preview: "/images/about/music/music-pair.png", alt: "李志与港乐音乐封面合图" },
  { date: "03", title: "科幻 / 动漫 / 推理", note: "追番爱好", meta: "科幻、动漫、推理", src: "/images/about/anime/anime-cover.svg", preview: "/images/about/anime/anime-cover.svg", alt: "哆啦A梦、名侦探柯南、亚人、进击的巨人、漂流少年海报" },
  { date: "04", title: "人工智能 / 数码科技", note: "AI / 手机 / 硬件", meta: "", src: "/images/about/tech/tech-desk.jpg", preview: "/images/about/tech/tech-desk.jpg", alt: "灰色桌面上的手机与键盘" },
  { date: "05", title: "INTP / 逻辑学家", note: "性格类型", meta: "", src: "/images/about/personality/intp-logician.svg", preview: "/images/about/personality/intp-logician.svg", alt: "INTP 逻辑学家紫色人格插画" },
];

export const fragments: AboutFragment[] = [
  { index: "01", title: "生活的城市", note: "照片与说明待补充", src: "/images/about/life-placeholder.svg", alt: "城市照片占位，待补充真实照片" },
  { index: "02", title: "日常一角", note: "照片与说明待补充", src: "/images/about/life-placeholder.svg", alt: "日常照片占位，待补充真实照片" },
  { index: "03", title: "出行片段", note: "照片与说明待补充", src: "/images/about/life-placeholder.svg", alt: "出行照片占位，待补充真实照片" },
  { index: "04", title: "我自己", note: "照片与说明待补充", src: "/images/about/life-placeholder.svg", alt: "个人照片占位，待补充真实照片" },
];
