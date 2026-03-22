import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Download, RefreshCw, Zap, MousePointer, Gift, PiggyBank, 
  Lightbulb, CheckCircle, AlertCircle, HelpCircle, Bell, Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

interface HookPhase {
  id: string;
  title: string;
  titleEn: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  questions: string[];
  examples: string[];
  placeholder: string;
}

const hookPhases: HookPhase[] = [
  {
    id: "trigger",
    title: "Déclencheur",
    titleEn: "Trigger",
    icon: Bell,
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    description: "Ce qui initie le comportement de l'utilisateur. Les déclencheurs externes (notifications, emails) deviennent internes (émotions, habitudes) avec le temps.",
    questions: [
      "Quel déclencheur externe utilisez-vous pour attirer les utilisateurs ?",
      "Quelle émotion interne pousse vos utilisateurs à revenir ?",
      "Comment transformez-vous les déclencheurs externes en internes ?"
    ],
    examples: ["Notification push", "Email de rappel", "Ennui", "Solitude", "FOMO", "Curiosité"],
    placeholder: "Ex: Notification de nouveau message, sentiment de FOMO quand les amis partagent..."
  },
  {
    id: "action",
    title: "Action",
    titleEn: "Action",
    icon: MousePointer,
    color: "text-green-600",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    description: "Le comportement le plus simple en anticipation d'une récompense. Suit le modèle B=MAT (Behavior = Motivation + Ability + Trigger).",
    questions: [
      "Quelle est l'action la plus simple que fait l'utilisateur ?",
      "Comment réduisez-vous la friction pour cette action ?",
      "Quel est le temps minimal pour accomplir cette action ?"
    ],
    examples: ["Scroller le feed", "Ouvrir l'app", "Cliquer sur play", "Swiper", "Taper un message"],
    placeholder: "Ex: Ouvrir l'app et scroller le feed en moins de 2 secondes..."
  },
  {
    id: "reward",
    title: "Récompense Variable",
    titleEn: "Variable Reward",
    icon: Gift,
    color: "text-purple-600",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    description: "La récompense imprévisible qui maintient l'engagement. 3 types : Tribu (social), Chasse (ressources), Soi (maîtrise/accomplissement).",
    questions: [
      "Quelle récompense sociale (Tribu) offrez-vous ?",
      "Quelle récompense de ressources (Chasse) offrez-vous ?",
      "Quelle récompense d'accomplissement (Soi) offrez-vous ?"
    ],
    examples: ["Likes et commentaires", "Nouveau contenu", "Badges", "Points", "Reconnaissance", "Progression"],
    placeholder: "Ex: Nombre variable de likes, nouveaux posts découverts, sentiment d'accomplissement..."
  },
  {
    id: "investment",
    title: "Investissement",
    titleEn: "Investment",
    icon: PiggyBank,
    color: "text-orange-600",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    description: "L'effort que l'utilisateur met dans le produit, augmentant la probabilité de retour. Crée de la valeur stockée et améliore le prochain cycle.",
    questions: [
      "Quelles données l'utilisateur stocke-t-il dans votre produit ?",
      "Comment l'expérience s'améliore-t-elle avec l'usage ?",
      "Quel effort l'utilisateur fait-il pour charger le prochain déclencheur ?"
    ],
    examples: ["Profil complété", "Followers", "Contenu créé", "Préférences", "Historique", "Réputation"],
    placeholder: "Ex: Profil enrichi, liste d'amis construite, playlists créées, algorithme personnalisé..."
  }
];

interface CanvasData {
  productName: string;
  trigger: string;
  action: string;
  reward: string;
  investment: string;
}

