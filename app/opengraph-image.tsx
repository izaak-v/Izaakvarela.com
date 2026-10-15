import { profile } from "@/content/profile";
import { ogSize, renderOgImage } from "@/lib/og";

export const alt = `${profile.name}, ${profile.title}`;
export const size = ogSize;
export const contentType = "image/png";

export default function OpenGraphImage() {
  const site = profile.website.replace(/^https?:\/\//, "");
  return renderOgImage({
    lines: [
      profile.phone ? `${profile.phone.display} · ${site}` : site,
      `NPN ${profile.npn} · Verifiable on NIPR`,
    ],
  });
}
