import { motion } from "framer-motion";
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  FileCheck, 
  BookOpen,
  Presentation,
  ClipboardList,
  BarChart3,
  Target,
  Lightbulb,
  Recycle,
  Leaf,
  Users,
  Settings,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: "pdf" | "excel" | "docx" | "template";
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  size?: string;
  color: string;
}

const resources: Resource[] = [
  // Business Model Resources
  {
    id: "R1",
    title: "Template Business Model Canvas (A4/A0)",
    description: "Canvas complet avec guide de remplissage pour structurer votre modèle économique",
    type: "pdf",
    category: "Business Model",
    icon: FileText,
    size: "2.4 MB",
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20"
  },
  {
    id: "R2",
    title: "Must Have Business Models - 114 Patterns",
    description: "Tableau Excel complet des 60 patterns Navigator, 45 patterns Durables et 9 métriques investisseurs avec définitions et KPIs",
    type: "excel",
    category: "Business Model",
    icon: FileSpreadsheet,
    size: "1.8 MB",
    color: "bg-green-500/10 text-green-600 border-green-500/20"
  },
  {
    id: "R3",
    title: "Tableau KPI (Financier/Client/Opérationnel)",
    description: "Dashboard Excel pour suivre vos indicateurs clés de performance par catégorie",
    type: "excel",
    category: "Business Model",
    icon: BarChart3,
    size: "856 KB",
    color: "bg-green-500/10 text-green-600 border-green-500/20"
  },
  {
    id: "R4",
    title: "Green Business Canvas",
    description: "Canvas adapté à l'entrepreneuriat vert avec intégration des impacts environnementaux et sociaux",
    type: "pdf",
    category: "Entrepreneuriat Vert",
    icon: Leaf,
    size: "3.1 MB",
    color: "bg-primary/10 text-primary border-primary/20"
  },
  {
    id: "R5",
    title: "Tableau de Bord ESG",
    description: "Suivi des indicateurs Environnement, Social, Gouvernance avec visualisations et benchmarks",
    type: "excel",
    category: "Entrepreneuriat Vert",
    icon: FileSpreadsheet,
    size: "1.2 MB",
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
  }
];

const getTypeLabel = (type: Resource["type"]) => {
  switch (type) {
    case "pdf": return "PDF";
    case "excel": return "Excel";
    case "docx": return "Word";
    case "template": return "Template";
  }
};

const getTypeColor = (type: Resource["type"]) => {
  switch (type) {
    case "pdf": return "bg-red-500/10 text-red-600";
    case "excel": return "bg-green-500/10 text-green-600";
    case "docx": return "bg-blue-500/10 text-blue-600";
    case "template": return "bg-purple-500/10 text-purple-600";
  }
};

interface DownloadableResourcesProps {
  category?: string;
  showTitle?: boolean;
  maxItems?: number;
}

const DownloadableResources = ({ category, showTitle = true, maxItems }: DownloadableResourcesProps) => {
  const filteredResources = category 
    ? resources.filter(r => r.category === category)
    : resources;
  
  const displayedResources = maxItems 
    ? filteredResources.slice(0, maxItems) 
    : filteredResources;

  const categories = [...new Set(resources.map(r => r.category))];

  const handleDownload = (resource: Resource) => {
    // In a real app, this would trigger a file download
    console.log(`Downloading: ${resource.title}`);
    // For demo purposes, show a toast or alert
    alert(`Le téléchargement de "${resource.title}" commencerait ici dans une application réelle.`);
  };

  return (
    <section className="py-12">
      {showTitle && (
        <div className="text-center mb-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-4"
          >
            📥 Ressources Téléchargeables
          </motion.h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Documents complémentaires pour approfondir et mettre en pratique vos apprentissages
          </p>
        </div>
      )}

      {!category && (
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((cat) => (
            <Badge key={cat} variant="outline" className="px-4 py-2">
              {cat}
            </Badge>
          ))}
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedResources.map((resource, index) => {
          const IconComponent = resource.icon;
          return (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`h-full hover:shadow-elevated transition-all duration-300 border ${resource.color.split(' ')[2] || 'border-border'}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className={`p-3 rounded-xl ${resource.color.split(' ').slice(0, 2).join(' ')}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <Badge className={getTypeColor(resource.type)} variant="secondary">
                      {getTypeLabel(resource.type)}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight mt-3">
                    {resource.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {resource.description}
                  </p>
                  <div className="flex items-center justify-between">
                    {resource.size && (
                      <span className="text-xs text-muted-foreground">
                        {resource.size}
                      </span>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="ml-auto gap-2"
                      onClick={() => handleDownload(resource)}
                    >
                      <Download className="h-4 w-4" />
                      Télécharger
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {maxItems && filteredResources.length > maxItems && (
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            Voir toutes les ressources ({filteredResources.length})
          </Button>
        </div>
      )}
    </section>
  );
};

export default DownloadableResources;
