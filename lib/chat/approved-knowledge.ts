// The only runtime knowledge source. Edit approved facts here, then regenerate
// docs/chatbot/approved-knowledge.md using the command in docs/chatbot.md.
// No filesystem access, raw content imports, private provenance or model config.
export const approvedKnowledge = [
  {
    id: "identity-career",
    title: "李康的身份与职业经历",
    href: "",
    text: "李康，网站品牌 KANG。现任弃疾数智科技产品总监。任职经历：2018.06—2020.01，法大大，UI/UX设计；2020.05—2023.02，腾讯，产品经理；2023.04—2026.03，亚飞电子商务，AI产品经理；2026.03—至今，弃疾数智科技，产品总监。转入产品岗位的时间是2020.05，进入AI产品经理岗位的时间是2023.04。",
  },
  {
    id: "canshen-ownership-status",
    title: "餐参AI：本人职责与上线状态",
    href: "",
    text: "正式产品名为餐参AI。李康主导从1.0优化到1.5构建的整体产品工作，核心包括产品中的Agent设计和营养师服务流程串联。1.0阶段主要优化既有功能，随后因业务方向调整重新梳理整体产品方案，在原有基础上优化迭代出1.5。餐参AI 1.5已上线。",
  },
  {
    id: "canshen-product-design",
    title: "餐参AI：持续食养与专业服务设计",
    href: "",
    text: "餐参AI面向个人与家庭的持续食养管理。产品内餐小参是食养管家与服务组织角色：先明确服务对象，再理解档案、方案、记录及服务状态，组织一个当下可执行的下一行动，串起建档、理解评估、方案确认、准备执行、饮食记录、周期回顾与下一周期调整。AI辅助理解、生成和解释；规则校验对象、授权、事实依据与状态。家庭主理人可以代操作，但成员档案和记录仍归对应成员；家庭共餐与成员个人方案分开。营养师服务设计为：用户从个人计划或家庭共餐购买专业把关，补充本次资料与问题；专家接单查看档案和方案，可审核保留原方案或调优，给出结论并交付；用户查看、反馈、主动采用后回到执行。用户端与独立专家端均有具体原型设计。",
  },
  {
    id: "contact-purpose",
    title: "联系与交流",
    href: "",
    text: "邮箱：hi@kangkangpm.com。微信：LKCW-9775。主要交流方向是AI产品交流与项目合作。网站通过真实案例介绍李康的职业经历、代表项目、本人职责与产品判断。",
  },
  {
    id: "smart-photo",
    title: "Smart Photo：内部商拍产品复盘",
    href: "/articles/smart-photo-beyond-the-generated-image",
    text: "Smart Photo是面向跨境电商运营的内部AI商拍与图文内容工具，连接商品上传、场景选择、生成候选和人工筛图，也涉及商品描述与多语言Listing。李康参与的产品工作与算法、开发、设计、运营协作。复盘强调生成图片只是流程中的一步，真正的产品问题包括可用性、人工判断与工作流衔接。",
  },
  {
    id: "tanbeixiong",
    title: "贪杯熊：酒吧场景产品复盘",
    href: "/articles/a-social-product-inside-the-bar",
    text: "2020.05—2023.02在腾讯担任产品经理期间，李康负责贪杯熊B/C双端产品迭代，连接线上社交与线下酒吧消费，参与搭建商家SaaS营销中台。贪杯熊涉及附近酒吧、酒局和大屏互动。产品工作包括现场观察、需求拆解，与设计、研发和运营共同推进。",
  },
  {
    id: "report-observer",
    title: "报告观察家",
    href: "/projects/xhs-report-agent",
    text: "本站项目报告观察家基于开源项目xhs-report-agent改造。它支持报告整理、图文草稿编辑、封面预览及图文包导出。网页体验不提供在线模型调用或自动发布；模型连接、登录和发布确认依赖桌面环境。",
  },
  {
    id: "zhijian-typesetting",
    title: "纸间 · 公众号排版",
    href: "/projects/zhijian",
    text: "本站项目纸间是浏览器内的公众号Markdown排版工具，支持编辑、实时预览、模板与样式调整、文件导入导出、复制富文本到公众号。草稿保存在当前浏览器，以文字排版为主。",
  },
  {
    id: "zhijian-mindmap",
    title: "枝间 · Markdown 思维导图",
    href: "/projects/zhijian-mindmap",
    text: "本站项目枝间将Markdown标题和列表实时转为思维导图，支持文件导入、缩放拖动、折叠、Markdown及离线交互HTML导出，手机可切换编辑和导图。草稿保存在当前浏览器。",
  },
] as const;

/** Human-readable mirror; tests require byte-for-byte equality with the file. */
export function renderApprovedKnowledgeMarkdown(): string {
  return "# KANG AI 正式知识库\n\n" +
    "> 本文件由 `lib/chat/approved-knowledge.ts` 生成，请勿单独编辑；运行时只读取该模块，不读取本文件。个人确认资料没有公开来源链接，不能用旧页面替代证明。\n\n" +
    approvedKnowledge.map(({ id, title, href, text }) =>
      `## ${title}\n\nID：\`${id}\`\n\n${text}\n\n${href ? `公开参考：[${title}](${href})` : "公开参考：无独立公开来源页（不展示来源卡片）。"}\n`
    ).join("\n");
}
