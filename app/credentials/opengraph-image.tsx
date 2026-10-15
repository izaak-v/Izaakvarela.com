import { profile } from "@/content/profile";
import { ogSize, renderOgImage } from "@/lib/og";

export const alt = `Credentials — ${profile.name}, ${profile.title}, NPN ${profile.npn}`;
export const size = ogSize;
export const contentType = "image/png";

export default function CredentialsOpenGraphImage() {
  return renderOgImage({
    eyebrow: "Verify my credentials",
    lines: [`National Producer Number: ${profile.npn}`, "Independently verifiable through NIPR"],
  });
}
