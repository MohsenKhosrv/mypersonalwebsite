import type { Metadata } from "next"
import { SiteNav } from "@/components/site-nav"

export const metadata: Metadata = {
  title: "Blog — Mohsen Khosravi",
  description: "Notes on product management, data analysis, and turning ambiguity into decisions.",
}

const POSTS = [
  {
    title: "Why Your Demand Forecast Is Wrong (and How to Fix It)",
    date: "March 2025",
    readingTime: "7 min read",
    excerpt:
      "Judgment-based forecasting feels safe until it cascades into excess inventory and constant production churn. Here is the data-driven method I used to sustain 90%+ accuracy.",
    tag: "Data Analysis",
  },
  {
    title: "Recovering Data the System Deleted",
    date: "February 2025",
    readingTime: "6 min read",
    excerpt:
      "When a source system severs the link between a record and the event that caused it, the lineage isn't always gone. Sometimes it's hiding in the audit log.",
    tag: "Data Visualization",
  },
  {
    title: "Building a Content Business From a Single Test Channel",
    date: "November 2024",
    readingTime: "9 min read",
    excerpt:
      "How an underserved diaspora audience and a disciplined content strategy turned one experiment into an eight-channel operation with 300K+ subscribers.",
    tag: "Product Management",
  },
  {
    title: "The Analyst's Job Is to Change a Decision",
    date: "September 2024",
    readingTime: "4 min read",
    excerpt:
      "A dashboard nobody acts on is a cost, not an asset. A short argument for measuring analytics work by the decisions it moves.",
    tag: "Data Analysis",
  },
]

export default function BlogPage() {
  return (
    <>
      <SiteNav active="/blog" />
      <main className="mx-auto max-w-3xl px-5 py-10 md:px-8 md:py-14">
        <h1 className="font-serif text-4xl font-bold text-balance md:text-5xl">Blog</h1>
        <p className="mt-2 text-muted-foreground text-pretty">
          Notes on product, data, and turning ambiguity into decisions.
        </p>

        <div className="mt-10 flex flex-col divide-y divide-border">
          {POSTS.map((post) => (
            <article key={post.title} className="group py-7 first:pt-0">
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="font-medium text-teal">{post.tag}</span>
                <span aria-hidden="true">·</span>
                <span>{post.date}</span>
                <span aria-hidden="true">·</span>
                <span>{post.readingTime}</span>
              </div>
              <h2 className="mt-2 font-serif text-2xl font-bold leading-snug text-balance transition-colors group-hover:text-accent">
                <a href="#">{post.title}</a>
              </h2>
              <p className="mt-2 leading-relaxed text-foreground/80 text-pretty">{post.excerpt}</p>
            </article>
          ))}
        </div>
      </main>
    </>
  )
}
