import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";
import { licenses } from "@/content/licenses";

export const alt = `${profile.name}, ${profile.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const photo = profile.photo
    ? `data:image/jpeg;base64,${(await readFile(join(process.cwd(), "public", profile.photo.src))).toString("base64")}`
    : null;
  const states = licenses.filter((l) => l.status === "active").map((l) => l.state);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        gap: 64,
        padding: 72,
        background: "linear-gradient(160deg, #0f3326, #0b261c)",
        color: "#f4f1e8",
        fontFamily: "Georgia, serif",
      }}
    >
      {photo ? (
        <div
          style={{ display: "flex", padding: 12, border: "2px solid #c9a564", borderRadius: 32 }}
        >
          <img
            src={photo}
            width={360}
            height={382}
            style={{ borderRadius: 22, objectFit: "cover" }}
            alt=""
          />
        </div>
      ) : null}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 84, fontWeight: 700, color: "#ffffff", lineHeight: 1 }}>
          {profile.name}
        </div>
        <div style={{ fontSize: 40, color: "#e2c991", marginTop: 20 }}>{profile.title}</div>
        <div style={{ width: 120, height: 3, background: "#c9a564", margin: "36px 0" }} />
        <div style={{ fontSize: 28, color: "#c3cfc8", fontFamily: "sans-serif" }}>
          {`NPN ${profile.npn}${states.length ? ` · Licensed in ${states.join(", ")}` : ""}`}
        </div>
        <div style={{ fontSize: 28, color: "#c3cfc8", marginTop: 12, fontFamily: "sans-serif" }}>
          {profile.website.replace(/^https?:\/\//, "")}
        </div>
      </div>
    </div>,
    size,
  );
}
