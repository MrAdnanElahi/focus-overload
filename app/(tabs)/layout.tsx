"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const nav = [
    { href: "/run", label: "Run" },          // ← remove (tabs)
    { href: "/dashboard", label: "Dashboard" },
    { href: "/rewards", label: "Rewards" },
  ];
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 backdrop-blur bg-background/60 border-b border-border">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <div className="font-semibold">⚡ Focus Overload</div>
          <nav className="flex gap-2">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`tab-link ${path === n.href ? "active-tab" : ""}`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
      <footer className="mx-auto max-w-5xl px-4 py-10 text-center text-xs text-muted-foreground">
        v1 — local only • PWA offline
      </footer>
    </div>
  );
}
