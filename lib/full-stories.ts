import fs from "node:fs"
import path from "node:path"

const FULL_STORIES_DIR = path.join(process.cwd(), "content", "full-stories")

/** Raw markdown for content/full-stories/<id>.md, or null if it hasn't been provided yet. */
export function getFullStory(id: string): string | null {
  const filePath = path.join(FULL_STORIES_DIR, `${id}.md`)
  if (!fs.existsSync(filePath)) return null
  return fs.readFileSync(filePath, "utf-8")
}

/**
 * Long-story markdown with the leading `# Title` line stripped, since the page that
 * renders it already shows the case study's title from lib/case-studies.ts.
 */
export function getFullStoryBody(id: string): string | null {
  const raw = getFullStory(id)
  if (!raw) return null
  return raw.replace(/^\s*#\s[^\n]*\n+/, "")
}
