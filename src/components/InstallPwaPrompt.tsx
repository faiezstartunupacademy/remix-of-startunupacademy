import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";
import { listenInstallPrompt } from "@/lib/pwa";

const DISMISS_KEY = "sap_pwa_install_dismissed";

export default function InstallPwaPrompt() {
  const [deferred, setDeferred] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY)) return;
    const off = listenInstallPrompt((e) => {
      setDeferred(e);
      setVisible(true);
    });
    return off;
  }, []);

  if (!visible || !deferred) return null;

  const install = async () => {
    try {
      await deferred.prompt();
      await deferred.userChoice;
    } finally {
      setVisible(false);
    }
  };

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-card border shadow-xl rounded-xl p-4 flex items-center gap-3 max-w-sm">
      <div className="text-2xl">📱</div>
      <div className="flex-1 text-sm">
        <p className="font-semibold">Installer l'app</p>
        <p className="text-muted-foreground text-xs">Accès rapide depuis votre écran d'accueil.</p>
      </div>
      <Button size="sm" onClick={install}><Download className="h-4 w-4 mr-1" />Installer</Button>
      <Button size="icon" variant="ghost" onClick={dismiss} aria-label="Fermer"><X className="h-4 w-4" /></Button>
    </div>
  );
}
