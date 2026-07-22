"use client"

import { useState, type FormEvent } from "react"
import { CheckCircle2 } from "lucide-react"

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-xl border border-border bg-card p-8">
        <CheckCircle2 className="size-8 text-accent" aria-hidden="true" />
        <h2 className="font-serif text-2xl font-bold">Thanks for reaching out</h2>
        <p className="leading-relaxed text-foreground/80 text-pretty">
          Your message has been received. I&apos;ll get back to you as soon as I can.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm font-semibold">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className="rounded-lg border border-border bg-card px-4 py-2.5 text-sm outline-none transition-colors focus:border-teal focus:ring-2 focus:ring-teal/30"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-semibold">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="rounded-lg border border-border bg-card px-4 py-2.5 text-sm outline-none transition-colors focus:border-teal focus:ring-2 focus:ring-teal/30"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-sm font-semibold">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          className="resize-y rounded-lg border border-border bg-card px-4 py-2.5 text-sm outline-none transition-colors focus:border-teal focus:ring-2 focus:ring-teal/30"
        />
      </div>

      <button
        type="submit"
        className="self-start rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-colors hover:brightness-110"
      >
        Send Message
      </button>
    </form>
  )
}
