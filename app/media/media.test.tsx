import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import type { CopyAssetsResult } from "@/content/assets";
import {
  InfographicsGallery,
  type GalleryInfographic,
} from "@/components/infographics-gallery";

// Unit tests for media interactions (task 6.6). Covers:
//  - Infographic lightbox open (Req 8.3)
//  - Video player renders with controls + preload="none" (Req 9.1, 9.3)
//  - Slide entries expose a download link (Req 10.2)
//
// The video and slides routes are pure server components that read their data
// from the build-time `copyAssets()` manifest. We mock that manifest so the
// tests are deterministic and free of filesystem side effects; the assertions
// then exercise the actual rendered markup the Visitor receives.

const MOCK_ASSETS: CopyAssetsResult = {
  media: [
    {
      kind: "video",
      title: "The Witness Protocol",
      assetPath: "/assets/videos/The_Witness_Protocol.mp4",
    },
    {
      kind: "video",
      title: "Architecting Moral Inheritance",
      assetPath: "/assets/videos/Architecting_Moral_Inheritance.mp4",
    },
    {
      kind: "slides",
      title: "The Witness Protocol",
      assetPath: "/assets/slides/The_Witness_Protocol.pptx",
    },
    {
      kind: "slides",
      title: "The Witness Protocol Blueprint",
      assetPath: "/assets/slides/The_Witness_Protocol_Blueprint.pptx",
    },
  ],
  copied: [],
  skipped: [],
};

vi.mock("@/content/assets", () => ({
  copyAssets: () => MOCK_ASSETS,
}));

describe("InfographicsGallery lightbox (Req 8.3)", () => {
  const infographics: GalleryInfographic[] = [
    {
      title: "Witness Protocol Framework",
      alt: "Witness Protocol Framework",
      assetPath: "/assets/infographics/framework.png",
    },
    {
      title: "Pipeline Architecture",
      alt: "Pipeline Architecture",
      assetPath: "/assets/infographics/pipeline.png",
    },
  ];

  it("renders no enlarged lightbox until an infographic is selected", () => {
    render(<InfographicsGallery infographics={infographics} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens an enlarged lightbox view of the selected infographic", () => {
    render(<InfographicsGallery infographics={infographics} />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /enlarge infographic: pipeline architecture/i,
      }),
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    // The enlarged image shown is the one that was selected.
    const enlarged = within(dialog).getByRole("img", {
      name: "Pipeline Architecture",
    });
    expect(enlarged).toHaveAttribute(
      "src",
      "/assets/infographics/pipeline.png",
    );
  });

  it("closes the lightbox via the close control", () => {
    render(<InfographicsGallery infographics={infographics} />);
    fireEvent.click(
      screen.getByRole("button", {
        name: /enlarge infographic: witness protocol framework/i,
      }),
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: /close enlarged view/i }),
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("VideosPage player (Req 9.1, 9.3)", () => {
  it("renders an HTML5 video player with controls and preload=\"none\" per video", async () => {
    const { default: VideosPage } = await import("./videos/page");
    const { container } = render(<VideosPage />);

    const players = container.querySelectorAll("video");
    // One player per video asset in the manifest.
    expect(players).toHaveLength(2);

    for (const player of players) {
      // controls present (Req 9.1) and media deferred until play (Req 9.3).
      expect(player).toHaveAttribute("controls");
      expect(player).toHaveAttribute("preload", "none");
      // Source points at the served asset path.
      const source = player.querySelector("source");
      expect(source).toHaveAttribute("type", "video/mp4");
      expect(source?.getAttribute("src")).toMatch(/^\/assets\/videos\/.+\.mp4$/);
    }
  });
});

describe("SlidesPage download links (Req 10.2)", () => {
  it("renders one download link per slide deck pointing at the served .pptx", async () => {
    const { default: SlidesPage } = await import("./slides/page");
    render(<SlidesPage />);

    const downloadLinks = screen.getAllByRole("link", { name: /download/i });
    expect(downloadLinks).toHaveLength(2);

    for (const link of downloadLinks) {
      // Native download affordance with a served PPTX path.
      expect(link).toHaveAttribute("download");
      expect(link.getAttribute("href")).toMatch(/^\/assets\/slides\/.+\.pptx$/);
    }
  });
});
