import { CalendarX2, Car, MapPin, Phone, ShieldCheck } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'
import { Accordion } from '@/components/Accordion/Accordion'
import { SectionHeading } from '@/components/SectionHeading/SectionHeading'
import { SimpleIcon } from '@/components/icons/SimpleIcon'
import { SOCIAL_PATHS } from '@/components/icons/logoPaths'
import { FAQ, FAQ_SECTION, type FaqChannel, type GuaranteeIcon } from '@/content/faq'
import { useLang } from '@/i18n/lang'
import styles from './Faq.module.css'
import { SiteLink } from '@/components/SiteLink/SiteLink'

const GUARANTEE_ICONS: Record<GuaranteeIcon, ReactNode> = {
  insurance: <ShieldCheck size={18} strokeWidth={1.5} />,
  delivery: <MapPin size={18} strokeWidth={1.5} />,
  return: <Car size={18} strokeWidth={1.5} />,
  cancel: <CalendarX2 size={18} strokeWidth={1.5} />,
}

function ChannelIcon({ icon }: { icon: FaqChannel['icon'] }) {
  if (icon === 'phone') return <Phone size={16} strokeWidth={1.6} aria-hidden="true" />
  return <SimpleIcon className={styles.channelLogo} path={SOCIAL_PATHS[icon]} />
}

// «Частые вопросы»: слева заголовок и под ним две карточки — «Не нашли
// ответ?» с мессенджерами и телефоном и «В каждой аренде» с главными
// обещаниями, справа — список вопросов. В разметке карточки идут после
// вопросов: «не нашли ответ» уместно, когда ответы уже просмотрены, — так
// они и читаются скринридером, и стоят на телефоне.
//
// Вопросы — общий аккордеон (components/Accordion): нативные
// <details>/<summary>, открытие одного ответа закрывает другой
export function Faq() {
  const lang = useLang()
  const text = FAQ_SECTION[lang]
  const items = FAQ.map((item) => ({ id: item.id, question: item.question[lang], answer: item.answer[lang] }))

  return (
    <section className={`container ${styles.section}`} id="faq" aria-labelledby="faq-title">
      <div className={styles.layout}>
        <div className={styles.intro}>
          <SectionHeading id="faq-title" eyebrow={text.eyebrow} title={text.title} />
          <p className={styles.lead} data-reveal>
            {text.lead}
          </p>
        </div>

        <div className={styles.list} data-reveal>
          <Accordion items={items} name="faq" openFirst />
        </div>

        <div className={styles.aside}>
          <div className={styles.contact} data-reveal>
            <p className={styles.contactTitle}>{text.contactTitle}</p>
            <p className={styles.contactText}>{text.contactText}</p>
            <ul className={styles.channels}>
              {text.channels.map((channel) => (
                <li key={channel.icon}>
                  <SiteLink className={styles.channel} href={channel.href}>
                    <ChannelIcon icon={channel.icon} />
                    {channel.label}
                  </SiteLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Вторая карточка колонки: тянется до низа списка вопросов,
              четыре пункта делят её высоту поровну */}
          <div className={styles.guarantees} data-reveal style={{ '--reveal-order': 1 } as CSSProperties}>
            <p className={styles.contactTitle}>{text.guaranteesTitle}</p>
            <ul className={styles.guaranteeList}>
              {text.guarantees.map((item) => (
                <li key={item.icon} className={styles.guarantee}>
                  <span className={styles.guaranteeIcon} aria-hidden="true">
                    {GUARANTEE_ICONS[item.icon]}
                  </span>
                  <span>
                    <span className={styles.guaranteeTitle}>{item.title}</span>
                    <span className={styles.guaranteeText}>{item.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
