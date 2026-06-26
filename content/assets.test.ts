// Runnable self-check for the asset-copy step (task 2.8).
//
// Exercises the non-trivial copy/cataloguing logic against a temp fixture:
// PDFs from the content manifest plus the three media kinds, including the
// missing-folder, missing-source, and oversized paths that must be omitted and
// logged rather than aborting the build (Req 6.2, 8.1, 9.1, 10.1, 21.1).
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { copyAssets } from "./assets";

describe("copyAssets (temp fixture)", () => {
  let root: string;
  let publicDir: string;

  beforeAll(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), "twp-assets-"));
    publicDir = path.join(root, "public");

    // A PDF in the content manifest -> copied under /assets/{category}/ (Req 6.2).
    fs.mkdirSync(path.join(root, "Articles and papers"));
    fs.writeFileSync(path.join(root, "Articles and papers", "paper.pdf"), "%PDF-1.4");

    // Infographics (PNG) — one normal, one oversized to exercise omission.
    fs.mkdirSync(path.join(root, "infographs"));
    fs.writeFileSync(
      path.join(root, "infographs", "The_Witness_Protocol_Framework.png"),
      "PNGDATA",
    );
    fs.writeFileSync(
      path.join(root, "infographs", "Huge_Diagram.png"),
      Buffer.alloc(2048, 1), // 2 KB, omitted by the 1 KB ceiling below
    );

    // Videos (MP4).
    fs.mkdirSync(path.join(root, "Video"));
    fs.writeFileSync(path.join(root, "Video", "Intro_Clip.mp4"), "MP4DATA");

    // slides/ folder intentionally omitted to exercise the missing-folder path.
  });

  afterAll(() => fs.rmSync(root, { recursive: true, force: true }));

  it("copies catalogued PDFs into the served public/assets tree", () => {
    const { copied } = copyAssets(root, publicDir, 1024);
    expect(copied).toContain("/assets/article/paper.pdf");
    expect(fs.existsSync(path.join(publicDir, "assets", "article", "paper.pdf"))).toBe(
      true,
    );
  });

  it("builds a MediaAsset per copied infographic/video with derived text", () => {
    const { media } = copyAssets(root, publicDir, 1024);

    const infographic = media.find((m) => m.kind === "infographic");
    expect(infographic).toEqual({
      kind: "infographic",
      title: "The Witness Protocol Framework",
      alt: "The Witness Protocol Framework",
      assetPath: "/assets/infographics/The_Witness_Protocol_Framework.png",
    });
    expect(
      fs.existsSync(
        path.join(publicDir, "assets", "infographics", "The_Witness_Protocol_Framework.png"),
      ),
    ).toBe(true);

    const video = media.find((m) => m.kind === "video");
    expect(video?.title).toBe("Intro Clip");
    expect(video?.alt).toBeUndefined(); // alt is infographics-only
    expect(video?.assetPath).toBe("/assets/videos/Intro_Clip.mp4");
  });

  it("omits and logs oversized assets without copying them", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { media, skipped } = copyAssets(root, publicDir, 1024);
    warn.mockRestore();

    expect(media.some((m) => m.assetPath.endsWith("Huge_Diagram.png"))).toBe(false);
    expect(
      fs.existsSync(path.join(publicDir, "assets", "infographics", "Huge_Diagram.png")),
    ).toBe(false);
    const oversized = skipped.find((s) => s.file.endsWith("Huge_Diagram.png"));
    expect(oversized?.reason).toMatch(/oversized/);
  });

  it("treats a missing media folder as empty (no slides emitted, no throw)", () => {
    const { media } = copyAssets(root, publicDir, 1024);
    expect(media.some((m) => m.kind === "slides")).toBe(false);
  });
});

describe("copyAssets (real source folders)", () => {
  it("copies the workspace assets and catalogues all three media kinds", () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "twp-assets-real-"));
    try {
      // process.cwd() is the TWPWEB project root under vitest and next build.
      const { media, skipped } = copyAssets(process.cwd(), out);
      expect(skipped).toEqual([]); // every real asset is under the 100 MB ceiling
      for (const kind of ["infographic", "video", "slides"] as const) {
        expect(media.some((m) => m.kind === kind)).toBe(true);
      }
      // Each catalogued asset was actually written to the served path.
      for (const asset of media) {
        expect(fs.existsSync(path.join(out, asset.assetPath))).toBe(true);
      }
    } finally {
      fs.rmSync(out, { recursive: true, force: true });
    }
  });
});
