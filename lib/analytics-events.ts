/**
 * Tracking plan as types. Event and property names are snake_case and must match docs/analytics.md.
 * Never add names, emails or form contents here.
 *
 * Mixpanel adds UTM params, referrer, device, browser, country and timestamp by itself.
 * `session_id` and `session_number` are registered as super properties, so they are not listed per event.
 */

export type ContentType =
  | "home"
  | "projects"
  | "case_study"
  | "blog"
  | "resume"
  | "contact"
  | "other"

export type EntryPoint = "home_card" | "projects_page" | "nav" | "external" | "direct"

export type DeviceType = "mobile" | "tablet" | "desktop"

export type ScrollThreshold = 25 | 50 | 75 | 100

export type IntentType =
  | "resume_viewed"
  | "resume_downloaded"
  | "linkedin_clicked"
  | "contact_submitted"

export interface AnalyticsEvents {
  session_start: {
    landing_page: string
    referrer_domain: string
    device_type: DeviceType
  }
  page_view: {
    page_name: string
    page_path: string
    content_type: ContentType
    entry_point: EntryPoint
  }
  page_exit: {
    page_path: string
    /** Seconds the page was visible */
    time_on_page: number
    /** Percent, 0-100 */
    max_scroll_depth: number
  }
  scroll_depth_reached: {
    scroll_depth: ScrollThreshold
    page_path: string
  }
  view_card: {
    card_name: string
    card_page: string
    /** 1-based order of the card on the page */
    card_position: number
    /** Homepage filter tab selected (e.g. "All", "Data Analysis"); omitted where there is no filter */
    active_filter?: string
  }
  click_link: {
    item_name: string
    page_path: string
    destination_address: string
    link_type: "internal" | "external"
    card_name?: string
  }
  read_article: {
    article_name: string
    article_path: string
    content_type: "case_study" | "blog"
    time_on_page: number
    entry_point: EntryPoint
  }
  contact_intent: {
    intent_type: IntentType
    source_page: string
  }
}

export type EventName = keyof AnalyticsEvents
