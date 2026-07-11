// ogImage.ts — resolves CMS-managed photo paths into properly sized,
// cropped Open Graph share images (1200x630 JPEG) at build time.
//
// Uses the same import.meta.glob pattern as SmartImage.astro to turn a
// content-collection string path (e.g. "/src/assets/uploads/photo.jpg")
// into an actual Vite-imported image module Astro can optimize.

import { getImage } from "astro:assets";
import type { ImageMetadata } from "astro";

const images = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/**/*.{jpeg,jpg,png,gif,webp,avif}"
);

/**
 * Resolves a photo path into a cropped 1200x630 share image URL.
 * Returns the path unchanged if it can't be resolved (e.g. already a
 * public/ path), and undefined if no path was given — in which case
 * Layout.astro's own "/logo.png" fallback takes over.
 */
export async function resolveOgImage(src?: string | null): Promise<string | undefined> {
  if (!src) return undefined;

  const key = src.startsWith("/") ? src : `/${src}`;
  const loader = images[key];
  if (!loader) return src;

  const { default: metadata } = await loader();
  const optimized = await getImage({
    src: metadata,
    width: 1200,
    height: 630,
    fit: "cover",
    format: "jpg",
    quality: 75,
  });
  return optimized.src;
}

interface StorySet {
  images?: Array<string | { img_src: string }>;
}

/** Pulls the first image out of a page's story_sets array, whichever shape it's in. */
export function firstStorySetImage(storySets?: StorySet[]): string | undefined {
  const first = storySets?.[0]?.images?.[0];
  if (!first) return undefined;
  return typeof first === "string" ? first : first.img_src;
}
