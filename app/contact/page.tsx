import type { Metadata } from "next"
import { Linkedin, Github } from "lucide-react"
import { SiteNav } from "@/components/site-nav"

export const metadata: Metadata = {
  title: "Contact — Mohsen Khosravi",
  description:
    "Get in touch with Mohsen Khosravi about product management and data analysis roles or collaborations.",
}

const CHANNELS = [
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "/in/khosravimohsen",
    href: "https://www.linkedin.com/in/khosravimohsen/",
    external: true,
  },
  {
    icon: Github,
    label: "GitHub",
    value: "@MohsenKhosrv",
    href: "https://github.com/MohsenKhosrv",
    external: true,
  },
]

export default function ContactPage() {
  return (
    <>
      <SiteNav active="/contact" />
      <main className="mx-auto max-w-4xl px-5 py-10 md:px-8 md:py-14">
        <h1 className="font-serif text-4xl font-bold text-balance md:text-5xl">Let&apos;s Connect</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground text-pretty">
          Whether it&apos;s a product role, a data problem worth solving, or just a good conversation
          — I&apos;d love to hear from you.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          {CHANNELS.map((channel) => {
            const Icon = channel.icon
            return (
              <a
                key={channel.label}
                href={channel.href}
                target={channel.external ? "_blank" : undefined}
                rel={channel.external ? "noopener noreferrer" : undefined}
                className="flex flex-1 items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted"
              >
                <Icon className="size-5 shrink-0 text-teal" aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block text-sm font-semibold">{channel.label}</span>
                  <span className="block truncate text-sm text-muted-foreground">{channel.value}</span>
                </span>
              </a>
            )
          })}
        </div>
      </main>
    </>
  )
}
