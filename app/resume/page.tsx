import type { Metadata } from "next"
import { Download, Briefcase, GraduationCap, Wrench } from "lucide-react"
import { SiteNav } from "@/components/site-nav"

export const metadata: Metadata = {
  title: "Resume — Mohsen Khosravi",
  description: "Experience, skills, and education of Mohsen Khosravi, Product Manager and Data Analyst.",
}

const EXPERIENCE = [
  {
    role: "Data Analyst",
    company: "Manufacturing & Packaging Operation",
    period: "2024 — Present",
    points: [
      "Built a Power BI repack cause dashboard that reduced rework by 50% in two months.",
      "Designed relational data models and ETL pipelines with server-side filtering for fast refreshes.",
      "Recovered lost carton-to-quality-event lineage from system audit logs using custom DAX logic.",
    ],
  },
  {
    role: "Data Analyst",
    company: "Polymer Production Company",
    period: "2023 — 2024",
    points: [
      "Rebuilt demand forecasting on five years of shipment data, sustaining 90%+ accuracy.",
      "Contributed ~$1M toward a $2M savings initiative in material ordering and forecasting.",
      "Reduced costly production changeovers through segment-level demand modeling.",
    ],
  },
  {
    role: "Product & Business Lead",
    company: "Rahnema",
    period: "2018 — 2020",
    points: [
      "Grew a YouTube content business from one test channel to an eight-channel operation.",
      "Reached 300K+ subscribers and 9M monthly views within 18 months.",
      "Drove 200%+ income growth for three consecutive months.",
    ],
  },
]

const SKILLS = [
  "Product Management",
  "Statistical Modeling",
  "Forecasting",
  "Power BI",
  "DAX",
  "SQL",
  "Python",
  "ETL & Data Modeling",
  "Stakeholder Management",
  "A/B Testing",
]

const EDUCATION = [
  {
    degree: "M.Sc. Industrial Engineering",
    school: "University (details available on request)",
    period: "",
  },
  {
    degree: "B.Sc. Industrial Engineering",
    school: "University (details available on request)",
    period: "",
  },
]

export default function ResumePage() {
  return (
    <>
      <SiteNav active="/resume" />
      <main className="mx-auto max-w-4xl px-5 py-10 md:px-8 md:py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-4xl font-bold text-balance md:text-5xl">Resume</h1>
            <p className="mt-2 text-muted-foreground text-pretty">
              Six years across media, manufacturing, and industrial operations.
            </p>
          </div>
          <a
            href="/resume.pdf"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-colors hover:brightness-110"
          >
            <Download className="size-4" aria-hidden="true" />
            Download PDF
          </a>
        </div>

        <section className="mt-12">
          <h2 className="flex items-center gap-2.5 font-serif text-2xl font-bold">
            <Briefcase className="size-5 text-teal" aria-hidden="true" />
            Experience
          </h2>
          <div className="mt-6 flex flex-col gap-8">
            {EXPERIENCE.map((job) => (
              <article key={`${job.company}-${job.period}`} className="border-l-2 border-border pl-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg font-semibold">{job.role}</h3>
                  <span className="text-sm font-medium text-muted-foreground">{job.period}</span>
                </div>
                <p className="text-sm font-medium text-teal">{job.company}</p>
                <ul className="mt-3 flex list-disc flex-col gap-1.5 pl-5 text-foreground/80">
                  {job.points.map((point) => (
                    <li key={point} className="leading-relaxed text-pretty">
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="flex items-center gap-2.5 font-serif text-2xl font-bold">
            <Wrench className="size-5 text-teal" aria-hidden="true" />
            Skills
          </h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {SKILLS.map((skill) => (
              <li
                key={skill}
                className="rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium"
              >
                {skill}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="flex items-center gap-2.5 font-serif text-2xl font-bold">
            <GraduationCap className="size-5 text-teal" aria-hidden="true" />
            Education
          </h2>
          <div className="mt-5 flex flex-col gap-4">
            {EDUCATION.map((edu) => (
              <div key={edu.degree}>
                <h3 className="font-semibold">{edu.degree}</h3>
                <p className="text-sm text-muted-foreground">{edu.school}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
