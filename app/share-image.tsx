import { ImageResponse } from "next/og";

export function createShareImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#F5B6A7",
          color: "#181813",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: "72px",
          width: "100%",
        }}
      >
        <div style={{ alignItems: "center", display: "flex", fontFamily: "Georgia, serif", fontSize: 48 }}>
          <span style={{ background: "#24745F", borderRadius: "50%", height: 16, marginRight: 16, width: 16 }} />
          Kept
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 900 }}>
          <div style={{ fontFamily: "Arial, sans-serif", fontSize: 22, letterSpacing: 4, marginBottom: 24, textTransform: "uppercase" }}>
            Evidence-backed follow-through
          </div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 92, letterSpacing: -4, lineHeight: 1.02 }}>
            Keep the promises your content makes.
          </div>
        </div>
        <div style={{ alignItems: "center", display: "flex", fontFamily: "Arial, sans-serif", fontSize: 25 }}>
          <span style={{ background: "#F8D05B", height: 12, marginRight: 16, width: 88 }} />
          Source → evidence → follow-up → kept
        </div>
      </div>
    ),
    { height: 630, width: 1200 },
  );
}