const HookCanvasTool = () => {
  const [canvasData, setCanvasData] = useState<CanvasData>({
    productName: "",
    trigger: "",
    action: "",
    reward: "",
    investment: ""
  });
  const [activePhase, setActivePhase] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const updateField = (field: keyof CanvasData, value: string) => {
    // Limit input length for security
    const maxLength = field === 'productName' ? 100 : 1000;
    const sanitizedValue = value.slice(0, maxLength);
    setCanvasData(prev => ({ ...prev, [field]: sanitizedValue }));
  };

  const calculateProgress = () => {
    const fields = ['trigger', 'action', 'reward', 'investment'] as const;
    const filledFields = fields.filter(field => canvasData[field].trim().length > 10);
    return (filledFields.length / fields.length) * 100;
  };

  const resetCanvas = () => {
    setCanvasData({
      productName: "",
      trigger: "",
      action: "",
      reward: "",
      investment: ""
    });
    toast.success("Canvas réinitialisé");
  };

  const exportToPDF = async () => {
    if (!canvasData.productName.trim()) {
      toast.error("Veuillez entrer le nom de votre produit");
      return;
    }

    const progress = calculateProgress();
    if (progress < 50) {
      toast.error("Veuillez remplir au moins 2 phases du Hook Canvas");
      return;
    }

    // Create a printable version
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Hook Canvas - ${canvasData.productName}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; background: #fff; }
          .header { text-align: center; margin-bottom: 40px; }
          .header h1 { font-size: 28px; color: #1a1a1a; margin-bottom: 8px; }
          .header p { color: #666; font-size: 14px; }
          .product-name { font-size: 20px; color: #6366f1; font-weight: 600; margin-bottom: 30px; text-align: center; }
          .canvas-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
          .phase { border: 2px solid #e5e7eb; border-radius: 12px; padding: 20px; }
          .phase-trigger { border-color: #3b82f6; background: #eff6ff; }
          .phase-action { border-color: #22c55e; background: #f0fdf4; }
          .phase-reward { border-color: #a855f7; background: #faf5ff; }
          .phase-investment { border-color: #f97316; background: #fff7ed; }
          .phase-header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
          .phase-number { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: white; font-size: 14px; }
          .phase-trigger .phase-number { background: #3b82f6; }
          .phase-action .phase-number { background: #22c55e; }
          .phase-reward .phase-number { background: #a855f7; }
          .phase-investment .phase-number { background: #f97316; }
          .phase-title { font-weight: 600; font-size: 16px; }
          .phase-content { color: #374151; font-size: 14px; line-height: 1.6; white-space: pre-wrap; }
          .footer { margin-top: 40px; text-align: center; color: #9ca3af; font-size: 12px; }
          .cycle-arrow { text-align: center; margin: 20px 0; font-size: 24px; color: #6366f1; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🪝 Hook Canvas</h1>
          <p>Basé sur le modèle de Nir Eyal - "Hooked: How to Build Habit-Forming Products"</p>
        </div>
        <div class="product-name">📱 ${canvasData.productName}</div>
        <div class="canvas-grid">
          <div class="phase phase-trigger">
            <div class="phase-header">
              <div class="phase-number">1</div>
              <span class="phase-title">🔔 Déclencheur (Trigger)</span>
            </div>
            <div class="phase-content">${canvasData.trigger || "Non renseigné"}</div>
          </div>
          <div class="phase phase-action">
            <div class="phase-header">
              <div class="phase-number">2</div>
              <span class="phase-title">👆 Action</span>
            </div>
            <div class="phase-content">${canvasData.action || "Non renseigné"}</div>
          </div>
          <div class="phase phase-reward">
            <div class="phase-header">
              <div class="phase-number">3</div>
              <span class="phase-title">🎁 Récompense Variable</span>
            </div>
            <div class="phase-content">${canvasData.reward || "Non renseigné"}</div>
          </div>
          <div class="phase phase-investment">
            <div class="phase-header">
              <div class="phase-number">4</div>
              <span class="phase-title">💰 Investissement</span>
            </div>
            <div class="phase-content">${canvasData.investment || "Non renseigné"}</div>
          </div>
        </div>
        <div class="cycle-arrow">↻ Le cycle se répète</div>
        <div class="footer">
          <p>Généré avec StartUnUp - Formation Marketing des Startups</p>
          <p>Date: ${new Date().toLocaleDateString('fr-FR')}</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
      toast.success("PDF prêt à être imprimé/sauvegardé");
    } else {
      toast.error("Impossible d'ouvrir la fenêtre d'impression");
    }
  };

  const progress = calculateProgress();

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Zap className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Outil Interactif</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Hook Canvas Builder</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Construisez votre boucle d'engagement basée sur le modèle de Nir Eyal. 
            Remplissez chaque phase pour créer un produit qui forme des habitudes.
          </p>
        </div>

        {/* Progress Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progression du Canvas</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Débutant</span>
              <span>Intermédiaire</span>
              <span>Complet</span>
            </div>
          </CardContent>
        </Card>

        {/* Product Name */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium block mb-1">Nom de votre produit</label>
                <Input
                  value={canvasData.productName}
                  onChange={(e) => updateField('productName', e.target.value)}
                  placeholder="Ex: Instagram, Duolingo, Slack..."
                  className="font-medium"
                  maxLength={100}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hook Cycle Visualization */}
        <div ref={canvasRef} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hookPhases.map((phase, index) => {
            const PhaseIcon = phase.icon;
            const fieldValue = canvasData[phase.id as keyof CanvasData];
            const isFilled = fieldValue.trim().length > 10;
            const isActive = activePhase === phase.id;

            return (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={`h-full transition-all ${isActive ? 'ring-2 ring-primary shadow-lg' : ''} ${phase.borderColor} border-2`}
                  onFocus={() => setActivePhase(phase.id)}
                  onBlur={() => setActivePhase(null)}
                >
                  <CardHeader className={`${phase.bgColor} rounded-t-lg`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center`}>
                          <PhaseIcon className={`h-5 w-5 ${phase.color}`} />
                        </div>
                        <div>
                          <CardTitle className="text-base flex items-center gap-2">
                            <span className={`w-6 h-6 rounded-full ${phase.color.replace('text', 'bg').replace('600', '500')} text-white text-xs flex items-center justify-center font-bold`}>
                              {index + 1}
                            </span>
                            {phase.title}
                          </CardTitle>
                          <p className="text-xs text-muted-foreground">{phase.titleEn}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isFilled ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-muted-foreground/40" />
                        )}
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent side="left" className="max-w-xs">
                            <p className="text-sm">{phase.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    {/* Questions Guide */}
                    <div className="space-y-1">
                      {phase.questions.map((q, i) => (
                        <p key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                          <Lightbulb className="h-3 w-3 mt-0.5 flex-shrink-0 text-yellow-500" />
                          {q}
                        </p>
                      ))}
                    </div>

                    {/* Input */}
                    <Textarea
                      value={fieldValue}
                      onChange={(e) => updateField(phase.id as keyof CanvasData, e.target.value)}
                      placeholder={phase.placeholder}
                      className="min-h-[100px] resize-none"
                      onFocus={() => setActivePhase(phase.id)}
                      maxLength={1000}
                    />

                    {/* Examples */}
                    <div className="flex flex-wrap gap-1">
                      {phase.examples.map((example, i) => (
                        <Badge 
                          key={i} 
                          variant="outline" 
                          className="text-xs cursor-pointer hover:bg-primary/10"
                          onClick={() => {
                            const currentValue = canvasData[phase.id as keyof CanvasData];
                            if (!currentValue.includes(example)) {
                              updateField(
                                phase.id as keyof CanvasData, 
                                currentValue ? `${currentValue}, ${example}` : example
                              );
                            }
                          }}
                        >
                          + {example}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Cycle Indicator */}
        <div className="flex justify-center">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>1. Déclencheur</span>
            <span>→</span>
            <span>2. Action</span>
            <span>→</span>
            <span>3. Récompense</span>
            <span>→</span>
            <span>4. Investissement</span>
            <span className="text-primary font-medium">↻</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Button variant="outline" onClick={resetCanvas} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Réinitialiser
          </Button>
          <Button onClick={exportToPDF} className="gap-2" disabled={progress < 25}>
            <Download className="h-4 w-4" />
            Exporter en PDF
          </Button>
        </div>

        {/* Tips */}
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-6">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Conseils de Nir Eyal
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <p className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Déclencheurs internes</strong> : Visez les émotions négatives (ennui, solitude, incertitude) que votre produit soulage.</span>
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Simplicité d'action</strong> : Réduisez le nombre de clics au minimum. Le scroll infini est un exemple parfait.</span>
                </p>
              </div>
              <div className="space-y-2">
                <p className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Variabilité</strong> : La récompense doit être imprévisible. C'est le principe des machines à sous.</span>
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Valeur stockée</strong> : Plus l'utilisateur investit, plus il est difficile de partir (effet IKEA).</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default HookCanvasTool;
