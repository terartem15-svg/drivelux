import { BadgePercent, CheckCircle2, Eye, EyeOff, Heart, Info, LoaderCircle, LogOut, Zap } from 'lucide-react'
import { useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import heroImage from '@/assets/hero/huracan.webp'
import { Breadcrumbs } from '@/components/Breadcrumbs/Breadcrumbs'
import { Button } from '@/components/Button/Button'
import { SiteLink } from '@/components/SiteLink/SiteLink'
import { ROUTES } from '@/content/site'
import { localized, useLang } from '@/i18n/lang'
import { login, logout, register, useUser } from '@/store/auth'
import { useDocumentTitle } from '@/utils/useDocumentTitle'
import styles from './AuthPage.module.css'

// Вход и регистрация — /login и /register. Сайт — концепт без сервера:
// аккаунт создаётся и проверяется по-настоящему, но живёт только в этом
// браузере (store/auth) и никуда не отправляется. Обе страницы говорят об
// этом прямо, рядом с кнопкой.
//
// Раскладка: слева — фото и чем полезен аккаунт, справа — карточка с
// вкладками «Вход / Регистрация» и формой. Проверка полей — своя (как в
// форме заказа услуги): сообщения под полями, поле с ошибкой помечено
// aria-invalid и связано с текстом ошибки, фокус переходит на первое
// неверное поле. Ошибки хранятся ключами, а не текстом — при смене языка
// они переводятся вместе со страницей.
//
// ?next=/booking — куда вернуть после входа (например, со страницы
// бронирования); без него — на главную
const TEXT = localized(
  {
    home: 'Главная',
    login: 'Вход',
    register: 'Регистрация',
    loginTitle: 'С возвращением',
    loginLead: 'Войдите, чтобы бронировать быстрее и копить привилегии клуба DriveLux.',
    registerTitle: 'Создайте аккаунт',
    registerLead: 'Минута — и вы в клубе DriveLux: скидки растут с каждой поездкой.',
    visualTitle: 'Аккаунт DriveLux',
    visualText: 'Ваши данные, избранное и уровень в программе лояльности — в одном месте.',
    benefits: [
      'Скидки клуба до 15% — с третьей поездки',
      'Бронирование в пару касаний: данные уже заполнены',
      'Избранные машины всегда под рукой',
    ],
    name: 'Имя и фамилия',
    namePlaceholder: 'Анна Смирнова',
    email: 'E-mail',
    emailPlaceholder: 'name@mail.ru',
    phone: 'Телефон',
    phonePlaceholder: '+7 916 123-45-67',
    optional: ' — необязательно',
    password: 'Пароль',
    passwordHint: 'Не меньше 8 символов, буквы и цифры',
    confirm: 'Повторите пароль',
    show: 'Показать пароль',
    hide: 'Скрыть пароль',
    strength: ['Слабый пароль', 'Средний пароль', 'Надёжный пароль'],
    terms: 'Принимаю условия аренды и политику конфиденциальности',
    offers: 'Присылать закрытые предложения на e-mail',
    remember: 'Запомнить меня',
    forgot: 'Забыли пароль?',
    forgotText:
      'В демо-версии восстановления нет: аккаунт хранится только в этом браузере. Создайте новый аккаунт с другим e-mail.',
    submitLogin: 'Войти',
    submitRegister: 'Создать аккаунт',
    submitting: 'Проверяем…',
    noAccount: 'Нет аккаунта?',
    toRegister: 'Зарегистрироваться',
    haveAccount: 'Уже есть аккаунт?',
    toLogin: 'Войти',
    demo: 'Демо: аккаунт хранится только в этом браузере, данные никуда не отправляются.',
    errors: {
      name: 'Укажите имя — хотя бы 2 буквы',
      email: 'Похоже, в e-mail ошибка. Пример: name@mail.ru',
      phone: 'В номере должно быть не меньше 10 цифр',
      password: 'Пароль — не меньше 8 символов, буквы и цифры',
      passwordRequired: 'Введите пароль',
      confirm: 'Пароли не совпадают',
      terms: 'Без согласия с условиями аккаунт не создать',
      exists: 'Аккаунт с таким e-mail уже есть в этом браузере — войдите',
      notFound: 'Аккаунт с таким e-mail не найден в этом браузере',
      wrongPassword: 'Неверный пароль',
    },
    summary: 'Проверьте поля с ошибкой — подсказки под ними.',
    welcome: (name: string) => `Добро пожаловать, ${name}!`,
    welcomeText: 'Аккаунт создан, вы уже вошли. Первая скидка клуба — с третьей поездки.',
    toFleet: 'Выбрать автомобиль',
    toLoyalty: 'О программе лояльности',
    signedIn: (name: string) => `Вы вошли как ${name}`,
    signedInText: 'Чтобы войти в другой аккаунт, сначала выйдите из этого.',
    logout: 'Выйти',
    toHome: 'На главную',
  },
  {
    home: 'Home',
    login: 'Sign in',
    register: 'Sign up',
    loginTitle: 'Welcome back',
    loginLead: 'Sign in to book faster and collect DriveLux Club privileges.',
    registerTitle: 'Create an account',
    registerLead: 'One minute — and you are in the DriveLux Club: discounts grow with every trip.',
    visualTitle: 'DriveLux account',
    visualText: 'Your details, favourites and loyalty tier — all in one place.',
    benefits: [
      'Club discounts up to 15% — from your third trip',
      'Book in a couple of taps: your details are filled in',
      'Your favourite cars always at hand',
    ],
    name: 'Full name',
    namePlaceholder: 'Anna Smith',
    email: 'E-mail',
    emailPlaceholder: 'name@mail.com',
    phone: 'Phone',
    phonePlaceholder: '+7 916 123-45-67',
    optional: ' — optional',
    password: 'Password',
    passwordHint: 'At least 8 characters, letters and digits',
    confirm: 'Repeat password',
    show: 'Show password',
    hide: 'Hide password',
    strength: ['Weak password', 'Fair password', 'Strong password'],
    terms: 'I accept the rental terms and the privacy policy',
    offers: 'Send me private offers by e-mail',
    remember: 'Remember me',
    forgot: 'Forgot password?',
    forgotText:
      'There is no recovery in the demo: the account lives only in this browser. Create a new account with another e-mail.',
    submitLogin: 'Sign in',
    submitRegister: 'Create account',
    submitting: 'Checking…',
    noAccount: 'No account yet?',
    toRegister: 'Sign up',
    haveAccount: 'Already have an account?',
    toLogin: 'Sign in',
    demo: 'Demo: the account is stored only in this browser, nothing is sent anywhere.',
    errors: {
      name: 'Enter your name — at least 2 letters',
      email: 'This e-mail looks wrong. E.g. name@mail.com',
      phone: 'The number needs at least 10 digits',
      password: 'At least 8 characters, letters and digits',
      passwordRequired: 'Enter your password',
      confirm: 'The passwords do not match',
      terms: 'You need to accept the terms to create an account',
      exists: 'An account with this e-mail already exists in this browser — sign in',
      notFound: 'No account with this e-mail in this browser',
      wrongPassword: 'Wrong password',
    },
    summary: 'Check the fields with errors — hints are below them.',
    welcome: (name: string) => `Welcome, ${name}!`,
    welcomeText: 'Your account is created and you are signed in. The first club discount starts on your third trip.',
    toFleet: 'Choose a car',
    toLoyalty: 'About the loyalty programme',
    signedIn: (name: string) => `You are signed in as ${name}`,
    signedInText: 'To sign in to another account, sign out of this one first.',
    logout: 'Sign out',
    toHome: 'Back home',
  },
)

type ErrorKey = keyof (typeof TEXT)['ru']['errors']
type Field = 'name' | 'email' | 'phone' | 'password' | 'confirm' | 'terms'
type Errors = Partial<Record<Field, ErrorKey>>

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const BENEFIT_ICONS = [BadgePercent, Zap, Heart]

// Безопасный адрес возврата: только страницы этого сайта
function safeNext(value: string | null) {
  // Только свой адрес: «//сайт» и «/\сайт» браузер понял бы как чужой домен
  return value && value.startsWith('/') && !value.startsWith('//') && !value.includes('\\') ? value : ROUTES.home
}

// Сила пароля: длина, буквы и цифры, разный регистр, символы
function strength(password: string): 0 | 1 | 2 {
  let score = 0
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  if (/[a-zа-яё]/.test(password) && /[A-ZА-ЯЁ]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[^\p{L}\d]/u.test(password)) score += 1
  return score >= 4 ? 2 : score >= 3 ? 1 : 0
}

function validPassword(password: string) {
  return password.length >= 8 && /\p{L}/u.test(password) && /\d/.test(password)
}

// --- Страницы ----------------------------------------------------------------------
export function LoginPage() {
  return <AuthPage mode="login" />
}

export function RegisterPage() {
  return <AuthPage mode="register" />
}

function AuthPage({ mode }: { mode: 'login' | 'register' }) {
  const lang = useLang()
  const text = TEXT[lang]
  const user = useUser()
  const [params] = useSearchParams()
  const next = params.get('next')
  const nextQuery = next ? `?next=${encodeURIComponent(next)}` : ''
  const [created, setCreated] = useState(false)
  useDocumentTitle(mode === 'login' ? text.login : text.register)

  let content: ReactNode
  if (created && user) {
    content = (
      <div className={styles.result} role="status">
        <CheckCircle2 className={styles.resultIcon} size={36} strokeWidth={1.4} aria-hidden="true" />
        <h1 className={styles.title}>{text.welcome(user.name.split(' ')[0])}</h1>
        <p className={styles.lead}>{text.welcomeText}</p>
        <div className={styles.resultActions}>
          <Button href={next ? safeNext(next) : ROUTES.fleet} arrow>
            {text.toFleet}
          </Button>
          <Button href={ROUTES.loyalty} variant="ghost">
            {text.toLoyalty}
          </Button>
        </div>
      </div>
    )
  } else if (user) {
    content = (
      <div className={styles.result}>
        <h1 className={styles.title}>{text.signedIn(user.name)}</h1>
        <p className={styles.lead}>{text.signedInText}</p>
        <div className={styles.resultActions}>
          <Button href={ROUTES.home} arrow>
            {text.toHome}
          </Button>
          <Button variant="ghost" icon={<LogOut size={16} strokeWidth={1.6} aria-hidden="true" />} onClick={logout}>
            {text.logout}
          </Button>
        </div>
      </div>
    )
  } else {
    content = (
      <>
        <div className={styles.tabs}>
          <SiteLink
            className={styles.tab}
            href={`${ROUTES.login}${nextQuery}`}
            aria-current={mode === 'login' ? 'page' : undefined}
          >
            {text.login}
          </SiteLink>
          <SiteLink
            className={styles.tab}
            href={`${ROUTES.register}${nextQuery}`}
            aria-current={mode === 'register' ? 'page' : undefined}
          >
            {text.register}
          </SiteLink>
        </div>
        <h1 className={styles.title}>{mode === 'login' ? text.loginTitle : text.registerTitle}</h1>
        <p className={styles.lead}>{mode === 'login' ? text.loginLead : text.registerLead}</p>
        {mode === 'login' ? (
          <LoginForm next={safeNext(next)} nextQuery={nextQuery} />
        ) : (
          <RegisterForm onCreated={() => setCreated(true)} nextQuery={nextQuery} />
        )}
      </>
    )
  }

  return (
    <div className={`container ${styles.page}`}>
      <Breadcrumbs
        crumbs={[{ label: text.home, href: ROUTES.home }, { label: mode === 'login' ? text.login : text.register }]}
      />

      <div className={styles.layout}>
        {/* --- Фото и польза аккаунта ---------------------------------------------------- */}
        <aside className={styles.visual} aria-label={text.visualTitle}>
          <img className={styles.visualPhoto} src={heroImage} alt="" />
          <div className={styles.visualBody}>
            <p className={styles.visualTitle}>{text.visualTitle}</p>
            <p className={styles.visualText}>{text.visualText}</p>
            <ul className={styles.benefits}>
              {text.benefits.map((benefit, index) => {
                const Icon = BENEFIT_ICONS[index]
                return (
                  <li key={benefit}>
                    <span className={styles.benefitIcon} aria-hidden="true">
                      <Icon size={16} strokeWidth={1.6} />
                    </span>
                    {benefit}
                  </li>
                )
              })}
            </ul>
          </div>
        </aside>

        {/* --- Карточка с формой ---------------------------------------------------------- */}
        <div className={styles.card}>{content}</div>
      </div>
    </div>
  )
}

// --- Вход ---------------------------------------------------------------------------
function LoginForm({ next, nextQuery }: { next: string; nextQuery: string }) {
  const lang = useLang()
  const text = TEXT[lang]
  const navigate = useNavigate()
  const id = useId()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [errors, setErrors] = useState<Errors>({})
  const [busy, setBusy] = useState(false)
  const [forgot, setForgot] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const nextErrors: Errors = {}
    if (!EMAIL.test(email.trim())) nextErrors.email = 'email'
    if (!password) nextErrors.password = 'passwordRequired'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      focusFirst(formRef.current, nextErrors)
      return
    }

    setBusy(true)
    const result = await login(email, password, remember)
    setBusy(false)
    if (result.ok) {
      navigate(next)
      return
    }
    const key: Errors = result.error === 'not-found' ? { email: 'notFound' } : { password: 'wrongPassword' }
    setErrors(key)
    focusFirst(formRef.current, key)
  }

  return (
    <form ref={formRef} className={styles.form} onSubmit={handleSubmit} noValidate aria-busy={busy}>
      <TextField
        id={`${id}-email`}
        field="email"
        label={text.email}
        type="email"
        autoComplete="email"
        placeholder={text.emailPlaceholder}
        value={email}
        onChange={(value) => {
          setEmail(value)
          if (errors.email) setErrors((current) => ({ ...current, email: undefined }))
        }}
        error={errors.email && text.errors[errors.email]}
        after={
          errors.email === 'notFound' ? (
            <SiteLink className={styles.inlineLink} href={`${ROUTES.register}${nextQuery}`}>
              {text.toRegister}
            </SiteLink>
          ) : undefined
        }
      />
      <PasswordField
        id={`${id}-password`}
        label={text.password}
        autoComplete="current-password"
        value={password}
        onChange={(value) => {
          setPassword(value)
          if (errors.password) setErrors((current) => ({ ...current, password: undefined }))
        }}
        error={errors.password && text.errors[errors.password]}
      />

      <div className={styles.row}>
        <label className={styles.check}>
          <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />
          <span>{text.remember}</span>
        </label>
        <button
          className={styles.textButton}
          type="button"
          aria-expanded={forgot}
          onClick={() => setForgot((value) => !value)}
        >
          {text.forgot}
        </button>
      </div>
      {forgot && (
        <p className={styles.note}>
          <Info size={16} strokeWidth={1.6} aria-hidden="true" />
          {text.forgotText}
        </p>
      )}

      <Submit busy={busy} label={text.submitLogin} busyLabel={text.submitting} />
      <p className={styles.switch}>
        {text.noAccount}{' '}
        <SiteLink className={styles.inlineLink} href={`${ROUTES.register}${nextQuery}`}>
          {text.toRegister}
        </SiteLink>
      </p>
      <p className={styles.demo}>
        <Info size={15} strokeWidth={1.6} aria-hidden="true" />
        {text.demo}
      </p>
    </form>
  )
}

