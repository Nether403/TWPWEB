// content/assets.ts
//
// Build-time asset-copy step (task 2.8). Next.js only serves static files from
// `public/`, but the Portal's source binaries live in workspace-root folders
// (`Articles and papers` PDFs, `infographs` PNGs, `slides` PPTX, `Video` MP4).
// This step copies those binaries into `public/assets/{category}/` and emits the
// `MediaAsset[]` manifest the media galleries consume.
//
// Reuses the file-name transforms (altTextFromFileName, videoTitleFromFileName,
// fileNameToTitle) and the content loader (loadAllContent) — no transform or
// loader logic is re-implemented here.
//
// Requirements: 6.2 (PDFs), 8.1 (infographics), 9.1 (videos), 10.1 (slides),
// 21.1 (build from existing source folders). A missing or oversized asset is
// logged and omitted, never a build-aborting throw.

import fs from "node:fs";
import path from "node:path";
import {
  altTextFromFileName,
  fileNameToTitle,
  videoTitleFromFileName,
} from "./transforms";
import { loadAllContent } from "./loader";

/** Media kinds catalogued in the MediaAsset manifest (design.md "MediaAsset"). */
export type MediaKind = "infographic" | "video" | "slides";

export interface MediaAsset {
  kind: MediaKind;
  title: string; // derived from file name
  alt?: string; // infographics only (Req 8.2)
  assetPath: string; // served path under public/
}

export interface CopyAssetsResult {
  media: MediaAsset[]; // infographics, videos, slides (Req 8.1, 9.1, 10.1)
  copied: string[]; // served paths actually written to public/ (PDFs + media)
  skipped: { file: string; reason: string }[]; // missing/oversized, omitted (not fatal)
}

// ponytail: a single hard size ceiling (100 MB) guards the static deploy against
// a pathologically large source file silently bloating the bundle. The current
// largest asset is ~67 MB, so nothing real is omitted today. Upgrade path: a
// per-kind ceiling (e.g. tighter for PNG than MP4) if one kind starts to drift.
const MAX_ASSET_BYTES = 100 * 1024 * 1024;

/** Media source folder → kind, extension, served-category, and title transform. */
const MEDIA_SOURCES: {
  dir: string;
  kind: MediaKind;
  ext: string;
  category: string;
  title: (fileName: string) => string;
  alt?: (fileName: string) => string;
}[] = [
  {
    dir: "infographs",
    kind: "infographic",
    ext: ".png",
    category: "infographics",
    title: fileNameToTitle,
    alt: altTextFromFileName,
  },
  {
    dir: "Video",
    kind: "video",
    ext: ".mp4",
    category: "videos",
    title: videoTitleFromFileName,
  },
  {
    dir: "slides",
    kind: "slides",
    ext: ".pptx",
    category: "slides",
    title: fileNameToTitle,
  },
];

/**
 * Copy one source file into the public tree, omitting (and logging) it when the
 * source is missing or exceeds the size ceiling. Returns true only when the file
 * was actually copied. Never throws on a missing/oversized asset (Req 6.2/8.1/
 * 9.1/10.1: "log a warning and omit … rather than aborting the build").
 */
function copyOne(
  srcAbs: string,
  destAbs: string,
  servedPath: string,
  sourceLabel: string,
  maxBytes: number,
  skipped: { file: string; reason: string }[],
): boolean {
  if (!fs.existsSync(srcAbs)) {
    const reason = "source file missing";
    skipped.push({ file: sourceLabel, reason });
    console.warn(`[assets] omitted (${reason}): ${sourceLabel}`);
    return false;
  }

  const { size } = fs.statSync(srcAbs);
  if (size > maxBytes) {
    const reason = `oversized (${size} bytes > ${maxBytes})`;
    skipped.push({ file: sourceLabel, reason });
    console.warn(`[assets] omitted (${reason}): ${sourceLabel}`);
    return false;
  }

  fs.mkdirSync(path.dirname(destAbs), { recursive: true });
  if (path.resolve(srcAbs) !== path.resolve(destAbs)) {
    fs.copyFileSync(srcAbs, destAbs);
  }
  void servedPath; // served path is recorded by the caller
  return true;
}

