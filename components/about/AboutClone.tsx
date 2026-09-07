"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { gsap } from "@/components/motion/gsap";
import { CoverImage } from "@/components/ui/CoverImage";
import type { ArticleListItem } from "@/lib/content/articles";
import { formatDateCompact } from "@/lib/dates";
import { siteConfig } from "@/lib/site";
import {
  aboutStats,
  favoriteRows,
  fragments,
  heroSlides,
  journeyRows,
  type AboutFavorite,
} from "./aboutData";
import styles from "./AboutPage.module.css";

interface AboutCloneProps {
  articles: ArticleListItem[];
}

const odometerCycle = Array.from({ length: 10 }, (_, index) => String(index));

function OdometerValue({ value }: { value: string }) {
  let digitIndex = 0;

  return (
    <strong className={styles.odometerValue} aria-label={value}>
      <span aria-hidden="true" className={styles.odometerCharacters}>
        {Array.from(value).map((character, characterIndex) => {
          if (!/\d/.test(character)) {
            return (
              <span
                className={styles.odometerSuffix}
                data-odometer-suffix
                key={`${character}-${characterIndex}`}
              >
                {character}
              </span>
            );
          }

          const cycles = 2 + (digitIndex % 2);
          const steps = [
            character,
            ...Array.from({ length: cycles }, () => odometerCycle).flat(),
            character,
          ];
          digitIndex += 1;

          return (
            <span
              className={styles.odometerDigit}
              data-odometer-digit
              key={`${character}-${characterIndex}`}
            >
              <span
                className={styles.odometerRibbon}
                data-final-index={steps.length - 1}
                data-odometer-ribbon
              >
                {steps.map((step, stepIndex) => (
                  <span key={`${step}-${stepIndex}`}>{step}</span>
                ))}
              </span>
            </span>
          );
        })}
      </span>
    </strong>
  );
}

function RevealCopy({ children }: { children: string }) {
  return (
    <span data-reveal-copy aria-label={children}>
      {Array.from(children).map((character, index) => (
        <span aria-hidden="true" key={`${character}-${index}`}>
          {character}
        </span>
      ))}
    </span>
  );
}

