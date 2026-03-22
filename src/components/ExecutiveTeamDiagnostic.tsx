import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, ChevronLeft, RotateCcw, Download, CheckCircle2,
  Users, DollarSign, TrendingUp, Code, Heart, Briefcase, Target,
  AlertTriangle, Sparkles, Building2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface DiagnosticQuestion {
  id: string;
  question: string;
  category: 'stage' | 'team' | 'challenges' | 'priorities';
  options: {
    value: string;
    label: string;
    description?: string;
    scores: Record<string, number>;
  }[];
}

interface RoleRecommendation {
  role: string;
  symbol: string;
  score: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  reasoning: string;
  icon: React.ElementType;
  color: string;
}

const diagnosticQuestions: DiagnosticQuestion[] = [
  {
    id: 'stage',
    question: "À quel stade se trouve votre startup ?",
    category: 'stage',
    options: [
      {
        value: 'pre-seed',
        label: 'Pre-Seed / Idée',
        description: 'Validation du concept, pas encore de produit',
        scores: { CEO: 5, CTO: 4, CFO: 1, CMO: 1, CRO: 0, CPO: 2, CHRO: 0, COO: 0 }
      },
      {
        value: 'seed',
        label: 'Seed / MVP',
        description: 'Premier produit, premiers clients',
        scores: { CEO: 4, CTO: 5, CFO: 2, CMO: 2, CRO: 1, CPO: 3, CHRO: 1, COO: 1 }
      },
      {
        value: 'series-a',
        label: 'Série A / PMF',
        description: 'Product-Market Fit atteint, scaling en cours',
        scores: { CEO: 3, CTO: 4, CFO: 4, CMO: 4, CRO: 4, CPO: 4, CHRO: 3, COO: 2 }
      },
      {
        value: 'series-b',
        label: 'Série B+ / Scale',
        description: 'Croissance rapide, équipe de 50+ personnes',
        scores: { CEO: 3, CTO: 3, CFO: 5, CMO: 4, CRO: 5, CPO: 4, CHRO: 5, COO: 4 }
      }
    ]
  },
  {
    id: 'team-size',
    question: "Quelle est la taille de votre équipe ?",
    category: 'team',
    options: [
      {
        value: 'solo',
        label: '1-5 personnes',
        scores: { CEO: 5, CTO: 3, CFO: 0, CMO: 1, CRO: 0, CPO: 1, CHRO: 0, COO: 0 }
      },
      {
        value: 'small',
        label: '6-20 personnes',
        scores: { CEO: 4, CTO: 4, CFO: 2, CMO: 3, CRO: 2, CPO: 3, CHRO: 2, COO: 1 }
      },
      {
        value: 'medium',
        label: '21-50 personnes',
        scores: { CEO: 3, CTO: 3, CFO: 4, CMO: 4, CRO: 4, CPO: 4, CHRO: 4, COO: 3 }
      },
      {
        value: 'large',
        label: '50+ personnes',
        scores: { CEO: 3, CTO: 3, CFO: 5, CMO: 4, CRO: 5, CPO: 4, CHRO: 5, COO: 5 }
      }
    ]
  },
  {
    id: 'funding',
    question: "Quelle est votre situation de financement ?",
    category: 'stage',
    options: [
      {
        value: 'bootstrapped',
        label: 'Bootstrapped',
        description: 'Autofinancement, pas de levée prévue',
        scores: { CEO: 4, CTO: 3, CFO: 2, CMO: 2, CRO: 3, CPO: 2, CHRO: 1, COO: 2 }
      },
      {
        value: 'raising',
        label: 'En cours de levée',
        description: 'Préparation ou négociation d\'une levée',
        scores: { CEO: 4, CTO: 3, CFO: 5, CMO: 2, CRO: 2, CPO: 2, CHRO: 1, COO: 1 }
      },
      {
        value: 'funded',
        label: 'Récemment financé',
        description: 'Levée récente, runway confortable',
        scores: { CEO: 3, CTO: 4, CFO: 3, CMO: 4, CRO: 4, CPO: 4, CHRO: 3, COO: 2 }
      },
      {
        value: 'profitable',
        label: 'Rentable / Cashflow positif',
        scores: { CEO: 3, CTO: 3, CFO: 3, CMO: 3, CRO: 4, CPO: 4, CHRO: 4, COO: 4 }
      }
    ]
  },
  {
    id: 'biggest-challenge',
    question: "Quel est votre plus grand défi actuel ?",
    category: 'challenges',
    options: [
      {
        value: 'product',
        label: 'Développer le produit',
        description: 'Features, qualité, scalabilité technique',
        scores: { CEO: 2, CTO: 5, CFO: 1, CMO: 1, CRO: 1, CPO: 5, CHRO: 1, COO: 1 }
      },
      {
        value: 'growth',
        label: 'Acquérir des clients',
        description: 'Marketing, ventes, traction',
        scores: { CEO: 2, CTO: 1, CFO: 1, CMO: 5, CRO: 5, CPO: 2, CHRO: 1, COO: 1 }
      },
      {
        value: 'hiring',
        label: 'Recruter et retenir les talents',
        description: 'Culture, recrutement, onboarding',
        scores: { CEO: 3, CTO: 2, CFO: 1, CMO: 1, CRO: 1, CPO: 1, CHRO: 5, COO: 3 }
      },
      {
        value: 'operations',
        label: 'Optimiser les opérations',
        description: 'Process, efficacité, coordination',
        scores: { CEO: 2, CTO: 2, CFO: 3, CMO: 1, CRO: 1, CPO: 2, CHRO: 2, COO: 5 }
      }
    ]
  },
  {
    id: 'revenue-model',
    question: "Quel est votre modèle de revenus principal ?",
    category: 'priorities',
    options: [
      {
        value: 'saas',
        label: 'SaaS / Abonnement',
        scores: { CEO: 3, CTO: 4, CFO: 3, CMO: 4, CRO: 4, CPO: 5, CHRO: 2, COO: 2, CCO: 5 }
      },
      {
        value: 'marketplace',
        label: 'Marketplace / Commission',
        scores: { CEO: 3, CTO: 4, CFO: 3, CMO: 5, CRO: 4, CPO: 4, CHRO: 2, COO: 4 }
      },
      {
        value: 'enterprise',
        label: 'Vente Enterprise / Grands comptes',
        scores: { CEO: 4, CTO: 3, CFO: 4, CMO: 3, CRO: 5, CPO: 3, CHRO: 2, COO: 2, CBDO: 4 }
      },
      {
        value: 'services',
        label: 'Services / Consulting',
        scores: { CEO: 4, CTO: 2, CFO: 3, CMO: 3, CRO: 4, CPO: 2, CHRO: 3, COO: 4 }
      }
    ]
  },
  {
    id: 'tech-dependency',
    question: "Quelle importance a la technologie dans votre proposition de valeur ?",
    category: 'priorities',
    options: [
      {
        value: 'core',
        label: 'Technologie = Notre produit',
        description: 'IA, deep tech, plateforme propriétaire',
        scores: { CEO: 3, CTO: 5, CFO: 2, CMO: 2, CRO: 2, CPO: 4, CHRO: 2, COO: 1, CISO: 3 }
      },
      {
        value: 'enabler',
        label: 'Technologie = Enabler',
        description: 'Tech importante mais pas le différenciateur',
        scores: { CEO: 3, CTO: 4, CFO: 3, CMO: 3, CRO: 3, CPO: 4, CHRO: 2, COO: 2 }
      },
      {
        value: 'support',
        label: 'Technologie = Support',
        description: 'Tech utile mais secondaire',
        scores: { CEO: 4, CTO: 2, CFO: 3, CMO: 4, CRO: 4, CPO: 3, CHRO: 3, COO: 3 }
      }
    ]
  },
  {
    id: 'current-gaps',
    question: "Où ressentez-vous le plus de gaps dans votre équipe ?",
    category: 'challenges',
    options: [
      {
        value: 'strategy',
        label: 'Vision & Stratégie',
        description: 'Direction floue, décisions difficiles',
        scores: { CEO: 5, CTO: 2, CFO: 3, CMO: 2, CRO: 2, CPO: 3, CHRO: 2, COO: 3 }
      },
      {
        value: 'finance',
        label: 'Finance & Fundraising',
        description: 'Comptabilité, prévisions, levées',
        scores: { CEO: 2, CTO: 1, CFO: 5, CMO: 1, CRO: 1, CPO: 1, CHRO: 1, COO: 2 }
      },
      {
        value: 'gtm',
        label: 'Go-to-Market',
        description: 'Marketing, ventes, positionnement',
        scores: { CEO: 2, CTO: 1, CFO: 1, CMO: 5, CRO: 5, CPO: 2, CHRO: 1, COO: 1 }
      },
      {
        value: 'people',
        label: 'People & Culture',
        description: 'RH, recrutement, engagement',
        scores: { CEO: 2, CTO: 1, CFO: 1, CMO: 1, CRO: 1, CPO: 1, CHRO: 5, COO: 3 }
      }
    ]
  },
  {
    id: 'founder-strengths',
    question: "Quelle est la force principale des fondateurs ?",
    category: 'team',
    options: [
      {
        value: 'technical',
        label: 'Technique / Produit',
        description: 'Ingénieurs, développeurs, designers',
        scores: { CEO: 3, CTO: 1, CFO: 4, CMO: 4, CRO: 4, CPO: 1, CHRO: 3, COO: 3 }
      },
      {
        value: 'commercial',
        label: 'Commercial / Business',
        description: 'Ventes, partenariats, négociation',
        scores: { CEO: 2, CTO: 5, CFO: 3, CMO: 3, CRO: 1, CPO: 4, CHRO: 3, COO: 2 }
      },
      {
        value: 'marketing',
        label: 'Marketing / Communication',
        description: 'Branding, contenu, acquisition',
        scores: { CEO: 3, CTO: 4, CFO: 3, CMO: 1, CRO: 4, CPO: 3, CHRO: 2, COO: 3 }
      },
      {
        value: 'operations',
        label: 'Opérations / Management',
        description: 'Process, organisation, gestion',
        scores: { CEO: 3, CTO: 4, CFO: 3, CMO: 4, CRO: 3, CPO: 3, CHRO: 2, COO: 1 }
      }
    ]
  }
];

