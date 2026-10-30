import fs from "fs";
import path from "path";

export interface LectureMetadata {
  slug: string;
  title: string;
  week: number;
  description: string;
  date?: string;
}

const LECTURES_DIR = path.join(process.cwd(), "src/content/lectures");

/**
 * Custom regex-based frontmatter parser (no external dependencies required).
 * Extracts title, week, description, and date from YAML frontmatter header.
 */
function parseFrontmatter(fileContent: string, fallbackSlug: string): LectureMetadata {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---/;
  const match = fileContent.match(frontmatterRegex);

  let title = fallbackSlug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
  let week = 0;
  let description = "";
  let date: string | undefined;

  if (match && match[1]) {
    const yamlLines = match[1].split("\n");
    for (const line of yamlLines) {
      const colonIndex = line.indexOf(":");
      if (colonIndex === -1) continue;

      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();

      // Remove surrounding quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      if (key === "title" && value) {
        title = value;
      } else if (key === "week") {
        const parsedWeek = parseInt(value, 10);
        if (!isNaN(parsedWeek)) week = parsedWeek;
      } else if (key === "description") {
        description = value;
      } else if (key === "date") {
        date = value;
      }
    }
  }

  return {
    slug: fallbackSlug,
    title,
    week,
    description,
    date,
  };
}

/**
 * Reads src/content/lectures and returns sorted LectureMetadata list.
 */
export function getLectures(): LectureMetadata[] {
  if (!fs.existsSync(LECTURES_DIR)) {
    return [];
  }

  const filenames = fs.readdirSync(LECTURES_DIR);

  const lectures: LectureMetadata[] = filenames
    .filter((filename) => filename.endsWith(".mdx") || filename.endsWith(".md"))
    .map((filename) => {
      const slug = filename.replace(/\.mdx?$/, "");
      const fullPath = path.join(LECTURES_DIR, filename);
      const fileContent = fs.readFileSync(fullPath, "utf-8");
      return parseFrontmatter(fileContent, slug);
    });

  // Sort by week ascending
  return lectures.sort((a, b) => a.week - b.week);
}
