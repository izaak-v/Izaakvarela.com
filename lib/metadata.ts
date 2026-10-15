import type { Metadata } from "next";
import { profile } from "@/content/profile";

export const siteTitle = `${profile.name} | ${profile.title}`;
export const siteDescription =
  "Izaak Varela is a licensed life insurance agent helping individuals and families review life insurance, final expense, mortgage protection, family protection, and living benefits options.";

export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  /** Share image path; defaults to the site-wide image. */
  image?: string;
}): Metadata {
  const image = opts.image ?? "/opengraph-image";
  const title = `${opts.title} | ${profile.name}, ${profile.title}`;
  return {
    title,
    description: opts.description,
    alternates: { canonical: opts.path },
    openGraph: { title, description: opts.description, url: opts.path, images: image },
    twitter: {
      card: "summary_large_image",
      title,
      description: opts.description,
      images: image,
    },
  };
}
