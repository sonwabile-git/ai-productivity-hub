import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ListChecks, Loader2, Wand2, Plus, X, Search } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { ToolHeader, ToolShell } from "@/components/tool-shell";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { CopyButton } from "@/components/copy-button";
import { Markdown } from "@/components/markdown";
import { planTasks } from "@/lib/ai-tools.functions";

export const Route = createFileRoute("/tasks")({
  head: () => ({ meta: [{ title: "Task Planner — Nova" }] }),
  component: Page,
});

type Item = {
  id: string;
  title: string;
  deadline: string;
  category: string;
  priority: "High" | "Medium" | "Low";
};

const CATEGORIES = ["Work", "Personal", "Meetings", "Deep Work", "Admin"];
const PRIORITY_COLOR: Record<Item["priority"], string> = {
  High: "bg-destructive/15 text-destructive border-destructive/30",
  Medium: "bg-warning/15 text-warning border-warning/30",
  Low: "bg-success/15 text-success border-success/30",
};

function Page() {
  const run = useServerFn(planTasks);
  const [items, setItems] = useState<Item[]>([]);
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [category, setCategory] = useState("Work");
  const [priority, setPriority] = useState<Item["priority"]>("Medium");
  const [horizon, setHorizon] = useState<"Day" | "Week">("Day");
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const add = () => {
    if (!title.trim()) return;
    setItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: title.trim(),
        deadline,
        category,
        priority,
      },
    ]);
    setTitle("");
    setDeadline("");
  };

  const remove = (id: string) => setItems((p) => p.filter((i) => i.id !== id));

  const generate = async () => {
    if (items.length === 0) {
      toast.error("Add at least one task first.");
      return;
    }
    const goals = items
      .map(
        (i) =>
          `- [${i.priority}] ${i.title}${i.deadline ? ` (due ${i.deadline})` : ""} [${i.category}]`,
      )
      .join("\n");
    setLoading(true);
    try {
      const res = await run({ data: { goals, horizon } });
      setOutput(res.text);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  const visible = items.filter((i) =>
    [i.title, i.category, i.priority].join(" ").toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <ToolShell>
      <ToolHeader
        icon={ListChecks}
        title="AI Task Planner"
        description="Add your tasks, set priorities and deadlines — let Nova build a smart schedule."
      />
      <AiDisclaimer />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Your tasks
          </h3>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Task</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Finish project proposal draft"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-2">
                <Label>Deadline</Label>
                <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as Item["priority"])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="button" variant="outline" onClick={add} className="w-full">
              <Plus /> Add task
            </Button>
          </div>

          {items.length > 0 && (
            <div className="mt-6 space-y-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="Filter tasks…"
                  className="pl-8"
                />
              </div>
              <ul className="space-y-2">
                <AnimatePresence>
                  {visible.map((i) => (
                    <motion.li
                      key={i.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      className="flex items-center justify-between gap-2 rounded-lg border border-border bg-background/60 p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">{i.title}</div>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                          <Badge variant="outline" className={PRIORITY_COLOR[i.priority]}>
                            {i.priority}
                          </Badge>
                          <Badge variant="secondary">{i.category}</Badge>
                          {i.deadline && <span>due {i.deadline}</span>}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => remove(i.id)}
                        aria-label="Remove"
                      >
                        <X />
                      </Button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </div>
          )}

          <div className="mt-6 flex items-end gap-2">
            <div className="flex-1 space-y-2">
              <Label>Plan horizon</Label>
              <Select value={horizon} onValueChange={(v) => setHorizon(v as "Day" | "Week")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Day">Today</SelectItem>
                  <SelectItem value="Week">This week</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={generate}
              disabled={loading || items.length === 0}
              className="bg-gradient-primary"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Wand2 />}
              Generate plan
            </Button>
          </div>
        </Card>

        <Card className="flex min-h-[400px] flex-col p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Smart plan
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
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Building your schedule…
              </motion.div>
            ) : output ? (
              <motion.div key="o" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <Markdown>{output}</Markdown>
              </motion.div>
            ) : (
              <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
                Your plan will appear here.
              </div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </ToolShell>
  );
}
