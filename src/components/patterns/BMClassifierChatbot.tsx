import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ClassificationResult {
  primary: {
    number: number;
    symbol: string;
    name: string;
    confidence: number;
    reasoning: string;
    characteristics: string[];
    incubation_alignment: Record<string, string>;
  };
  alternatives: { number: number; symbol: string; name: string; reasoning: string }[];
  key_metrics: { name: string; description: string; target: string; decision_rule: string }[];
  go_nogo_rules: string[];
  source?: "ai" | "fallback";
  notice?: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  classification?: ClassificationResult;
}

export const BMClassifierChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "👋 Bonjour ! Je suis votre assistant IA pour classifier automatiquement votre Business Model parmi les 60 patterns de Gassmann.\n\nDécrivez votre projet (nom, problème, solution, secteur) et je vous proposerai le pattern le plus adapté avec des métriques clés.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const classifyBM = async (userText: string): Promise<{ content: string; classification?: ClassificationResult }> => {
    try {
      const { data, error } = await supabase.functions.invoke("classify-bm", {
        body: {
          name: "Projet utilisateur",
          description: userText,
          problem: userText,
          solution: userText,
          sector: "",
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const result = data as ClassificationResult;
      const isFallback = result.source === "fallback";
      let content = `${isFallback ? "🧭 **Classification automatique de secours**" : "🎯 **Classification IA terminée**"} (Confiance : ${result.primary.confidence}%)\n\n`;
      if (result.notice) {
        content += `${result.notice}\n\n`;
      }
      content += `**Pattern principal : ${result.primary.symbol} — ${result.primary.name}**\n`;
      content += `${result.primary.reasoning}\n\n`;
      content += `📊 **Caractéristiques clés :**\n`;
      result.primary.characteristics.forEach(c => { content += `• ${c}\n`; });
      content += `\n🔄 **Patterns alternatifs :**\n`;
      result.alternatives.forEach(a => { content += `• **${a.symbol} ${a.name}** — ${a.reasoning}\n`; });
      content += `\n📈 **Métriques pivots :**\n`;
      result.key_metrics.forEach(m => { content += `• **${m.name}** : ${m.description} (Cible: ${m.target})\n`; });
      content += `\n🚦 **Règles GO/NO-GO :**\n`;
      result.go_nogo_rules.forEach(r => { content += `• ${r}\n`; });

      return { content, classification: result };”}}]}]}.
    } catch (e: any) {
      if (e?.message?.includes("429") || e?.status === 429) {
        return { content: "⚠️ Trop de requêtes. Veuillez réessayer dans quelques instants." };
      }
      if (e?.message?.includes("402") || e?.status === 402) {
        return { content: "⚠️ Crédits IA épuisés. Veuillez recharger vos crédits dans les paramètres." };
      }
      console.error("classify-bm error:", e);
      return { content: "❌ Erreur lors de la classification. Veuillez réessayer." };
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userMessage: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    const userInput = input;
    setInput("");
    setIsTyping(true);

    const { content, classification } = await classifyBM(userInput);
    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content,
      classification,
    }]);
    setIsTyping(false);
  };

  return (
    <>
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

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[420px] max-w-[calc(100vw-48px)] h-[600px] max-h-[calc(100vh-100px)]"
          >
            <Card className="h-full flex flex-col shadow-elevated overflow-hidden">
              <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">BM Classifier IA</h3>
                    <p className="text-xs text-white/70">Classification automatique Gassmann</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20">
                  <X className="h-5 w-5" />
                </Button>
              </div>

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
                    <div className={`max-w-[85%] rounded-2xl p-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-card border rounded-tl-sm"
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                      {message.classification && (
                        <div className="mt-3 space-y-2">
                          <div className="flex flex-wrap gap-1">
                            <Badge className="bg-primary/90 text-primary-foreground cursor-pointer" onClick={() => setExpandedSection(expandedSection === `inc-${message.id}` ? null : `inc-${message.id}`)}>
                              📋 Alignement Incubation
                            </Badge>
                          </div>
                          {expandedSection === `inc-${message.id}` && (
                            <div className="p-2 rounded bg-muted/50 text-xs space-y-1 border">
                              {Object.entries(message.classification.primary.incubation_alignment).map(([k, v]) => (
                                <p key={k}><strong className="capitalize">{k.replace(/_/g, " ")} :</strong> {v}</p>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-card border rounded-2xl rounded-tl-sm p-3 flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">Classification en cours...</span>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {messages.length <= 2 && (
                <div className="px-4 py-2 border-t bg-background">
                  <p className="text-xs text-muted-foreground mb-2">Exemples :</p>
                  <div className="flex flex-wrap gap-1">
                    {[
                      "SaaS B2B de gestion RH par abonnement",
                      "Marketplace de services freelance",
                      "App mobile freemium de fitness",
                    ].map((q) => (
                      <Button key={q} variant="outline" size="sm" className="text-xs h-7 rounded-full" onClick={() => setInput(q)}>
                        {q}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-4 border-t bg-background">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Décrivez votre projet..."
                    className="rounded-full"
                    disabled={isTyping}
                  />
                  <Button onClick={handleSend} size="icon" className="rounded-full flex-shrink-0" disabled={!input.trim() || isTyping}>
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
