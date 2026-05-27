import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Mail, Loader2, Wand2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToolHeader, ToolShell } from "@/components/tool-shell";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { CopyButton } from "@/components/copy-button";
import { Markdown } from "@/components/markdown";
import { generateEmail } from "@/lib/ai-tools.functions";

export const Route = createFileRoute("/email")({
  head: () => ({ meta: [{ title: "Email Generator — Nova" }] }),
  component: EmailPage,
});

function EmailPage() {
  const run = useServerFn(generateEmail);
  const [topic, setTopic] = useState("");
  const [recipient, setRecipient] = useState("");
  const [tone, setTone] = useState<"Formal" | "Friendly" | "Persuasive">("Formal");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const res = await run({ data: { topic, recipient, tone } });
      setOutput(res.text);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolShell>
      <ToolHeader
        icon={Mail}
        title="Smart Email Generator"
        description="Describe the email you need — Nova drafts it in your chosen tone."
      />
      <AiDisclaimer />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient (optional)</Label>
              <Input
                id="recipient"
                placeholder="e.g. Sarah, Marketing Team"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                maxLength={200}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={tone} onValueChange={(v) => setTone(v as typeof tone)}>
                <SelectTrigger id="tone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Formal">Formal</SelectItem>
                  <SelectItem value="Friendly">Friendly</SelectItem>
                  <SelectItem value="Persuasive">Persuasive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="topic">What is the email about?</Label>
              <Textarea
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Request a one-week extension on the Q4 report and propose a new deadline"
                rows={8}
                maxLength={2000}
              />
            </div>
            <Button
              type="submit"
              disabled={loading || !topic.trim()}
              className="w-full bg-gradient-primary"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Wand2 />}
              {loading ? "Drafting…" : "Generate email"}
            </Button>
          </form>
        </Card>

        <Card className="flex min-h-[400px] flex-col p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Draft
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
                className="flex flex-1 items-center justify-center text-sm text-muted-foreground"
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Drafting your email…
              </motion.div>
            ) : output ? (
              <motion.div
                key="o"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Textarea
                  value={output}
                  onChange={(e) => setOutput(e.target.value)}
                  rows={16}
                  className="font-mono text-xs"
                />
                <div className="mt-3 rounded-lg border border-border/60 bg-muted/40 p-4">
                  <Markdown>{output}</Markdown>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-1 items-center justify-center text-center text-sm text-muted-foreground">
                Your draft will appear here.
              </div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </ToolShell>
  );
}
