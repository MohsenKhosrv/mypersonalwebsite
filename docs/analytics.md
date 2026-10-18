# Analytics tracking plan (Mixpanel)

Code lives in three files:

| File | Role |
| --- | --- |
| `lib/analytics-events.ts` | Event names and property types (typos fail at compile time) |
| `lib/analytics.ts` | `track()` wrapper, Mixpanel init (dynamic import), sessions, first-touch properties |
| `components/analytics-provider.tsx` | Page views, exits, scroll, card impressions, click delegation, conversions |

Markup hooks (all optional, read by the provider):

| Attribute | Meaning |
| --- | --- |
| `data-track-name="x"` | `item_name` for a link inside this element (falls back to `aria-label` / link text) |
| `data-track-card="Card title"` | Marks a project card: `card_name`, impression tracking, `card_name` on its links |
| `data-card-position="n"` | 1-based order of the card on the page |
| `data-track-zone="nav"` | Links inside count as `nav` for `entry_point` |
| `data-active-filter="All"` | Current homepage filter label (set on the portfolio `<main>`) |
| `data-track-intent="resume_downloaded"` | Force a `contact_intent` for a link (also `linkedin_clicked`) |

## Configuration

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_MIXPANEL_TOKEN` | Project token. Empty = tracking fully disabled (one dev console warning) |
| `NEXT_PUBLIC_ANALYTICS_DEBUG` | `true` in dev logs every event + properties to the console. With no token it is a dry run (nothing sent). Ignored in production builds |

Mixpanel config: `autocapture: false`, `track_pageview: false`, `persistence: 'localStorage'`, `ignore_dnt: false`.

## Super properties (on every event)

| Property | Value |
| --- | --- |
| `session_id` | Random ID in `sessionStorage`. New after 30 min inactivity or a new browser session |
| `session_number` | Counter in `localStorage`, +1 per new session |

Registered once on the first ever visit (`register_once`): `first_visit_date` (YYYY-MM-DD), `first_landing_page`, `first_referrer_domain`, and `first_utm_source` / `first_utm_medium` when present.

UTM, referrer, device, browser, country and timestamp come from Mixpanel and are not duplicated.
No names, emails or form contents are ever sent.

## Events

### `session_start`
Once per new session (first load, or first activity after 30 min idle).
`landing_page` (path), `referrer_domain` (hostname or `direct`), `device_type` (`mobile` | `tablet` | `desktop`).

### `page_view`
Initial load and every client-side route change (once per page view).
| Property | Values |
| --- | --- |
| `page_name` | `Home`, `Projects`, `Resume`, `Contact`, `Blog`, or the case study title |
| `page_path` | Pathname |
| `content_type` | `home`, `projects`, `case_study`, `blog`, `resume`, `contact`, `other` (404s) |
| `entry_point` | `home_card`, `projects_page`, `nav`, `external`, `direct` |

`entry_point` rules: a clicked card (on `/` -> `home_card`, on `/projects` -> `projects_page`) or nav link (`nav`) wins; otherwise a case study reached from `/projects` or `/` is `projects_page` / `home_card`, any other internal navigation is `nav`. For the first page of a visit: no referrer -> `direct`, same-site referrer -> `nav`, other referrer -> `external`.

### `page_exit`
Once per page view, on route change, tab hidden, or `pagehide` (sendBeacon). `page_path`, `time_on_page` (visible seconds), `max_scroll_depth` (percent).
Because it fires once, switching tabs ends the page view's exit measurement; later time on that page is not added to `page_exit`.

### `scroll_depth_reached`
Once per threshold per page load. `scroll_depth` (`25` | `50` | `75` | `100`), `page_path`.
Depth = `scrollY / (page height - viewport)`. Pages that do not scroll count as 100 and fire all four thresholds on load.

### `view_card`
Card >= 50% visible (or >= 50% of the viewport for cards taller than 2 viewports) for 1 continuous second. Once per card per page load.
`card_name`, `card_page`, `card_position`, `active_filter` (`All`, `Data Analysis`, `Data Visualization`, `Product Management`; omitted on `/projects`, which has no filter).

### `click_link`
Any link click (delegated, capture phase). Same-page `#hash` links are ignored.
`item_name`, `page_path`, `destination_address` (internal: path + query + hash; external: origin + path only; `mailto:` / `tel:` addresses reduced to the scheme), `link_type` (`internal` | `external`), `card_name` (links inside a project card). External links are sent via sendBeacon.

