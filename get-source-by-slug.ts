import fs from "fs"
import path from "path"

export const getSourceBySlug = async <T extends string>({
  slug,
  directory = "content",
  formats = ["mdx", "md"] as T[],
}: {
  slug: string | string[]
  directory?: string
  formats?: T[]
}): Promise<{
  source: string
  format: T
} | null> => {
  try {
    const slugPath = Array.isArray(slug) ? slug.join("/") : slug
    const fileBasePath = path.join(process.cwd(), directory, slugPath)

    for (const format of formats) {
      const filePath = `${fileBasePath}.${format}`
      if (fs.existsSync(filePath)) {
        return {
          source: await fs.promises.readFile(filePath, "utf8"),
          format: format,
        }
      }
    }

    if (!fs.existsSync(path.join(process.cwd(), directory))) {
      throw new Error(
        `The directory "${directory}" does not exist. Please provide a valid directory.`,
      )
    }

    return null
  } catch (error) {
    if (error instanceof Error) {
      console.error(`An error occurred: ${error.message}`)
    } else {
      console.error("An unknown error occurred")
    }
    return null
  }
}
