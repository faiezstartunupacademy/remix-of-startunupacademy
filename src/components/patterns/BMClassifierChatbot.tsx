import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, Bot, User, Lightbulb, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BM_PATTERNS } from "@/data/businessModelPatterns";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  patterns?: typeof BM_PATTERNS;
}

const initialQuestions = [
  "Quel est votre secteur d'activité ?",
  "Décrivez votre produit ou service en une phrase.",
  "Comment générez-vous des revenus actuellement ?",
  "Qui sont vos clients principaux (B2B, B2C, les deux) ?",
];

const sectorKeywords: Record<string, string[]> = {
  "tech": ["saas", "logiciel", "application", "software", "plateforme", "digital", "numérique", "ia", "ai"],
  "retail": ["commerce", "vente", "boutique", "magasin", "e-commerce", "retail", "produit"],
  "service": ["service", "conseil", "consulting", "freelance", "prestation", "accompagnement"],
  "manufacturing": ["fabrication", "production", "industrie", "usine", "manufacture"],
  "marketplace": ["marketplace", "place de marché", "mise en relation", "plateforme"],
  "subscription": ["abonnement", "subscription", "récurrent", "mensuel", "saas"],
  "freemium": ["gratuit", "free", "freemium", "premium", "version gratuite"],
};

const patternsByContext: Record<string, number[]> = {
  "tech": [1, 4, 12, 17, 24, 35, 42, 54],
  "retail": [2, 8, 15, 22, 29, 37, 48],
  "service": [3, 9, 14, 21, 28, 41, 55],
  "marketplace": [5, 11, 19, 30, 38, 45, 52],
  "subscription": [4, 12, 24, 35, 42, 54],
  "freemium": [17, 24, 42, 54],
  "manufacturing": [6, 13, 20, 27, 33, 44, 51],
};

export const BMClassifierChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "👋 Bonjour ! Je suis votre assistant pour classifier et découvrir les patterns de Business Model les plus adaptés à votre projet.\n\nDécrivez-moi votre activité et je vous suggérerai les patterns les plus pertinents parmi les 60 patterns de Gassmann.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const analyzeInput = (text: string): typeof BM_PATTERNS => {
    const lowerText = text.toLowerCase();
    const detectedContexts: string[] = [];

    // Detect contexts based on keywords
    Object.entries(sectorKeywords).forEach(([context, keywords]) => {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        detectedContexts.push(context);
      }
    });

    // Get relevant pattern numbers
    const relevantPatternNumbers = new Set<number>();
    detectedContexts.forEach(context => {
      patternsByContext[context]?.forEach(num => relevantPatternNumbers.add(num));
    });

    // If no specific context found, suggest general patterns
    if (relevantPatternNumbers.size === 0) {
      [1, 4, 12, 17, 24, 35, 42, 54].forEach(num => relevantPatternNumbers.add(num));
    }

    // Get full pattern data
    return BM_PATTERNS.filter(p => relevantPatternNumbers.has(p.number)).slice(0, 6);
  };

  const [selectedPattern, setSelectedPattern] = useState<typeof BM_PATTERNS[0] | null>(null);

  const generateResponse = (userMessage: string): { content: string; patterns: typeof BM_PATTERNS } => {
    const patterns = analyzeInput(userMessage);
    
    let content = "";
    
    if (patterns.length > 0) {
      content = `🎯 Basé sur votre description, voici les patterns de Business Model qui pourraient correspondre à votre projet :\n\n`;
      
      patterns.forEach((pattern, index) => {
        content += `**${index + 1}. ${pattern.name}** (${pattern.symbol})\n`;
        content += `   💡 ${pattern.idea}\n\n`;
      });
      
      content += `\n📌 Cliquez sur un pattern pour voir ses détails, combinaisons possibles et KPIs.\n\n💡 **Combiner des patterns ?** Les patterns compatibles sont indiqués dans les détails de chaque pattern. Une combinaison stratégique de 2-3 patterns complémentaires renforce souvent le business model.`;
    } else {
      content = "Je comprends ! Pour vous aider à identifier les meilleurs patterns, pouvez-vous me préciser :\n\n• Votre modèle de revenus (abonnement, commission, vente directe...)\n• Votre cible (B2B, B2C)\n• Votre différenciation principale";
    }

    return { content, patterns };
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const { content, patterns } = generateResponse(input);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content,
        patterns,
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-glow flex items-center justify-center"
          >
            <MessageSquare className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-48px)] h-[600px] max-h-[calc(100vh-100px)]"
          >
            <Card className="h-full flex flex-col shadow-elevated overflow-hidden">
              {/* Header */}
              <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">BM Pattern Classifier</h3>
                    <p className="text-xs text-white/70">Trouvez votre business model</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}>
                      {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <div className={`max-w-[80%] rounded-2xl p-3 ${
                      message.role === "user" 
                        ? "bg-primary text-primary-foreground rounded-tr-sm" 
                        : "bg-card border rounded-tl-sm"
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      
                      {/* Pattern badges */}
                      {message.patterns && message.patterns.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {message.patterns.map((pattern) => (
                            <Badge 
                              key={pattern.number} 
                              variant="secondary"
                              className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                              onClick={() => setSelectedPattern(selectedPattern?.number === pattern.number ? null : pattern)}
                            >
                              {pattern.symbol} {pattern.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {/* Pattern detail inline */}
                      {message.patterns && selectedPattern && message.patterns.some(p => p.number === selectedPattern.number) && (
                        <div className="mt-2 p-3 rounded-lg bg-primary/5 border border-primary/20 text-xs space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="font-bold text-primary">{selectedPattern.symbol} {selectedPattern.name}</p>
                            <button onClick={() => setSelectedPattern(null)} className="text-muted-foreground hover:text-foreground">✕</button>
                          </div>
                          <p>💡 {selectedPattern.idea}</p>
                          <p>📊 <strong>KPI :</strong> {selectedPattern.kpi}</p>
                          <p>🎯 <strong>BI :</strong> {selectedPattern.bi}</p>
                          <p>📈 <strong>Maturité :</strong> {selectedPattern.maturity}</p>
                          <p>✅ <strong>Compatible avec :</strong> {selectedPattern.compatible}</p>
                          <p>❌ <strong>Anti-patterns :</strong> {selectedPattern.antiPatterns}</p>
                          <p>📉 <strong>YC Metrics :</strong> {selectedPattern.ycMetrics}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-card border rounded-2xl rounded-tl-sm p-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Questions */}
              {messages.length <= 2 && (
                <div className="px-4 py-2 border-t bg-background">
                  <p className="text-xs text-muted-foreground mb-2">Questions rapides :</p>
                  <div className="flex flex-wrap gap-1">
                    {["SaaS B2B", "E-commerce", "Marketplace", "Abonnement"].map((q) => (
                      <Button
                        key={q}
                        variant="outline"
                        size="sm"
                        className="text-xs h-7 rounded-full"
                        onClick={() => handleQuickQuestion(`Mon projet est un ${q}`)}
                      >
                        {q}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t bg-background">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Décrivez votre business model..."
                    className="rounded-full"
                  />
                  <Button 
                    onClick={handleSend} 
                    size="icon"
                    className="rounded-full flex-shrink-0"
                    disabled={!input.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BMClassifierChatbot;
