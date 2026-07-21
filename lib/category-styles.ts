import type { CategoryId } from "./case-studies"

interface CategoryStyle {
  /** Text color for the small-caps sidebar header + label */
  text: string
  /** Badge background + text for the pill-shaped category badge */
  badge: string
  /** Left border accent color for the active sidebar item */
  accentBorder: string
}

export const CATEGORY_STYLES: Record<CategoryId, CategoryStyle> = {
  "data-analysis": {
    text: "text-cat-analysis",
    badge: "bg-cat-analysis-bg text-cat-analysis",
    accentBorder: "border-cat-analysis",
  },
  "data-visualization": {
    text: "text-cat-viz",
    badge: "bg-cat-viz-bg text-cat-viz",
    accentBorder: "border-cat-viz",
  },
  "product-management": {
    text: "text-cat-product",
    badge: "bg-cat-product-bg text-cat-product",
    accentBorder: "border-cat-product",
  },
}
