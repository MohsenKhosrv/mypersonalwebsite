import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { ArrowLeft } from "lucide-react"
import { SiteNav } from "@/components/site-nav"
import { CASE_STUDIES, CATEGORY_LABELS } from "@/lib/case-studies"
import { CATEGORY_STYLES } from "@/lib/category-styles"
import { getFullStoryBody } from "@/lib/full-stories"

export function generateStaticParams() {
  return CASE_STUDIES.map((study) => ({ id: study.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const study = CASE_STUDIES.find((s) => s.id === id)
  if (!study) return {}
  return {
    title: `${study.title} — Mohsen Khosravi`,
    description: study.problem,
  }
}

export default async function CaseStudyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const study = CASE_STUDIES.find((s) => s.id === id)
  if (!study) notFound()

  const styles = CATEGORY_STYLES[study.category]
  const fullStoryBody = getFullStoryBody(study.id)

  return (
    <>
      <SiteNav active="/projects" />
      <main className="mx-auto max-w-3xl px-5 py-10 md:px-8 md:py-14">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal transition-colors hover:text-accent"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to Projects
        </Link>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
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
        <h1 className="mt-4 font-serif text-3xl font-bold leading-snug text-balance md:text-4xl">
          {study.title}
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">{study.company}</p>

        {fullStoryBody ? (
          <div
            className="prose prose-neutral mt-8 max-w-none
              prose-headings:font-serif prose-headings:font-bold prose-headings:text-balance prose-headings:text-foreground
              prose-p:leading-relaxed prose-p:text-foreground/80 prose-p:text-pretty
              prose-a:text-teal prose-a:no-underline hover:prose-a:underline
              prose-strong:text-foreground
              prose-blockquote:border-teal prose-blockquote:text-foreground/70
              prose-code:text-foreground prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-muted prose-pre:text-foreground
              prose-th:text-foreground prose-td:text-foreground/80
              prose-hr:border-border prose-li:text-foreground/80"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{fullStoryBody}</ReactMarkdown>
          </div>
        ) : (
          <div className="mt-8 flex flex-col gap-5">
            {(
              [
                ["The Problem", study.problem],
                ["Why It Mattered", study.whyItMattered],
                ["My Solution", study.solution],
                ["Key Impact", study.keyImpact],
              ] as const
            ).map(([heading, text]) => (
              <section key={heading}>
                <h2 className="font-serif text-xl font-bold text-balance">{heading}</h2>
                <p className="mt-2 leading-relaxed text-foreground/80 text-pretty">{text}</p>
              </section>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
