import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  interested: { label: "Intéressé", color: "bg-blue-500/10 text-blue-700 dark:text-blue-300" },
  in_dd: { label: "En DD", color: "bg-amber-500/10 text-amber-700 dark:text-amber-300" },
  committed: { label: "Engagé", color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" },
  passed: { label: "Refusé", color: "bg-muted text-muted-foreground" },
};

export default function InvestorInterests({ userId }: { userId: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, [userId]);

  async function load() {
    const { data: deals } = await supabase.from("deal_room_deals").select("id, title").eq("user_id", userId);
    const dealIds = (deals || []).map(d => d.id);
    if (dealIds.length === 0) { setItems([]); setLoading(false); return; }
    const { data } = await supabase
      .from("deal_room_investor_interests")
      .select("*")
      .in("deal_id", dealIds)
      .order("created_at", { ascending: false });
    const dealMap = Object.fromEntries((deals || []).map(d => [d.id, d.title]));
    setItems((data || []).map(i => ({ ...i, deal_title: dealMap[i.deal_id] })));
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from("deal_room_investor_interests").update({ status }).eq("id", id);
    if (error) { toast.error("Erreur"); return; }
    toast.success("Statut mis à jour");
    load();
  }

  if (loading) return <p className="text-muted-foreground">Chargement…</p>;
  if (items.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Users className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
        <p className="text-muted-foreground">Aucun investisseur intéressé pour le moment.</p>
        <p className="text-xs text-muted-foreground mt-1">Les investisseurs apparaîtront ici lorsqu'ils manifesteront leur intérêt.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {items.map(it => (
        <Card key={it.id} className="p-4 flex items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">Investisseur · {it.investor_user_id.slice(0, 8)}</div>
            <div className="text-xs text-muted-foreground">Deal : {it.deal_title}</div>
            {it.ticket_size_tnd && (
              <div className="text-xs mt-1">Ticket : <strong>{Number(it.ticket_size_tnd).toLocaleString()} TND</strong></div>
            )}
            {it.notes && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{it.notes}</p>}
          </div>
          <div className="flex items-center gap-2">
            {it.nda_signed_at && (
              <Badge variant="outline" className="gap-1 text-xs">
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> NDA {format(new Date(it.nda_signed_at), "dd/MM")}
              </Badge>
            )}
            <Select value={it.status} onValueChange={(v) => updateStatus(it.id, v)}>
              <SelectTrigger className="w-36 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(STATUS_LABEL).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Badge className={STATUS_LABEL[it.status]?.color}>{STATUS_LABEL[it.status]?.label}</Badge>
          </div>
        </Card>
      ))}
    </div>
  );
}
