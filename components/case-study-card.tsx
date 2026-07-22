import Link from "next/link"
import { AlertTriangle, Star, CheckCircle2, TrendingUp, ArrowUpRight, type LucideIcon } from "lucide-react"
import type { CaseStudy } from "@/lib/case-studies"
import { CATEGORY_LABELS } from "@/lib/case-studies"
import { CATEGORY_STYLES } from "@/lib/category-styles"

interface DetailRow {
  icon: LucideIcon
  label: string
  key: keyof Pick<CaseStudy, "problem" | "whyItMattered" | "solution" | "keyImpact">
}

const ROWS: DetailRow[] = [
  { icon: AlertTriangle, label: "The Problem", key: "problem" },
  { icon: Star, label: "Why It Mattered", key: "whyItMattered" },
  { icon: CheckCircle2, label: "My Solution", key: "solution" },
  { icon: TrendingUp, label: "Key Impact", key: "keyImpact" },
]

export function CaseStudyCard({ study }: { study: CaseStudy }) {
  const styles = CATEGORY_STYLES[study.category]

  return (
    <article
      id={study.id}
      className="scroll-mt-6 overflow-hidden rounded-xl border border-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.12)]"
    >
      {/* Card header */}
      <div className="border-b border-border px-6 py-6 md:px-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-bold tracking-wide uppercase ${styles.badge}`}
            >
              {CATEGORY_LABELS[study.category]}
            </span>
            <span className="text-sm font-medium text-muted-foreground">{study.year}</span>
          </div>
          <ul className="flex flex-wrap gap-2">
            {study.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
        <h2 className="mt-4 font-serif text-2xl font-bold leading-snug text-balance md:text-3xl">
          {study.title}
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">{study.company}</p>
      </div>

      {/* Detail rows */}
      <div className="divide-y divide-border">
        {ROWS.map((row) => {
          const Icon = row.icon
          return (
            <div
              key={row.key}
              className="grid grid-cols-1 gap-2 px-6 py-3 md:grid-cols-[160px_1fr] md:gap-4 md:px-8"
            >
              <div className="flex items-center gap-2.5">
                <Icon className="size-5 shrink-0 text-teal" strokeWidth={2} aria-hidden="true" />
                <span className="font-semibold">{row.label}</span>
              </div>
              <p className="leading-relaxed text-foreground/80 text-pretty">{study[row.key]}</p>
            </div>
          )
        })}
      </div>

      {/* Card footer */}
      <div className="border-t border-border px-6 py-4 md:px-8">
        <Link
          href={`/projects#${study.id}`}
          className="group inline-flex items-center gap-1 text-sm font-semibold text-teal"
        >
          Read Full Story
          <ArrowUpRight
            className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </article>
  )
}
