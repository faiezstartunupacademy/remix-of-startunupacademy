import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Target, ArrowRight, RotateCcw, Download, CheckCircle2, 
  Circle, Crosshair, Zap, TrendingUp, AlertCircle, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { tractionChannels } from "@/data/tractionChannelsData";

type Ring = 'outer' | 'possible' | 'inner' | null;

interface ChannelSelection {
  channelId: string;
  ring: Ring;
  notes: string;
  testIdea: string;
  expectedCost: string;
  expectedTime: string;
}

const BullseyeSimulator = () => {
  const [selections, setSelections] = useState<Record<string, ChannelSelection>>({});
  const [currentPhase, setCurrentPhase] = useState<'brainstorm' | 'rank' | 'test' | 'results'>('brainstorm');
  const [expandedChannel, setExpandedChannel] = useState<string | null>(null);

  const ringColors = {
    outer: 'bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600',
    possible: 'bg-amber-100 dark:bg-amber-900/30 border-amber-400',
    inner: 'bg-green-100 dark:bg-green-900/30 border-green-500',
  };

  const ringLabels = {
    outer: 'Long Shot',
    possible: 'Possible',
    inner: 'Top 3',
  };

  const setChannelRing = (channelId: string, ring: Ring) => {
    setSelections(prev => {
      // Count current inner ring selections
      const innerCount = Object.values(prev).filter(s => s.ring === 'inner').length;
      const currentRing = prev[channelId]?.ring;
      
      // Limit inner ring to 3 channels
      if (ring === 'inner' && innerCount >= 3 && currentRing !== 'inner') {
        return prev;
      }

      if (ring === null) {
        const { [channelId]: _, ...rest } = prev;
        return rest;
      }

      return {
        ...prev,
        [channelId]: {
          ...prev[channelId],
          channelId,
          ring,
          notes: prev[channelId]?.notes || '',
          testIdea: prev[channelId]?.testIdea || '',
          expectedCost: prev[channelId]?.expectedCost || '',
          expectedTime: prev[channelId]?.expectedTime || '',
        }
      };
    });
  };

  const updateChannelDetails = (channelId: string, field: keyof ChannelSelection, value: string) => {
    setSelections(prev => ({
      ...prev,
      [channelId]: {
        ...prev[channelId],
        [field]: value,
      }
    }));
  };

  const getChannelsByRing = (ring: Ring) => {
    return Object.values(selections)
      .filter(s => s.ring === ring)
      .map(s => tractionChannels.find(c => c.id === s.channelId))
      .filter(Boolean);
  };

  const innerChannels = getChannelsByRing('inner');
  const possibleChannels = getChannelsByRing('possible');
  const outerChannels = getChannelsByRing('outer');

  const canProceedToRank = Object.keys(selections).length >= 6;
  const canProceedToTest = innerChannels.length === 3;

  const resetSimulator = () => {
    setSelections({});
    setCurrentPhase('brainstorm');
    setExpandedChannel(null);
  };

  const exportResults = () => {
    const content = `
BULLSEYE FRAMEWORK - RÉSULTATS
==============================
Date: ${new Date().toLocaleDateString('fr-FR')}

TOP 3 CANAUX (INNER RING)
-------------------------
${innerChannels.map((ch, i) => `
${i + 1}. ${ch?.name}
   Catégorie: ${ch?.category}
   Description: ${ch?.description}
   Test prévu: ${selections[ch?.id || '']?.testIdea || 'Non défini'}
   Coût estimé: ${selections[ch?.id || '']?.expectedCost || 'Non défini'}
   Durée estimée: ${selections[ch?.id || '']?.expectedTime || 'Non défini'}
   Notes: ${selections[ch?.id || '']?.notes || 'Aucune'}
`).join('')}

CANAUX POSSIBLES (MIDDLE RING)
------------------------------
${possibleChannels.map(ch => `- ${ch?.name}: ${ch?.description}`).join('\n')}

CANAUX LONG SHOT (OUTER RING)
-----------------------------
${outerChannels.map(ch => `- ${ch?.name}: ${ch?.description}`).join('\n')}

PROCHAINES ÉTAPES
-----------------
1. Lancer des tests peu coûteux sur vos 3 canaux prioritaires
2. Mesurer les résultats après 2-4 semaines
3. Doubler sur le canal le plus performant
4. Répéter le processus tous les trimestres
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bullseye-framework-results.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderBrainstormPhase = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Badge variant="outline" className="mb-4">Phase 1: Brainstorm</Badge>
        <h3 className="text-2xl font-bold mb-2">Classez les 19 canaux de traction</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Placez chaque canal dans l'un des trois cercles selon leur potentiel pour votre startup.
          Objectif : identifier vos 3 meilleurs canaux pour la phase de test.
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4">
        <div className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded-full ${ringColors.inner} border-2`} />
          <span className="text-sm">Inner Ring (Top 3)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded-full ${ringColors.possible} border-2`} />
          <span className="text-sm">Possible (Prometteurs)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded-full ${ringColors.outer} border-2`} />
          <span className="text-sm">Long Shot (À explorer)</span>
        </div>
      </div>

      {/* Progress */}
      <div className="max-w-md mx-auto">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Canaux classés</span>
          <span>{Object.keys(selections).length}/19</span>
        </div>
        <Progress value={(Object.keys(selections).length / 19) * 100} className="h-2" />
      </div>

      {/* Channels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {tractionChannels.map((channel) => {
          const selection = selections[channel.id];
          const ringStyle = selection?.ring ? ringColors[selection.ring] : '';
          
          return (
            <motion.div
              key={channel.id}
              layout
              className={`p-4 rounded-xl border-2 transition-all ${
                ringStyle || 'bg-card border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-sm">{channel.name}</h4>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {channel.category}
                  </Badge>
                </div>
                {selection?.ring && (
                  <Badge variant="outline" className="text-xs">
                    {ringLabels[selection.ring]}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                {channel.description}
              </p>
              <div className="flex gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant={selection?.ring === 'inner' ? 'default' : 'outline'}
                        className="flex-1 h-8 text-xs"
                        onClick={() => setChannelRing(channel.id, selection?.ring === 'inner' ? null : 'inner')}
                        disabled={innerChannels.length >= 3 && selection?.ring !== 'inner'}
                      >
                        <Crosshair className="h-3 w-3 mr-1" />
                        Top 3
                      </Button>
                    </TooltipTrigger>
                    {innerChannels.length >= 3 && selection?.ring !== 'inner' && (
                      <TooltipContent>
                        <p>Maximum 3 canaux dans le Top 3</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
                <Button
                  size="sm"
                  variant={selection?.ring === 'possible' ? 'default' : 'outline'}
                  className="flex-1 h-8 text-xs"
                  onClick={() => setChannelRing(channel.id, selection?.ring === 'possible' ? null : 'possible')}
                >
                  <Circle className="h-3 w-3 mr-1" />
                  Possible
                </Button>
                <Button
                  size="sm"
                  variant={selection?.ring === 'outer' ? 'default' : 'outline'}
                  className="flex-1 h-8 text-xs"
                  onClick={() => setChannelRing(channel.id, selection?.ring === 'outer' ? null : 'outer')}
                >
                  <Target className="h-3 w-3 mr-1" />
                  Long Shot
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Next Step */}
      <div className="flex justify-center">
        <Button 
          size="lg" 
          onClick={() => setCurrentPhase('test')}
          disabled={!canProceedToTest}
        >
          {canProceedToTest ? (
            <>
              Planifier les tests
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              <AlertCircle className="mr-2 h-4 w-4" />
              Sélectionnez exactement 3 canaux Top 3 ({innerChannels.length}/3)
            </>
          )}
        </Button>
      </div>
    </div>
  );

  const renderTestPhase = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Badge variant="outline" className="mb-4">Phase 2: Test</Badge>
        <h3 className="text-2xl font-bold mb-2">Planifiez vos tests de traction</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Définissez des expériences peu coûteuses pour valider le potentiel de vos 3 canaux prioritaires.
        </p>
      </div>

      {/* Inner Ring Channels */}
      <div className="space-y-4">
        {innerChannels.map((channel, index) => {
          if (!channel) return null;
          const selection = selections[channel.id];
          const isExpanded = expandedChannel === channel.id;
          
          return (
            <motion.div
              key={channel.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-2 border-green-500/50">
                <CardHeader 
                  className="cursor-pointer"
                  onClick={() => setExpandedChannel(isExpanded ? null : channel.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{channel.name}</CardTitle>
                        <CardDescription>{channel.description}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary">{channel.category}</Badge>
                  </div>
                </CardHeader>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <CardContent className="space-y-4 pt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">
                              Idée de test (expérience peu coûteuse)
                            </label>
                            <textarea
                              className="w-full p-3 rounded-lg border bg-background resize-none text-sm"
                              rows={3}
                              placeholder="Ex: Lancer une campagne Google Ads avec 100€ de budget sur 3 mots-clés..."
                              value={selection?.testIdea || ''}
                              onChange={(e) => updateChannelDetails(channel.id, 'testIdea', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">
                              Notes & Hypothèses
                            </label>
                            <textarea
                              className="w-full p-3 rounded-lg border bg-background resize-none text-sm"
                              rows={3}
                              placeholder="Ex: Je pense que ce canal fonctionnera car notre audience cible..."
                              value={selection?.notes || ''}
                              onChange={(e) => updateChannelDetails(channel.id, 'notes', e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Budget estimé</label>
                            <input
                              type="text"
                              className="w-full p-3 rounded-lg border bg-background text-sm"
                              placeholder="Ex: 100-500€"
                              value={selection?.expectedCost || ''}
                              onChange={(e) => updateChannelDetails(channel.id, 'expectedCost', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Durée du test</label>
                            <input
                              type="text"
                              className="w-full p-3 rounded-lg border bg-background text-sm"
                              placeholder="Ex: 2 semaines"
                              value={selection?.expectedTime || ''}
                              onChange={(e) => updateChannelDetails(channel.id, 'expectedTime', e.target.value)}
                            />
                          </div>
                        </div>
                        
                        {/* Channel tactics preview */}
                        <div className="bg-muted/50 rounded-lg p-4">
                          <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                            <Zap className="h-4 w-4 text-amber-500" />
                            Tactiques suggérées
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {channel.tactics?.slice(0, 4).map((tactic, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {tactic}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={() => setCurrentPhase('brainstorm')}>
          Retour au classement
        </Button>
        <Button onClick={() => setCurrentPhase('results')}>
          Voir le résumé
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderResultsPhase = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Badge variant="outline" className="mb-4">Résultats</Badge>
        <h3 className="text-2xl font-bold mb-2">Votre Bullseye Framework</h3>
        <p className="text-muted-foreground">
          Récapitulatif de vos canaux de traction prioritaires
        </p>
      </div>

      {/* Visual Bullseye */}
      <div className="relative max-w-md mx-auto aspect-square">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800/50 flex items-center justify-center">
          <div className="absolute top-2 text-xs font-medium text-muted-foreground">Long Shot ({outerChannels.length})</div>
        </div>
        {/* Middle ring */}
        <div className="absolute inset-[20%] rounded-full border-4 border-amber-400 bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
          <div className="absolute top-2 text-xs font-medium text-amber-600">Possible ({possibleChannels.length})</div>
        </div>
        {/* Inner ring */}
        <div className="absolute inset-[40%] rounded-full border-4 border-green-500 bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <div className="text-center p-4">
            <Crosshair className="h-8 w-8 mx-auto text-green-600 mb-2" />
            <span className="text-sm font-bold text-green-600">Top 3</span>
          </div>
        </div>
      </div>

      {/* Top 3 Summary */}
      <Card className="border-2 border-green-500/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crosshair className="h-5 w-5 text-green-500" />
            Vos 3 Canaux Prioritaires
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {innerChannels.map((channel, i) => {
              if (!channel) return null;
              const selection = selections[channel.id];
              return (
                <div key={channel.id} className="flex items-start gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{channel.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{selection?.testIdea || 'Pas de test défini'}</p>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>💰 {selection?.expectedCost || 'N/A'}</span>
                      <span>⏱️ {selection?.expectedTime || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Other Rings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Circle className="h-4 w-4 text-amber-500" />
              Canaux Possibles ({possibleChannels.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {possibleChannels.map(ch => (
                <Badge key={ch?.id} variant="secondary">{ch?.name}</Badge>
              ))}
              {possibleChannels.length === 0 && (
                <p className="text-sm text-muted-foreground">Aucun canal sélectionné</p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4 text-gray-500" />
              Long Shots ({outerChannels.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {outerChannels.map(ch => (
                <Badge key={ch?.id} variant="outline">{ch?.name}</Badge>
              ))}
              {outerChannels.length === 0 && (
                <p className="text-sm text-muted-foreground">Aucun canal sélectionné</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Prochaines Étapes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
              <span className="text-sm">Lancez des tests peu coûteux sur vos 3 canaux prioritaires cette semaine</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
              <span className="text-sm">Mesurez les résultats après 2-4 semaines (CAC, conversion, volume)</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
              <span className="text-sm">Doublez sur le canal le plus performant (règle des 50% du temps)</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">4</div>
              <span className="text-sm">Répétez le processus tous les trimestres pour trouver de nouveaux canaux</span>
            </li>
          </ol>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button onClick={() => setCurrentPhase('brainstorm')} variant="outline">
          Modifier le classement
        </Button>
        <Button onClick={exportResults} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exporter
        </Button>
        <Button onClick={resetSimulator}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Recommencer
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
          <Target className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">Framework Bullseye</span>
        </div>
        <h2 className="text-3xl font-black mb-2">Simulateur Bullseye</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Identifiez et priorisez vos 3 meilleurs canaux de traction avec le framework de Gabriel Weinberg (Traction).
        </p>
      </div>

      {/* Phase Indicator */}
      <div className="flex justify-center gap-4">
        {['brainstorm', 'test', 'results'].map((phase, index) => (
          <div
            key={phase}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              currentPhase === phase 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground'
            }`}
          >
            <span className="w-6 h-6 rounded-full bg-background/20 flex items-center justify-center text-xs font-bold">
              {index + 1}
            </span>
            <span className="text-sm font-medium capitalize hidden sm:inline">{phase}</span>
          </div>
        ))}
      </div>

      {/* Content based on phase */}
      {currentPhase === 'brainstorm' && renderBrainstormPhase()}
      {currentPhase === 'test' && renderTestPhase()}
      {currentPhase === 'results' && renderResultsPhase()}
    </div>
  );
};

export default BullseyeSimulator;
