import { PracticeMotion } from "./PracticeMotion";
import { SiteFooter } from "@/components/layout/SiteFooter";
import Link from "next/link";
import { CoverImage } from "@/components/ui/CoverImage";
import { profile } from "@/lib/profile";
import { formatDateCompact } from "@/lib/dates";
import type { ProjectListItem } from "@/lib/content/projects";
import type { ArticleListItem } from "@/lib/content/articles";
import s from "./HomeEditorial.module.css";


export function HomeViewpoint() {
  return <div className={`${s.shell} ${s.viewpoint}`}>
    <p className={s.eyebrow}>00 / VIEWPOINT · 我怎么看</p>
    <div className={s.introGrid}>
      <blockquote className={s.statement}><span className="sr-only">{profile.viewpoint.join(" ")}</span><span aria-hidden="true">{profile.viewpoint.map(line => <span className={s.lineClip} key={line}>{Array.from(line).map((char, i) => <span className="vp-char" key={i}>{char}</span>)}</span>)}</span></blockquote>
      <div className={s.principles}>{profile.viewpointPrinciples.map((item, i) => <div className="vp-principle" key={item.title}><div className={s.principleInner}><span className={s.principleDot} aria-hidden="true" /><span className={s.principleNumber}>0{i + 1}</span><p>{item.title}</p><small>{item.desc}</small><div className={s.principleImage} aria-hidden="true"><CoverImage src={`/images/home/orisa/sec-5-phase-${i + 1}.webp`} alt="" sizes="280px" /></div></div></div>)}</div>
    </div>
    <div className={s.chapterEnd}><span>想法，放进真实的产品里。</span><a href="#home-work">往下看作品 <span aria-hidden="true">↓</span></a></div>
  </div>;
}