// --- Регистрация --------------------------------------------------------------------
function RegisterForm({ onCreated, nextQuery }: { onCreated: () => void; nextQuery: string }) {
  const lang = useLang()
  const text = TEXT[lang]
  const id = useId()
  const [values, setValues] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [terms, setTerms] = useState(false)
  const [offers, setOffers] = useState(true)
  const [errors, setErrors] = useState<Errors>({})
  const [busy, setBusy] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  function validate(state = values, accepted = terms): Errors {
    const result: Errors = {}
    if (state.name.trim().length < 2) result.name = 'name'
    if (!EMAIL.test(state.email.trim())) result.email = 'email'
    if (state.phone.trim() && state.phone.replace(/\D/g, '').length < 10) result.phone = 'phone'
    if (!validPassword(state.password)) result.password = 'password'
    if (state.confirm !== state.password || !state.confirm) result.confirm = 'confirm'
    if (!accepted) result.terms = 'terms'
    return result
  }

  // Поле с ошибкой перепроверяется на каждом вводе — ошибка уходит, как
  // только значение стало верным
  function set(field: keyof typeof values, value: string) {
    const next = { ...values, [field]: value }
    setValues(next)
    if (Object.keys(errors).length) {
      const fresh = validate(next)
      setErrors((current) => {
        const updated: Errors = {}
        for (const key of Object.keys(current) as Field[]) {
          if (current[key] === 'exists' && key === 'email' && field !== 'email') updated.email = 'exists'
          else if (fresh[key]) updated[key] = fresh[key]
        }
        return updated
      })
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      focusFirst(formRef.current, nextErrors)
      return
    }
    setBusy(true)
    const result = await register({ ...values, offers })
    setBusy(false)
    if (result.ok) {
      onCreated()
      window.scrollTo({ top: 0, behavior: 'instant' })
      return
    }
    setErrors({ email: 'exists' })
    focusFirst(formRef.current, { email: 'exists' })
  }

  const level = strength(values.password)
  const errorCount = Object.values(errors).filter(Boolean).length

  return (
    <form ref={formRef} className={styles.form} onSubmit={handleSubmit} noValidate aria-busy={busy}>
      <TextField
        id={`${id}-name`}
        field="name"
        label={text.name}
        autoComplete="name"
        placeholder={text.namePlaceholder}
        value={values.name}
        onChange={(value) => set('name', value)}
        error={errors.name && text.errors[errors.name]}
      />
      <div className={styles.pair}>
        <TextField
          id={`${id}-email`}
          field="email"
          label={text.email}
          type="email"
          autoComplete="email"
          placeholder={text.emailPlaceholder}
          value={values.email}
          onChange={(value) => set('email', value)}
          error={errors.email && text.errors[errors.email]}
          after={
            errors.email === 'exists' ? (
              <SiteLink className={styles.inlineLink} href={`${ROUTES.login}${nextQuery}`}>
                {text.toLogin}
              </SiteLink>
            ) : undefined
          }
        />
        <TextField
          id={`${id}-phone`}
          field="phone"
          label={text.phone}
          optional={text.optional}
          type="tel"
          autoComplete="tel"
          placeholder={text.phonePlaceholder}
          value={values.phone}
          onChange={(value) => set('phone', value)}
          error={errors.phone && text.errors[errors.phone]}
        />
      </div>
      <div className={styles.pair}>
        <PasswordField
          id={`${id}-password`}
          label={text.password}
          autoComplete="new-password"
          value={values.password}
          onChange={(value) => set('password', value)}
          error={errors.password && text.errors[errors.password]}
          hint={text.passwordHint}
          meter={values.password ? { level, label: text.strength[level] } : undefined}
        />
        <PasswordField
          id={`${id}-confirm`}
          field="confirm"
          label={text.confirm}
          autoComplete="new-password"
          value={values.confirm}
          onChange={(value) => set('confirm', value)}
          error={errors.confirm && text.errors[errors.confirm]}
        />
      </div>

      <div className={styles.checks}>
        <label className={styles.check} data-field="terms">
          <input
            type="checkbox"
            checked={terms}
            aria-invalid={errors.terms ? true : undefined}
            aria-describedby={errors.terms ? `${id}-terms-error` : undefined}
            onChange={(event) => {
              setTerms(event.target.checked)
              if (errors.terms && event.target.checked) setErrors((current) => ({ ...current, terms: undefined }))
            }}
          />
          <span>{text.terms}</span>
        </label>
        {errors.terms && (
          <p className={styles.error} id={`${id}-terms-error`}>
            {text.errors[errors.terms]}
          </p>
        )}
        <label className={styles.check}>
          <input type="checkbox" checked={offers} onChange={(event) => setOffers(event.target.checked)} />
          <span>{text.offers}</span>
        </label>
      </div>

      <p className={styles.summary} role="alert">
        {errorCount > 1 ? text.summary : ''}
      </p>

      <Submit busy={busy} label={text.submitRegister} busyLabel={text.submitting} />
      <p className={styles.switch}>
        {text.haveAccount}{' '}
        <SiteLink className={styles.inlineLink} href={`${ROUTES.login}${nextQuery}`}>
          {text.toLogin}
        </SiteLink>
      </p>
      <p className={styles.demo}>
        <Info size={15} strokeWidth={1.6} aria-hidden="true" />
        {text.demo}
      </p>
    </form>
  )
}

