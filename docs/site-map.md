# Site map: mohsenkhosravi.com

High-level map of pages, elements and technical specifications. No page copy; element names are logical names (component or markup role). Keep this file updated when pages or components change. Analytics details are in [analytics.md](analytics.md).

## 1. Site-wide

| Item | Spec |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack), React 19, TypeScript (strict) |
| Styling | Tailwind CSS 4 (`@tailwindcss/postcss`, `@tailwindcss/typography`), tokens in `app/globals.css` |
| Fonts | `next/font/google`: Inter (`--font-inter`, sans), Lora (`--font-lora`, serif) |
| Icons | `lucide-react` |
| Markdown | `react-markdown` + `remark-gfm`, read at build time from `content/full-stories/<id>.md` |
| Package manager | pnpm (`pnpm-lock.yaml`) |
| Rendering | All routes statically generated (SSG); case studies via `generateStaticParams` |
| Data | No database or API. Case study data in `lib/case-studies.ts`; long stories in `content/full-stories/` |
| Analytics | Mixpanel via `AnalyticsProvider` (root layout, wrapped in `Suspense`) |
| Env vars | `NEXT_PUBLIC_MIXPANEL_TOKEN`, `NEXT_PUBLIC_ANALYTICS_DEBUG` (see `.env.example`) |
| Hosting | Vercel (built with v0); repo has no `.vercel` folder locally |
| Images | `public/headshot.jpg`, `public/projects/*.jpg` (served via `next/image`) |
| Forms / auth / CMS | None |
| Lint | `npm run lint` is broken (`next lint` removed in Next 16, no ESLint config) |

### Global layout (`app/layout.tsx`)
- `<html>` with font variables, `<body>` containing: `AnalyticsProvider` (renders nothing), then `{children}`.
- No shared header or footer in the layout: each page renders its own header (`Hero` on home, `SiteNav` elsewhere). There is no footer.

## 2. Page tree

```
/                         Home / Portfolio
├─ /resume                Resume
├─ /projects              Projects list
│   └─ /projects/[id]     Case study (4 pages)
├─ /blog                  Blog (index only)
└─ /contact               Contact
(any other path)          Next.js default 404
```

Case study IDs: `google-merchandise-store-dashboard`, `youtube-content-business`, `demand-forecasting`, `repack-cause-dashboard`.
Categories: `data-analysis`, `data-visualization`, `product-management`.

## 3. Shared elements

| Element | File | Type | Used on | Notes |
| --- | --- | --- | --- | --- |
| `SiteNav` | `components/site-nav.tsx` | Server | All pages except Home | Logo (MK badge + name) and primary nav; `active` prop highlights current page |
| `Hero` | `components/hero.tsx` | Server | Home | Contains its own primary nav (same 5 links), headshot, intro, 2 CTAs |
| Primary nav links | in `SiteNav`, `Hero` | Links | All | Portfolio `/`, Resume `/resume`, Projects `/projects`, Blog `/blog`, Contact `/contact` (list is duplicated in both files) |
| `Portfolio` | `components/portfolio.tsx` | Client | Home | Owns filter state, active card, scroll-spy |
| `Sidebar` | `components/sidebar.tsx` | Client | Home | Filter pills + grouped jump list |
| `CaseStudyCard` | `components/case-study-card.tsx` | Server | Home | Props: `study`, `footerHref`, `position` |
| `StoryToc` | `components/story-toc.tsx` | Client | Case study | Left-rail table of contents, `lg`+ only |
| `AnalyticsProvider` | `components/analytics-provider.tsx` | Client | All | No UI |
| Category styles | `lib/category-styles.ts` | Lib | Home, Projects, Case study | Badge and accent classes per category |

## 4. Pages

### Home `/`
- **File:** `app/page.tsx`; **render:** static; **content_type:** `home`
- **Layout:** `Hero`, then `Portfolio` (`<main>`, two columns: sidebar + cards)
- **Elements:** `Hero` (nav, headshot, headline, intro, `hero_view_resume` CTA, `hero_lets_connect` CTA) · `Sidebar` (filter pills: All / Data Analysis / Data Visualization / Product Management; jump list) · `CaseStudyCard` x4 (category badge, year, tags, title, company, detail rows or screenshot, "Read Full Story" link)
- **Data:** `CASE_STUDIES`, `CATEGORIES`
- **Behavior:** filter changes the visible cards; scroll-spy highlights the active card; jump list scrolls to a card
- **Links out:** `/resume`, LinkedIn (external), `/projects/[id]` per card, primary nav
- **Analytics:** `page_view`, `page_exit`, `scroll_depth_reached`, `view_card` (with `active_filter`), `click_link`, `contact_intent` (`linkedin_clicked`)

