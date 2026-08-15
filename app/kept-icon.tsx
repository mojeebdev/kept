import { ImageResponse } from "next/og";

export function createKeptIcon(size: number) {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#181813",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            background: "#F8F4EA",
            borderRadius: Math.round(size * 0.16),
            display: "flex",
            height: Math.round(size * 0.66),
            justifyContent: "center",
            position: "relative",
            width: Math.round(size * 0.66),
          }}
        >
          <div
            style={{
              background: "#24745F",
              borderRadius: "50%",
              height: Math.round(size * 0.095),
              left: Math.round(size * 0.085),
              position: "absolute",
              top: Math.round(size * 0.085),
              width: Math.round(size * 0.095),
            }}
          />
          <span
            style={{
              color: "#181813",
              fontFamily: "Georgia, serif",
              fontSize: Math.round(size * 0.46),
              fontWeight: 700,
              lineHeight: 1,
              marginTop: Math.round(size * 0.045),
            }}
          >
            K
          </span>
        </div>
      </div>
    ),
    { height: size, width: size },
  );
}
