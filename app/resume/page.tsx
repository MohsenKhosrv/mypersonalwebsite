import type { Metadata } from "next"
import { Briefcase, GraduationCap, Wrench, Award, Mail, Phone, Linkedin } from "lucide-react"
import { SiteNav } from "@/components/site-nav"

export const metadata: Metadata = {
  title: "Resume — Mohsen Khosravizadeh",
  description:
    "Experience, skills, and education of Mohsen Khosravizadeh, Product Manager and Data Analyst.",
}

const EXPERIENCE = [
  {
    role: "Senior Business Analyst",
    company: "INVISTA",
    period: "2022 — Present",
    summary:
      "INVISTA is a global manufacturer of polymers and fibers used in airbags and industrial products.",
    points: [
      "Led production planning, aligning a cross-functional team across sales, operations, and engineering, applying scenario analysis and financial modeling to build recommendations and present to senior leadership.",
      "Drove $2M in annual savings by rebuilding material ordering and demand forecasting with statistical analysis and developing KPIs to monitor inventory performance.",
      "Built Power BI dashboards translating root causes of quality events into clear, actionable recommendations for operations leaders, reducing rework by 50% in 2 months and time to ship by 70% in 6 months.",
      "Built and deployed AI workflows using Copilot Studio to automate operations reporting, integrating data across 10+ production sites and saving 10 person-hours per week.",
    ],
  },
  {
    role: "Product Manager",
    company: "Rahnema, Tehran, Iran",
    period: "2018 — 2021",
    summary:
      "Rahnema is a digital content services company specializing in mobile and online distribution across Iranian markets.",
    points: [
      "Built and scaled a content distribution business from zero to 9M monthly views, growing from a single-channel MVP to 8 channels over 2 years, coordinating a cross-functional team of 22.",
      "Owned content and revenue strategy, aggregating and analyzing revenue and engagement data to guide format and publishing decisions; introduced 3 new content formats that increased revenue 20% in 4 months.",
      "Led market intelligence through ongoing competitor benchmarking, vendor relationships, and platform trend monitoring, and translated insights into content acquisition strategy.",
      "Ran experiments on content type, thumbnail, and title wording, improving CTR by 22% through optimizing thumbnails.",
    ],
  },
  {
    role: "Product Specialist",
    company: "Rahnema, Tehran, Iran",
    period: "2015 — 2018",
    summary: "",
    points: [
      "Structured over 60 business cases for content acquisition and distribution through financial modeling, helping the business development team negotiate complex deals and improving revenue by 30%.",
      "Implemented agile methodology by developing KPIs and transforming processes across the department, reducing deal-to-contract time by 80%.",
      "Partnered with the technology team to implement MTN mobile operator payment API across music and games apps.",
    ],
  },
  {
    role: "Associate Product Manager — Jomlak",
    company: "Rahnema, Tehran, Iran",
    period: "2014 — 2015",
    summary: "Jomlak was a consumer social app with 1M downloads, repositioned as a local Twitter alternative.",
    points: [
      "Led full product transformation from moderated portal to real-time social platform, shipping a complete social layer with a team of 12 in under 6 months; grew DAU from 80K to 120K (50%) within 2 months of launch.",
      "Assisted in development of product vision, roadmap, and milestones, defining growth-led development, user engagement, and revenue strategy.",
      "Diagnosed a post-launch retention gap through cohort and demographic analysis, identifying the root cause as content-fit and redirected product strategy accordingly.",
    ],
  },
]

const SKILL_GROUPS = [
  {
    label: "Product Management",
    skills: ["Product Roadmap Development", "Product Strategy", "Market Analysis", "Competitive Intelligence"],
  },
  {
    label: "Business & Reporting",
    skills: [
      "Business Case Development",
      "Financial Modeling",
      "Scenario Analysis",
      "Data Storytelling",
      "Dashboard Development",
      "Executive Reporting",
    ],
  },
  {
    label: "Data & Analytics",
    skills: [
      "SQL",
      "Relational Databases",
      "ETL",
      "Python",
      "Power BI",
      "Excel",
      "Word",
      "PowerPoint",
      "Statistical Analysis",
      "Experimentation",
      "KPI Development",
    ],
  },
  {
    label: "AI & Automation",
    skills: ["Copilot Studio", "Power Automate"],
  },
]

