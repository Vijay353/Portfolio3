import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name} | ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Typographic share card, generated at build time. */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#fafaf8",
          color: "#16181d",
        }}
      >
        <div style={{ fontSize: 26, letterSpacing: 3, textTransform: "uppercase", color: "#1d4c8f", fontWeight: 600 }}>
          {site.role}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05 }}>{site.name}</div>
          <div style={{ fontSize: 38, marginTop: 28, color: "#4f5561", lineHeight: 1.3, maxWidth: 960 }}>{site.positioning}</div>
        </div>
        <div style={{ display: "flex", gap: 48, fontSize: 26, color: "#4f5561", borderTop: "2px solid #e3e3de", paddingTop: 28 }}>
          <span>FactSet</span>
          <span>Configit</span>
          <span>University at Buffalo</span>
          <span>Third Estate Ventures</span>
        </div>
      </div>
    ),
    size,
  );
}
