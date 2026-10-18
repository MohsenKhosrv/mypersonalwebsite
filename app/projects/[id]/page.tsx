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
import { StoryToc, type TocItem } from "@/components/story-toc"

/**
 * Per-story table-of-contents config: heading text -> short label. When a story has an entry,
 * only the listed headings appear (all as top-level markers), in document order.
 * Stories without an entry list every ## and ### heading under its own text.
 */
const TOC_OVERRIDES: Record<string, Record<string, string>> = {
  "youtube-content-business": {
    "Phase 1: Identifying the Opportunity": "Opportunity",
    "Phase 2: Exploring a Solution": "Solution",
    "Phase 3: Building a Commercial Success": "Commercial Success",
    "Building the Business Infrastructure": "Business Infrastructure",
    "Phase 4: Scaling the Business": "Scaling",
    "Revenue Optimization": "Revenue Optimization",
    "Reflection": "Reflection",
  },
  "google-merchandise-store-dashboard": {
    "Visuals": "Visuals",
    "Overall Purpose and Stakeholder Analysis": "Purpose",
    "ETL Process": "ETL",
    "Insights": "Insights",
    "Appendix": "Appendix",
  },
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

/** Table-of-contents entries from the story's ## and ### headings (ignoring fenced code). */
function getTocItems(markdown: string, storyId: string): TocItem[] {
  const overrides = TOC_OVERRIDES[storyId]
  const items: TocItem[] = []
  let inFence = false
  for (const line of markdown.split(/\r?\n/)) {
    if (line.startsWith("```")) inFence = !inFence
    if (inFence) continue
    const m = /^(##|###) (.+?)\s*$/.exec(line)
    if (!m) continue
    if (overrides && !(m[2] in overrides)) continue
    items.push({
      id: slugify(m[2]),
      label: overrides ? overrides[m[2]] : m[2],
      level: overrides || m[1] === "##" ? 2 : 3,
    })
  }
  return items
}

function headingText(children: React.ReactNode): string {
  return Array.isArray(children) ? children.join("") : String(children ?? "")
}

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
  const tocItems = fullStoryBody ? getTocItems(fullStoryBody, study.id) : []

  return (
    <>
      <SiteNav active="/projects" />
      <main className="mx-auto max-w-3xl px-5 py-10 md:px-8 md:py-14">
        {tocItems.length > 1 ? (
          <aside className="fixed top-1/2 left-5 z-10 hidden -translate-y-1/2 lg:block xl:left-8">
            <StoryToc items={tocItems} />
          </aside>
        ) : null}
        <div className="min-w-0">
        <Link
          href="/projects"
          data-track-name="back_to_projects"
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
              prose-hr:border-border prose-li:text-foreground/80
              prose-img:rounded-lg prose-img:border prose-img:border-border"
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ node: _node, children, ...props }) => (
                  <h2 id={slugify(headingText(children))} className="scroll-mt-24" {...props}>
                    {children}
                  </h2>
                ),
                h3: ({ node: _node, children, ...props }) => (
                  <h3 id={slugify(headingText(children))} className="scroll-mt-24" {...props}>
                    {children}
                  </h3>
                ),
                table: ({ node: _node, ...props }) => (
                  <div className="overflow-x-auto">
                    <table {...props} />
                  </div>
                ),
              }}
            >
              {fullStoryBody}
            </ReactMarkdown>
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
        </div>
      </main>
    </>
  )
}
