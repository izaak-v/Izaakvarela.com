/* eslint-disable @next/next/no-img-element -- ImageResponse (Satori) requires plain <img> */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const ogSize = { width: 1200, height: 630 };

/** Branded share card used for link previews (texts, email, social). */
export async function renderOgImage(opts: { eyebrow?: string; lines: string[]; pill?: string }) {
  const photo = profile.photo
    ? `data:image/jpeg;base64,${(await readFile(join(process.cwd(), "public", profile.photo.src))).toString("base64")}`
    : null;

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
        {opts.eyebrow ? (
          <div
            style={{
              fontSize: 24,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#c9a564",
              fontFamily: "sans-serif",
              marginBottom: 18,
            }}
          >
            {opts.eyebrow}
          </div>
        ) : null}
        <div style={{ fontSize: 84, fontWeight: 700, color: "#ffffff", lineHeight: 1 }}>
          {profile.name}
        </div>
        <div style={{ fontSize: 40, color: "#e2c991", marginTop: 20 }}>{profile.title}</div>
        <div style={{ width: 120, height: 3, background: "#c9a564", margin: "36px 0" }} />
        {opts.lines.map((line) => (
          <div
            key={line}
            style={{ fontSize: 28, color: "#c3cfc8", marginTop: 10, fontFamily: "sans-serif" }}
          >
            {line}
          </div>
        ))}
        {opts.pill ? (
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              marginTop: 32,
              padding: "16px 30px",
              borderRadius: 999,
              background: "#c9a564",
              color: "#0b261c",
              fontSize: 28,
              fontWeight: 700,
              fontFamily: "sans-serif",
            }}
          >
            {opts.pill}
          </div>
        ) : null}
      </div>
    </div>,
    ogSize,
  );
}
