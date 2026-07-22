import Link from "next/link"

const NAV_LINKS = [
  { href: "/resume", label: "Resume" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
]

export function Hero() {
  return (
    <header className="relative overflow-hidden bg-hero text-hero-foreground">
      {/* subtle grid texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-5 pt-6 pb-12 md:px-8 md:pb-16">
        {/* Top navigation */}
        <nav
          aria-label="Primary"
          className="mb-10 flex items-center justify-end gap-1 md:mb-12 md:gap-2"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-semibold text-hero-muted transition-colors hover:bg-white/10 hover:text-hero-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-7">
          <div
            className="flex size-20 shrink-0 items-center justify-center rounded-full font-serif text-2xl font-bold text-hero-foreground shadow-lg ring-4 ring-white/5 md:size-24"
            style={{
              background: "radial-gradient(circle at 30% 30%, #4db6ac, #1f6f68 70%, #134e4a)",
            }}
            aria-hidden="true"
          >
            MK
          </div>
          <div className="max-w-2xl">
            <h1 className="font-serif text-4xl font-bold leading-tight text-balance md:text-5xl">
              Mohsen Khosravi
            </h1>
            <p className="mt-2 text-sm font-semibold tracking-[0.14em] text-teal uppercase">
              Product Manager · Data Analyst
            </p>
            <p className="mt-4 leading-relaxed text-hero-muted text-pretty">
              I turn ambiguous problems into shipped products and messy data into decisions that
              stick. Six years across media, manufacturing, and industrial operations — always at
              the intersection of analysis and execution.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/resume"
                className="rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-colors hover:brightness-110"
              >
                View Resume
              </Link>
              <Link
                href="/contact"
                className="rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-hero-foreground transition-colors hover:bg-white/10"
              >
                Let&apos;s Connect
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