### Resume `/resume`
- **File:** `app/resume/page.tsx`; **static**; **content_type:** `resume`
- **Elements:** `SiteNav` · header block (name, title, `resume_contact_me` link, `resume_linkedin` link) · sections: Professional Experience, Skills, Education, Certificates
- **Data:** hard-coded constants in the page file (`EXPERIENCE`, `SKILL_GROUPS`, `EDUCATION`, `CERTIFICATES`)
- **Not present:** download button
- **Analytics:** `page_view`, `page_exit`, `scroll_depth_reached`, `click_link`, `contact_intent` (`resume_viewed`, `linkedin_clicked`; `resume_downloaded` ready for a future download link)

### Projects `/projects`
- **File:** `app/projects/page.tsx`; **static**; **content_type:** `projects`
- **Elements:** `SiteNav` · page heading + intro · vertical list of project cards (`project_card` link: category badge, year, title, company, screenshot or problem summary, "Read case study")
- **Data:** `CASE_STUDIES`, `CATEGORY_LABELS`, `CATEGORY_STYLES`
- **No filter** (unlike Home)
- **Analytics:** `page_view`, `page_exit`, `scroll_depth_reached`, `view_card` (no `active_filter`), `click_link` (with `card_name`)

### Case study `/projects/[id]`
- **File:** `app/projects/[id]/page.tsx`; **SSG** via `generateStaticParams`; unknown id returns `notFound()`; **content_type:** `case_study`
- **Metadata:** dynamic `generateMetadata` (title = study title)
- **Elements:** `SiteNav` · `StoryToc` (only when the story has more than 1 heading; hidden below `lg`) · `back_to_projects` link · category badge, year, tags · title, company · body
- **Body:** if `content/full-stories/<id>.md` exists, rendered markdown (h2/h3 get slug ids, tables wrapped for scroll); otherwise 4 fallback sections (Problem, Why It Mattered, Solution, Key Impact) from the data file
- **TOC config:** `TOC_OVERRIDES` in the page file for `youtube-content-business` and `google-merchandise-store-dashboard`; other stories list every h2/h3
- **Data:** `CASE_STUDIES`, `getFullStoryBody()` (`lib/full-stories.ts`, uses `fs` at build time)
- **Analytics:** `page_view`, `page_exit`, `scroll_depth_reached`, `click_link`, `read_article` (75% scroll + 45 s)

### Blog `/blog`
- **File:** `app/blog/page.tsx`; **static**; **content_type:** `blog`
- **Elements:** `SiteNav` · heading · post list (currently one welcome entry: title, date, reading time, excerpt, tag)
- **Data:** `POSTS` constant in the page file
- **Not present:** individual post pages (`/blog/[slug]`), links from entries
- **Analytics:** `page_view`, `page_exit`, `scroll_depth_reached`, `click_link`. `read_article` will apply to future `/blog/*` posts only

### Contact `/contact`
- **File:** `app/contact/page.tsx`; **static**; **content_type:** `contact`
- **Elements:** `SiteNav` · heading + intro · channel links: `contact_linkedin`, `contact_github` (both external, new tab)
- **Data:** `CHANNELS` constant in the page file
- **Not present:** contact form
- **Analytics:** `page_view`, `page_exit`, `scroll_depth_reached`, `click_link`, `contact_intent` (`linkedin_clicked`; `contact_submitted` reserved)

### 404 (any unknown path)
- Next.js default; no custom `not-found.tsx`. Tracked as `content_type: other`.

## 5. Element naming reference (`data-track-name`)

| Name | Where |
| --- | --- |
| `nav_logo` | `SiteNav` logo |
| `nav_portfolio`, `nav_resume`, `nav_projects`, `nav_blog`, `nav_contact` | `SiteNav` and `Hero` nav |
| `hero_view_resume`, `hero_lets_connect` | `Hero` CTAs |
| `card_read_full_story` | Home card footer link |
| `project_card` | Projects list card |
| `back_to_projects` | Case study back link |
| `resume_contact_me`, `resume_linkedin` | Resume header links |
| `contact_linkedin`, `contact_github` | Contact channel links |

Other data attributes: `data-track-card` (card title), `data-card-position`, `data-track-zone="nav"`, `data-active-filter` (Home `<main>`), `data-track-intent` (optional override).

## 6. Source layout

```
app/            layout.tsx, globals.css, page.tsx, resume/, projects/, projects/[id]/, blog/, contact/
components/     analytics-provider, case-study-card, hero, portfolio, sidebar, site-nav, story-toc
lib/            analytics.ts, analytics-events.ts, case-studies.ts, category-styles.ts, full-stories.ts
content/        full-stories/*.md (+ source images)
public/         headshot.jpg, projects/*.jpg
docs/           analytics.md, site-map.md
```