export function HomeEditorial({ projects, articles }: { projects: ProjectListItem[]; articles: ArticleListItem[] }) {
  const questionImages = ["800x800_card-image-03.webp", "800x800_card-image-04.webp", "1200x1200_service-image-01.webp", "800x800_card-image-02.webp"];
  const questionCaptions = [
    "先弄清用户到底想完成什么。要是不用 AI 也能解决，就别硬塞。",
    "看看他现在怎么干活，哪一步最费劲、最重复，或者最容易出错。",
    "能不能及时发现，能不能退回来，什么时候必须把事情交还给人。",
    "第二次还愿意来，才说明产品真有用。",
  ];
  const small = projects.find(p => p.slug === "canshen-ai");
  const large = projects.find(p => p.slug === "zhijian");
  return <div className={s.editorial}>
    <section data-theme="light" className={s.light} id="home-work" aria-labelledby="home-work-title">
      <div className={`${s.shell} ${s.work}`}>
        <div className={s.sectionHead}><div><p className={s.eyebrow}>01 / SELECTED WORK</p><h2 id="home-work-title">我把这些判断，<br />做进了产品里。</h2></div><Link className={s.textLink} href="/projects">全部项目 <span aria-hidden="true">↗</span></Link></div>
        <div className={s.projectGrid}>
          {small && <Link className={`${s.project} ${s.smallProject}`} href={`/projects/${small.slug}`}><div className={s.projectImage}><CoverImage src={small.cover || "/images/projects/placeholders/featured.webp"} alt="餐参 AI 项目封面占位" sizes="(max-width: 767px) 100vw, 38vw" /></div><div className={s.projectCaption}><h3>{small.title}</h3><span aria-hidden="true">↗</span></div><div className={s.tags}>{small.tags.slice(0, 2).map(tag => <span key={tag}>{tag}</span>)}</div>{!small.cover && <p className={s.placeholder}>封面占位 · 项目内容待补充</p>}</Link>}
          {large && <Link className={`${s.project} ${s.largeProject}`} href={`/projects/${large.slug}`}><div className={s.projectImage}><CoverImage src={large.cover!} alt="纸间的 Markdown 编辑与公众号排版预览" sizes="(max-width: 767px) 100vw, 62vw" /></div><div className={s.projectCaption}><h3>{large.title}</h3><span aria-hidden="true">↗</span></div><p className={s.projectSummary}>{large.summary}</p><div className={s.tags}>{large.tags.slice(0, 3).map(tag => <span key={tag}>{tag}</span>)}</div></Link>}
        </div>
      </div>
    </section>
    <section data-theme="dark" className={s.practice} aria-labelledby="home-practice-title">
      <PracticeMotion><div className={`${s.shell} ${s.practiceGrid}`}>
        <div data-practice-heading className={s.practiceHeading}><p className={s.eyebrow}>02 / IN PRACTICE</p><h2 id="home-practice-title">我反复<br />问自己的<br />四个问题<span>。</span></h2><p>6 YEARS IN PRODUCT<br />3 YEARS IN AI</p></div>
        <div className={s.questions}>{profile.practiceQuestions.map((q, i) => (
          <details key={q.en} className={s.question}>
            <summary>
              <span className={s.questionImage}><CoverImage src={`/images/home/rayo/${questionImages[i]}`} className={s.questionCutout} alt="" sizes="(max-width: 767px) 100vw, (max-width: 1099px) 50vw, 38vw" /></span>
              <span data-theme="light" className={s.questionBar}>
                <span className={s.questionMeta}>0{i + 1} / {q.en}</span>
                <span className={s.questionTitle}>{q.zh}</span>
                <span className={s.questionCaption}>{questionCaptions[i]}</span>
              </span>
            </summary>
            <p>{q.desc}</p>
          </details>
        ))}</div>
      </div></PracticeMotion>
    </section>
    <section data-theme="light" className={s.light} aria-labelledby="home-writing-title"><div className={`${s.shell} ${s.writing}`}>
      <div className={s.sectionHead}><div><p className={s.eyebrow}>03 / SELECTED WRITING</p><h2 id="home-writing-title">有些问题，<br />写下来才想得明白。</h2></div><Link className={s.textLink} href="/articles">全部文章 <span aria-hidden="true">↗</span></Link></div>
      <div className={s.articleGrid}>{articles.slice(0, 3).map(article => <Link key={article.slug} href={`/articles/${article.slug}`} className={s.article}><div className={s.articleImage}>{article.cover && <CoverImage src={article.cover} alt="" sizes="(max-width: 767px) 100vw, (max-width: 1440px) 30vw, 410px" />}</div><div className={s.articleCopy}><div className={s.articleMeta}><span>{article.category}</span><time dateTime={article.date}>{formatDateCompact(article.date)}</time></div><h3>{article.title}</h3><span className={s.articleArrow} aria-hidden="true">↗</span></div></Link>)}</div>
    </div></section>
    <section data-theme="light" className={s.light} aria-labelledby="home-about-title"><div className={`${s.shell} ${s.about}`}>
      <div className={s.aboutCopy}><p className={s.eyebrow}>04 / MORE ABOUT ME</p><h2 id="home-about-title">对世界保持好奇。<br />偶尔较真，<br />经常折腾。</h2><p>有 AI、产品和做过的项目，<br />也有一些与工作无关的念头。</p><Link className={s.textLink} href="/about">更多关于我 <span aria-hidden="true">↗</span></Link></div>
      <div className={s.aboutMedia}><div className={s.aboutImage}><CoverImage src="/images/about/orisa/img-117.webp" alt="生活照片位置占位" sizes="(max-width: 767px) 100vw, 50vw" /></div><p className={s.placeholder}>生活片段 · 图片占位，待替换真实照片</p><div className={s.interests}><span>产品</span><span>AI</span><span>写作</span><span>游戏</span></div></div>
    </div></section>
    <div data-theme="dark" className={s.footerSurface}>
      <div className={s.contactBackground} aria-hidden="true"><CoverImage src="/images/home/orisa/footer-10-bg-lines.webp" alt="" sizes="100vw" /></div>
    <section className={s.contact} aria-labelledby="home-contact-title">
      <div className={s.shell}>
        <div className={s.contactInner}>
          <div className={`${s.contactDecoration} ${s.contactDecorationLeft}`} aria-hidden="true"><CoverImage src="/images/home/orisa/footer-10-deco-2.webp" alt="" sizes="200px" /></div>
          <div className={s.contactCopy}>
            <p className={s.eyebrow}>LET’S TALK</p>
            <h2 id="home-contact-title">聊聊<span>也可以。</span></h2>
            <a className={s.contactLink} href={`mailto:${profile.contact.email}`}><span className={s.contactPill}>{profile.contact.email}</span><span className={s.contactArrow} aria-hidden="true">↗</span></a>
          </div>
          <div className={`${s.contactDecoration} ${s.contactDecorationRight}`} aria-hidden="true"><CoverImage src="/images/home/orisa/footer-10-deco-1.webp" alt="" sizes="200px" /></div>
        </div>
      </div>
    </section>
      <SiteFooter />
    </div>
  </div>;
}
