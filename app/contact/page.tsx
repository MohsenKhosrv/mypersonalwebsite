import type { Metadata } from "next"
import { Mail, Linkedin, Github } from "lucide-react"
import { SiteNav } from "@/components/site-nav"
import { ContactForm } from "@/components/contact-form"

export const metadata: Metadata = {
  title: "Contact — Mohsen Khosravi",
  description: "Get in touch with Mohsen Khosravi about product management and data analysis roles or collaborations.",
}

const CHANNELS = [
  { icon: Mail, label: "Email", value: "hello@mohsenkhosravi.com", href: "mailto:hello@mohsenkhosravi.com" },
  { icon: Linkedin, label: "LinkedIn", value: "/in/mohsenkhosravi", href: "#" },
  { icon: Github, label: "GitHub", value: "@mohsenkhosravi", href: "#" },
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

        <div className="mt-10 grid gap-10 md:grid-cols-[1fr_260px]">
          <ContactForm />

          <aside className="flex flex-col gap-4">
            <h2 className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
              Elsewhere
            </h2>
            {CHANNELS.map((channel) => {
              const Icon = channel.icon
              return (
                <a
                  key={channel.label}
                  href={channel.href}
                  className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted"
                >
                  <Icon className="size-5 shrink-0 text-teal" aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{channel.label}</span>
                    <span className="block truncate text-sm text-muted-foreground">
                      {channel.value}
                    </span>
                  </span>
                </a>
              )
            })}
          </aside>
        </div>
      </main>
    </>
  )
}
