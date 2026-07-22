import type { Metadata } from "next"
import { SiteNav } from "@/components/site-nav"

export const metadata: Metadata = {
  title: "Blog — Mohsen Khosravi",
  description: "Notes on product management, data analysis, and turning ambiguity into decisions.",
}

const POSTS = [
  {
    title: "What My Posts Here Are About",
    date: "July 2026",
    readingTime: "0 min read",
    excerpt:
      "This section is dedicated to my personal posts, learnings, product teardowns and book recommendations.",
    tag: "Welcome",
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
