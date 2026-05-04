import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Crown, Lock, Search, ShieldCheck, UserCheck, UserX, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const OWNER_EMAILS = ["faiez.ghorbel@gmail.com", "faiezghorbel6@gmail.com"];
const isOwnerEmail = (email: string | null) => !!email && OWNER_EMAILS.includes(email);

interface AccountRow {
  user_id: string;
  email: string | null;
  full_name: string | null;
  role: "admin" | "user";
  created_at: string | null;
}

const AccountsManager = () => {
  const [rows, setRows] = useState<AccountRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("get_users_with_roles");
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      setRows((data as AccountRow[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const setRole = async (userId: string, email: string | null, role: "admin" | "user") => {
    if (role === "admin" && !isOwnerEmail(email)) {
      toast({
        title: "Action interdite",
        description: `Le rôle administrateur est réservé aux comptes propriétaires (${OWNER_EMAILS.join(", ")}).`,
        variant: "destructive",
      });
      return;
    }
    setUpdating(userId);
    const { error } = await supabase
      .from("user_roles")
      .upsert({ user_id: userId, role }, { onConflict: "user_id,role" });
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Rôle mis à jour" });
      await load();
    }
    setUpdating(null);
  };

  const filtered = rows.filter(
    (r) =>
      r.email?.toLowerCase().includes(search.toLowerCase()) ||
      r.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  const adminCount = rows.filter((r) => r.role === "admin").length;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Gestion des comptes
            </CardTitle>
            <CardDescription>
              Comptes propriétaires : <span className="font-mono">{OWNER_EMAILS.join(", ")}</span> — seuls autorisés en tant qu'administrateurs.
              {" "}
              <Badge variant="secondary" className="ml-2">
                {adminCount} admin / {rows.length} comptes
              </Badge>
            </CardDescription>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par email/nom"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Inscription</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Aucun compte trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((r) => {
                    const isOwner = isOwnerEmail(r.email);
                    return (
                      <TableRow key={r.user_id}>
                        <TableCell className="font-mono text-xs">
                          {r.email || "—"}
                          {isOwner && (
                            <Badge className="ml-2 bg-amber-500">
                              <Crown className="h-3 w-3 mr-1" /> Owner
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{r.full_name || "—"}</TableCell>
                        <TableCell>
                          <Badge
                            variant={r.role === "admin" ? "default" : "secondary"}
                            className={r.role === "admin" ? "bg-amber-500" : ""}
                          >
                            {r.role === "admin" ? (
                              <><Crown className="h-3 w-3 mr-1" /> Admin</>
                            ) : (
                              <><UserCheck className="h-3 w-3 mr-1" /> Utilisateur</>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {r.created_at ? new Date(r.created_at).toLocaleDateString("fr-FR") : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={!isOwner || r.role === "admin" || updating === r.user_id}
                              onClick={() => setRole(r.user_id, r.email, "admin")}
                              title={!isOwner ? "Réservé au compte propriétaire" : "Promouvoir admin"}
                            >
                              {!isOwner ? <Lock className="h-3 w-3 mr-1" /> : <Crown className="h-3 w-3 mr-1" />}
                              Admin
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={isOwner || r.role === "user" || updating === r.user_id}
                              onClick={() => setRole(r.user_id, r.email, "user")}
                              title={isOwner ? "Le propriétaire ne peut être rétrogradé" : "Rétrograder"}
                            >
                              <UserX className="h-3 w-3 mr-1" /> Utilisateur
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AccountsManager;
