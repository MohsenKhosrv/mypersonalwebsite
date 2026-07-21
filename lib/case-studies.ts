export type CategoryId = "data-analysis" | "data-visualization" | "product-management"

export interface Category {
  id: CategoryId
  label: string
}

export interface CaseStudy {
  id: string
  category: CategoryId
  year: string
  tags: string[]
  title: string
  company: string
  problem: string
  whyItMattered: string
  solution: string
  keyImpact: string
}

export const CATEGORIES: Category[] = [
  { id: "data-analysis", label: "Data Analysis" },
  { id: "data-visualization", label: "Data Visualization" },
  { id: "product-management", label: "Product Management" },
]

export const CATEGORY_LABELS: Record<CategoryId, string> = {
  "data-analysis": "Data Analysis",
  "data-visualization": "Data Visualization",
  "product-management": "Product Management",
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "youtube-content-business",
    category: "product-management",
    year: "2018–2020",
    tags: ["YouTube Analytics", "Content Strategy", "Business Development"],
    title: "Building a YouTube Content Business from Zero",
    company: "Rahnema",
    problem:
      "Rahnema, Iran's dominant music distributor, faced forecasted revenue pressure as the Rial collapsed. Domestic platforms were saturating. The company needed a new revenue channel for mid-term growth.",
    whyItMattered:
      "The Persian-speaking diaspora represented millions of underserved users on YouTube, generating ad revenue no Iranian distributor had systematically captured. The opportunity was large and largely untapped.",
    solution:
      "I identified the opportunity, built the business case, and led the build from a single test channel to an eight-channel operation. I defined content strategy, built operational infrastructure across legal, finance, design, and support, and optimized revenue through data-driven analysis of YouTube Analytics.",
    keyImpact:
      "300K+ subscribers, 9M monthly views, tens of thousands of dollars in monthly recurring revenue, 200%+ income growth for three consecutive months, all within 18 months.",
  },
  {
    id: "demand-forecasting",
    category: "data-analysis",
    year: "2023–2024",
    tags: ["Statistical Modeling", "Forecasting", "Stakeholder Collaboration"],
    title: "Rebuilding Demand Forecasting with a Data-Driven Method",
    company: "Polymer Production Company (proprietary, name withheld)",
    problem:
      "The demand forecasting process relied on a manual, judgment-based method with little analytical foundation. Forecasts were unreliable and changed frequently.",
    whyItMattered:
      "Unreliable forecasts cascaded into the entire operation. Production plans changed constantly, raw material orders were disrupted, and the business held excess inventory of both raw materials and finished goods to buffer against uncertainty. The cumulative cost was significant.",
    solution:
      "I led a structured, data-driven redesign of the forecasting method. Starting with five years of actual shipment data, I segmented customers and products by demand behavior, tested multiple averaging windows, and identified that a six-month rolling average consistently minimized forecast variance. I validated the method on held-out data, incorporated customer-provided signals for exceptions, and applied growth and decline rates for non-stable segments.",
    keyImpact:
      "Demand accuracy reached and sustained above 90% within three months. Product changeovers on production assets, each costing over $100K, were significantly reduced. This work contributed approximately $1M of a broader $2M savings initiative in material ordering and demand forecasting.",
  },
  {
    id: "repack-cause-dashboard",
    category: "data-visualization",
    year: "2025",
    tags: ["Power BI", "DAX", "ETL", "Data Modeling"],
    title: "Repack Cause Dashboard",
    company: "Manufacturing & Packaging Operation (proprietary, name withheld)",
    problem:
      "A manufacturing operation had no visibility into what was driving carton rework. The source system deleted the original carton record every time a repack occurred, permanently severing the link between a carton and the quality event that caused its rework.",
    whyItMattered:
      "Repack work always lost the capacity fight against new production, creating a growing backlog. Backlogged cartons meant held inventory and tied-up cash. Teams also defensively over-repacked cartons to be safe, wasting capacity on unnecessary rework.",
    solution:
      "I traced the missing lineage back through the system's own audit log and built logic to reliably extract quality event data from it. I designed a relational data model connecting cartons, components, and quality events, built an ETL pipeline with server-side filtering for fast refreshes, and layered in DAX logic guaranteeing every repacked carton is accounted for.",
    keyImpact:
      "Reduced rework by 50% within 2 months. Reduced time to ship by 70% within 6 months. Gave Operations and Quality leadership their first real visibility into repack root causes.",
  },
]
