/**
 * Register the StartUp Academy Plus service worker.
 * CRITICAL guards:
 *  - Only in production builds
 *  - Never inside an iframe (Lovable preview runs in iframe)
 *  - Never on a Lovable preview host
 */
export function registerServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

  const isInIframe = (() => {
    try { return window.self !== window.top; } catch { return true; }
  })();

  const host = window.location.hostname;
  const isPreviewHost =
    host.includes("id-preview--") ||
    host.includes("lovableproject.com") ||
    host.includes("lovable.app") ||
    host === "localhost" ||
    host === "127.0.0.1";

  if (isInIframe || isPreviewHost) {
    // Cleanup any previously-registered SW in preview contexts
    navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((r) => r.unregister())).catch(() => {});
    return;
  }

  if (!import.meta.env.PROD) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {});
  });
}

/**
 * Hook to surface the browser's beforeinstallprompt event so an
 * "Install app" button can call it later. Returns the deferred event.
 */
export function listenInstallPrompt(onAvailable: (e: any) => void) {
  const handler = (e: any) => {
    e.preventDefault();
    onAvailable(e);
  };
  window.addEventListener("beforeinstallprompt", handler);
  return () => window.removeEventListener("beforeinstallprompt", handler);
}
