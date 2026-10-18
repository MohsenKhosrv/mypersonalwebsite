"use client"

/**
 * Behavioural tracking for the whole site, mounted once in the root layout.
 *
 * Page-level state (timers, observers, scroll listener) lives in a module-level `page` object that is
 * started when the route changes and torn down when the next route starts. It is deliberately NOT
 * created/destroyed in effect cleanup, so React strict-mode's mount -> unmount -> mount in dev cannot
 * produce a duplicate page_view or a phantom page_exit. Global listeners (click, visibility, pagehide)
 * are added in an effect with a normal cleanup, so they are registered exactly once at any time.
 */
import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { ensureSession, initAnalytics, track } from "@/lib/analytics"
import type { ContentType, EntryPoint, ScrollThreshold } from "@/lib/analytics-events"
import { CASE_STUDIES } from "@/lib/case-studies"

const SCROLL_THRESHOLDS: ScrollThreshold[] = [25, 50, 75, 100]
const SCROLL_THROTTLE_MS = 200
const ACTIVITY_THROTTLE_MS = 15_000
const CARD_DWELL_MS = 1000
const READ_MIN_DEPTH = 75
const READ_MIN_SECONDS = 45
const PENDING_ENTRY_TTL_MS = 5000

interface PageState {
  key: string
  path: string
  contentType: ContentType
  entryPoint: EntryPoint
  visibleMs: number
  visibleSince: number | null
  maxScroll: number
  scrollFired: Set<ScrollThreshold>
  exitSent: boolean
  articleSent: boolean
  cardsFired: Set<string>
  teardown: Array<() => void>
}

let page: PageState | null = null
let previousPath: string | null = null
let pendingEntry: { entry: EntryPoint; at: number } | null = null

// ------------------------------------------------------------------ route classification

function classify(pathname: string): { contentType: ContentType; pageName: string } {
  if (pathname === "/") return { contentType: "home", pageName: "Home" }
  if (pathname === "/projects") return { contentType: "projects", pageName: "Projects" }
  if (pathname.startsWith("/projects/")) {
    const id = pathname.split("/")[2]
    const study = CASE_STUDIES.find((s) => s.id === id)
    return { contentType: "case_study", pageName: study?.title ?? id }
  }
  if (pathname === "/resume") return { contentType: "resume", pageName: "Resume" }
  if (pathname === "/contact") return { contentType: "contact", pageName: "Contact" }
  if (pathname === "/blog") return { contentType: "blog", pageName: "Blog" }
  if (pathname.startsWith("/blog/")) return { contentType: "blog", pageName: pathname.split("/")[2] }
  return { contentType: "other", pageName: pathname }
}

function isArticle(p: PageState): boolean {
  return p.contentType === "case_study" || (p.contentType === "blog" && p.path !== "/blog")
}

function resolveEntryPoint(contentType: ContentType): EntryPoint {
  if (pendingEntry && Date.now() - pendingEntry.at < PENDING_ENTRY_TTL_MS) {
    const { entry } = pendingEntry
    pendingEntry = null
    return entry
  }
  pendingEntry = null

  if (previousPath !== null) {
    // Client-side navigation with no tracked click (back button, in-page links)
    if (contentType === "case_study" && previousPath === "/projects") return "projects_page"
    if (contentType === "case_study" && previousPath === "/") return "home_card"
    return "nav"
  }

  // First page of the visit
  if (!document.referrer) return "direct"
  try {
    return new URL(document.referrer).origin === window.location.origin ? "nav" : "external"
  } catch {
    return "direct"
  }
}

// ------------------------------------------------------------------ page lifecycle

function visibleSeconds(p: PageState): number {
  const live = p.visibleSince !== null ? Date.now() - p.visibleSince : 0
  return Math.round((p.visibleMs + live) / 1000)
}

function pauseClock(p: PageState) {
  if (p.visibleSince !== null) {
    p.visibleMs += Date.now() - p.visibleSince
    p.visibleSince = null
  }
}

function currentScrollPercent(): number {
  const el = document.documentElement
  const scrollable = el.scrollHeight - window.innerHeight
  if (scrollable <= 2 || scrollable - window.scrollY <= 2) return 100 // 2px tolerance for fractional scroll
  return Math.max(0, Math.min(100, Math.floor((window.scrollY / scrollable) * 100)))
}

function maybeReadArticle(p: PageState) {
  if (p.articleSent || !isArticle(p)) return
  if (p.maxScroll < READ_MIN_DEPTH || visibleSeconds(p) < READ_MIN_SECONDS) return
  p.articleSent = true
  const heading = document.querySelector("h1")?.textContent?.trim()
  track("read_article", {
    article_name: heading || classify(p.path).pageName,
    article_path: p.path,
    content_type: p.contentType as "case_study" | "blog",
    time_on_page: visibleSeconds(p),
    entry_point: p.entryPoint,
  })
}

