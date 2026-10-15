import { profile } from "@/content/profile";
import { ogSize, renderOgImage } from "@/lib/og";

export const alt = `Verify My Credentials — ${profile.name}, ${profile.title}`;
export const size = ogSize;
export const contentType = "image/png";

export default function CredentialsOpenGraphImage() {
  return renderOgImage({
    eyebrow: "Credentials",
    lines: [`National Producer Number ${profile.npn}`, "Independently verifiable through NIPR"],
    pill: "Verify My Credentials →",
  });
}