// --- Поля ---------------------------------------------------------------------------
// Фокус на первое поле с ошибкой — в порядке полей формы
function focusFirst(form: HTMLFormElement | null, errors: Errors) {
  const order: Field[] = ['name', 'email', 'phone', 'password', 'confirm', 'terms']
  const first = order.find((field) => errors[field])
  if (!first || !form) return
  const target =
    first === 'terms'
      ? form.querySelector<HTMLInputElement>('[data-field="terms"] input')
      : form.querySelector<HTMLInputElement>(`[data-field="${first}"] input`)
  target?.focus()
}

interface TextFieldProps {
  id: string
  field: Field
  label: string
  optional?: string
  type?: string
  autoComplete: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  error?: string
  after?: ReactNode
}

function TextField({
  id,
  field,
  label,
  optional,
  type = 'text',
  autoComplete,
  placeholder,
  value,
  onChange,
  error,
  after,
}: TextFieldProps) {
  return (
    <div className={styles.field} data-field={field}>
      <label className={styles.label} htmlFor={id}>
        {label}
        {optional && <span className={styles.optional}>{optional}</span>}
      </label>
      <input
        className={styles.control}
        id={id}
        type={type}
        autoComplete={autoComplete}
        inputMode={type === 'email' ? 'email' : type === 'tel' ? 'tel' : undefined}
        placeholder={placeholder}
        spellCheck={false}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {error && (
        <p className={styles.error} id={`${id}-error`}>
          {error} {after}
        </p>
      )}
    </div>
  )
}