/**
 * Copy every binary referenced by the build into `public/assets/{category}/` and
 * return the MediaAsset manifest plus copy/skip bookkeeping.
 *
 * - PDFs come from the content manifest (`loadAllContent`): each `format: "pdf"`
 *   item already carries the `assetPath` (`/assets/{category}/file.pdf`) the
 *   served file must live at, so we copy `sourcePath` → `public + assetPath`.
 * - Infographics / videos / slides are scanned from their source folders, copied
 *   to `/assets/{category}/file`, and catalogued as `MediaAsset`s. If a source
 *   folder is missing but generated public assets already exist, those are
 *   catalogued as a fallback so checked-in public media still appears.
 *
 * Pure with respect to the file system inputs: the same source bytes yield the
 * same manifest. Missing folders are treated as empty (warning, not error).
 *
 * @param rootDir   workspace root holding the source folders. Defaults to cwd
 *                  (the Next.js build runs from the project root); overridable so
 *                  the self-check can point at a temp fixture.
 * @param publicDir destination `public/` directory. Defaults to `{rootDir}/public`.
 * @param maxBytes  size ceiling; sources larger than this are omitted. Defaults
 *                  to MAX_ASSET_BYTES; overridable so the self-check can exercise
 *                  the oversized path without writing a 100 MB fixture.
 */
export function copyAssets(
  rootDir: string = process.cwd(),
  publicDir: string = path.join(rootDir, "public"),
  maxBytes: number = MAX_ASSET_BYTES,
): CopyAssetsResult {
  const media: MediaAsset[] = [];
  const copied: string[] = [];
  const skipped: { file: string; reason: string }[] = [];

  // 1. PDFs referenced by the content manifest (Req 6.2).
  const { items } = loadAllContent(rootDir);
  for (const item of items) {
    if (item.format !== "pdf" || !item.assetPath) continue;
    const srcAbs = path.join(rootDir, item.sourcePath);
    const destAbs = path.join(publicDir, item.assetPath);
    if (copyOne(srcAbs, destAbs, item.assetPath, item.sourcePath, maxBytes, skipped)) {
      copied.push(item.assetPath);
    }
  }

  // 2. Infographics, videos, slides scanned from their source folders.
  for (const source of MEDIA_SOURCES) {
    let folderAbs = path.join(rootDir, source.dir);
    if (!fs.existsSync(folderAbs)) {
      const publicFallbackAbs = path.join(publicDir, "assets", source.category);
      const rootPublicFallbackAbs = path.join(rootDir, "public", "assets", source.category);
      if (fs.existsSync(rootPublicFallbackAbs)) {
        console.warn(
          `[assets] media folder missing, using public/assets fallback: ${source.dir}`,
        );
        folderAbs = rootPublicFallbackAbs;
      } else if (fs.existsSync(publicFallbackAbs)) {
        console.warn(
          `[assets] media folder missing, using public/assets fallback: ${source.dir}`,
        );
        folderAbs = publicFallbackAbs;
      } else {
        console.warn(
          `[assets] media folder missing, treating as empty: ${source.dir}`,
        );
        continue;
      }
    }

    const fileNames = fs
      .readdirSync(folderAbs, { withFileTypes: true })
      .filter((e) => e.isFile() && path.extname(e.name).toLowerCase() === source.ext)
      .map((e) => e.name)
      .sort(); // deterministic manifest order

    for (const fileName of fileNames) {
      const servedPath = `/assets/${source.category}/${fileName}`;
      const srcAbs = path.join(folderAbs, fileName);
      const destAbs = path.join(publicDir, "assets", source.category, fileName);
      const sourceLabel = path.relative(rootDir, srcAbs) || path.join(source.dir, fileName);

      if (!copyOne(srcAbs, destAbs, servedPath, sourceLabel, maxBytes, skipped))
        continue;

      copied.push(servedPath);
      media.push({
        kind: source.kind,
        title: source.title(fileName),
        ...(source.alt ? { alt: source.alt(fileName) } : {}),
        assetPath: servedPath,
      });
    }
  }

  return { media, copied, skipped };
}