function checkScroll(p: PageState) {
  if (window.location.pathname !== p.path) return // route already changed; DOM belongs to the next page
  const percent = currentScrollPercent()
  if (percent > p.maxScroll) p.maxScroll = percent
  for (const threshold of SCROLL_THRESHOLDS) {
    if (p.maxScroll >= threshold && !p.scrollFired.has(threshold)) {
      p.scrollFired.add(threshold)
      track("scroll_depth_reached", { scroll_depth: threshold, page_path: p.path })
    }
  }
  maybeReadArticle(p)
}

function sendExit(p: PageState) {
  if (p.exitSent) return
  p.exitSent = true
  pauseClock(p)
  if (window.location.pathname === p.path) {
    const percent = currentScrollPercent()
    if (percent > p.maxScroll) p.maxScroll = percent
  }
  track(
    "page_exit",
    {
      page_path: p.path,
      time_on_page: Math.round(p.visibleMs / 1000),
      max_scroll_depth: p.maxScroll,
    },
    { beacon: true },
  )
}

function endPage() {
  if (!page) return
  sendExit(page)
  page.teardown.forEach((fn) => fn())
  previousPath = page.path
  page = null
}

/** Fire `view_card` once per card per page load: >= 50% visible for 1 continuous second. */
function watchCards(p: PageState): () => void {
  const timers = new Map<Element, number>()
  const watched = new WeakSet<Element>()

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const el = entry.target as HTMLElement
        // Cards taller than 2x the viewport can never reach 50% of their own height
        const visibleEnough =
          entry.isIntersecting &&
          (entry.intersectionRatio >= 0.5 || entry.intersectionRect.height >= window.innerHeight * 0.5)
        const running = timers.get(el)

        if (!visibleEnough) {
          if (running !== undefined) {
            window.clearTimeout(running)
            timers.delete(el)
          }
          continue
        }
        if (running !== undefined) continue

        timers.set(
          el,
          window.setTimeout(() => {
            timers.delete(el)
            const name = el.dataset.trackCard
            if (!name || p.cardsFired.has(name) || page !== p) return
            p.cardsFired.add(name)
            io.unobserve(el)
            const filter = document.querySelector<HTMLElement>("[data-active-filter]")?.dataset.activeFilter
            track("view_card", {
              card_name: name,
              card_page: p.path,
              card_position: Number(el.dataset.cardPosition) || 1,
              ...(filter ? { active_filter: filter } : {}),
            })
          }, CARD_DWELL_MS),
        )
      }
    },
    { threshold: Array.from({ length: 21 }, (_, i) => i / 20) },
  )

  const scan = () => {
    document.querySelectorAll<HTMLElement>("[data-track-card]").forEach((el) => {
      if (watched.has(el) || p.cardsFired.has(el.dataset.trackCard ?? "")) return
      watched.add(el)
      io.observe(el)
    })
  }

  let frame = 0
  const mo = new MutationObserver(() => {
    if (frame) return
    frame = window.requestAnimationFrame(() => {
      frame = 0
      scan()
    })
  })
  mo.observe(document.body, { childList: true, subtree: true })
  scan()

  return () => {
    io.disconnect()
    mo.disconnect()
    timers.forEach((id) => window.clearTimeout(id))
    timers.clear()
    if (frame) window.cancelAnimationFrame(frame)
  }
}

function startPage(key: string, path: string) {
  endPage()

  const { contentType, pageName } = classify(path)
  const p: PageState = {
    key,
    path,
    contentType,
    entryPoint: resolveEntryPoint(contentType),
    visibleMs: 0,
    visibleSince: document.visibilityState === "visible" ? Date.now() : null,
    maxScroll: 0,
    scrollFired: new Set(),
    exitSent: false,
    articleSent: false,
    cardsFired: new Set(),
    teardown: [],
  }
  page = p

  track("page_view", {
    page_name: pageName,
    page_path: path,
    content_type: contentType,
    entry_point: p.entryPoint,
  })
  if (contentType === "resume") {
    track("contact_intent", { intent_type: "resume_viewed", source_page: path })
  }

  // Passive, throttled (leading + trailing) scroll listener
  let lastRun = 0
  let trailing = 0
  const onScroll = () => {
    const wait = SCROLL_THROTTLE_MS - (Date.now() - lastRun)
    if (wait <= 0) {
      lastRun = Date.now()
      checkScroll(p)
    } else if (!trailing) {
      trailing = window.setTimeout(() => {
        trailing = 0
        lastRun = Date.now()
        checkScroll(p)
      }, wait)
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true })
  p.teardown.push(() => {
    window.removeEventListener("scroll", onScroll)
    if (trailing) window.clearTimeout(trailing)
  })

  // Visible time can cross 45s without any scroll event, so poll cheaply for articles
  if (isArticle(p)) {
    const id = window.setInterval(() => maybeReadArticle(p), 1000)
    p.teardown.push(() => window.clearInterval(id))
  }

  p.teardown.push(watchCards(p))

  // Initial reading (short pages are fully "scrolled" on load)
  const frame = window.requestAnimationFrame(() => {
    if (page === p) checkScroll(p)
  })
  p.teardown.push(() => window.cancelAnimationFrame(frame))
}