interface PasswordFieldProps {
  id: string
  field?: Field
  label: string
  autoComplete: string
  value: string
  onChange: (value: string) => void
  error?: string
  hint?: string
  meter?: { level: 0 | 1 | 2; label: string }
}

// Пароль с кнопкой «показать»: глаз переключает type поля, фокус остаётся
// в поле. Под паролем регистрации — шкала надёжности из трёх делений
function PasswordField({
  id,
  field = 'password',
  label,
  autoComplete,
  value,
  onChange,
  error,
  hint,
  meter,
}: PasswordFieldProps) {
  const text = TEXT[useLang()]
  const [visible, setVisible] = useState(false)
  const describedBy = [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(' ') || undefined

  return (
    <div className={styles.field} data-field={field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <div className={styles.passwordBox}>
        <input
          className={styles.control}
          id={id}
          type={visible ? 'text' : 'password'}
          autoComplete={autoComplete}
          spellCheck={false}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <button
          className={styles.eye}
          type="button"
          aria-label={visible ? text.hide : text.show}
          aria-pressed={visible}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? (
            <EyeOff size={18} strokeWidth={1.6} aria-hidden="true" />
          ) : (
            <Eye size={18} strokeWidth={1.6} aria-hidden="true" />
          )}
        </button>
      </div>
      {meter && (
        <div className={styles.meter} data-level={meter.level}>
          <span className={styles.meterBars} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className={styles.meterLabel}>{meter.label}</span>
        </div>
      )}
      {hint && !error && (
        <p className={styles.hint} id={`${id}-hint`}>
          {hint}
        </p>
      )}
      {error && (
        <p className={styles.error} id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  )
}

function Submit({ busy, label, busyLabel }: { busy: boolean; label: string; busyLabel: string }) {
  return (
    <Button
      className={styles.submit}
      type="submit"
      size="lg"
      disabled={busy}
      arrow={!busy}
      icon={
        busy ? <LoaderCircle className={styles.spinner} size={18} strokeWidth={1.8} aria-hidden="true" /> : undefined
      }
    >
      {busy ? busyLabel : label}
    </Button>
  )
}
