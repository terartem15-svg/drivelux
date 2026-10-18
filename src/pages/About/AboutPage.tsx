import {
  Armchair,
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  CarFront,
  ConciergeBell,
  Expand,
  FileCheck2,
  Gem,
  HeartHandshake,
  Info,
  KeyRound,
  LayoutGrid,
  Mail,
  Phone,
  Play,
  Route,
  ScanEye,
  ShieldCheck,
  UsersRound,
  type LucideIcon,
} from 'lucide-react'
import { useCallback, useId, useState, type CSSProperties } from 'react'
import { Accordion } from '@/components/Accordion/Accordion'
import { Breadcrumbs } from '@/components/Breadcrumbs/Breadcrumbs'
import { Button } from '@/components/Button/Button'
import { SectionHeading } from '@/components/SectionHeading/SectionHeading'
import { SiteLink } from '@/components/SiteLink/SiteLink'
import {
  ABOUT_IMAGES,
  ABOUT_PAGE,
  FILM,
  GALLERY,
  STATS,
  type AboutImage,
  type PointIcon,
  type StatIcon,
} from '@/content/about'
import { CONTACTS, ROUTES } from '@/content/site'
import { useLang } from '@/i18n/lang'
import { useDocumentTitle } from '@/utils/useDocumentTitle'
import { FilmDialog, Lightbox } from './MediaDialog'
import styles from './AboutPage.module.css'

// Страница «О компании» (/about) — презентация бренда по макету: от первого
// экрана до финального призыва перед общим подвалом. Порядок блоков — от
// «кто мы» к «что делать дальше»:
//  1. первый экран с фото Lamborghini и кнопкой «Узнать больше» (плавно
//     ведёт к истории) и ряд показателей поверх низа фото;
//  2. «Наша история»: фото шоурума с кнопкой видео, текст с раскрытием
//     «Читать подробнее» и концептуальная временная шкала;
//  3. «Наша философия» — асимметричная мозаика из фото и текста;
//  4. «Наши принципы» — четыре строки с иконками;
//  5. «Почему DriveLux» — практическая польза рядом с одним крупным кадром;
//  6. «DriveLux в деталях» — галерея-мозаика с лайтбоксом;
//  7. «Наш подход к сервису» — четыре шага со ссылками на разделы сайта;
//  8. вопросы, финальный блок и подписи к фото.
// Все тексты, цифры и фото — content/about.ts. Цифры и годы
// демонстрационные, на странице это подписано

// --- Иконки ------------------------------------------------------------------------------
// Тонкий штрих одного размера: иконки читаются одним рядом, как в
// преимуществах на главной
const STAT_ICONS: Record<StatIcon, LucideIcon> = {
  gem: Gem,
  car: CarFront,
  users: UsersRound,
  shield: ShieldCheck,
}

const POINT_ICONS: Record<PointIcon, LucideIcon> = {
  quality: BadgeCheck,
  transparency: ScanEye,
  comfort: Armchair,
  responsibility: HeartHandshake,
  choice: LayoutGrid,
  booking: CalendarCheck,
  trip: Route,
  services: ConciergeBell,
  terms: FileCheck2,
}

// Два размера одного кадра для srcset: браузер сам выберет файл под
// ширину блока и плотность экрана
function sources(image: AboutImage, smallWidth: number, largeWidth: number) {
  return `${image.small} ${smallWidth}w, ${image.src} ${largeWidth}w`
}

const order = (index: number) => ({ '--reveal-order': index }) as CSSProperties

