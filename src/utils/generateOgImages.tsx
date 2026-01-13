import satori, { type SatoriOptions } from "satori";
import { Resvg } from "@resvg/resvg-js";
import { type CollectionEntry } from "astro:content";
import postOgImage from "./og-templates/post";
import siteOgImage from "./og-templates/site";

const fetchFonts = async () => {
  try {
    // Regular Font
    const fontFileRegular = await fetch(
      "https://www.1001fonts.com/download/font/ibm-plex-mono.regular.ttf",
      { signal: AbortSignal.timeout(5000) }
    );
    const fontRegular: ArrayBuffer = await fontFileRegular.arrayBuffer();

    // Bold Font
    const fontFileBold = await fetch(
      "https://www.1001fonts.com/download/font/ibm-plex-mono.bold.ttf",
      { signal: AbortSignal.timeout(5000) }
    );
    const fontBold: ArrayBuffer = await fontFileBold.arrayBuffer();

    return { fontRegular, fontBold };
  } catch (error) {
    console.warn(
      "Failed to fetch fonts from 1001fonts.com, using fallback:",
      error
    );
    // Return empty buffers as fallback
    return {
      fontRegular: new ArrayBuffer(0),
      fontBold: new ArrayBuffer(0),
    };
  }
};

const { fontRegular, fontBold } = await fetchFonts();

const options: SatoriOptions = {
  width: 1200,
  height: 630,
  embedFont: true,
  fonts:
    fontRegular.byteLength > 0
      ? [
          {
            name: "IBM Plex Mono",
            data: fontRegular,
            weight: 400,
            style: "normal",
          },
          {
            name: "IBM Plex Mono",
            data: fontBold,
            weight: 600,
            style: "normal",
          },
        ]
      : [],
};

function svgBufferToPngBuffer(svg: string) {
  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  return pngData.asPng();
}

export async function generateOgImageForPost(post: CollectionEntry<"blog">) {
  if (fontRegular.byteLength === 0) {
    // Return a simple placeholder PNG when fonts are unavailable
    console.warn(
      "Fonts not available, skipping OG image generation for post:",
      post.data.title
    );
    return new Uint8Array(0);
  }
  const svg = await satori(postOgImage(post), options);
  return svgBufferToPngBuffer(svg);
}

export async function generateOgImageForSite() {
  if (fontRegular.byteLength === 0) {
    // Return a simple placeholder PNG when fonts are unavailable
    console.warn("Fonts not available, skipping OG image generation for site");
    return new Uint8Array(0);
  }
  const svg = await satori(siteOgImage(), options);
  return svgBufferToPngBuffer(svg);
}
