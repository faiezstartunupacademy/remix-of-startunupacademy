import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, ExternalLink, Sparkles, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Suggested = {
  id: string;
  title: string;
  type: "market_intel" | "incubation" | "strategic";
  origin: string;
  createdAt: string;
  // resolution helpers
  markdown?: string | null;
  bucket?: string;
  path?: string;
};

export default function SuggestedDocuments({ userId }: { userId: string }) {
  const [items, setItems] = useState<Suggested[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const mi: any = await supabase
        .from("market_intelligence_reports")
        .select("id,title,report_type,result_markdown,created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(30);

      const list: Suggested[] = [];
      ((mi.data as any[]) || []).forEach((r: any) =>
        list.push({
          id: "mi-" + r.id,
          title: r.title,
          type: "market_intel",
          origin: `Market Intel · ${r.report_type}`,
          createdAt: r.created_at,
          markdown: r.result_markdown,
        })
      );
      list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      setItems(list);
      setLoading(false);
    })();
  }, [userId]);

  async function openItem(it: Suggested) {
    if (it.markdown !== undefined && it.markdown !== null) {
      const blob = new Blob([it.markdown || ""], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      return;
    }
    if (it.bucket && it.path) {
      const { data, error } = await supabase.storage
        .from(it.bucket)
        .createSignedUrl(it.path, 60);
      if (error || !data) {
        toast.error("Lien signé impossible");
        return;
      }
      window.open(data.signedUrl, "_blank");
    }
  }

  async function attachToDealRoom(it: Suggested) {
    try {
      const path = `${userId}/suggested/${Date.now()}-${it.title.replace(/[^\w.-]+/g, "_")}.${it.type === "market_intel" ? "md" : "pdf"}`;
      if (it.markdown !== undefined && it.markdown !== null) {
        const blob = new Blob([it.markdown || ""], { type: "text/markdown" });
        const { error: upErr } = await supabase.storage
          .from("deal-room-documents")
          .upload(path, blob, { contentType: "text/markdown" });
        if (upErr) throw upErr;
        await supabase.from("deal_room_documents").insert({
          user_id: userId,
          category: it.type === "market_intel" ? "pitch" : "traction",
          name: `${it.title}.md`,
          file_path: path,
          file_size: blob.size,
          mime_type: "text/markdown",
        });
      } else if (it.bucket && it.path) {
        // download then re-upload
        const { data: blob, error: dlErr } = await supabase.storage
          .from(it.bucket)
          .download(it.path);
        if (dlErr || !blob) throw dlErr || new Error("download failed");
        const { error: upErr } = await supabase.storage
          .from("deal-room-documents")
          .upload(path, blob, { contentType: blob.type });
        if (upErr) throw upErr;
        await supabase.from("deal_room_documents").insert({
          user_id: userId,
          category: "pitch",
          name: it.title,
          file_path: path,
          file_size: blob.size,
          mime_type: blob.type || "application/pdf",
        });
      }
      toast.success("Joint au Deal Room ✓");
    } catch (e: any) {
      toast.error(e?.message || "Échec de l'ajout");
    }
  }

  if (loading) {
    return (
      <Card className="p-4 flex items-center justify-center">
        <Loader2 className="w-4 h-4 animate-spin" />
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card className="p-4 text-sm text-muted-foreground">
        Aucun document généré en amont (Market Intelligence ou Incubation) à
        suggérer pour le moment.
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-primary" />
        <h3 className="font-semibold text-sm">
          Documents suggérés depuis vos modules amont
        </h3>
        <Badge variant="outline" className="text-xs ml-auto">
          {items.length}
        </Badge>
      </div>
      <div className="space-y-2 max-h-72 overflow-y-auto">
        {items.map((it) => (
          <div
            key={it.id}
            className="flex items-center gap-2 p-2 rounded-md border bg-muted/30"
          >
            <FileText className="w-4 h-4 text-primary shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium truncate">{it.title}</div>
              <div className="text-[10px] text-muted-foreground">
                {it.origin} ·{" "}
                {new Date(it.createdAt).toLocaleDateString("fr-FR")}
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => openItem(it)}
              title="Aperçu"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => attachToDealRoom(it)}
              className="gap-1"
            >
              <Download className="w-3.5 h-3.5" /> Joindre
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}
