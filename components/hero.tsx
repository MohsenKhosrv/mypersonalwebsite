import Image from "next/image"
import Link from "next/link"

const NAV_LINKS = [
  { href: "/", label: "Portfolio" },
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
          <Image
            src="/headshot.jpg"
            alt="Mohsen Khosravi"
            width={250}
            height={250}
            priority
            className="h-[250px] w-[250px] shrink-0 rounded-full object-cover shadow-lg ring-4 ring-white/5"
          />
          <div className="max-w-2xl md:ml-[100px]">
            <h1 className="font-serif text-4xl font-bold leading-tight text-balance md:text-5xl">
              Mohsen Khosravi
            </h1>
            <div className="mt-4 space-y-4 leading-relaxed text-hero-muted text-pretty">
              <p>
                The main purpose of this portfolio is to show how I think. The projects and
                presentations demonstrate skills that I have built over the years, like data
                analysis, coding, and Power BI, but what matters more is:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  <span className="font-semibold text-hero-foreground">Thinking skills:</span>{" "}
                  Structured Thinking, Systems Thinking, Design Thinking
                </li>
                <li>
                  <span className="font-semibold text-hero-foreground">Interpersonal skills:</span>{" "}
                  Collaboration, Coordination, Leadership
                </li>
              </ul>
              <p>
                If the thinking behind my work interests you, send me a message. I&apos;d be glad
                to chat if:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>You are a hiring manager or recruiter who wants to discuss an opportunity</li>
                <li>You are a friend who could use a hand with a task or project</li>
                <li>You are a curious visitor who shares these interests and wants to connect</li>
              </ul>
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/resume"
                className="rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-colors hover:brightness-110"
              >
                View Resume
              </Link>
              <a
                href="https://www.linkedin.com/in/khosravimohsen/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-hero-foreground transition-colors hover:bg-white/10"
              >
                Let&apos;s Connect
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
