import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { MessageSquare, RotateCcw, Sparkles } from "lucide-react";
import novaLogo from "@/assets/nova-logo.png";
import { Button } from "@/components/ui/button";
import { ToolHeader, ToolShell } from "@/components/tool-shell";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "AI Chatbot — Nova" }] }),
  component: Page,
});

const STORAGE_KEY = "nova-chat-messages-v1";

const SUGGESTIONS = [
  "How can I run a more focused 1:1 meeting?",
  "Give me 3 quick productivity tips for today.",
  "Help me say no politely to a low-priority request.",
  "What's a simple weekly review template?",
];

function Page() {
  const [initial, setInitial] = useState<UIMessage[]>([]);
  const loaded = useRef(false);
  if (!loaded.current && typeof window !== "undefined") {
    loaded.current = true;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setInitial(JSON.parse(raw) as UIMessage[]);
    } catch {
      /* ignore */
    }
  }

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    messages: initial,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* ignore */
    }
  }, [messages]);

  const [input, setInput] = useState("");
  const isLoading = status === "submitted" || status === "streaming";

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    sendMessage({ text });
  };

  const clear = () => {
    setMessages([]);
    if (typeof window !== "undefined") localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <ToolShell>
      <div className="flex items-center justify-between">
        <ToolHeader
          icon={MessageSquare}
          title="AI Workplace Chatbot"
          description="Nova — your always-on productivity co-pilot."
        />
        {messages.length > 0 && (
          <Button variant="outline" size="sm" onClick={clear}>
            <RotateCcw /> New chat
          </Button>
        )}
      </div>
      <AiDisclaimer />

      <div className="flex h-[calc(100vh-19rem)] min-h-[480px] flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-elegant">
        <Conversation className="flex-1">
          <ConversationContent className="px-4 py-6 md:px-8">
            {messages.length === 0 ? (
              <ConversationEmptyState
                icon={
                  <img
                    src={novaLogo}
                    alt="Nova"
                    width={64}
                    height={64}
                    className="h-16 w-16"
                  />
                }
                title="Hi, I'm Nova"
                description="Ask anything about productivity, communication, or workflow."
              >
                <div className="mt-4 grid w-full max-w-xl grid-cols-1 gap-2 sm:grid-cols-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => sendMessage({ text: s })}
                      className="rounded-xl border border-border bg-background/60 px-3 py-2 text-left text-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft"
                    >
                      <Sparkles className="mr-1 inline h-3.5 w-3.5 text-primary" />
                      {s}
                    </button>
                  ))}
                </div>
              </ConversationEmptyState>
            ) : (
              messages.map((m) => {
                const text = m.parts
                  .map((p) => (p.type === "text" ? p.text : ""))
                  .join("");
                return (
                  <Message key={m.id} from={m.role}>
                    <MessageContent>
                      {m.role === "assistant" ? (
                        <MessageResponse>{text}</MessageResponse>
                      ) : (
                        <span className="whitespace-pre-wrap">{text}</span>
                      )}
                    </MessageContent>
                  </Message>
                );
              })
            )}
            {status === "submitted" && (
              <Message from="assistant">
                <MessageContent>
                  <Shimmer>Thinking…</Shimmer>
                </MessageContent>
              </Message>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <div className="border-t border-border/60 bg-background/60 p-3 backdrop-blur md:p-4">
          <PromptInput onSubmit={submit}>
            <PromptInputTextarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message Nova…"
              autoFocus
            />
            <PromptInputFooter className="justify-end">
              <PromptInputSubmit status={status} disabled={!input.trim() && !isLoading} />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </ToolShell>
  );
}