const roleDetails: Record<string, { icon: React.ElementType; color: string; fullName: string }> = {
  CEO: { icon: Building2, color: 'bg-indigo-500', fullName: 'Chief Executive Officer' },
  CTO: { icon: Code, color: 'bg-purple-500', fullName: 'Chief Technology Officer' },
  CFO: { icon: DollarSign, color: 'bg-emerald-500', fullName: 'Chief Financial Officer' },
  CMO: { icon: TrendingUp, color: 'bg-orange-500', fullName: 'Chief Marketing Officer' },
  CRO: { icon: Target, color: 'bg-rose-500', fullName: 'Chief Revenue Officer' },
  CPO: { icon: Sparkles, color: 'bg-violet-500', fullName: 'Chief Product Officer' },
  CHRO: { icon: Heart, color: 'bg-pink-500', fullName: 'Chief Human Resources Officer' },
  COO: { icon: Briefcase, color: 'bg-slate-500', fullName: 'Chief Operating Officer' },
  CCO: { icon: Users, color: 'bg-teal-500', fullName: 'Chief Customer Officer' },
  CBDO: { icon: Users, color: 'bg-amber-500', fullName: 'Chief Business Development Officer' },
  CISO: { icon: AlertTriangle, color: 'bg-red-500', fullName: 'Chief Information Security Officer' }
};

