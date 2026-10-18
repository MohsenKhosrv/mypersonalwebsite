/**
 * Mixpanel wrapper. Every component calls `track()`; nothing else imports mixpanel-browser.
 *
 * - No token  -> does nothing (one console warning in dev). With NEXT_PUBLIC_ANALYTICS_DEBUG=true in dev
 *   it runs as a dry run: events are logged to the console but never sent.
 * - mixpanel-browser is loaded with a dynamic import after the page is interactive; events captured
 *   before it arrives are queued (with their original timestamp) and flushed in order.
 * - Sessions: a session ends after 30 minutes of inactivity or when the browser session ends
 *   (sessionStorage is gone). `session_id` / `session_number` are registered as super properties.
 */
import type { AnalyticsEvents, DeviceType, EventName } from "./analytics-events"

type Mixpanel = typeof import("mixpanel-browser").default

const TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN
const DEBUG =
  process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === "true"
const SESSION_TIMEOUT_MS = 30 * 60 * 1000

const KEY_SESSION_ID = "mk_session_id"
const KEY_LAST_ACTIVITY = "mk_last_activity"
const KEY_SESSION_NUMBER = "mk_session_number"

export interface TrackOptions {
  /** Send immediately via navigator.sendBeacon so the event survives unload / outbound navigation */
  beacon?: boolean
}

interface Session {
  id: string
  number: number
}

let mixpanel: Mixpanel | null = null
let initStarted = false
let registeredSessionId: string | null = null
const queue: Array<(mp: Mixpanel) => void> = []

const isBrowser = () => typeof window !== "undefined"
const isEnabled = () => isBrowser() && (Boolean(TOKEN) || DEBUG)

// ---------------------------------------------------------------- storage (with in-memory fallback)

const memory = new Map<string, string>()

function readStore(kind: "session" | "local", key: string): string | null {
  try {
    const store = kind === "session" ? window.sessionStorage : window.localStorage
    return store.getItem(key)
  } catch {
    return memory.get(`${kind}:${key}`) ?? null
  }
}

function writeStore(kind: "session" | "local", key: string, value: string) {
  try {
    const store = kind === "session" ? window.sessionStorage : window.localStorage
    store.setItem(key, value)
  } catch {
    memory.set(`${kind}:${key}`, value)
  }
}

// ---------------------------------------------------------------- helpers shared with the provider

export function getDeviceType(): DeviceType {
  const ua = navigator.userAgent
  if (/iPad|Tablet|PlayBook|Silk/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua))) {
    return "tablet"
  }
  if (/Mobi|iPhone|iPod|Android/i.test(ua)) return "mobile"
  return "desktop"
}

/** Hostname of document.referrer, or "direct" when there is none. */
export function getReferrerDomain(): string {
  if (!document.referrer) return "direct"
  try {
    return new URL(document.referrer).hostname || "direct"
  } catch {
    return "direct"
  }
}

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`
}

function debugLog(label: string, name: string, props: unknown) {
  if (DEBUG) console.log(`[analytics] ${label} ${name}`, props)
}

// ---------------------------------------------------------------- sessions

/**
 * Returns the current session, starting a new one (and queueing `session_start`) when the previous
 * one expired. Called on every tracked event and on throttled user activity.
 */
export function ensureSession(): Session | null {
  if (!isEnabled()) return null
  const now = Date.now()
  const id = readStore("session", KEY_SESSION_ID)
  const last = Number(readStore("session", KEY_LAST_ACTIVITY))
  const expired = !id || !last || now - last > SESSION_TIMEOUT_MS

  writeStore("session", KEY_LAST_ACTIVITY, String(now))
  if (!expired && id) {
    return { id, number: Number(readStore("local", KEY_SESSION_NUMBER)) || 1 }
  }

  const session: Session = {
    id: newId(),
    number: (Number(readStore("local", KEY_SESSION_NUMBER)) || 0) + 1,
  }
  writeStore("session", KEY_SESSION_ID, session.id)
  writeStore("local", KEY_SESSION_NUMBER, String(session.number))

  dispatch(
    "session_start",
    {
      landing_page: window.location.pathname,
      referrer_domain: getReferrerDomain(),
      device_type: getDeviceType(),
    },
    session,
  )
  return session
}

// ---------------------------------------------------------------- init

function utmFromUrl() {
  const params = new URLSearchParams(window.location.search)
  const out: Record<string, string> = {}
  const source = params.get("utm_source")
  const medium = params.get("utm_medium")
  if (source) out.first_utm_source = source
  if (medium) out.first_utm_medium = medium
  return out
}

function onMixpanelReady(mp: Mixpanel) {
  mixpanel = mp
  // First ever visit only: skip when the persisted property already exists.
  if (mp.get_property("first_visit_date") === undefined) {
    mp.register_once({
      first_visit_date: new Date().toISOString().slice(0, 10),
      first_landing_page: window.location.pathname,
      first_referrer_domain: getReferrerDomain(),
      ...utmFromUrl(),
    })
  }
  for (const job of queue.splice(0)) job(mp)
}

/** Idempotent (safe under React strict mode). Call once from the analytics provider. */
export function initAnalytics() {
  if (!isBrowser() || initStarted) return
  initStarted = true

  if (!TOKEN) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[analytics] NEXT_PUBLIC_MIXPANEL_TOKEN is not set; Mixpanel tracking is disabled." +
          (DEBUG ? " Debug dry-run: events are logged but not sent." : ""),
      )
    }
    return
  }

  import("mixpanel-browser")
    .then(({ default: mp }) => {
      mp.init(TOKEN, {
        autocapture: false,
        track_pageview: false,
        persistence: "localStorage",
        ignore_dnt: false,
      })
      onMixpanelReady(mp)
    })
    .catch((error) => {
      if (process.env.NODE_ENV !== "production") console.warn("[analytics] failed to load", error)
    })
}

// ---------------------------------------------------------------- track

function dispatch<K extends EventName>(
  name: K,
  props: AnalyticsEvents[K],
  session: Session,
  options?: TrackOptions,
) {
  const time = Date.now() / 1000
  debugLog(TOKEN ? "track" : "track (dry run, not sent)", name, {
    ...props,
    session_id: session.id,
    session_number: session.number,
  })
  if (!TOKEN) return

  const send = (mp: Mixpanel) => {
    if (registeredSessionId !== session.id) {
      mp.register({ session_id: session.id, session_number: session.number })
      registeredSessionId = session.id
    }
    mp.track(
      name,
      { ...props, time },
      options?.beacon ? { transport: "sendBeacon", send_immediately: true } : undefined,
    )
  }
  if (mixpanel) send(mixpanel)
  else queue.push(send)
}

/** Type-checked event tracking. Event names and property shapes live in analytics-events.ts. */
export function track<K extends EventName>(name: K, props: AnalyticsEvents[K], options?: TrackOptions) {
  if (!isEnabled()) return
  const session = ensureSession()
  if (!session) return
  dispatch(name, props, session, options)
}
