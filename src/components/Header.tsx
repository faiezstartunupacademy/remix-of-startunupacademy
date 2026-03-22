import { useState } from "react";
import { useTranslation } from "react-i18next";
import MfaSetup from "@/components/MfaSetup";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, BookOpen, Users, Building2, Moon, Sun, Rocket, Shield, Search, Zap, MessageSquare, LogIn, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchDialog from "@/components/SearchDialog";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import logoStartunup from "@/assets/logo_startunup_new.png";
import { useAuth } from "@/hooks/useAuth";
import NotificationBell from "@/components/NotificationBell";

const Header = () => {
  const { t } = useTranslation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });
  const location = useLocation();
  const { isAdmin, user, signOut } = useAuth();

  const formationItems = [
    { title: "Platform Strategy", description: t("formationsPage.platformStrategyDesc"), href: "/formation/platform-strategy", icon: "🌐", color: "from-blue-500/20 to-indigo-600/10", isNew: true },
    { title: "Mental Models", description: "Super Thinking: modèles mentaux", href: "/formation/mental-models", icon: "🧠", color: "from-purple-500/20 to-indigo-600/10" },
    { title: t("formationsPage.coursesCount") + " & " + t("mvp.metrics"), description: "86 métriques, KPIs, Heatmap", href: "/formation/croissance", icon: "📈", color: "from-teal-500/20 to-teal-600/10" },
    { title: t("formationsPage.bmcVsLean"), description: t("formationsPage.bmcVsLeanDesc"), href: "/formation/bm-comparison", icon: "⚖️", color: "from-rose-500/20 to-rose-600/10" },
    { title: "Design Thinking", description: t("formations.designThinkingDesc"), href: "/formation/design-thinking", icon: "🎨", color: "from-purple-500/20 to-purple-600/10" },
    { title: "Lean Canvas", description: t("formations.leanCanvasDesc"), href: "/formation/lean-canvas", icon: "📋", color: "from-emerald-500/20 to-emerald-600/10" },
    { title: "Growth Hacking", description: t("formations.growthHackingDesc"), href: "/formation/growth-hacking", icon: "🚀", color: "from-orange-500/20 to-orange-600/10" },
    { title: t("formationsPage.businessModel"), description: t("formationsPage.businessModelDesc"), href: "/formation/business-model", icon: "💼", color: "from-blue-500/20 to-blue-600/10" },
    { title: t("formationsPage.marketingStartups"), description: t("formationsPage.marketingStartupsDesc"), href: "/formation/startup-marketing", icon: "📣", color: "from-pink-500/20 to-pink-600/10" },
    { title: t("formationsPage.operatingModel"), description: t("formationsPage.operatingModelDesc"), href: "/formation/operating-model", icon: "⚙️", color: "from-indigo-500/20 to-indigo-600/10" },
    { title: t("formationsPage.cChief"), description: t("formationsPage.cChiefDesc"), href: "/c-chief", icon: "👔", color: "from-amber-500/20 to-amber-600/10" },
    { title: t("formationsPage.aiBusiness"), description: t("formationsPage.aiBusinessDesc"), href: "/formation/ai-business", icon: "🤖", color: "from-violet-500/20 to-fuchsia-600/10", isNew: true },
  ];

  const toggleDarkMode = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center group">
          <motion.img 
            src={logoStartunup} 
            alt="StarTunUp Academy" 
            className="h-10 md:h-12 w-auto"
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            whileHover={{ scale: 1.05, rotate: 2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:flex ml-4">
          <NavigationMenuList className="gap-2">
            <NavigationMenuItem>
              <Link
                to="/startups"
                className={cn(
                  "group inline-flex h-11 w-max items-center justify-center rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 border",
                  location.pathname === "/startups" 
                    ? "bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-600 border-blue-500/30" 
                    : "hover:bg-blue-500/10 border-transparent hover:border-blue-500/20"
                )}
              >
                <Building2 className="mr-2 h-4 w-4" />
                {t("nav.foundations")}
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link
                to="/ecosysteme"
                className={cn(
                  "group inline-flex h-11 w-max items-center justify-center rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 border",
                  location.pathname === "/ecosysteme" 
                    ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-600 border-emerald-500/30" 
                    : "hover:bg-emerald-500/10 border-transparent hover:border-emerald-500/20"
                )}
              >
                <Users className="mr-2 h-4 w-4" />
                {t("nav.ecosystem")}
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-gradient-to-r from-primary/10 to-purple-500/10 hover:from-primary/20 hover:to-purple-500/20 data-[state=open]:from-primary/20 data-[state=open]:to-purple-500/20 h-11 px-5 gap-2 rounded-full font-medium transition-all border border-primary/20">
                <BookOpen className="h-4 w-4 text-primary" />
                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent font-semibold">{t("nav.formation")}</span>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <motion.ul 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid w-[550px] gap-3 p-5 md:w-[700px] md:grid-cols-2"
                >
                  {formationItems.map((item, index) => (
                    <motion.li 
                      key={item.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <NavigationMenuLink asChild>
                        <Link
                          to={item.href}
                          className={cn(
                            "block select-none space-y-1 rounded-2xl p-4 leading-none no-underline outline-none transition-all duration-300 relative",
                            `bg-gradient-to-br ${item.color} hover:shadow-lg hover:scale-[1.02]`,
                            location.pathname === item.href && "ring-2 ring-primary shadow-lg"
                          )}
                        >
                          {'isNew' in item && item.isNew && (
                            <span className="absolute top-2 right-2 px-2 py-0.5 bg-rose-500 text-white text-[10px] font-bold rounded-full">
                              NEW
                            </span>
                          )}
                          <div className="flex items-center gap-4">
                            <span className="text-3xl">{item.icon}</span>
                            <div>
                              <div className="text-sm font-bold leading-none mb-1">{item.title}</div>
                              <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </motion.li>
                  ))}
                </motion.ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link
                to="/communaute"
                className={cn(
                  "group inline-flex h-11 w-max items-center justify-center rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 border",
                  location.pathname.startsWith("/communaute")
                    ? "bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-600 border-violet-500/30" 
                    : "hover:bg-violet-500/10 border-transparent hover:border-violet-500/20"
                )}
              >
                <Users className="mr-2 h-4 w-4" />
                {t("nav.community")}
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link
                to="/marketplace"
                className={cn(
                  "group inline-flex h-11 w-max items-center justify-center rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 border",
                  location.pathname.startsWith("/marketplace")
                    ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-600 border-emerald-500/30" 
                    : "hover:bg-emerald-500/10 border-transparent hover:border-emerald-500/20"
                )}
              >
                <Rocket className="mr-2 h-4 w-4" />
                Marketplace
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full h-11 px-4 gap-2 text-muted-foreground"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-4 w-4" />
            <span className="text-sm">{t("nav.search")}</span>
            <kbd className="hidden xl:inline-flex h-5 items-center gap-0.5 rounded border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
              ⌘K
            </kbd>
          </Button>
          <NotificationBell />
          {user ? (
            <>
              <LanguageSwitcher />
              <MfaSetup />
              <span className="text-sm text-muted-foreground truncate max-w-[120px]">{user.email}</span>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full h-11 px-4 hover:bg-destructive/10 text-destructive"
                onClick={signOut}
              >
                <LogIn className="mr-2 h-4 w-4" />
                {t("nav.logout")}
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full h-11 px-4 hover:bg-primary/10"
              asChild
            >
              <Link to="/auth">
                <LogIn className="mr-2 h-4 w-4" />
                {t("nav.login")}
              </Link>
            </Button>
          )}
          {isAdmin && (
            <Button
              variant="default"
              size="sm"
              className="rounded-full h-11 px-5 bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-500/25 animate-pulse-slow border-0"
              asChild
            >
              <Link to="/admin">
                <Shield className="mr-2 h-4 w-4" />
                Admin
              </Link>
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="rounded-full h-11 w-11 hover:bg-primary/10"
          >
            <AnimatePresence mode="wait">
              {isDark ? (
                <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Sun className="h-5 w-5 text-amber-500" />
                </motion.div>
              ) : (
                <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Moon className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-3 lg:hidden">
          <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="rounded-full h-10 w-10">
            {isDark ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-10 w-10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X className="h-6 w-6" /></motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><Menu className="h-6 w-6" /></motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden border-t border-border bg-background/98 backdrop-blur-xl overflow-hidden"
          >
            <nav className="container py-6 space-y-6">
              <div className="space-y-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-3 mb-4">{t("nav.formation")}</p>
                <div className="grid grid-cols-2 gap-3">
                  {formationItems.map((item, index) => (
                    <motion.div key={item.href} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }}>
                      <Link
                        to={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex flex-col items-center gap-2 px-4 py-5 rounded-2xl transition-all duration-300",
                          `bg-gradient-to-br ${item.color}`,
                          location.pathname === item.href && "ring-2 ring-primary"
                        )}
                      >
                        <span className="text-3xl">{item.icon}</span>
                        <span className="font-semibold text-sm text-center">{item.title}</span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                  <Link to="/startups" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-muted/50 transition-all">
                    <div className="p-2.5 rounded-xl bg-blue-500/10"><Building2 className="h-5 w-5 text-blue-500" /></div>
                    <span className="font-medium">{t("nav.foundations")}</span>
                  </Link>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
                  <Link to="/ecosysteme" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-muted/50 transition-all">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10"><Users className="h-5 w-5 text-emerald-500" /></div>
                    <span className="font-medium">{t("nav.ecosystem")}</span>
                  </Link>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.28 }}>
                  <Link to="/communaute" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-muted/50 transition-all">
                    <div className="p-2.5 rounded-xl bg-violet-500/10"><Users className="h-5 w-5 text-violet-500" /></div>
                    <span className="font-medium">{t("nav.community")}</span>
                  </Link>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.32 }}>
                  <Link to="/marketplace" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-muted/50 transition-all">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10"><Rocket className="h-5 w-5 text-emerald-500" /></div>
                    <span className="font-medium">Marketplace</span>
                  </Link>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                  <Link to="/c-chief" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-muted/50 transition-all">
                    <div className="p-2.5 rounded-xl bg-amber-500/10"><Rocket className="h-5 w-5 text-amber-500" /></div>
                    <span className="font-medium">C-CHIEF</span>
                  </Link>
                </motion.div>
              </div>

              <motion.div className="flex flex-col gap-3 pt-4 border-t border-border" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                {user ? (
                  <>
                    <p className="text-sm text-muted-foreground text-center truncate">{user.email}</p>
                    <Button variant="outline" className="w-full rounded-full h-12 font-medium" onClick={() => { signOut(); setMobileMenuOpen(false); }}>
                      <LogIn className="mr-2 h-4 w-4" />
                      {t("nav.logout")}
                    </Button>
                  </>
                ) : (
                  <Button variant="default" className="w-full rounded-full h-12 font-medium" asChild>
                    <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                      <LogIn className="mr-2 h-4 w-4" />
                      {t("nav.login")}
                    </Link>
                  </Button>
                )}
                {isAdmin && (
                  <Button variant="default" className="w-full rounded-full h-12 font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/25 border-0" asChild>
                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                      <Shield className="mr-2 h-4 w-4" />
                      Admin
                    </Link>
                  </Button>
                )}
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
    <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
};

export default Header;