### `read_article`
Once per page load on case studies and blog posts (`/blog/*`; the `/blog` index is not an article) when scroll depth >= 75% AND >= 45 visible seconds.
`article_name` (page `<h1>`), `article_path`, `content_type` (`case_study` | `blog`), `time_on_page`, `entry_point`.

### `contact_intent`
Conversion event, fired next to the underlying action. `source_page` is the path where the action happened.
| `intent_type` | Trigger |
| --- | --- |
| `resume_viewed` | `/resume` page view |
| `resume_downloaded` | Click on a `.pdf`/`.doc(x)` link or `download` link related to the resume, or `data-track-intent="resume_downloaded"` (no download button exists on the site yet) |
| `linkedin_clicked` | Click on any `linkedin.com` link (hero "Let's Connect", resume page, contact page) |
| `contact_submitted` | Reserved. There is no contact form; call `track('contact_intent', { intent_type: 'contact_submitted', source_page })` on a successful submit, with no form content |

## Verification checklist

Setup: put a token in `.env.local` (a dev/test Mixpanel project is best), set `NEXT_PUBLIC_ANALYTICS_DEBUG=true`, run `npm run dev`, open DevTools Console. In Mixpanel open **Events > Live View** for that project. Use a fresh incognito window for first-visit checks.

1. **Disabled mode**: remove the token, reload. Expect one `[analytics] ... disabled` warning and no requests to `api-js.mixpanel.com` in the Network tab.
2. **Session + first visit** (fresh window, `/`): console shows `session_start` then `page_view`, once each (not twice, despite React strict mode). In Live View, `session_start` has `landing_page`, `referrer_domain`, `device_type`; open any event > Properties and see `session_id`, `session_number: 1`, and (user profile / super props) `first_visit_date`, `first_landing_page`, `first_referrer_domain`. Reload: `session_number` stays 1 (same browser session).
3. **New session**: close the window, open the site again: `session_number` is 2 and a new `session_start` fires. Idle for 30+ minutes then click: a new `session_id` and `session_start`.
4. **UTM**: open `/?utm_source=test&utm_medium=email` in a fresh window: `first_utm_source` / `first_utm_medium` present; Mixpanel's own `utm_source` appears on events.
5. **page_view / entry_point**: direct load -> `direct`. Click a home card "Read Full Story" -> case study `page_view` with `home_card`. From `/projects` click a card -> `projects_page`. Click a nav item -> `nav`. Open the site from another site/search link -> `external`.
6. **scroll_depth_reached**: scroll a long page slowly: 25, 50, 75, 100 each appear once. Scroll up and down again: no repeats. Navigate away and back: they fire again (new page load).
7. **page_exit**: navigate to another page, then close the tab and switch tabs. One `page_exit` per page view with sensible `time_on_page` and `max_scroll_depth`. In Network you should see the exit event sent as a beacon (`ping` type request).
8. **view_card**: on `/`, scroll so a card is more than half visible and stay 1 s: `view_card` with `card_position` and `active_filter: All`. Scroll past quickly (under 1 s): no event. Switch the filter to "Data Analysis": newly shown cards fire with `active_filter: Data Analysis`; already-fired cards do not fire again. Check `/projects` too.
9. **click_link**: click a nav item, a hero button, a card link, the LinkedIn link: each logs one `click_link` with the right `item_name`, `link_type`, `destination_address`, and `card_name` for card links. Outbound clicks must still appear in Live View even though the page navigates away.
10. **read_article**: open a case study, scroll to the bottom, stay at least 45 visible seconds: exactly one `read_article`. Scroll to 75% but leave quickly: none. Keep the tab hidden: the 45 s clock does not run.
11. **contact_intent**: opening `/resume` -> `resume_viewed`; clicking LinkedIn (hero, resume, or contact page) -> `linkedin_clicked` next to its `click_link`. Download and submit intents need a download link / form first.
12. **Privacy**: inspect several events in Live View; there must be no names, emails or form text, and external `destination_address` values have no query strings.
13. **Counts**: filter one session in Live View. Per page view you should see exactly one `page_view`, at most one `page_exit`, and each scroll threshold at most once.
