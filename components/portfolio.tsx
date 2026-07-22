"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import type { CategoryId } from "@/lib/case-studies"
import { CASE_STUDIES } from "@/lib/case-studies"
import { Sidebar } from "./sidebar"
import { CaseStudyCard } from "./case-study-card"

type Filter = "all" | CategoryId

export function Portfolio() {
  const [activeFilter, setActiveFilter] = useState<Filter>("all")
  const [activeId, setActiveId] = useState<string | null>(CASE_STUDIES[0]?.id ?? null)
  const isProgrammaticScroll = useRef(false)

  const visibleStudies = useMemo(() => {
    if (activeFilter === "all") return CASE_STUDIES
    return CASE_STUDIES.filter((s) => s.category === activeFilter)
  }, [activeFilter])

  // Scroll-spy: highlight the case study currently in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScroll.current) return
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: 0 },
    )

    const nodes = visibleStudies
      .map((s) => document.getElementById(s.id))
      .filter((n): n is HTMLElement => n !== null)
    nodes.forEach((n) => observer.observe(n))

    return () => observer.disconnect()
  }, [visibleStudies])

  const handleSelect = (id: string) => {
    setActiveId(id)
    const el = document.getElementById(id)
    if (!el) return
    // Suppress scroll-spy briefly so the clicked item stays highlighted during the smooth scroll
    isProgrammaticScroll.current = true
    el.scrollIntoView({ behavior: "smooth", block: "start" })
    window.setTimeout(() => {
      isProgrammaticScroll.current = false
    }, 700)
  }

  const handleFilterChange = (filter: Filter) => {
    setActiveFilter(filter)
    const next = filter === "all" ? CASE_STUDIES : CASE_STUDIES.filter((s) => s.category === filter)
    setActiveId(next[0]?.id ?? null)
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12">
      <div className="flex flex-col gap-8 md:flex-row md:gap-10">
        <aside className="md:w-[280px] md:shrink-0">
          <Sidebar
            studies={visibleStudies}
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
            activeId={activeId}
            onSelect={handleSelect}
          />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col gap-6">
          {visibleStudies.map((study) => (
            <CaseStudyCard key={study.id} study={study} />
          ))}
        </div>
      </div>
    </main>
  )
}
