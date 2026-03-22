import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowLeft, Users2, Map, FileText, Rocket, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PeriodicTableStartups from "@/components/PeriodicTableStartups";
import StartupActSection from "@/components/StartupActSection";
import StartupsTunisie from "@/components/ecosystem/StartupsTunisie";
import GreenEcosystem from "@/components/ecosystem/GreenEcosystem";
import DownloadAllCards from "@/components/DownloadAllCards";

const EcosystemPage = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="gradient-hero py-16 lg:py-24">
          <div className="container">
            <Link to="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors"><ArrowLeft className="h-4 w-4" />{t("common.backToHome")}</Link>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent text-sm font-medium mb-6"><Users2 className="h-4 w-4" /><span>{t("ecosystem.badge")}</span></div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{t("ecosystem.title")}</h1>
              <p className="text-lg text-white/70 mb-8">{t("ecosystem.desc")}</p>
            </motion.div>
          </div>
        </section>

        <section className="py-16">
          <div className="container">
            <div className="flex justify-end mb-4"><DownloadAllCards /></div>
            <Tabs defaultValue="mapping" className="space-y-8">
              <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-4">
                <TabsTrigger value="mapping" className="flex items-center gap-2"><Map className="h-4 w-4" /><span className="hidden sm:inline">{t("ecosystem.mappingTab")}</span></TabsTrigger>
                <TabsTrigger value="green" className="flex items-center gap-2"><Leaf className="h-4 w-4" /><span className="hidden sm:inline">{t("ecosystem.greenTab")}</span></TabsTrigger>
                <TabsTrigger value="startupact" className="flex items-center gap-2"><FileText className="h-4 w-4" /><span className="hidden sm:inline">{t("ecosystem.startupActTab")}</span></TabsTrigger>
                <TabsTrigger value="startups" className="flex items-center gap-2"><Rocket className="h-4 w-4" /><span className="hidden sm:inline">{t("ecosystem.startupsTab")}</span></TabsTrigger>
              </TabsList>
              <TabsContent value="mapping" className="space-y-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-2xl mx-auto mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">{t("ecosystem.periodicTable")}</h2>
                  <p className="text-muted-foreground">{t("ecosystem.periodicTableDesc")}</p>
                </motion.div>
                <PeriodicTableStartups />
              </TabsContent>
              <TabsContent value="green" className="space-y-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-2xl mx-auto mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">{t("ecosystem.greenTitle")}</h2>
                  <p className="text-muted-foreground">{t("ecosystem.greenDesc")}</p>
                </motion.div>
                <GreenEcosystem />
              </TabsContent>
              <TabsContent value="startupact" className="space-y-8"><StartupActSection /></TabsContent>
              <TabsContent value="startups" className="space-y-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-2xl mx-auto mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">{t("ecosystem.startupsTitle")}</h2>
                  <p className="text-muted-foreground">{t("ecosystem.startupsDesc")}</p>
                </motion.div>
                <StartupsTunisie />
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default EcosystemPage;
