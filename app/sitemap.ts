import type { MetadataRoute } from "next";
import { profile } from "@/content/profile";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/credentials", "/schedule", "/contact", "/privacy", "/terms"].map((path) => ({
    url: `${profile.website}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : path === "/credentials" ? 0.8 : 0.5,
  }));
}
