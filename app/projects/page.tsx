import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { SiteNav } from "@/components/site-nav"
import { CASE_STUDIES, CATEGORY_LABELS } from "@/lib/case-studies"
import { CATEGORY_STYLES } from "@/lib/category-styles"

export const metadata: Metadata = {
  title: "Projects — Mohsen Khosravi",
  description: "Selected case studies across data analysis, data visualization, and product management.",
}

export default function ProjectsPage() {
  return (
    <>
      <SiteNav active="/projects" />
      <main className="mx-auto max-w-5xl px-5 py-10 md:px-8 md:py-14">
        <h1 className="font-serif text-4xl font-bold text-balance md:text-5xl">Projects</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground text-pretty">
          Selected case studies where analysis met execution — from forecasting and dashboards to
          building a content business from zero.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {CASE_STUDIES.map((study) => {
            const styles = CATEGORY_STYLES[study.category]
            return (
              <Link
                key={study.id}
                href={`/#${study.id}`}
                className="group flex flex-col rounded-xl border border-border bg-card p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.18)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold tracking-wide uppercase ${styles.badge}`}
                  >
                    {CATEGORY_LABELS[study.category]}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">{study.year}</span>
                </div>
                <h2 className="mt-4 font-serif text-xl font-bold leading-snug text-balance">
                  {study.title}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{study.company}</p>
                <p className="mt-3 leading-relaxed text-foreground/80 text-pretty">{study.problem}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-teal">
                  Read case study
                  <ArrowUpRight
                    className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            )
          })}
        </div>
      </main>
    </>
  )
}
