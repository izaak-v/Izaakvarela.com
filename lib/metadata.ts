import type { Metadata } from "next";
import { profile } from "@/content/profile";

export const siteTitle = `${profile.name} | ${profile.title}`;
export const siteDescription =
  "Licensed life insurance agent helping individuals and families review life insurance, final expense, mortgage protection, and family protection options.";

export function pageMetadata(opts: { title: string; description: string; path: string }): Metadata {
  const title = `${opts.title} | ${profile.name}, ${profile.title}`;
  return {
    title,
    description: opts.description,
    alternates: { canonical: opts.path },
    openGraph: { title, description: opts.description, url: opts.path, images: "/opengraph-image" },
    twitter: {
      card: "summary_large_image",
      title,
      description: opts.description,
      images: "/opengraph-image",
    },
  };
}
