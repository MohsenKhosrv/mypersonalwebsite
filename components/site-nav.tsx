import Link from "next/link"

const NAV_LINKS = [
  { href: "/", label: "Portfolio" },
  { href: "/resume", label: "Resume" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
]

export function SiteNav({ active }: { active?: string }) {
  return (
    <header className="bg-hero text-hero-foreground">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-serif text-lg font-bold transition-opacity hover:opacity-90"
        >
          <span
            className="flex size-9 items-center justify-center rounded-full text-sm text-hero-foreground ring-2 ring-white/5"
            style={{
              background: "radial-gradient(circle at 30% 30%, #4db6ac, #1f6f68 70%, #134e4a)",
            }}
            aria-hidden="true"
          >
            MK
          </span>
          <span className="hidden sm:inline">Mohsen Khosravi</span>
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-1 md:gap-2">
          {NAV_LINKS.map((link) => {
            const isActive = active === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-white/10 text-hero-foreground"
                    : "text-hero-muted hover:bg-white/10 hover:text-hero-foreground"
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
