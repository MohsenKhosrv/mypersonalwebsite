"use client"

import type { CaseStudy, CategoryId } from "@/lib/case-studies"
import { CATEGORIES, CATEGORY_LABELS } from "@/lib/case-studies"
import { CATEGORY_STYLES } from "@/lib/category-styles"

type Filter = "all" | CategoryId

interface SidebarProps {
  studies: CaseStudy[]
  activeFilter: Filter
  onFilterChange: (filter: Filter) => void
  activeId: string | null
  onSelect: (id: string) => void
}

export function Sidebar({ studies, activeFilter, onFilterChange, activeId, onSelect }: SidebarProps) {
  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    ...CATEGORIES.map((c) => ({ id: c.id as Filter, label: c.label })),
  ]

  // Only show category groups that (a) match the current filter and (b) contain studies
  const visibleCategories = CATEGORIES.filter((cat) => {
    if (activeFilter !== "all" && activeFilter !== cat.id) return false
    return studies.some((s) => s.category === cat.id)
  })

  return (
    <nav aria-label="Case studies" className="md:sticky md:top-6">
      <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
        Jump To
      </p>

      {/* Filter pills — horizontal scroll on mobile */}
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible md:pb-0">
        {filters.map((f) => {
          const isActive = activeFilter === f.id
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => onFilterChange(f.id)}
              aria-pressed={isActive}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? "border-hero bg-hero text-hero-foreground"
                  : "border-border bg-card text-foreground hover:bg-muted"
              }`}
            >
              {f.label}
            </button>
          )
        })}
      </div>

      {/* Grouped list — hidden on mobile to keep the top bar compact */}
      <div className="mt-6 hidden border-t border-border pt-6 md:block">
        <ul className="flex flex-col gap-6">
          {visibleCategories.map((cat) => {
            const catStudies = studies.filter((s) => s.category === cat.id)
            const styles = CATEGORY_STYLES[cat.id]
            return (
              <li key={cat.id}>
                <p
                  className={`text-xs font-bold tracking-[0.12em] uppercase ${styles.text}`}
                >
                  {CATEGORY_LABELS[cat.id]}
                </p>
                <ul className="mt-3 flex flex-col gap-1">
                  {catStudies.map((study) => {
                    const isActive = activeId === study.id
                    return (
                      <li key={study.id}>
                        <button
                          type="button"
                          onClick={() => onSelect(study.id)}
                          aria-current={isActive ? "true" : undefined}
                          className={`w-full rounded-md border-l-2 px-3 py-2 text-left text-sm leading-snug transition-colors ${
                            isActive
                              ? `${styles.accentBorder} bg-muted font-semibold text-foreground`
                              : "border-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                          }`}
                        >
                          {study.title}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
