import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Search, Loader2, Wand2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ToolHeader, ToolShell } from "@/components/tool-shell";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { CopyButton } from "@/components/copy-button";
import { Markdown } from "@/components/markdown";
import { researchTopic } from "@/lib/ai-tools.functions";

export const Route = createFileRoute("/research")({
  head: () => ({ meta: [{ title: "Research Assistant — Nova" }] }),
  component: Page,
});

const SUGGESTIONS = [
  "Remote vs hybrid work productivity",
  "Best practices for async communication",
  "OKRs vs KPIs for small teams",
  "Reducing meeting fatigue",
];

function Page() {
  const run = useServerFn(researchTopic);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const submit = async (e?: React.FormEvent, override?: string) => {
    e?.preventDefault();
    const q = (override ?? query).trim();
    if (q.length < 3) return;
    setQuery(q);
    setLoading(true);
    try {
      const res = await run({ data: { query: q } });
      setOutput(res.text);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolShell>
      <ToolHeader
        icon={Search}
        title="AI Research Assistant"
        description="Get briefings with insights and recommendations on any topic."
      />
      <AiDisclaimer />

      <Card className="p-5">
        <form onSubmit={(e) => submit(e)} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Research a topic, article, or report…"
              className="pl-9 h-11"
              maxLength={2000}
            />
          </div>
          <Button
            type="submit"
            disabled={loading || query.trim().length < 3}
            className="h-11 bg-gradient-primary px-6"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Wand2 />}
            Research
          </Button>
        </form>
        <div className="mt-4 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <Badge
              key={s}
              variant="secondary"
              className="cursor-pointer hover:bg-accent"
              onClick={() => submit(undefined, s)}
            >
              {s}
            </Badge>
          ))}
        </div>
      </Card>

      <Card className="min-h-[400px] p-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Briefing
          </h3>
          {output && <CopyButton text={output} />}
        </div>
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="l"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-48 items-center justify-center text-sm text-muted-foreground"
            >
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Researching…
            </motion.div>
          ) : output ? (
            <motion.div key="o" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <Markdown>{output}</Markdown>
            </motion.div>
          ) : (
            <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
              Ask anything to begin.
            </div>
          )}
        </AnimatePresence>
      </Card>
    </ToolShell>
  );
}