// ------------------------------------------------------------------ global listeners

function cleanText(el: Element): string {
  const raw = el.getAttribute("aria-label") || el.textContent || ""
  return raw.replace(/\s+/g, " ").trim().slice(0, 80)
}

function handleClick(event: MouseEvent) {
  const target = event.target
  if (!(target instanceof Element)) return
  const anchor = target.closest<HTMLAnchorElement>("a[href]")
  if (!anchor) return
  const rawHref = anchor.getAttribute("href") ?? ""
  if (rawHref.startsWith("#") || !page) return

  let url: URL
  try {
    url = new URL(anchor.href, window.location.href)
  } catch {
    return
  }

  const internal = url.origin === window.location.origin
  const here = window.location.pathname + window.location.search
  if (internal && url.pathname + url.search === here) return // hash-only / self links

  // Never send mailto/tel addresses or query strings of outbound links
  const destination = internal
    ? url.pathname + url.search + url.hash
    : url.protocol === "http:" || url.protocol === "https:"
      ? url.origin + url.pathname
      : url.protocol

  const card = anchor.closest<HTMLElement>("[data-track-card]")
  const named = anchor.closest<HTMLElement>("[data-track-name]")
  const itemName = named?.dataset.trackName || cleanText(anchor) || destination

  if (internal) {
    const inNav = anchor.closest("[data-track-zone='nav']")
    pendingEntry = {
      entry: card && !inNav ? (page.path === "/" ? "home_card" : "projects_page") : "nav",
      at: Date.now(),
    }
  }

  track(
    "click_link",
    {
      item_name: itemName,
      page_path: page.path,
      destination_address: destination,
      link_type: internal ? "internal" : "external",
      ...(card?.dataset.trackCard ? { card_name: card.dataset.trackCard } : {}),
    },
    { beacon: !internal },
  )

  // Conversion events, fired alongside the underlying click
  const declared = anchor.closest<HTMLElement>("[data-track-intent]")?.dataset.trackIntent
  const isLinkedIn = declared === "linkedin_clicked" || /(^|\.)linkedin\.com$/i.test(url.hostname)
  const isResumeFile =
    declared === "resume_downloaded" ||
    ((anchor.hasAttribute("download") || /\.(pdf|docx?)$/i.test(url.pathname)) &&
      /resume/i.test(url.pathname + page.path))

  if (isLinkedIn) {
    track("contact_intent", { intent_type: "linkedin_clicked", source_page: page.path }, { beacon: true })
  }
  if (isResumeFile) {
    track("contact_intent", { intent_type: "resume_downloaded", source_page: page.path }, { beacon: true })
  }
}

function handleVisibility() {
  if (!page) return
  if (document.visibilityState === "hidden") {
    pauseClock(page)
    sendExit(page)
  } else if (page.visibleSince === null) {
    page.visibleSince = Date.now()
  }
}

function handlePageHide() {
  if (page) sendExit(page)
}

// ------------------------------------------------------------------ provider

export function AnalyticsProvider() {
  const pathname = usePathname()
  const search = useSearchParams().toString()

  useEffect(() => {
    initAnalytics()

    let lastActivity = 0
    const onActivity = () => {
      const now = Date.now()
      if (now - lastActivity < ACTIVITY_THROTTLE_MS) return
      lastActivity = now
      ensureSession() // rolls the session over after 30 minutes idle
    }

    document.addEventListener("click", handleClick, true)
    document.addEventListener("visibilitychange", handleVisibility)
    window.addEventListener("pagehide", handlePageHide)
    window.addEventListener("pointerdown", onActivity, { passive: true })
    window.addEventListener("keydown", onActivity)
    window.addEventListener("scroll", onActivity, { passive: true })
    return () => {
      document.removeEventListener("click", handleClick, true)
      document.removeEventListener("visibilitychange", handleVisibility)
      window.removeEventListener("pagehide", handlePageHide)
      window.removeEventListener("pointerdown", onActivity)
      window.removeEventListener("keydown", onActivity)
      window.removeEventListener("scroll", onActivity)
    }
  }, [])

  useEffect(() => {
    const key = search ? `${pathname}?${search}` : pathname
    if (page?.key === key) return // strict-mode double effect / re-render
    startPage(key, pathname)
  }, [pathname, search])

  return null
}
