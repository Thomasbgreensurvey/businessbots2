import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, User, ExternalLink, Minimize2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import banjoImg from "@/assets/agents/banjo-new.png";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const SKOOL_LINK = "https://www.skool.com/sales-ai-business-marketing-7663/about?ref=002573a2eb4443249a5fce3b6607713d";
const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const quickActions = [
  { label: "AI Employees", message: "Tell me about the 8 AI Employees" },
  { label: "Pricing", message: "What are the pricing plans?" },
  { label: "Free Course", message: "Tell me about the free AI training course" },
  { label: "Book Demo", message: "How do I book a demo?" },
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hey there! 👋 I'm Banjo, your AI Customer Support specialist. I'm here to help you 24/7 with any questions about our AI Employees, pricing, or how to get started. What can I help you with today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const streamChat = async (userMessages: Message[]) => {
    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: userMessages }),
      });

      if (!resp.ok || !resp.body) {
        if (resp.status === 429) {
          toast.error("Too many requests. Please wait a moment.");
          return;
        }
        throw new Error("Failed to start stream");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let assistantContent = "";
      let streamDone = false;

      // Add empty assistant message
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

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
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content: assistantContent };
                return updated;
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Something went wrong. Please try again.");
      setMessages((prev) => prev.slice(0, -1));
    }
  };

  const handleSend = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = { role: "user", content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    await streamChat(updatedMessages.filter((m) => m.role === "user" || m.role === "assistant"));
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMessageContent = (content: string) => {
    // Convert markdown links and Skool links
    const parts = content.split(/(https?:\/\/[^\s]+)/g);
    return parts.map((part, i) => {
      if (part.startsWith("http")) {
        const isSkool = part.includes("skool.com");
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 underline"
          >
            {isSkool ? "Join Free Community" : "Link"}
            <ExternalLink className="w-3 h-3" />
          </a>
        );
      }
      return part;
    });
  };

  return (
    <>
      {/* Floating Button - Banjo Avatar */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 group"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 blur-lg opacity-60 group-hover:opacity-80 transition-opacity" />
            
            {/* Main button container */}
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 p-0.5 shadow-2xl">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                <img 
                  src={banjoImg} 
                  alt="Banjo - AI Support Agent" 
                  className="w-14 h-14 object-cover object-top scale-125"
                />
              </div>
            </div>
            
            {/* Online indicator */}
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-emerald-400 rounded-full border-2 border-slate-900 shadow-lg"
            />
            
            {/* Chat prompt bubble */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden md:block"
            >
              <div className="bg-white text-slate-900 text-sm font-medium px-4 py-2 rounded-xl shadow-xl whitespace-nowrap">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  Chat with Banjo
                </span>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45 w-2 h-2 bg-white" />
              </div>
            </motion.div>
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
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`fixed z-50 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-indigo-500/20 shadow-2xl flex flex-col overflow-hidden ${
              isExpanded
                ? "bottom-4 right-4 left-4 top-4 md:left-auto md:w-[500px] md:h-[700px] rounded-2xl"
                : "bottom-6 right-6 w-[380px] h-[580px] rounded-2xl"
            }`}
            style={{ boxShadow: "0 25px 50px -12px rgba(99, 102, 241, 0.25)" }}
          >
            {/* Header - Enhanced with Banjo */}
            <div className="relative px-5 py-4 bg-gradient-to-r from-indigo-600/30 via-purple-600/20 to-indigo-600/30 border-b border-indigo-500/20">
              {/* Subtle pattern overlay */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '20px 20px'
              }} />
              
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {/* Avatar glow */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 blur-md opacity-50" />
                    <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5">
                      <div className="w-full h-full rounded-full bg-slate-900 overflow-hidden">
                        <img 
                          src={banjoImg} 
                          alt="Banjo" 
                          className="w-full h-full object-cover object-top scale-125"
                        />
                      </div>
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-slate-900" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-base">Banjo</h3>
                      <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30">
                        AI
                      </span>
                    </div>
                    <p className="text-xs text-indigo-200/70">Customer Support Agent • Online</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    aria-label="Expand chat"
                  >
                    <Minimize2 className="w-4 h-4 text-indigo-300/70" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    aria-label="Close chat"
                  >
                    <X className="w-4 h-4 text-indigo-300/70" />
                  </button>
                </div>
              </div>
              
              {/* Agent capabilities hint */}
              <div className="relative mt-3 flex items-center gap-2 text-[11px] text-indigo-200/50">
                <Sparkles className="w-3 h-3" />
                <span>I can handle 1,000+ conversations at once • 100+ languages • 24/7</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex-shrink-0 p-0.5">
                      <div className="w-full h-full rounded-full bg-slate-900 overflow-hidden">
                        <img 
                          src={banjoImg} 
                          alt="Banjo" 
                          className="w-full h-full object-cover object-top scale-125"
                        />
                      </div>
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-md"
                        : "bg-slate-800/80 text-slate-100 rounded-bl-md border border-indigo-500/20"
                    }`}
                  >
                    {message.role === "assistant" ? renderMessageContent(message.content) : message.content}
                    {message.role === "assistant" && message.content === "" && isLoading && (
                      <span className="inline-flex gap-1">
                        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </span>
                    )}
                  </div>
                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex-shrink-0 flex items-center justify-center">
                      <User className="w-4 h-4 text-slate-300" />
                    </div>
                  )}
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length <= 2 && (
              <div className="px-4 pb-3">
                <p className="text-[11px] text-indigo-300/50 mb-2 font-medium">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => handleSend(action.message)}
                      disabled={isLoading}
                      className="px-3 py-1.5 text-xs font-medium bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30 transition-all hover:border-indigo-500/50 disabled:opacity-50"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-indigo-500/20 bg-slate-900/80">
              <div className="flex items-center gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Banjo anything..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-slate-800/80 border border-indigo-500/20 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent disabled:opacity-50"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-center text-[10px] text-slate-500 mt-3">
                Powered by <span className="text-indigo-400 font-medium">Business Bots UK</span> • Banjo resolves 80% of queries instantly
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