const ExecutiveTeamDiagnostic = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const progress = ((currentQuestion + 1) / diagnosticQuestions.length) * 100;

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [diagnosticQuestions[currentQuestion].id]: value
    }));
  };

  const calculateResults = (): RoleRecommendation[] => {
    const scores: Record<string, number> = {};
    
    Object.entries(answers).forEach(([questionId, answerValue]) => {
      const question = diagnosticQuestions.find(q => q.id === questionId);
      if (question) {
        const selectedOption = question.options.find(o => o.value === answerValue);
        if (selectedOption) {
          Object.entries(selectedOption.scores).forEach(([role, score]) => {
            scores[role] = (scores[role] || 0) + score;
          });
        }
      }
    });

    const maxScore = Math.max(...Object.values(scores));
    
    return Object.entries(scores)
      .map(([role, score]) => {
        const normalizedScore = Math.round((score / maxScore) * 100);
        const details = roleDetails[role] || { icon: Users, color: 'bg-gray-500', fullName: role };
        
        let priority: 'critical' | 'high' | 'medium' | 'low';
        let reasoning: string;
        
        if (normalizedScore >= 85) {
          priority = 'critical';
          reasoning = 'Rôle essentiel pour votre stade actuel. À recruter en priorité absolue.';
        } else if (normalizedScore >= 70) {
          priority = 'high';
          reasoning = 'Rôle important qui comblera des gaps significatifs dans votre équipe.';
        } else if (normalizedScore >= 50) {
          priority = 'medium';
          reasoning = 'Rôle utile à moyen terme. Considérez un profil fractional.';
        } else {
          priority = 'low';
          reasoning = 'Pas une priorité immédiate pour votre stade actuel.';
        }
        
        return {
          role,
          symbol: role,
          score: normalizedScore,
          priority,
          reasoning,
          icon: details.icon,
          color: details.color
        };
      })
      .sort((a, b) => b.score - a.score);
  };

  const handleNext = () => {
    if (currentQuestion < diagnosticQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  const exportResults = () => {
    const results = calculateResults();
    const criticalRoles = results.filter(r => r.priority === 'critical');
    const highRoles = results.filter(r => r.priority === 'high');
    
    let content = `DIAGNOSTIC ÉQUIPE EXECUTIVE - RÉSULTATS\n`;
    content += `${'='.repeat(50)}\n\n`;
    content += `Date: ${new Date().toLocaleDateString('fr-FR')}\n\n`;
    
    content += `RÔLES PRIORITAIRES (Critical)\n`;
    content += `${'-'.repeat(30)}\n`;
    criticalRoles.forEach(r => {
      const details = roleDetails[r.role];
      content += `• ${r.role} - ${details?.fullName || r.role}\n`;
      content += `  Score: ${r.score}% | ${r.reasoning}\n\n`;
    });
    
    content += `\nRÔLES IMPORTANTS (High)\n`;
    content += `${'-'.repeat(30)}\n`;
    highRoles.forEach(r => {
      const details = roleDetails[r.role];
      content += `• ${r.role} - ${details?.fullName || r.role}\n`;
      content += `  Score: ${r.score}% | ${r.reasoning}\n\n`;
    });
    
    content += `\nTOUS LES SCORES\n`;
    content += `${'-'.repeat(30)}\n`;
    results.forEach(r => {
      content += `${r.role}: ${r.score}% (${r.priority})\n`;
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diagnostic-executive-team.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const results = showResults ? calculateResults() : [];
  const currentQ = diagnosticQuestions[currentQuestion];

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {!showResults ? (
          <motion.div
            key="questions"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Question {currentQuestion + 1} sur {diagnosticQuestions.length}
                </span>
                <Badge variant="outline">{currentQ.category}</Badge>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Question */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{currentQ.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={answers[currentQ.id] || ''}
                  onValueChange={handleAnswer}
                  className="space-y-3"
                >
                  {currentQ.options.map((option) => (
                    <div
                      key={option.value}
                      className={`flex items-start space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        answers[currentQ.id] === option.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => handleAnswer(option.value)}
                    >
                      <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                      <Label htmlFor={option.value} className="cursor-pointer flex-1">
                        <p className="font-semibold">{option.label}</p>
                        {option.description && (
                          <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
                        )}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Précédent
              </Button>
              <Button
                onClick={handleNext}
                disabled={!answers[currentQ.id]}
              >
                {currentQuestion === diagnosticQuestions.length - 1 ? 'Voir les résultats' : 'Suivant'}
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <CheckCircle2 className="h-4 w-4" />
                Diagnostic Complété
              </div>
              <h2 className="text-2xl font-bold mb-2">Vos Priorités de Recrutement C-Suite</h2>
              <p className="text-muted-foreground">
                Basé sur vos réponses, voici les rôles à recruter en priorité
              </p>
            </div>

            {/* Critical Roles */}
            {results.filter(r => r.priority === 'critical').length > 0 && (
              <div className="space-y-4">
                <h3 className="font-bold flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  Recrutements Critiques
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {results.filter(r => r.priority === 'critical').map((role) => {
                    const Icon = role.icon;
                    return (
                      <Card key={role.role} className="border-red-200 dark:border-red-800">
                        <CardContent className="p-5">
                          <div className="flex items-start gap-4">
                            <div className={`${role.color} p-3 rounded-xl text-white`}>
                              <Icon className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-bold text-lg">{role.symbol}</h4>
                                <Badge variant="destructive">{role.score}%</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {roleDetails[role.role]?.fullName}
                              </p>
                              <p className="text-sm">{role.reasoning}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* High Priority Roles */}
            {results.filter(r => r.priority === 'high').length > 0 && (
              <div className="space-y-4">
                <h3 className="font-bold flex items-center gap-2 text-amber-600">
                  <TrendingUp className="h-5 w-5" />
                  Haute Priorité
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.filter(r => r.priority === 'high').map((role) => {
                    const Icon = role.icon;
                    return (
                      <Card key={role.role} className="border-amber-200 dark:border-amber-800">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`${role.color} p-2 rounded-lg text-white`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-bold">{role.symbol}</h4>
                              <Badge variant="outline" className="text-xs">{role.score}%</Badge>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">{role.reasoning}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Other Roles */}
            <div className="space-y-4">
              <h3 className="font-bold text-muted-foreground">Autres Rôles</h3>
              <div className="flex flex-wrap gap-2">
                {results.filter(r => r.priority === 'medium' || r.priority === 'low').map((role) => (
                  <Badge 
                    key={role.role} 
                    variant="secondary"
                    className={role.priority === 'medium' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : ''}
                  >
                    {role.symbol}: {role.score}%
                  </Badge>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 justify-center pt-4 border-t">
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Refaire le diagnostic
              </Button>
              <Button onClick={exportResults}>
                <Download className="h-4 w-4 mr-2" />
                Exporter les résultats
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExecutiveTeamDiagnostic;
