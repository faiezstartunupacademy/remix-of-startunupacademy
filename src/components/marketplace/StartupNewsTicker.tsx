import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Newspaper, Rocket, TrendingUp, Award, DollarSign, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";

const newsTypeIcons: Record<string, React.ElementType> = {
  announcement: Newspaper,
  funding: DollarSign,
  launch: Rocket,
  milestone: Award,
  partnership: Users,
  growth: TrendingUp,
};

const newsTypeColors: Record<string, string> = {
  announcement: "bg-primary/20 text-primary",
  funding: "bg-emerald-500/20 text-emerald-600",
  launch: "bg-violet-500/20 text-violet-600",
  milestone: "bg-amber-500/20 text-amber-600",
  partnership: "bg-sky-500/20 text-sky-600",
  growth: "bg-rose-500/20 text-rose-600",
};

interface NewsItem {
  id: string;
  title: string;
  content: string | null;
  news_type: string;
  created_at: string;
  startup_name?: string;
}

const StartupNewsTicker = () => {
  const { t } = useTranslation();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      const { data } = await supabase
        .from("marketplace_news")
        .select("id, title, content, news_type, created_at, startup_id")
        .eq("is_approved", true)
        .order("created_at", { ascending: false })
        .limit(20) as any;

      if (data?.length) {
        const startupIds = [...new Set(data.map((n: any) => n.startup_id).filter(Boolean))] as string[];
        let startupMap: Record<string, string> = {};
        if (startupIds.length) {
          const { data: startups } = await supabase
            .from("marketplace_startups")
            .select("id, name")
            .in("id", startupIds);
          if (startups) {
            startupMap = Object.fromEntries(startups.map((s: any) => [s.id, s.name]));
          }
        }

        setNews(data.map((n: any) => ({
          ...n,
          startup_name: n.startup_id ? startupMap[n.startup_id] : undefined,
        })));
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    if (news.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % news.length);
    }, 5000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [news.length]);

  if (!news.length) return null;

  const current = news[currentIndex];
  const Icon = newsTypeIcons[current.news_type] || Zap;
  const colorClass = newsTypeColors[current.news_type] || "bg-primary/20 text-primary";

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-white/5">
      {/* Animated background dots */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/30"
            style={{ left: `${15 + i * 15}%`, top: `${30 + (i % 3) * 20}%` }}
            animate={{ opacity: [0.2, 0.6, 0.2], scale: [1, 1.5, 1] }}
            transition={{ duration: 2 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      <div className="container relative z-10">
        <div className="flex items-center gap-3 py-2.5">
          {/* Live indicator */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-30" />
              <span className="relative block w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Live</span>
          </div>

          <div className="w-px h-5 bg-white/10" />

          {/* News content */}
          <div className="flex-1 overflow-hidden h-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex items-center gap-2"
              >
                <Badge variant="outline" className={`${colorClass} border-0 text-[10px] px-1.5 py-0 h-5 gap-1 shrink-0`}>
                  <Icon className="h-3 w-3" />
                  {current.news_type}
                </Badge>
                {current.startup_name && (
                  <span className="text-white/90 font-semibold text-sm shrink-0">{current.startup_name}</span>
                )}
                <span className="text-white/60 text-sm truncate">{current.title}</span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress dots */}
          {news.length > 1 && (
            <div className="flex items-center gap-1 shrink-0">
              {news.slice(0, Math.min(news.length, 8)).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    i === currentIndex ? "bg-primary w-4" : "bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StartupNewsTicker;
