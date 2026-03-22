import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Bot, User, Trash2, Image, BrainCircuit, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

type Message = { role: "user" | "assistant"; content: string; images?: string[] };

interface FormationChatbotProps {
  formationName: string;
  formationContext: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/formation-chatbot`;
const INFOGRAPHIC_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-infographic`;

async function streamChat({
  messages,
  formationName,
  formationContext,
  onDelta,
  onDone,
  onError,
}: {
  messages: Message[];
  formationName: string;
  formationContext: string;
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (msg: string) => void;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages: messages.map(m => ({ role: m.role, content: m.content })), formationName, formationContext }),
  });

  if (!resp.ok) {
    const body = await resp.json().catch(() => ({}));
    onError(body.error || "Erreur du serveur");
    return;
  }

  if (!resp.body) {
    onError("Pas de réponse");
    return;
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let textBuffer = "";
  let streamDone = false;

  while (!streamDone) {
    const { done, value } = await reader.read();
    if (done) break;
    textBuffer += decoder.decode(value, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
      let line = textBuffer.slice(0, newlineIndex);
      textBuffer = textBuffer.slice(newlineIndex + 1);

      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;

      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") {
        streamDone = true;
        break;
      }

      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) onDelta(content);
      } catch {
        textBuffer = line + "\n" + textBuffer;
        break;
      }
    }
  }

  if (textBuffer.trim()) {
    for (let raw of textBuffer.split("\n")) {
      if (!raw) continue;
      if (raw.endsWith("\r")) raw = raw.slice(0, -1);
      if (raw.startsWith(":") || raw.trim() === "") continue;
      if (!raw.startsWith("data: ")) continue;
      const jsonStr = raw.slice(6).trim();
      if (jsonStr === "[DONE]") continue;
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) onDelta(content);
      } catch { /* ignore */ }
    }
  }

  onDone();
}

