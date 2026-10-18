import { useSyncExternalStore } from 'react'

// Аккаунты DriveLux — демо без сервера. Регистрация и вход работают по-
// настоящему, но только в этом браузере: аккаунты лежат в localStorage и
// никуда не отправляются. Страницы входа и регистрации прямо об этом пишут.
//
// Пароль не хранится открытым текстом даже здесь: сохраняется его хеш
// SHA-256 с солью аккаунта (Web Crypto). Где Web Crypto недоступен (сайт
// открыт не по https и не с localhost), хеш считается простой функцией —
// для демо этого достаточно, и данные всё равно не покидают браузер.
//
// Сессия — e-mail вошедшего: в localStorage, если отмечено «Запомнить
// меня», иначе в sessionStorage (закрыл вкладку — вышел). Шапка, мобильное
// меню и формы подписаны на хранилище и меняются вместе
export interface Account {
  name: string
  email: string
  phone: string
  createdAt: string
  offers: boolean
}

interface StoredAccount extends Account {
  salt: string
  hash: string
}

const ACCOUNTS_KEY = 'drivelux:accounts'
const SESSION_KEY = 'drivelux:session'

// --- Хранилища ----------------------------------------------------------------------
// localStorage и sessionStorage могут быть недоступны (приватный режим,
// запрет cookie) — тогда аккаунт живёт до перезагрузки страницы
let memoryAccounts: StoredAccount[] = []

function readAccounts(): StoredAccount[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) ?? '[]')
    return Array.isArray(parsed) ? (parsed as StoredAccount[]).filter((item) => typeof item?.email === 'string') : []
  } catch {
    return memoryAccounts
  }
}

function writeAccounts(accounts: StoredAccount[]) {
  memoryAccounts = accounts
  try {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
  } catch {
    // Остаётся в памяти
  }
}

function readSession(): string | null {
  try {
    return localStorage.getItem(SESSION_KEY) ?? sessionStorage.getItem(SESSION_KEY)
  } catch {
    return null
  }
}

function writeSession(email: string | null, remember = true) {
  try {
    localStorage.removeItem(SESSION_KEY)
    sessionStorage.removeItem(SESSION_KEY)
    if (email) (remember ? localStorage : sessionStorage).setItem(SESSION_KEY, email)
  } catch {
    // Сессия живёт в памяти до перезагрузки
  }
}

// --- Хеш пароля -------------------------------------------------------------------------
function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

// Запасной хеш FNV-1a — только если Web Crypto недоступен
function fallbackHash(text: string) {
  let hash = 0x811c9dc5
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index)
    hash = Math.imul(hash, 0x01000193)
  }
  return `fnv-${(hash >>> 0).toString(16)}`
}

async function hashPassword(password: string, salt: string) {
  const text = `${salt}:${password}`
  if (!globalThis.crypto?.subtle) return fallbackHash(text)
  return toHex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)))
}

function newSalt() {
  if (typeof globalThis.crypto !== 'undefined' && 'getRandomValues' in globalThis.crypto) {
    return toHex(crypto.getRandomValues(new Uint8Array(12)).buffer)
  }
  return Math.random().toString(16).slice(2)
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function publicPart(account: StoredAccount): Account {
  return {
    name: account.name,
    email: account.email,
    phone: account.phone,
    createdAt: account.createdAt,
    offers: account.offers,
  }
}

// --- Состояние ------------------------------------------------------------------------
function findCurrent(): Account | null {
  const email = readSession()
  const account = email ? readAccounts().find((item) => item.email === email) : undefined
  return account ? publicPart(account) : null
}

let user: Account | null = findCurrent()
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

function setUser(next: Account | null) {
  user = next
  emit()
}

// Вход или выход в соседней вкладке приходит событием storage
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key !== SESSION_KEY && event.key !== ACCOUNTS_KEY) return
    setUser(findCurrent())
  })
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useUser(): Account | null {
  return useSyncExternalStore(subscribe, () => user)
}

// --- Действия -------------------------------------------------------------------------
export type RegisterResult = { ok: true } | { ok: false; error: 'exists' }
export type LoginResult = { ok: true } | { ok: false; error: 'not-found' | 'wrong-password' }

export async function register(input: {
  name: string
  email: string
  phone: string
  password: string
  offers: boolean
}): Promise<RegisterResult> {
  const email = normalizeEmail(input.email)
  const accounts = readAccounts()
  if (accounts.some((item) => item.email === email)) return { ok: false, error: 'exists' }

  const salt = newSalt()
  const account: StoredAccount = {
    name: input.name.trim(),
    email,
    phone: input.phone.trim(),
    createdAt: new Date().toISOString(),
    offers: input.offers,
    salt,
    hash: await hashPassword(input.password, salt),
  }
  writeAccounts([...accounts, account])
  writeSession(email)
  setUser(publicPart(account))
  return { ok: true }
}

export async function login(emailInput: string, password: string, remember: boolean): Promise<LoginResult> {
  const email = normalizeEmail(emailInput)
  const account = readAccounts().find((item) => item.email === email)
  if (!account) return { ok: false, error: 'not-found' }
  if ((await hashPassword(password, account.salt)) !== account.hash) return { ok: false, error: 'wrong-password' }
  writeSession(email, remember)
  setUser(publicPart(account))
  return { ok: true }
}

export function logout() {
  writeSession(null)
  setUser(null)
}

// Инициалы для кружка-аватара: «Анна Смирнова» → «АС»
export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
    .slice(0, 2)
}
