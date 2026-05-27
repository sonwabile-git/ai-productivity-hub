import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { FileText, Loader2, Wand2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ToolHeader, ToolShell } from "@/components/tool-shell";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { CopyButton } from "@/components/copy-button";
import { Markdown } from "@/components/markdown";
import { summarizeMeeting } from "@/lib/ai-tools.functions";

export const Route = createFileRoute("/summarize")({
  head: () => ({ meta: [{ title: "Meeting Summarizer — Nova" }] }),
  component: Page,
});

const SAMPLE = `Paste raw meeting notes or transcript here. Nova will extract the key points, decisions, action items, and deadlines.`;

function Page() {
  const run = useServerFn(summarizeMeeting);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (notes.trim().length < 20) {
      toast.error("Paste at least 20 characters of notes.");
      return;
    }
    setLoading(true);
    try {
      const res = await run({ data: { notes } });
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
        icon={FileText}
        title="Meeting Notes Summarizer"
        description="Drop in long notes or transcripts — get a clean structured summary."
      />
      <AiDisclaimer />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Meeting notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={SAMPLE}
                rows={18}
                maxLength={20000}
              />
              <div className="text-right text-xs text-muted-foreground">
                {notes.length.toLocaleString()} / 20,000
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-primary"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Wand2 />}
              {loading ? "Summarizing…" : "Summarize"}
            </Button>
          </form>
        </Card>

        <Card className="flex min-h-[400px] flex-col p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Summary
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
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Extracting key points…
              </motion.div>
            ) : output ? (
              <motion.div key="o" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <Markdown>{output}</Markdown>
              </motion.div>
            ) : (
              <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
                Your summary will appear here.
              </div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </ToolShell>
  );
}
