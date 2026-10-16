"use client"

import { useEffect, useState } from "react"

export interface TocItem {
  id: string
  label: string
  /** 2 = main section, 3 = sub-section */
  level: 2 | 3
}

/**
 * Sticky left-rail table of contents: a column of dash markers (longer for sections, shorter for
 * sub-sections) that expands into titles on hover/focus and highlights the section in view.
 */
export function StoryToc({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "")

  useEffect(() => {
    const nodes = items
      .map((i) => document.getElementById(i.id))
      .filter((n): n is HTMLElement => n !== null)
    if (nodes.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActiveId(visible[0].target.id)
      },
      { rootMargin: "-10% 0px -75% 0px", threshold: 0 },
    )
    nodes.forEach((n) => observer.observe(n))
    return () => observer.disconnect()
  }, [items])

  const go = (id: string) => {
    setActiveId(id)
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <nav aria-label="On this page" className="group relative w-10">
      {/* Collapsed: dash markers */}
      <ul className="flex flex-col gap-3.5 py-2 transition-opacity group-focus-within:opacity-0 group-hover:opacity-0">
        {items.map((item) => (
          <li key={item.id} className="h-0.5">
            <span
              className={`block h-0.5 rounded-full transition-colors ${
                item.level === 2 ? "w-6" : "w-3.5"
              } ${activeId === item.id ? "bg-foreground" : "bg-muted-foreground/35"}`}
            />
          </li>
        ))}
      </ul>

      {/* Expanded: titles */}
      <ul className="pointer-events-none absolute top-0 left-0 z-10 flex min-w-48 flex-col gap-0.5 rounded-xl border border-border bg-card p-2 opacity-0 shadow-lg transition-opacity group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => go(item.id)}
              className={`w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors hover:bg-muted ${
                item.level === 3 ? "pl-6 text-muted-foreground" : "font-semibold"
              } ${activeId === item.id ? "text-teal" : item.level === 2 ? "text-foreground" : ""}`}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
