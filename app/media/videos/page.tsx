import type { Metadata } from "next";
import { copyAssets } from "@/content/assets";

/**
 * /media/videos — Video gallery (Req 9.1, 9.2, 9.3).
 *
 * Statically rendered: at build time `copyAssets()` copies the source MP4s into
 * `public/assets/videos/` and returns the `MediaAsset[]` manifest. This page
 * reuses that manifest as the single source of truth — it does NOT re-scan the
 * `Video` folder or re-derive titles; `title` already carries the file-name-
 * derived, human-readable label (via `videoTitleFromFileName`, Req 9.2).
 *
 * Each MP4 is embedded with a standard HTML5 `<video controls>` player (Req 9.1).
 * `preload="none"` defers loading the media data until the Visitor presses play,
 * so an unplayed video transfers no bytes beyond its DOM node (Req 9.3). No
 * lightbox or client interaction is required, so this is a pure server
 * component. Styling stays within the basalt/paper tokens — no accent hues, no
 * rounded corners (Req 18).
 */

export const metadata: Metadata = {
  title: "Videos — The Witness Protocol",
  description:
    "Watch the Witness Protocol project videos explaining the protocol, its architecture, and its alignment methodology.",
};

export default function VideosPage() {
  // Build-time manifest; keep only videos. Order is the manifest's deterministic
  // (sorted) order from copyAssets().
  const videos = copyAssets().media.filter((asset) => asset.kind === "video");

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-24">
      <header className="flex flex-col gap-6">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
          Media — Videos
        </p>
        <h1 className="text-4xl tracking-wide sm:text-5xl">Videos</h1>
        <p className="max-w-2xl text-lg leading-relaxed text-fg">
          Project videos on the Witness Protocol, its architecture, and its
          alignment methodology. Press play on any video to begin
          playback&mdash;media loads only once you start watching.
        </p>
      </header>

      {videos.length === 0 ? (
        <p className="text-base leading-relaxed text-muted">
          No videos are available yet.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-px border border-border bg-border lg:grid-cols-2">
          {videos.map((video) => (
            <li key={video.assetPath} className="flex flex-col gap-3 bg-bg p-4">
              {/* HTML5 player with controls (Req 9.1); preload="none" defers all
                  media-data loading until the Visitor initiates playback (Req 9.3). */}
              <video
                controls
                preload="none"
                className="h-auto w-full border border-border bg-bg"
                aria-label={video.title}
              >
                <source src={video.assetPath} type="video/mp4" />
                Your browser does not support the video element. You can{" "}
                <a href={video.assetPath} className="underline">
                  download the video
                </a>{" "}
                instead.
              </video>
              {/* Human-readable title derived from the file name (Req 9.2). */}
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                {video.title}
              </span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
