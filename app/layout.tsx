import type { Metadata, Viewport } from "next";
import { DM_Sans, IBM_Plex_Mono, Instrument_Serif } from "next/font/google";
import { AuthProvider } from "@/components/auth/auth-provider";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Kept — Keep the promises your content makes",
    template: "%s | Kept",
  },
  description:
    "Kept turns public creator promises into a private, evidence-backed ledger and helps you write the follow-up that closes the loop.",
  applicationName: "Kept",
  keywords: ["creator follow-up", "content promises", "evidence-backed", "accountability", "content workflow"],
  formatDetection: {
    address: false,
    email: false,
    telephone: false,
  },
  openGraph: {
    title: "Kept — Keep the promises your content makes",
    description: "Turn public creator promises into an evidence-backed ledger and write the follow-up that closes the loop.",
    locale: "en_US",
    siteName: "Kept",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kept — Keep the promises your content makes",
    description: "Turn public creator promises into an evidence-backed ledger and write the follow-up that closes the loop.",
  },
  robots: {
    follow: true,
    index: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Kept",
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#181813",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${instrumentSerif.variable} ${plexMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