const FormationChatbot = ({ formationName, formationContext }: FormationChatbotProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const generateVisual = async (type: "infographic" | "mindmap") => {
    setIsGeneratingImage(true);
    const label = type === "infographic" ? "infographie récapitulative" : "carte mentale";
    
    setMessages(prev => [...prev, 
      { role: "user" as const, content: `Génère une ${label} de la formation` },
      { role: "assistant" as const, content: `⏳ Génération de la ${label} en cours... Cela peut prendre quelques secondes.` }
    ]);

    try {
      // Extract key points from formation context
      const contextLines = formationContext.split("\n").filter(l => l.trim().length > 10);
      const keyPoints = contextLines.slice(0, 12).map(l => l.replace(/^[-•*#]+\s*/, "").trim());

      const resp = await fetch(INFOGRAPHIC_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ formationName, keyPoints, type }),
      });

      if (!resp.ok) {
        const body = await resp.json().catch(() => ({}));
        throw new Error(body.error || "Erreur de génération");
      }

      const data = await resp.json();
      
      if (data.images && data.images.length > 0) {
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: `✅ Voici votre ${label} pour **${formationName}** !\n\n${data.text || `Cliquez sur l'image pour la télécharger.`}`,
            images: data.images.filter((img: string) => img),
          };
          return updated;
        });
      } else {
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: `⚠️ La génération de l'image n'a pas abouti. ${data.text || "Veuillez réessayer."}`,
          };
          return updated;
        });
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erreur inconnue";
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: `❌ Erreur: ${errorMsg}. Veuillez réessayer.`,
        };
        return updated;
      });
      toast({ title: "Erreur", description: errorMsg, variant: "destructive" });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const downloadImage = (dataUrl: string, filename: string) => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const send = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";
    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      await streamChat({
        messages: [...messages, userMsg],
        formationName,
        formationContext,
        onDelta: upsertAssistant,
        onDone: () => setIsLoading(false),
        onError: (msg) => {
          toast({ title: "Erreur", description: msg, variant: "destructive" });
          setIsLoading(false);
        },
      });
    } catch {
      toast({ title: "Erreur", description: "Impossible de contacter l'assistant", variant: "destructive" });
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const isBusy = isLoading || isGeneratingImage;

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              size="lg"
              className="rounded-full w-14 h-14 shadow-xl bg-primary hover:bg-primary/90 p-0"
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[420px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-4rem)] flex flex-col rounded-2xl border bg-background shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b bg-primary text-primary-foreground">
              <div className="flex items-center gap-2 min-w-0">
                <Bot className="h-5 w-5 shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">Assistant IA</p>
                  <p className="text-xs opacity-80 truncate">{formationName}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground hover:bg-white/20" onClick={clearChat}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground hover:bg-white/20" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground text-sm py-6 space-y-3">
                  <Bot className="h-10 w-10 mx-auto opacity-50" />
                  <p className="font-medium">Bienvenue ! 👋</p>
                  <p>Posez-moi vos questions sur la formation <strong>{formationName}</strong></p>
                  <div className="flex flex-wrap gap-2 justify-center pt-2">
                    {["Résume cette formation", "Quels sont les concepts clés ?", "Donne un exercice pratique"].map((q) => (
                      <button
                        key={q}
                        onClick={() => { setInput(q); inputRef.current?.focus(); }}
                        className="text-xs px-3 py-1.5 rounded-full border bg-muted hover:bg-accent transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                  
                  {/* Visual generation buttons */}
                  <div className="border-t pt-4 mt-4">
                    <p className="text-xs text-muted-foreground mb-3 font-medium">🎨 Génération visuelle IA</p>
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 rounded-full text-xs"
                        onClick={() => generateVisual("infographic")}
                        disabled={isBusy}
                      >
                        <Image className="h-3.5 w-3.5" />
                        Infographie récap
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 rounded-full text-xs"
                        onClick={() => generateVisual("mindmap")}
                        disabled={isBusy}
                      >
                        <BrainCircuit className="h-3.5 w-3.5" />
                        Carte mentale
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted rounded-bl-md"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="space-y-3">
                        <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:my-1 [&>ul]:my-1 [&>ol]:my-1 [&>h1]:text-base [&>h2]:text-sm [&>h3]:text-sm">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                        {msg.images && msg.images.length > 0 && (
                          <div className="space-y-2">
                            {msg.images.map((imgUrl, imgIdx) => (
                              <div key={imgIdx} className="relative group">
                                <img
                                  src={imgUrl}
                                  alt={`Generated ${formationName}`}
                                  className="rounded-xl border border-border w-full cursor-pointer hover:opacity-90 transition-opacity"
                                  onClick={() => {
                                    // Open in new tab for full view
                                    const w = window.open();
                                    if (w) {
                                      w.document.write(`<img src="${imgUrl}" style="max-width:100%;height:auto;" />`);
                                      w.document.title = `${formationName} - Image`;
                                    }
                                  }}
                                />
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  className="absolute bottom-2 right-2 gap-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg text-xs"
                                  onClick={() => downloadImage(imgUrl, `${formationName.replace(/\s+/g, "-").toLowerCase()}-visual.png`)}
                                >
                                  <Download className="h-3.5 w-3.5" />
                                  Télécharger
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>

            {/* Action bar for visual generation when chat has messages */}
            {messages.length > 0 && (
              <div className="border-t px-3 py-2 flex gap-2 bg-muted/30">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-xs text-muted-foreground hover:text-foreground flex-1"
                  onClick={() => generateVisual("infographic")}
                  disabled={isBusy}
                >
                  {isGeneratingImage ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Image className="h-3.5 w-3.5" />}
                  Infographie
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-xs text-muted-foreground hover:text-foreground flex-1"
                  onClick={() => generateVisual("mindmap")}
                  disabled={isBusy}
                >
                  {isGeneratingImage ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <BrainCircuit className="h-3.5 w-3.5" />}
                  Carte mentale
                </Button>
              </div>
            )}

            {/* Input */}
            <div className="border-t p-3">
              <div className="flex gap-2 items-end">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Posez votre question..."
                  rows={1}
                  className="flex-1 resize-none rounded-xl border bg-muted/50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 max-h-24"
                />
                <Button
                  onClick={send}
                  disabled={!input.trim() || isBusy}
                  size="icon"
                  className="rounded-xl h-10 w-10 shrink-0"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FormationChatbot;
