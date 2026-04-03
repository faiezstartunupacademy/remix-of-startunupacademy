import { useState } from "react";
import { motion } from "framer-motion";
import { Grid3X3, Leaf, TrendingUp, BookOpen, Bot } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import BMNavigator from "./BMNavigator";
import SustainablePatterns from "./SustainablePatterns";
import BMValidation from "./BMValidation";
import BMClassifierChatbot from "./BMClassifierChatbot";
import MustHaveBM from "./MustHaveBM";
import PatternAssistant from "./PatternAssistant";

type PatternTab = "navigator" | "sustainable" | "bmv" | "musthave";

const ASSISTANT_CONFIG: Record<PatternTab, { title: string; color: string; icon: React.ReactNode; suggestions: string[] }> = {
  navigator: {
    title: "Patterns Navigator",
    color: "bg-primary",
    icon: <Grid3X3 className="h-5 w-5" />,
    suggestions: [
      "Quel pattern BM convient à une marketplace B2B ?",
      "Quelle est la différence entre Freemium et Razor & Blade ?",
      "Comment combiner Subscription et Lock-In ?",
    ],
  },
  sustainable: {
    title: "Patterns Durables",
    color: "bg-emerald-500",
    icon: <Leaf className="h-5 w-5" />,
    suggestions: [
      "Comment intégrer l'économie circulaire dans mon BM ?",
      "Quels patterns durables pour une startup tech ?",
      "Expliquez le pattern Cradle-to-Cradle.",
    ],
  },
  bmv: {
    title: "BM Validation",
    color: "bg-amber-500",
    icon: <TrendingUp className="h-5 w-5" />,
    suggestions: [
      "Comment valider mon hypothèse de pricing ?",
      "Quels tests pour mesurer le product-market fit ?",
      "Quand faut-il pivoter son Business Model ?",
    ],
  },
  musthave: {
    title: "Must Have BM",
    color: "bg-rose-500",
    icon: <BookOpen className="h-5 w-5" />,
    suggestions: [
      "Quels sont les composants essentiels d'un BM ?",
      "Comment évaluer la scalabilité de mon modèle ?",
      "Quelle structure de coûts pour un SaaS ?",
    ],
  },
};

export const PatternsSpace = () => {
  const [activeTab, setActiveTab] = useState<PatternTab>("navigator");

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as PatternTab)} className="w-full">
        <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 h-auto p-1.5 bg-muted/50 rounded-full">
          <TabsTrigger 
            value="navigator" 
            className="gap-2 py-3 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all"
          >
            <Grid3X3 className="h-4 w-4" />
            <span className="hidden sm:inline">Navigator</span>
          </TabsTrigger>
          <TabsTrigger 
            value="sustainable" 
            className="gap-2 py-3 rounded-full data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
          >
            <Leaf className="h-4 w-4" />
            <span className="hidden sm:inline">Sustainable</span>
          </TabsTrigger>
          <TabsTrigger 
            value="bmv" 
            className="gap-2 py-3 rounded-full data-[state=active]:bg-amber-500 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
          >
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">BMV</span>
          </TabsTrigger>
          <TabsTrigger 
            value="musthave" 
            className="gap-2 py-3 rounded-full data-[state=active]:bg-rose-500 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
          >
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Must Have</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="navigator" className="mt-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <BMNavigator />
          </motion.div>
        </TabsContent>

        <TabsContent value="sustainable" className="mt-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <SustainablePatterns />
          </motion.div>
        </TabsContent>

        <TabsContent value="bmv" className="mt-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <BMValidation />
          </motion.div>
        </TabsContent>

        <TabsContent value="musthave" className="mt-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <MustHaveBM />
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* BM Classifier Chatbot */}
      <BMClassifierChatbot />
    </div>
  );
};

export default PatternsSpace;
