"use client";

import { useEffect, useState } from "react";

export default function PWAInstaller() {
  const [deferred, setDeferred] = useState<any>(null);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const onPrompt = (e: any) => {
      e.preventDefault();
      setDeferred(e);
      setCanInstall(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    if ("serviceWorker" in navigator)
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  const install = async () => {
    if (!deferred) return;
    deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    setCanInstall(false);
  };

  if (!canInstall) return null;

  return (
    <button
      onClick={install}
      className="fixed bottom-6 right-6 rounded-xl bg-primary text-primary-foreground px-4 py-2 shadow-soft"
    >
      Install App
    </button>
  );
}
