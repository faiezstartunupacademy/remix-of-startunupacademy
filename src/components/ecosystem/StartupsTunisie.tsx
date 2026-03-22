import { motion } from "framer-motion";
import { 
  MapPin, 
  Users, 
  Calendar, 
  TrendingUp, 
  Leaf, 
  Cpu, 
  ShoppingBag, 
  Heart, 
  Building,
  Rocket,
  Award,
  ExternalLink
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const startups = [
  {
    name: "Expensya",
    sector: "FinTech",
    description: "Solution de gestion des notes de frais pour entreprises",
    location: "Tunis",
    founded: 2014,
    employees: "200+",
    stage: "Série B",
    icon: TrendingUp,
    color: "bg-blue-500",
  },
  {
    name: "InstaDeep",
    sector: "IA",
    description: "Intelligence artificielle et deep learning pour l'entreprise",
    location: "Tunis",
    founded: 2014,
    employees: "300+",
    stage: "Acquise par BioNTech",
    icon: Cpu,
    color: "bg-purple-500",
  },
  {
    name: "Gomycode",
    sector: "EdTech",
    description: "Bootcamp de formation au développement et data science",
    location: "Tunis",
    founded: 2017,
    employees: "100+",
    stage: "Série A",
    icon: Building,
    color: "bg-amber-500",
  },
  {
    name: "Dabchy",
    sector: "E-commerce",
    description: "Marketplace de mode de seconde main",
    location: "Tunis",
    founded: 2018,
    employees: "50+",
    stage: "Seed",
    icon: ShoppingBag,
    color: "bg-rose-500",
  },
  {
    name: "Kumulus",
    sector: "GreenTech",
    description: "Générateurs d'eau potable à partir de l'air",
    location: "Tunis",
    founded: 2018,
    employees: "30+",
    stage: "Série A",
    icon: Leaf,
    color: "bg-emerald-500",
  },
  {
    name: "Cure Bionics",
    sector: "HealthTech",
    description: "Prothèses bioniques imprimées en 3D accessibles",
    location: "Sousse",
    founded: 2017,
    employees: "20+",
    stage: "Seed",
    icon: Heart,
    color: "bg-red-500",
  },
];

const successStories = [
  {
    startup: "InstaDeep",
    achievement: "Acquisition par BioNTech pour $680M",
    year: 2023,
    description: "Plus grande exit de l'histoire des startups tunisiennes",
  },
  {
    startup: "Expensya",
    achievement: "Levée Série B de $20M",
    year: 2022,
    description: "Expansion en Europe et au Moyen-Orient",
  },
  {
    startup: "Gomycode",
    achievement: "Expansion dans 10 pays africains",
    year: 2023,
    description: "Leader de l'éducation tech en Afrique francophone",
  },
];

const sectors = [
  { name: "FinTech", count: 25, color: "bg-blue-500" },
  { name: "EdTech", count: 18, color: "bg-amber-500" },
  { name: "HealthTech", count: 15, color: "bg-red-500" },
  { name: "GreenTech", count: 22, color: "bg-emerald-500" },
  { name: "E-commerce", count: 30, color: "bg-rose-500" },
  { name: "IA & Data", count: 12, color: "bg-purple-500" },
];

const StartupsTunisie = () => {
  return (
    <div className="space-y-8">
      {/* Stats Section */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="pt-6">
          <h4 className="font-semibold mb-4 text-lg">L'écosystème startup tunisien en chiffres (2026)</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">1 500+</p>
              <p className="text-sm text-muted-foreground">Startups labellisées</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">$220M+</p>
              <p className="text-sm text-muted-foreground">Levées de fonds (2026)</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">30K+</p>
              <p className="text-sm text-muted-foreground">Emplois créés</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">42%</p>
              <p className="text-sm text-muted-foreground">Startups fondées par des femmes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="phares" className="space-y-6">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
          <TabsTrigger value="phares" className="flex items-center gap-2">
            <Rocket className="h-4 w-4" />
            Phares
          </TabsTrigger>
          <TabsTrigger value="success" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Success Stories
          </TabsTrigger>
          <TabsTrigger value="secteurs" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Secteurs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="phares" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {startups.map((startup, index) => (
              <motion.div
                key={startup.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full hover:shadow-lg transition-all group border-2 hover:border-primary/30">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl ${startup.color}/10`}>
                        <startup.icon className={`h-6 w-6 ${startup.color.replace('bg-', 'text-')}`} />
                      </div>
                      <Badge variant="secondary">{startup.stage}</Badge>
                    </div>

                    <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                      {startup.name}
                    </h3>
                    <p className="text-sm text-primary font-medium mb-3">{startup.sector}</p>
                    <p className="text-sm text-muted-foreground mb-4">{startup.description}</p>

                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {startup.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {startup.founded}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {startup.employees}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="success" className="space-y-6">
          <div className="grid gap-6">
            {successStories.map((story, index) => (
              <motion.div
                key={story.startup}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden border-2 hover:border-primary/30 transition-all">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="bg-gradient-to-br from-primary/20 to-accent/20 p-8 flex items-center justify-center md:w-48">
                        <div className="text-center">
                          <Award className="h-12 w-12 text-primary mx-auto mb-2" />
                          <p className="font-bold text-primary">{story.year}</p>
                        </div>
                      </div>
                      <div className="flex-1 p-6">
                        <h3 className="text-2xl font-bold mb-2">{story.startup}</h3>
                        <p className="text-lg text-primary font-medium mb-2">{story.achievement}</p>
                        <p className="text-muted-foreground">{story.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="secteurs" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sectors.map((sector, index) => (
              <motion.div
                key={sector.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-all border-2 hover:border-primary/30">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${sector.color}`} />
                        <span className="font-bold">{sector.name}</span>
                      </div>
                      <Badge variant="outline" className="text-lg font-bold">
                        {sector.count}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StartupsTunisie;