import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Loader2, MessageSquare, Send, User, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

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

const EXAMPLE_PROMPTS = [
  "SaaS B2B de gestion RH par abonnement",
  "Marketplace de services freelance",
  "App mobile freemium de fitness",
];

const formatClassificationMessage = (result: ClassificationResult) => {
  const isFallback = result.source === "fallback";
  let content = `${isFallback ? "🧭 **Classification automatique de secours**" : "🎯 **Classification IA terminée**"} (Confiance : ${result.primary.confidence}%)\n\n`;

  if (result.notice) {
    content += `${result.notice}\n\n`;
  }

  content += `**Pattern principal : ${result.primary.symbol} — ${result.primary.name}**\n`;
  content += `${result.primary.reasoning}\n\n`;
  content += "📊 **Caractéristiques clés :**\n";
  result.primary.characteristics.forEach((characteristic) => {
    content += `• ${characteristic}\n`;
  });

  content += "\n🔄 **Patterns alternatifs :**\n";
  result.alternatives.forEach((alternative) => {
    content += `• **${alternative.symbol} ${alternative.name}** — ${alternative.reasoning}\n`;
  });

  content += "\n📈 **Métriques pivots :**\n";
  result.key_metrics.forEach((metric) => {
    content += `• **${metric.name}** : ${metric.description} (Cible: ${metric.target})\n`;
  });

  content += "\n🚦 **Règles GO/NO-GO :**\n";
  result.go_nogo_rules.forEach((rule) => {
    content += `• ${rule}\n`;
  });

  return content;
};

export const BMClassifierChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "👋 Bonjour ! Je suis votre assistant IA pour classifier automatiquement votre Business Model parmi les 60 patterns de Gassmann.\n\nDécrivez votre projet (nom, problème, solution, secteur) et je vous proposerai le pattern le plus adapté avec des métriques clés.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const classifyBM = async (
    userText: string,
  ): Promise<{ content: string; classification?: ClassificationResult }> => {
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
      if (!data?.primary) throw new Error("Classification indisponible pour le moment.");

      const result = data as ClassificationResult;
      return {
        content: formatClassificationMessage(result),
        classification: result,
      };
    } catch (error: any) {
      if (error?.message?.includes("429") || error?.status === 429) {
        return { content: "⚠️ Trop de requêtes. Veuillez réessayer dans quelques instants." };
      }
      if (error?.message?.includes("402") || error?.status === 402) {
        return {
          content:
            "⚠️ Le service IA principal n'est pas disponible pour le moment. Réessayez dans quelques instants si la classification de secours n'apparaît pas encore.",
        };
      }

      console.error("classify-bm error:", error);
      return { content: "❌ Erreur lors de la classification. Veuillez réessayer." };
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userInput = input.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userInput,
    };

    setMessages((previous) => [...previous, userMessage]);
    setInput("");
    setIsTyping(true);

    const { content, classification } = await classifyBM(userInput);

    setMessages((previous) => [
      ...previous,
      {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        content,
        classification,
      },
    ]);
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
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow"
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
            className="fixed bottom-6 right-6 z-50 h-[600px] max-h-[calc(100vh-100px)] w-[420px] max-w-[calc(100vw-48px)]"
          >
            <Card className="flex h-full flex-col overflow-hidden shadow-elevated">
              <div className="flex items-center justify-between bg-primary p-4 text-primary-foreground">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">BM Classifier IA</h3>
                    <p className="text-xs text-primary-foreground/70">Classification automatique Gassmann</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-primary-foreground hover:bg-primary-foreground/20"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto bg-muted/30 p-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>

                    <div
                      className={`max-w-[85%] rounded-2xl p-3 ${
                        message.role === "user"
                          ? "rounded-tr-sm bg-primary text-primary-foreground"
                          : "rounded-tl-sm border bg-card"
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm">{message.content}</p>

                      {message.classification && (
                        <div className="mt-3 space-y-2">
                          <div className="flex flex-wrap gap-1">
                            <Badge
                              variant="secondary"
                              className="cursor-pointer"
                              onClick={() =>
                                setExpandedSection(
                                  expandedSection === `inc-${message.id}` ? null : `inc-${message.id}`,
                                )
                              }
                            >
                              📋 Alignement incubation
                            </Badge>
                          </div>

                          {expandedSection === `inc-${message.id}` && (
                            <div className="space-y-1 rounded border bg-muted/50 p-2 text-xs">
                              {Object.entries(message.classification.primary.incubation_alignment).map(
                                ([key, value]) => (
                                  <p key={key}>
                                    <strong className="capitalize">{key.replace(/_/g, " ")} :</strong> {value}
                                  </p>
                                ),
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-foreground">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm border bg-card p-3">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">Classification en cours...</span>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {messages.length <= 2 && (
                <div className="border-t bg-background px-4 py-2">
                  <p className="mb-2 text-xs text-muted-foreground">Exemples :</p>
                  <div className="flex flex-wrap gap-1">
                    {EXAMPLE_PROMPTS.map((prompt) => (
                      <Button
                        key={prompt}
                        variant="outline"
                        size="sm"
                        className="h-7 rounded-full text-xs"
                        onClick={() => setInput(prompt)}
                      >
                        {prompt}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t bg-background p-4">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => event.key === "Enter" && handleSend()}
                    placeholder="Décrivez votre projet..."
                    className="rounded-full"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={handleSend}
                    size="icon"
                    className="flex-shrink-0 rounded-full"
                    disabled={!input.trim() || isTyping}
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
