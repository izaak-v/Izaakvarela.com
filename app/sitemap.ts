import type { MetadataRoute } from "next";
import { site } from "./site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/privacy", "/terms"].map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: "yearly",
    priority: path === "" ? 1 : 0.3,
  }));
}
