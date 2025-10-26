import "./globals.css";
import type { Metadata, Viewport } from "next";
import { GameProvider } from "@/components/app/GameProvider";
import PWAInstaller from "@/components/app/PWAInstaller";

// 👇 keep metadata for title, description, manifest
export const metadata: Metadata = {
  title: "Focus Overload",
  description: "A gamified focus tracker — XP, coins, quests, analytics.",
  manifest: "/manifest.json",
};

// 👇 move themeColor to viewport (this fixes the warning)
export const viewport: Viewport = {
  themeColor: "#6366f1",
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
