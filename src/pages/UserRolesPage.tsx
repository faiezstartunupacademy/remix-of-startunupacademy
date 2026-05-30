import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Briefcase, GraduationCap, Network, Rocket, Crown, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUserRoles, RoleType, ROLE_LABELS, ROLE_DESCRIPTIONS } from "@/hooks/useUserRoles";
import { useToast } from "@/hooks/use-toast";

const ICONS: Record<RoleType, any> = {
  startuper: Rocket,
  mentor: GraduationCap,
  investor: Briefcase,
  incubator: Network,
};

const ALL_ROLES: RoleType[] = ["startuper", "mentor", "investor", "incubator"];

const UserRolesPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const { roles, addRole, removeRole, setPrimary, loading } = useUserRoles(userId);
  const [working, setWorking] = useState<RoleType | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }
      setUserId(user.id);
    })();
  }, [navigate]);

  const toggleRole = async (role: RoleType, enabled: boolean) => {
    setWorking(role);
    if (enabled) {
      const err = await addRole(role);
      if (err) toast({ title: "Erreur", description: err.message, variant: "destructive" });
      else toast({ title: `Rôle ${ROLE_LABELS[role]} activé` });
    } else {
      if (roles.length <= 1) {
        toast({ title: "Action impossible", description: "Vous devez conserver au moins un rôle actif.", variant: "destructive" });
        setWorking(null);
        return;
      }
      await removeRole(role);
      toast({ title: `Rôle ${ROLE_LABELS[role]} désactivé` });
    }
    setWorking(null);
  };

  const promote = async (role: RoleType) => {
    await setPrimary(role);
    toast({ title: `${ROLE_LABELS[role]} défini comme rôle principal` });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl py-8 space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/mission-control")}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Mission Control
          </Button>
        </div>

        <div>
          <h1 className="text-2xl font-bold">Mes rôles sur la plateforme</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Activez plusieurs casquettes pour adapter Mission Control à vos besoins. Vous pouvez basculer entre les rôles à tout moment.
          </p>
        </div>

        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-4 text-sm space-y-1.5">
            <p className="font-semibold">Comment fonctionnent les rôles ?</p>
            <ul className="text-muted-foreground space-y-1 list-disc pl-5">
              <li>Le <b>rôle principal</b> détermine la vue par défaut à l'ouverture de Mission Control.</li>
              <li>Basculez d'un rôle à l'autre via le <b>sélecteur en haut</b> du cockpit — votre choix est mémorisé.</li>
              <li>Activer ou désactiver un rôle ne supprime <b>jamais</b> vos données associées.</li>
            </ul>
          </CardContent>
        </Card>


        {loading ? (
          <p className="text-sm text-muted-foreground">Chargement…</p>
        ) : (
          <div className="grid gap-4">
            {ALL_ROLES.map(role => {
              const active = roles.find(r => r.role_type === role);
              const Icon = ICONS[role];
              return (
                <Card key={role} className={active ? "border-primary/40" : ""}>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="h-11 w-11 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base flex items-center gap-2">
                          {ROLE_LABELS[role]}
                          {active?.is_primary && (
                            <Badge variant="secondary" className="gap-1"><Crown className="h-3 w-3 text-amber-500" /> Principal</Badge>
                          )}
                        </CardTitle>
                        <CardDescription>{ROLE_DESCRIPTIONS[role]}</CardDescription>
                      </div>
                      <Switch
                        checked={!!active}
                        disabled={working === role}
                        onCheckedChange={(v) => toggleRole(role, v)}
                      />
                    </div>
                  </CardHeader>
                  {active && !active.is_primary && (
                    <CardContent className="pt-0">
                      <Button size="sm" variant="outline" onClick={() => promote(role)} className="gap-1">
                        <Crown className="h-3 w-3" /> Définir comme principal
                      </Button>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        <Card className="bg-muted/30 border-dashed">
          <CardContent className="p-4 text-xs text-muted-foreground space-y-1">
            <p>• Activer le rôle <b>Mentor</b> crée automatiquement votre fiche dans l'annuaire des mentors.</p>
            <p>• Retirer un rôle désactive l'accès aux fonctionnalités correspondantes (vos données restent conservées).</p>
            <p>• Le rôle principal détermine la vue par défaut à l'ouverture de Mission Control.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserRolesPage;
