// content/transforms.ts
//
// Pure file-name transforms shared by the build-time content loader and the
// media viewer. No I/O, no dependencies — given the same input they always
// produce the same output.
//
// Design references: design.md "Content Loader" and "Media_Viewer".
// Property 7 (tested in task 2.2): the human-readable text produced by
// fileNameToTitle / altTextFromFileName / videoTitleFromFileName is non-empty,
// carries no file extension, and contains no underscore or dash separators.
// Requirements: 8.2, 9.2, 10.1, 19.1

/**
 * Reduce a path or file name to its base name with the final extension removed.
 * Drops any directory segments, then strips a single trailing `.ext`.
 */
function baseName(fileName: string): string {
  // Last path segment, tolerating both POSIX and Windows separators.
  const segment = fileName.split(/[\\/]/).pop() ?? "";
  // Remove only the final extension (".png", ".md", ...); leave inner dots be.
  return segment.replace(/\.[^.]+$/, "");
}

/**
 * Turn a file name into human-readable text: strip the extension, convert
 * `_`/`-` separators to spaces, collapse whitespace, and title-case each word
 * (first letter capitalized, existing inner casing preserved so acronyms like
 * "PII" survive). Falls back to "Untitled" when nothing readable remains, so
 * the result is always non-empty (Property 7).
 */
function humanize(fileName: string): string {
  const cleaned = baseName(fileName)
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (cleaned === "") return "Untitled";

  return cleaned
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * URL-safe slug derived from a file name: lower-cased, non-alphanumeric runs
 * collapsed to single dashes, edges trimmed. Dashes are intentional here —
 * they are the URL separator, not the human-readable separators Property 7
 * forbids in titles. Falls back to "untitled" so the slug is never empty.
 */
export function fileNameToSlug(fileName: string): string {
  const slug = baseName(fileName)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug === "" ? "untitled" : slug;
}

/** Human-readable title for a content file (strips extension, title-cases). */
export function fileNameToTitle(fileName: string): string {
  return humanize(fileName);
}

/** Descriptive alt text for an infographic, derived from its file name. */
export function altTextFromFileName(fileName: string): string {
  return humanize(fileName);
}

/** Human-readable video title, derived from the video file name. */
export function videoTitleFromFileName(fileName: string): string {
  return humanize(fileName);
}