export function AboutPage() {
  const lang = useLang()
  const text = ABOUT_PAGE[lang]
  useDocumentTitle(text.title)

  const [lightbox, setLightbox] = useState<number | null>(null)
  const [filmOpen, setFilmOpen] = useState(false)
  const closeLightbox = useCallback(() => setLightbox(null), [])
  const closeFilm = useCallback(() => setFilmOpen(false), [])

  const { hero, road, details, keys, cta } = ABOUT_IMAGES
  const [ideaFreedom, ideaDetails, ideaComfort, ideaPersonal] = text.ideas

  return (
    <div className={styles.page}>
      {/* --- Первый экран и показатели ------------------------------------------------------
          Фото — общее для обоих блоков: на десктопе ряд показателей лежит на
          его растворённом низу, как в макете; на планшете и телефоне фото
          стоит полосой между текстом и показателями */}
      <div className={styles.top}>
        <div className={styles.heroMedia} aria-hidden="true">
          {/* Размытая копия того же кадра — фон под текстом слева, чтобы
              резкое фото справа растворялось в «свою» атмосферу, а не в
              пустой чёрный */}
          <img className={styles.heroBlur} src={hero.small} alt="" />
          <img
            className={styles.heroPhoto}
            src={hero.src}
            srcSet={sources(hero, 1200, 2400)}
            sizes="(max-width: 1023px) 100vw, 66vw"
            alt=""
            fetchPriority="high"
            style={{ objectPosition: hero.focus }}
          />
        </div>

        <section className={`container ${styles.hero}`} aria-labelledby="about-title">
          <Breadcrumbs crumbs={[{ label: text.home, href: ROUTES.home }, { label: text.title }]} />
          <div className={styles.heroText}>
            <p className={styles.eyebrow}>{text.eyebrow}</p>
            <h1 className={styles.title} id="about-title">
              <span className={styles.titleLine}>{text.heading[0]}</span>{' '}
              <span className={`${styles.titleLine} ${styles.titleAccent}`}>{text.heading[1]}</span>
            </h1>
            <p className={styles.lead}>{text.lead}</p>
            {/* Якорь на той же странице: прокрутку к истории делает
                components/ScrollManager — плавно, если анимации не отключены */}
            <Button className={styles.heroButton} href="#story" size="lg" arrow>
              {text.more}
            </Button>
          </div>
        </section>

        {/* Полоса показателей — с линиями во всю ширину экрана, как линия
            под шапкой; сами пункты — в общей колонке */}
        <section className={styles.stats} aria-labelledby="stats-title">
          <div className="container">
            <h2 className="visually-hidden" id="stats-title">
              {text.statsTitle}
            </h2>
            <ul className={styles.statList}>
              {STATS.map((stat, index) => {
                const Icon = STAT_ICONS[stat.icon]
                return (
                  <li key={stat.icon} className={styles.stat} data-reveal style={order(index)}>
                    <span className={styles.statIcon} aria-hidden="true">
                      <Icon size={22} strokeWidth={1.4} />
                    </span>
                    <span className={styles.statBody}>
                      <span className={styles.statValue}>
                        {stat.value[lang]}
                        {stat.unit && <span className={styles.statUnit}> {stat.unit[lang]}</span>}
                      </span>
                      <span className={styles.statLabel}>{stat.label[lang]}</span>
                    </span>
                  </li>
                )
              })}
            </ul>
            <p className={styles.statsNote}>
              <Info size={14} strokeWidth={1.6} aria-hidden="true" />
              {text.statsNote}
            </p>
          </div>
        </section>
      </div>

      <Story onWatch={() => setFilmOpen(true)} />

      {/* --- Философия ----------------------------------------------------------------------
          Зигзаг: сверху текст слева и большое фото справа, снизу — наоборот.
          Идеи разного веса: две — подписями на фото, две — текстом с крупным
          номером. Так блок не превращается в сетку одинаковых карточек */}
      <section className={`container ${styles.section}`} aria-labelledby="philosophy-title">
        <div className={styles.philoTop}>
          <div className={styles.philoHead} data-reveal>
            <p className={styles.sectionEyebrow}>{text.philosophyEyebrow}</p>
            <h2 className={styles.philoTitle} id="philosophy-title">
              {text.philosophyTitle[0]} <span className={styles.accent}>{text.philosophyTitle[1]}</span>
            </h2>
            <p className={styles.philoLead}>{text.philosophyLead}</p>
          </div>

          <article className={`${styles.ideaPhoto} ${styles.ideaRoad}`} data-reveal style={order(1)}>
            <img
              src={road.small}
              srcSet={sources(road, 1000, 2000)}
              sizes="(max-width: 1023px) 100vw, 58vw"
              alt={road.alt[lang]}
              loading="lazy"
              style={{ objectPosition: road.focus }}
            />
            <div className={styles.ideaOverlay}>
              <span className={styles.ideaNumber} aria-hidden="true">
                01
              </span>
              <h3 className={styles.ideaTitle}>{ideaFreedom.title}</h3>
              <p className={styles.ideaText}>{ideaFreedom.text}</p>
            </div>
          </article>
        </div>

        <div className={styles.philoBottom}>
          <article className={`${styles.ideaPhoto} ${styles.ideaDetail}`} data-reveal>
            <img
              src={details.small}
              srcSet={sources(details, 800, 1600)}
              sizes="(max-width: 1023px) 100vw, 40vw"
              alt={details.alt[lang]}
              loading="lazy"
              style={{ objectPosition: details.focus }}
            />
            <div className={styles.ideaOverlay}>
              <span className={styles.ideaNumber} aria-hidden="true">
                02
              </span>
              <h3 className={styles.ideaTitle}>{ideaDetails.title}</h3>
              <p className={styles.ideaText}>{ideaDetails.text}</p>
            </div>
          </article>

          <div className={styles.ideaPair}>
            {[ideaComfort, ideaPersonal].map((idea, index) => (
              <article key={idea.title} className={styles.ideaPlain} data-reveal style={order(index + 1)}>
                <span className={styles.ideaBigNumber} aria-hidden="true">
                  0{index + 3}
                </span>
                <h3 className={styles.ideaTitle}>{idea.title}</h3>
                <p className={styles.ideaText}>{idea.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* --- Принципы -----------------------------------------------------------------------
          Слева заголовок (на десктопе держится у верха экрана, пока листаются
          строки), справа — четыре строки через тонкие линии */}
      <section className={`container ${styles.section} ${styles.principles}`} aria-labelledby="principles-title">
        <div className={styles.principlesHead} data-reveal>
          <p className={styles.sectionEyebrow}>{text.principlesEyebrow}</p>
          <h2 className={styles.sectionTitle} id="principles-title">
            {text.principlesTitle}
          </h2>
          <p className={styles.sectionLead}>{text.principlesLead}</p>
        </div>
        <ol className={styles.principleList}>
          {text.principles.map((principle, index) => {
            const Icon = POINT_ICONS[principle.icon]
            return (
              <li key={principle.icon} className={styles.principle} data-reveal style={order(index)}>
                <span className={styles.principleNumber} aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className={styles.principleIcon} aria-hidden="true">
                  <Icon size={26} strokeWidth={1.3} />
                </span>
                <h3 className={styles.principleTitle}>{principle.title}</h3>
                <p className={styles.principleText}>{principle.text}</p>
              </li>
            )
          })}
        </ol>
      </section>

      {/* --- Почему DriveLux ----------------------------------------------------------------
          Польза для гостя: один крупный кадр (ключи в руке — итог всего пути)
          и короткие пункты сеткой. То, что на сайте — демо, так и названо */}
      <section className={`container ${styles.section} ${styles.why}`} aria-labelledby="why-title">
        <div className={styles.whyMedia} data-reveal>
          <img
            src={keys.small}
            srcSet={sources(keys, 700, 1200)}
            sizes="(max-width: 1023px) 100vw, 40vw"
            alt={keys.alt[lang]}
            loading="lazy"
            style={{ objectPosition: keys.focus }}
          />
          <p className={styles.whyBadge}>
            <KeyRound size={18} strokeWidth={1.5} aria-hidden="true" />
            {text.whyBadge}
          </p>
        </div>

        <div className={styles.whyBody}>
          <div data-reveal>
            <p className={styles.sectionEyebrow}>{text.whyEyebrow}</p>
            <h2 className={styles.sectionTitle} id="why-title">
              {text.whyTitle}
            </h2>
            <p className={styles.sectionLead}>{text.whyLead}</p>
          </div>
          <ul className={styles.whyList}>
            {text.why.map((item, index) => {
              const Icon = POINT_ICONS[item.icon]
              return (
                <li key={item.icon} className={styles.whyItem} data-reveal style={order(index)}>
                  <span className={styles.whyIcon} aria-hidden="true">
                    <Icon size={20} strokeWidth={1.5} />
                  </span>
                  <h3 className={styles.whyTitle}>{item.title}</h3>
                  <p className={styles.whyText}>{item.text}</p>
                </li>
              )
            })}
            <li className={styles.whyCta} data-reveal style={order(text.why.length)}>
              <SiteLink className={styles.whyLink} href={text.whyLink.href}>
                {text.whyLink.label}
                <ArrowRight size={18} strokeWidth={1.6} aria-hidden="true" />
              </SiteLink>
            </li>
          </ul>
        </div>
      </section>

      {/* --- Галерея ------------------------------------------------------------------------
          Мозаика из шести кадров: крупный, узкие и широкие. Плитка — кнопка:
          открывает кадр целиком в лайтбоксе */}
      <section className={`container ${styles.section}`} aria-labelledby="gallery-title">
        <SectionHeading
          id="gallery-title"
          eyebrow={text.galleryEyebrow}
          title={text.galleryTitle}
          aside={<p className={styles.headAside}>{text.galleryLead}</p>}
        />
        <ul className={styles.gallery}>
          {GALLERY.map((photo, index) => (
            <li key={photo.id} className={styles.tileItem} data-area={photo.area} data-reveal style={order(index)}>
              <button
                className={styles.tile}
                type="button"
                aria-haspopup="dialog"
                aria-label={text.galleryOpen(photo.caption[lang])}
                onClick={() => setLightbox(index)}
              >
                <img
                  src={photo.small}
                  srcSet={`${photo.small} 800w, ${photo.src} 1600w`}
                  sizes="(max-width: 640px) 100vw, (max-width: 1023px) 50vw, 33vw"
                  alt=""
                  loading="lazy"
                  style={{ objectPosition: photo.focus, '--tone': photo.tone } as CSSProperties}
                />
                <span className={styles.tileCaption} aria-hidden="true">
                  {photo.caption[lang]}
                </span>
                <span className={styles.tileZoom} aria-hidden="true">
                  <Expand size={16} strokeWidth={1.6} />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* --- Подход к сервису ---------------------------------------------------------------
          Четыре шага на одной линии с золотыми маркерами; на телефоне линия
          становится вертикальной. У каждого шага — ссылка на раздел сайта */}
      <section className={`container ${styles.section}`} aria-labelledby="approach-title">
        <SectionHeading
          id="approach-title"
          eyebrow={text.approachEyebrow}
          title={text.approachTitle}
          aside={<p className={styles.headAside}>{text.approachLead}</p>}
        />
        <ol className={styles.steps}>
          {text.steps.map((step, index) => (
            <li key={step.title} className={styles.step} data-reveal style={order(index)}>
              <span className={styles.stepMarker} aria-hidden="true">
                {index + 1}
              </span>
              <div className={styles.stepBody}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepText}>{step.text}</p>
                <SiteLink className={styles.stepLink} href={step.link.href}>
                  {step.link.label}
                  <ArrowRight size={15} strokeWidth={1.6} aria-hidden="true" />
                </SiteLink>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* --- Вопросы ------------------------------------------------------------------------
          Общий аккордеон сайта: нативные <details>, повторное нажатие
          закрывает ответ. Слева — подводка, ссылка на все вопросы и контакты
          (демонстрационные, из content/site.ts) */}
      <section className={`container ${styles.section} ${styles.faq}`} aria-labelledby="about-faq-title">
        <div>
          <SectionHeading id="about-faq-title" eyebrow={text.faqEyebrow} title={text.faqTitle} />
          <p className={styles.sectionLead} data-reveal>
            {text.faqLead}
          </p>
          <div className={styles.faqContacts} data-reveal>
            <a className={styles.faqContact} href={CONTACTS.phone.href}>
              <Phone size={16} strokeWidth={1.6} aria-hidden="true" />
              {CONTACTS.phone.label}
            </a>
            <a className={styles.faqContact} href={CONTACTS.email.href}>
              <Mail size={16} strokeWidth={1.6} aria-hidden="true" />
              {CONTACTS.email.label}
            </a>
            <SiteLink className={styles.textLink} href={text.faqLink.href}>
              {text.faqLink.label}
              <ArrowRight size={15} strokeWidth={1.6} aria-hidden="true" />
            </SiteLink>
          </div>
        </div>
        <div data-reveal>
          <Accordion items={text.faq} name="about-faq" openFirst />
        </div>
      </section>

      {/* --- Финальный блок -----------------------------------------------------------------
          Золотой силуэт машины в темноте и два следующих шага */}
      <section className={`container ${styles.section}`} aria-labelledby="about-cta-title">
        <div className={styles.cta}>
          <img
            className={styles.ctaPhoto}
            src={cta.small}
            srcSet={sources(cta, 1200, 2400)}
            sizes="100vw"
            alt=""
            loading="lazy"
            style={{ objectPosition: cta.focus }}
          />
          <div className={styles.ctaInner} data-reveal>
            <p className={styles.ctaEyebrow}>{text.ctaEyebrow}</p>
            <h2 className={styles.ctaTitle} id="about-cta-title">
              <span className={styles.titleLine}>{text.ctaTitle[0]}</span>{' '}
              <span className={`${styles.titleLine} ${styles.titleAccent}`}>{text.ctaTitle[1]}</span>
            </h2>
            <p className={styles.ctaText}>{text.ctaText}</p>
            <div className={styles.ctaActions}>
              <Button href={text.ctaPrimary.href} size="lg" arrow>
                {text.ctaPrimary.label}
              </Button>
              <Button href={text.ctaSecondary.href} variant="ghost" size="lg">
                {text.ctaSecondary.label}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* --- Подписи к фото и видео ---------------------------------------------------------- */}
      <p className={`container ${styles.credits}`}>
        {text.credits}{' '}
        {[hero, ABOUT_IMAGES.story, road, details, keys, ...GALLERY, cta, FILM].map((item, index) => (
          <span key={item.credit.url}>
            {index > 0 && ', '}
            <a href={item.credit.url} target="_blank" rel="noreferrer">
              {item.credit.author}
            </a>
          </span>
        ))}{' '}
        — Unsplash, Pexels.
      </p>

      <Lightbox photos={GALLERY} index={lightbox} onIndexChange={setLightbox} onClose={closeLightbox} />
      <FilmDialog open={filmOpen} onClose={closeFilm} />
    </div>
  )
}

// --- Наша история ------------------------------------------------------------------------
// Три части, как в макете: фото пространства с кнопкой видео, текст с
// раскрытием «Читать подробнее» и временная шкала. Дополнительный текст
// стоит в разметке всегда, но закрытым — inert, чтобы Tab и скринридер не
// заходили в невидимое; раскрывается плавно (grid-template-rows)
function Story({ onWatch }: { onWatch: () => void }) {
  const lang = useLang()
  const text = ABOUT_PAGE[lang]
  const story = ABOUT_IMAGES.story
  const [expanded, setExpanded] = useState(false)
  const moreId = useId()

  return (
    <section className={`container ${styles.section} ${styles.story}`} id="story" aria-labelledby="story-title">
      <div className={styles.storyMedia} data-reveal>
        <img
          src={story.small}
          srcSet={sources(story, 800, 1400)}
          sizes="(max-width: 1023px) 100vw, 40vw"
          alt={story.alt[lang]}
          loading="lazy"
          style={{ objectPosition: story.focus }}
        />
        <button className={styles.play} type="button" aria-haspopup="dialog" onClick={onWatch}>
          <span className={styles.playIcon} aria-hidden="true">
            <Play size={16} strokeWidth={1.8} fill="currentColor" />
          </span>
          {text.video}
        </button>
      </div>

      <div className={styles.storyBody} data-reveal style={order(1)}>
        <p className={styles.sectionEyebrow}>{text.storyEyebrow}</p>
        <h2 className={styles.sectionTitle} id="story-title">
          {text.storyTitle}
        </h2>
        <div className={styles.storyText}>
          {text.story.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className={styles.storyMore} id={moreId} data-open={expanded ? '' : undefined} inert={!expanded}>
          <div className={styles.storyMoreInner}>
            <div className={styles.storyText}>
              {text.storyMore.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
        <Button
          className={styles.readMore}
          arrow
          aria-expanded={expanded}
          aria-controls={moreId}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? text.readLess : text.readMore}
        </Button>
      </div>

      <div className={styles.timeline} data-reveal style={order(2)}>
        <p className={styles.timelineTitle}>{text.timelineTitle}</p>
        <ol className={styles.stages}>
          {text.timeline.map((stage) => (
            <li key={stage.year} className={styles.stage}>
              <span className={styles.stageYear}>{stage.year}</span>
              <h3 className={styles.stageTitle}>{stage.title}</h3>
              <p className={styles.stageText}>{stage.text}</p>
            </li>
          ))}
        </ol>
        <p className={styles.timelineNote}>{text.timelineNote}</p>
      </div>
    </section>
  )
}
