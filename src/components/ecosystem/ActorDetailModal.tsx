import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, MapPin, Mail, ShieldCheck, Calendar, Users, ExternalLink, Heart } from "lucide-react";
import { ACTOR_CATEGORY_COLORS, type EcosystemActor } from "./EcosystemActorsMap";

interface Props {
  actor: (EcosystemActor & {
    contact_email?: string | null;
    contact_phone?: string | null;
    address?: string | null;
    sectors?: string[] | null;
    founded_year?: number | null;
    team_size_range?: string | null;
  }) | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isFollowing?: boolean;
  onToggleFollow?: () => void;
}

export default function ActorDetailModal({ actor, open, onOpenChange, isFollowing, onToggleFollow }: Props) {
  if (!actor) return null;
  const color = ACTOR_CATEGORY_COLORS[actor.partner_type] || "#6366f1";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-4">
            {actor.logo_url ? (
              <img src={actor.logo_url} alt={actor.name} className="w-16 h-16 rounded-xl object-cover bg-muted" />
            ) : (
              <div className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-2xl shrink-0" style={{ background: color }}>
                {actor.name[0]}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <DialogTitle className="flex items-center gap-2 text-2xl">
                {actor.name}
                {actor.is_verified && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    <ShieldCheck className="h-3 w-3" /> Partenaire officiel
                  </span>
                )}
              </DialogTitle>
              <DialogDescription className="mt-1">
                <Badge variant="secondary" style={{ background: `${color}20`, color }} className="border-0">
                  {actor.partner_type}
                </Badge>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {actor.description && <p className="text-sm leading-relaxed text-muted-foreground">{actor.description}</p>}

          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            {actor.governorate && (
              <div className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" /><div><div className="font-medium">{actor.governorate}</div>{actor.address && <div className="text-xs text-muted-foreground">{actor.address}</div>}</div></div>
            )}
            {actor.founded_year && (
              <div className="flex items-start gap-2"><Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" /><div><div className="font-medium">Fondé en {actor.founded_year}</div></div></div>
            )}
            {actor.team_size_range && (
              <div className="flex items-start gap-2"><Users className="h-4 w-4 mt-0.5 text-muted-foreground" /><div><div className="font-medium">Équipe : {actor.team_size_range}</div></div></div>
            )}
            {actor.contact_email && (
              <div className="flex items-start gap-2"><Mail className="h-4 w-4 mt-0.5 text-muted-foreground" /><a href={`mailto:${actor.contact_email}`} className="hover:text-primary truncate">{actor.contact_email}</a></div>
            )}
          </div>

          {actor.programs_offered && actor.programs_offered.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2">Programmes proposés</h4>
              <div className="flex flex-wrap gap-2">
                {actor.programs_offered.map((p) => <Badge key={p} variant="outline">{p}</Badge>)}
              </div>
            </div>
          )}

          {actor.sectors && actor.sectors.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2">Secteurs</h4>
              <div className="flex flex-wrap gap-2">
                {actor.sectors.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2 border-t">
            {actor.website && (
              <Button asChild variant="default">
                <a href={actor.website} target="_blank" rel="noreferrer"><Globe className="h-4 w-4 mr-2" />Site officiel <ExternalLink className="h-3 w-3 ml-1" /></a>
              </Button>
            )}
            {onToggleFollow && (
              <Button variant={isFollowing ? "default" : "outline"} onClick={onToggleFollow}>
                <Heart className={`h-4 w-4 mr-2 ${isFollowing ? "fill-current" : ""}`} />{isFollowing ? "Suivi" : "Suivre"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