const EDUCATION = [
  {
    degree: "Master of Science in Management Strategy",
    school: "Smith School of Business, Queen's University, Kingston",
    period: "2021 — 2022",
    note: "Awarded Business School Scholarship for academic excellence ($26K); served as teaching assistant for MBA and undergraduate corporate strategy courses.",
  },
  {
    degree: "Master of Business Administration (MBA)",
    school: "Sharif University of Technology, Tehran, Iran",
    period: "2019 — 2021",
    note: "",
  },
  {
    degree: "Bachelor of Science, Aerospace Engineering",
    school: "Sharif University of Technology, Tehran, Iran",
    period: "2005 — 2011",
    note: "",
  },
]

const CERTIFICATES = [
  "Google Advanced Data Analytics Certificate — Google/Coursera, May 2025",
]

export default function ResumePage() {
  return (
    <>
      <SiteNav active="/resume" />
      <main className="mx-auto max-w-4xl px-5 py-10 md:px-8 md:py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-4xl font-bold text-balance md:text-5xl">
              Mohsen Khosravizadeh
            </h1>
            <p className="mt-2 text-sm font-semibold tracking-[0.14em] text-teal uppercase">
              Product Manager · Data Analyst
            </p>
          </div>
          <ul className="flex flex-col gap-1.5 text-sm text-muted-foreground">
            <li>
              <a
                href="mailto:khosravi.mn@gmail.com"
                className="inline-flex items-center gap-2 transition-colors hover:text-teal"
              >
                <Mail className="size-4 text-teal" aria-hidden="true" />
                khosravi.mn@gmail.com
              </a>
            </li>
            <li className="inline-flex items-center gap-2">
              <Phone className="size-4 text-teal" aria-hidden="true" />
              343-989-4540
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/khosravimohsen/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-teal"
              >
                <Linkedin className="size-4 text-teal" aria-hidden="true" />
                linkedin.com/in/khosravimohsen
              </a>
            </li>
          </ul>
        </div>

        <section className="mt-12">
          <h2 className="flex items-center gap-2.5 font-serif text-2xl font-bold">
            <Briefcase className="size-5 text-teal" aria-hidden="true" />
            Professional Experience
          </h2>
          <div className="mt-6 flex flex-col gap-8">
            {EXPERIENCE.map((job) => (
              <article key={`${job.company}-${job.period}`} className="border-l-2 border-border pl-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg font-semibold">{job.role}</h3>
                  <span className="text-sm font-medium text-muted-foreground">{job.period}</span>
                </div>
                <p className="text-sm font-medium text-teal">{job.company}</p>
                {job.summary ? (
                  <p className="mt-1 text-sm italic text-muted-foreground text-pretty">{job.summary}</p>
                ) : null}
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
          <div className="mt-6 flex flex-col gap-5">
            {SKILL_GROUPS.map((group) => (
              <div key={group.label}>
                <h3 className="text-sm font-semibold text-muted-foreground">{group.label}</h3>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <li
                      key={skill}
                      className="rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="flex items-center gap-2.5 font-serif text-2xl font-bold">
            <GraduationCap className="size-5 text-teal" aria-hidden="true" />
            Education
          </h2>
          <div className="mt-6 flex flex-col gap-5">
            {EDUCATION.map((edu) => (
              <div key={edu.degree} className="border-l-2 border-border pl-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-semibold">{edu.degree}</h3>
                  {edu.period ? (
                    <span className="text-sm font-medium text-muted-foreground">{edu.period}</span>
                  ) : null}
                </div>
                <p className="text-sm font-medium text-teal">{edu.school}</p>
                {edu.note ? (
                  <p className="mt-1.5 leading-relaxed text-foreground/80 text-pretty">{edu.note}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="flex items-center gap-2.5 font-serif text-2xl font-bold">
            <Award className="size-5 text-teal" aria-hidden="true" />
            Certificates
          </h2>
          <ul className="mt-5 flex list-disc flex-col gap-1.5 pl-5 text-foreground/80">
            {CERTIFICATES.map((cert) => (
              <li key={cert} className="leading-relaxed text-pretty">
                {cert}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  )
}
