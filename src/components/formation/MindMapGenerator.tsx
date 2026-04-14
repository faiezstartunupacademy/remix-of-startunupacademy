import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { BrainCircuit, Loader2, Download, ZoomIn, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  getGeneratedVisualExtension,
  getGeneratedVisualMessage,
  type GeneratedVisualResponse,
} from "@/utils/generatedVisuals";

interface MindMapGeneratorProps {
  formations: {
    name: string;
    keyPoints: string[];
    icon: string;
  }[];
}

const INFOGRAPHIC_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-infographic`;

const MindMapGenerator = ({ formations }: MindMapGeneratorProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedFormations, setSelectedFormations] = useState<Set<number>>(new Set());

  const toggleFormation = (index: number) => {
    setSelectedFormations(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const generateMindMap = async () => {
    const selected = formations.filter((_, i) => selectedFormations.has(i));
    if (selected.length === 0) {
      toast({ title: "Sélection requise", description: "Sélectionnez au moins une formation", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    setGeneratedImages([]);

    try {
      const allKeyPoints = selected.flatMap(f => 
        f.keyPoints.map(p => `[${f.name}] ${p}`)
      );

      const combinedName = selected.length === 1 
        ? selected[0].name 
        : `Connexions: ${selected.map(f => f.name).join(" ↔ ")}`;

      const resp = await fetch(INFOGRAPHIC_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          formationName: combinedName,
          keyPoints: allKeyPoints,
          type: "mindmap",
        }),
      });

      if (!resp.ok) {
        const body = await resp.json().catch(() => ({}));
        throw new Error(body.error || "Erreur de génération");
      }

      const data: GeneratedVisualResponse = await resp.json();
      if (data.images && data.images.length > 0) {
        setGeneratedImages(data.images.filter((img: string) => img));
        toast({
          title: data.fallback ? "⚠️ Carte mentale de secours générée" : "✅ Carte mentale générée !",
          description: data.fallback
            ? getGeneratedVisualMessage(data, "La version IA n'est pas disponible pour le moment.")
            : "Vous pouvez la télécharger ci-dessous.",
        });
      } else {
        toast({
          title: data.fallback ? "Génération limitée" : "Aucune image",
          description: getGeneratedVisualMessage(data, "Réessayez"),
          variant: data.fallback ? undefined : "destructive",
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur inconnue";
      toast({ title: "Erreur", description: msg, variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = (dataUrl: string) => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `mindmap-startunup-${Date.now()}.${getGeneratedVisualExtension(dataUrl)}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <section className="py-12">
      <div className="container max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <BrainCircuit className="h-4 w-4" />
            <span>Générateur de Cartes Mentales IA</span>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-3">
            Cartes mentales scientifiques
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Sélectionnez les formations à connecter et générez une carte mentale de haute qualité 
            reliant les concepts clés, méthodologies et outils entre elles.
          </p>
        </motion.div>

        {/* Formation selector */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {formations.map((formation, index) => (
            <motion.div
              key={formation.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedFormations.has(index)
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border hover:border-primary/30"
                }`}
                onClick={() => toggleFormation(index)}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <span className="text-2xl">{formation.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">{formation.name}</p>
                    <p className="text-xs text-muted-foreground">{formation.keyPoints.length} concepts</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedFormations.has(index)
                      ? "border-primary bg-primary"
                      : "border-muted-foreground/30"
                  }`}>
                    {selectedFormations.has(index) && (
                      <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Generate button */}
        <div className="text-center mb-8">
          <Button
            size="lg"
            className="rounded-full shadow-lg gap-2 px-8"
            onClick={generateMindMap}
            disabled={isGenerating || selectedFormations.size === 0}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <BrainCircuit className="h-5 w-5" />
                Générer la carte mentale ({selectedFormations.size} formation{selectedFormations.size > 1 ? "s" : ""})
              </>
            )}
          </Button>
        </div>

        {/* Generated images */}
        {generatedImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h3 className="text-xl font-bold text-foreground mb-2">Carte mentale générée</h3>
              <p className="text-sm text-muted-foreground">Cliquez pour agrandir ou téléchargez l'image</p>
            </div>
            {generatedImages.map((imgUrl, idx) => (
              <div key={idx} className="relative group rounded-2xl overflow-hidden border border-border shadow-lg bg-background">
                <img
                  src={imgUrl}
                  alt="Mind map"
                  className="w-full h-auto cursor-pointer"
                  onClick={() => {
                    const w = window.open();
                    if (w) {
                      w.document.write(`<img src="${imgUrl}" style="max-width:100%;height:auto;" />`);
                      w.document.title = "Carte mentale STARTUNUP";
                    }
                  }}
                />
                <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-1.5 rounded-lg shadow-lg"
                    onClick={() => {
                      const w = window.open();
                      if (w) {
                        w.document.write(`<img src="${imgUrl}" style="max-width:100%;height:auto;" />`);
                      }
                    }}
                  >
                    <ZoomIn className="h-4 w-4" />
                    Agrandir
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-1.5 rounded-lg shadow-lg"
                    onClick={() => downloadImage(imgUrl)}
                  >
                    <Download className="h-4 w-4" />
                    Télécharger
                  </Button>
                </div>
              </div>
            ))}
            <div className="text-center">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 rounded-full"
                onClick={generateMindMap}
                disabled={isGenerating}
              >
                <RefreshCw className="h-4 w-4" />
                Régénérer
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default MindMapGenerator;
