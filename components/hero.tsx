const STATS = [
  { value: "6+", label: "Years" },
  { value: "3", label: "Domains" },
  { value: "$12M+", label: "Value" },
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
      <div className="relative mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
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
            <div className="max-w-xl">
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
                <a
                  href="#"
                  className="rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-colors hover:brightness-110"
                >
                  View Resume
                </a>
                <a
                  href="mailto:hello@example.com"
                  className="rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-hero-foreground transition-colors hover:bg-white/10"
                >
                  Let&apos;s Connect
                </a>
              </div>
            </div>
          </div>

          <dl className="flex flex-row gap-8 md:flex-col md:gap-5 md:text-right">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-serif text-3xl font-bold leading-none md:text-4xl">
                  {stat.value}
                </dd>
                <dd className="mt-1 text-xs font-semibold tracking-[0.14em] text-hero-muted uppercase">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </header>
  )
}
