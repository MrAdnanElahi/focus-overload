import "./globals.css";
import type { Metadata, Viewport } from "next";
import { GameProvider } from "@/components/app/GameProvider";
import PWAInstaller from "@/components/app/PWAInstaller";

/** Viewport: fixes the themeColor warning and lets iOS use full screen (safe areas) */
export const viewport: Viewport = {
  themeColor: "#6366f1",
  viewportFit: "cover",
};

/** Metadata: adds icons + iOS Apple Web App meta (no manual <meta> needed) */
export const metadata: Metadata = {
  title: "Focus Overload",
  description: "A gamified focus tracker — XP, coins, quests, analytics.",
  manifest: "/manifest.json",
  icons: {
    apple: "/apple-touch-icon.png", // 180x180 for iOS Home Screen
    icon: [
      { url: "/icons/focus-icon-192.png", sizes: "192x192" },
      { url: "/icons/focus-icon-512.png", sizes: "512x512" },
    ],
  },
  appleWebApp: {
    capable: true,                   // <meta name="apple-mobile-web-app-capable" content="yes">
    statusBarStyle: "black-translucent", // <meta name="apple-mobile-web-app-status-bar-style" ...>
    title: "Focus Overload",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground">
        <GameProvider>
          {children}
          <PWAInstaller />
        </GameProvider>
      </body>
    </html>
  );
}
