import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home, Map, Calendar, FolderKanban, User } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Mobile-only bottom navigation bar (iPhone SE 375px → 428px).
 * Hidden on tablet/desktop (md+).
 */
const BottomNav = () => {
  const { t } = useTranslation();
  const location = useLocation();

  // Hide on auth-like pages and admin
  const hidden =
    location.pathname.startsWith("/auth") ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/reset-password");
  if (hidden) return null;

  const items = [
    { to: "/mission-control", icon: Home, label: t("mobileNav.home", "Accueil") },
    { to: "/roadmap", icon: Map, label: t("mobileNav.roadmap", "Roadmap") },
    { to: "/mentors", icon: Calendar, label: t("mobileNav.sessions", "Sessions") },
    { to: "/deal-room", icon: FolderKanban, label: t("mobileNav.docs", "Docs") },
    { to: "/profil/donnees", icon: User, label: t("mobileNav.profile", "Profil") },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]"
      aria-label="Navigation mobile"
    >
      <ul className="grid grid-cols-5">
        {items.map(({ to, icon: Icon, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center gap-1 py-2 text-[10px] font-medium min-h-[56px] transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              <Icon className="h-5 w-5" aria-hidden />
              <span className="truncate max-w-[64px]">{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default BottomNav;
