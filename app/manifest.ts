import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kept — Keep the promises your content makes",
    short_name: "Kept",
    description: "An evidence-backed ledger for the promises your content makes.",
    start_url: "/",
    display: "standalone",
    background_color: "#181813",
    theme_color: "#181813",
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
