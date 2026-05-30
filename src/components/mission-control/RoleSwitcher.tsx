import { Link } from "react-router-dom";
import { Briefcase, GraduationCap, Network, Rocket, Plus, Check, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROLE_LABELS, RoleType } from "@/hooks/useUserRoles";

const ICONS: Record<RoleType, any> = {
  startuper: Rocket,
  mentor: GraduationCap,
  investor: Briefcase,
  incubator: Network,
};

interface Props {
  roles: { role_type: RoleType; is_primary: boolean }[];
  activeRole: RoleType | null;
  onChange: (r: RoleType) => void;
}

const RoleSwitcher = ({ roles, activeRole, onChange }: Props) => {
  const Active = activeRole ? ICONS[activeRole] : Rocket;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 h-9">
          <Active className="h-4 w-4 text-primary" />
          <span className="font-medium">{activeRole ? ROLE_LABELS[activeRole] : "Choisir un rôle"}</span>
          {roles.length > 1 && <Badge variant="secondary" className="text-[10px] h-4 px-1.5">{roles.length}</Badge>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Mes casquettes</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {roles.length === 0 && (
          <div className="px-2 py-3 text-xs text-muted-foreground">
            Aucun rôle configuré. Ajoutez-en un pour personnaliser votre dashboard.
          </div>
        )}
        {roles.map(r => {
          const Icon = ICONS[r.role_type];
          const isActive = r.role_type === activeRole;
          return (
            <DropdownMenuItem
              key={r.role_type}
              onClick={() => onChange(r.role_type)}
              className="gap-2 cursor-pointer"
            >
              <Icon className="h-4 w-4 text-primary" />
              <span className="flex-1">{ROLE_LABELS[r.role_type]}</span>
              {r.is_primary && <Crown className="h-3 w-3 text-amber-500" />}
              {isActive && <Check className="h-4 w-4 text-emerald-600" />}
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profil/roles" className="gap-2 cursor-pointer">
            <Plus className="h-4 w-4" />
            <span>Gérer mes rôles</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RoleSwitcher;