export function AboutClone({ articles }: AboutCloneProps) {
  const root = useRef<HTMLDivElement>(null);
  const sliderTrack = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const dragStart = useRef({ pointerX: 0, translateX: 0, dragging: false });
  const currentTranslate = useRef(0);
  const xTo = useRef<(value: number) => void>(() => undefined);
  const yTo = useRef<(value: number) => void>(() => undefined);
  const [previewItem, setPreviewItem] = useState(favoriteRows[0]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const heroScrollCards = gsap.utils.toArray<HTMLElement>(
          "[data-hero-scroll-card]",
        );
        gsap.set(heroScrollCards, { xPercent: 35 });
        gsap.to(heroScrollCards, {
          xPercent: -200,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-about-slider]",
            start: "-1000 top",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        gsap.utils.toArray<HTMLElement>("[data-odometer-digit]").forEach(
          (digit, index) => {
            const ribbon = digit.querySelector<HTMLElement>(
              "[data-odometer-ribbon]",
            );
            if (!ribbon) return;

            const finalIndex = Number(ribbon.dataset.finalIndex ?? 0);
            gsap.set(ribbon, { y: 0 });
            gsap.to(ribbon, {
              y: () => -finalIndex * digit.getBoundingClientRect().height,
              duration: 1.4 + (index % 4) * 0.08,
              delay: (index % 4) * 0.04,
              ease: "power4.out",
              scrollTrigger: {
                trigger: "[data-about-stats]",
                start: "top 78%",
                once: true,
                invalidateOnRefresh: true,
              },
            });
          },
        );

        gsap.utils.toArray<HTMLElement>("[data-reveal-copy]").forEach((copy) => {
          const characters = copy.querySelectorAll(":scope > span");
          gsap.fromTo(
            characters,
            { opacity: 0.4, x: -7 },
            {
              opacity: 1,
              x: 0,
              stagger: 0.012,
              ease: "none",
              scrollTrigger: {
                trigger: copy,
                start: "top 80%",
                end: "top 20%",
                scrub: true,
              },
            },
          );
        });

        gsap.fromTo(
          "[data-journey-image] img",
          { scale: 1.5 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-journey-image]",
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );

        gsap.fromTo(
          "[data-journey-line]",
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: "top",
            ease: "none",
            scrollTrigger: {
              trigger: "[data-journey-list]",
              start: "top 50%",
              end: "top top",
              scrub: 1.2,
              invalidateOnRefresh: true,
            },
          },
        );
      });

      mm.add(
        "(prefers-reduced-motion: no-preference) and (min-width: 992px)",
        () => {
          const journeyItems = gsap.utils.toArray<HTMLElement>(
            "[data-journey-row]",
          );
          journeyItems.forEach((item) => {
            const content = Array.from(item.children);
            gsap.fromTo(
              content,
              { opacity: 0.35, y: 80 },
              {
                opacity: 1,
                y: 0,
                ease: "none",
                scrollTrigger: {
                  trigger: item,
                  start: "top 90%",
                  end: "top 50%",
                  scrub: 1,
                },
              },
            );
          });

          const scrollItems = gsap.utils.toArray<HTMLElement>(
            "[data-scroll-move-up]",
          );
          scrollItems.forEach((item) => {
            gsap.to(item, {
              y: -100,
              duration: 1.5,
              ease: "none",
              scrollTrigger: {
                trigger: item,
                start: "top 70%",
                scrub: 1,
              },
            });
          });
        },
      );

      if (preview.current) {
        xTo.current = gsap.quickTo(preview.current, "x", {
          duration: 0.34,
          ease: "power3.out",
        });
        yTo.current = gsap.quickTo(preview.current, "y", {
          duration: 0.34,
          ease: "power3.out",
        });
        gsap.set(preview.current, {
          xPercent: 0,
          yPercent: -100,
          rotation: -15,
          scale: 0,
          opacity: 0,
        });
      }

      return () => {
        mm.revert();
      };
    },
    { scope: root },
  );

  const setSliderPosition = (value: number) => {
    if (!sliderTrack.current) return;
    const firstCard = sliderTrack.current.firstElementChild as HTMLElement | null;
    const cardWidth = firstCard?.getBoundingClientRect().width ?? window.innerWidth;
    const min = -(cardWidth + 30) * (heroSlides.length - 1);
    const max = 0;
    currentTranslate.current = Math.max(min, Math.min(max, value));
    sliderTrack.current.style.transform = `translate3d(${currentTranslate.current}px, 0, 0)`;
  };

  const beginDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragStart.current = {
      pointerX: event.clientX,
      translateX: currentTranslate.current,
      dragging: true,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.dataset.dragging = "true";
  };

  const moveDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragStart.current.dragging) return;
    setSliderPosition(
      dragStart.current.translateX + event.clientX - dragStart.current.pointerX,
    );
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragStart.current.dragging = false;
    event.currentTarget.dataset.dragging = "false";
    const firstCard = sliderTrack.current?.firstElementChild as HTMLElement | null;
    const cardWidth = firstCard?.getBoundingClientRect().width ?? window.innerWidth;
    const step = cardWidth + 30;
    setSliderPosition(Math.round(currentTranslate.current / step) * step);
  };

  const showPreview = (
    item: AboutFavorite,
    position?: { clientX: number; clientY: number },
  ) => {
    setPreviewItem(item);
    if (!preview.current || window.innerWidth < 768) return;
    if (position) {
      xTo.current(position.clientX + 18);
      yTo.current(position.clientY - 18);
    }
    gsap.to(preview.current, {
      scale: 1,
      opacity: 1,
      duration: 0.4,
      ease: "back.out(1.15)",
    });
  };

  const hidePreview = () => {
    if (!preview.current) return;
    gsap.to(preview.current, {
      scale: 0,
      opacity: 0,
      duration: 0.28,
      delay: 0.12,
      ease: "power2.in",
    });
  };

  return (
    <div ref={root} className={styles.page}>
      <section className={styles.hero} data-about-hero>
        <div className={styles.frame}>
          <p className={styles.eyebrow}>ABOUT ME ↗</p>
          <div className={styles.heroGrid}>
            <h1 className={styles.heroTitle}>
              对世界保持好奇
              <br />
              偶尔较真，经常折腾。
            </h1>
          </div>
        </div>

        <div
          className={styles.sliderViewport}
          data-about-slider
          onPointerDown={beginDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <div ref={sliderTrack} className={styles.sliderTrack}>
            {heroSlides.map((image, index) => (
              <figure
                className={styles.heroSlide}
                data-hero-scroll-card
                key={image.src}
              >
                <CoverImage
                  src={image.src}
                  alt={image.alt}
                  sizes="(max-width: 767px) 92vw, 50vw"
                  priority={index < 2}
                />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.stats} ${styles.frame}`} data-about-stats>
        {aboutStats.map((stat) => (
          <div className={styles.stat} key={stat.value}>
            <OdometerValue value={stat.value} />
            <span className={styles.statLabel}>{stat.label}</span>
          </div>
        ))}
      </section>

      <section className={styles.journey} data-about-journey data-theme="dark">
        <div className={styles.frame}>
          <div className={styles.journeyIntro}>
            <h2>一路走来，答案一直在变。</h2>
            <p>
              <RevealCopy>
                这里不是一份履历，只是几个让我改变方向的时刻。很多事情，都是做完以后才慢慢明白它留下了什么。
              </RevealCopy>
            </p>
          </div>
          <div className={styles.journeyGrid}>
            <figure className={styles.journeyImage} data-journey-image>
              <CoverImage
                src="/images/about/orisa/img-121.webp"
                alt="个人旅程图片占位"
                sizes="(max-width: 991px) 100vw, 42vw"
              />
              <figcaption>
                <span>MY JOURNEY</span>
                <strong>还在路上</strong>
              </figcaption>
            </figure>
            <div className={styles.journeyListWrap} data-journey-list>
              <span className={styles.journeyLine} data-journey-line aria-hidden="true" />
              <ol className={styles.journeyList}>
                {journeyRows.map((item) => (
                  <li data-journey-row key={item.year}>
                    <time>{item.year}</time>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.copy}</p>
                      <small>{item.meta}</small>
                    </div>
                    <ArrowUpRight aria-hidden size={18} />
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.awards} ${styles.frame}`} data-about-awards>
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>MORE ABOUT ME ↗</p>
          <h2>关于我的一些小事。</h2>
        </div>
        <div className={styles.awardList}>
          {favoriteRows.map((item) => (
            <button
              type="button"
              className={styles.awardRow}
              data-scroll-move-up
              key={item.title}
              onMouseEnter={(event) => showPreview(item, event)}
              onMouseMove={(event) => {
                xTo.current(event.clientX + 18);
                yTo.current(event.clientY - 18);
              }}
              onMouseLeave={hidePreview}
              onFocus={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                showPreview(item, { clientX: rect.right - 320, clientY: rect.top + 32 });
              }}
              onBlur={hidePreview}
            >
              <span className={styles.awardDate}>{item.date}</span>
              <span className={styles.awardThumb}>
                <CoverImage src={item.src} alt="" sizes="90px" />
              </span>
              <span className={styles.awardContent}>
                <strong>{item.title}</strong>
                <small>{item.note}</small>
              </span>
              <span className={styles.awardMeta}>{item.meta}</span>
              <ArrowUpRight aria-hidden size={18} />
            </button>
          ))}
        </div>
        <div ref={preview} className={styles.awardPreview} aria-hidden="true">
          <CoverImage src={previewItem.preview} alt="" sizes="280px" />
        </div>
      </section>

      <aside className={styles.manifesto} data-about-manifesto>
        <div className={styles.frame}>
          <h2>给想法留个地方。</h2>
          <p>
            想把平时一闪而过的念头、对产品的思考，以及对生活的一些看法，慢慢留在这里。有时是一篇认真写下的文章，有时只是几句随想。不一定每次都有结论，也不保证以后不会改变主意，但都是当时真实的自己。
          </p>
        </div>
      </aside>

      <section className={`${styles.team} ${styles.frame}`} data-about-team>
        <div className={styles.teamIntro}>
          <h2>生活里的几个片段。</h2>
          <p>
            一些日常照片，慢慢补充。
          </p>
        </div>
        <div className={styles.fragmentGrid}>
          {fragments.map((item) => (
            <article className={styles.fragmentCard} key={item.index}>
              <div className={styles.fragmentImage}>
                <CoverImage src={item.src} alt={item.alt} sizes="(max-width: 767px) 100vw, 25vw" />
                <span className={styles.fragmentArrow}>
                  <ArrowUpRight aria-hidden size={19} />
                </span>
                <div className={styles.fragmentText}>
                  <small>{item.index}</small>
                  <h3>{item.title}</h3>
                  <p>{item.note}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.contact} ${styles.frame}`} data-about-contact>
        <div>
          <p className={styles.eyebrow}>GET IN TOUCH ↗</p>
          <h2>聊聊也可以。</h2>
        </div>
        <div className={styles.contactBody}>
          <p>
            关于文章里的某个想法，或者你最近在折腾的东西，都欢迎来聊聊。
          </p>
          <dl>
            <div><dt>目前生活在</dt><dd>深圳，中国</dd></div>
            <div><dt>可以聊聊</dt><dd>产品、AI、写作和游戏</dd></div>
          </dl>
          <a className={styles.contactLine} href={`mailto:${siteConfig.author.email}`}>
            <span>邮箱 · {siteConfig.author.email}</span><ArrowUpRight aria-hidden size={20} />
          </a>
          <div className={styles.contactLine}>
            <span>微信 · {siteConfig.author.wechat}</span>
          </div>
        </div>
      </section>

      <section className={`${styles.journal} ${styles.frame}`} data-about-journal>
        <div className={styles.journalTitle}>
          <p className={styles.eyebrow}>JOURNAL ↗</p>
          <h2>最近写下的。</h2>
        </div>
        <div className={styles.articleList}>
          {articles.slice(0, 3).map((article) => (
            <Link href={`/articles/${article.slug}`} className={styles.articleRow} key={article.slug}>
              <div className={styles.articleImage}>
                {article.cover ? (
                  <CoverImage src={article.cover} alt="" sizes="(max-width: 767px) 100vw, 33vw" />
                ) : null}
              </div>
              <div className={styles.articleMeta}>
                <span>{article.category}</span>
                <time dateTime={article.date}>{formatDateCompact(article.date)}</time>
              </div>
              <h3>{article.title}</h3>
              <ArrowUpRight aria-hidden size={20} />
            </Link>
          ))}
        </div>
        <Link className={styles.allArticles} href="/articles">
          全部文章 <ArrowUpRight aria-hidden size={20} />
        </Link>
      </section>
    </div>
  );
}
