import { createFileRoute } from "@tanstack/react-router";
import { useTheme } from "next-themes";
import { Settings as SettingsIcon, Moon, Sun, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ToolHeader, ToolShell } from "@/components/tool-shell";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Nova" }] }),
  component: Page,
});

function Page() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const clearAll = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("nova-chat-messages-v1");
      toast.success("Local chat history cleared");
    }
  };

  return (
    <ToolShell>
      <ToolHeader
        icon={SettingsIcon}
        title="Settings"
        description="Personalize Nova and review responsible-AI guidance."
      />

      <Card className="p-6">
        <h3 className="font-display text-base font-semibold">Appearance</h3>
        <Separator className="my-4" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            <div>
              <Label className="text-sm font-medium">Dark mode</Label>
              <p className="text-xs text-muted-foreground">
                Switch between light and dark themes.
              </p>
            </div>
          </div>
          <Switch checked={isDark} onCheckedChange={(v) => setTheme(v ? "dark" : "light")} />
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-display text-base font-semibold">Data</h3>
        <Separator className="my-4" />
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Local chat history</Label>
            <p className="text-xs text-muted-foreground">
              Conversations with the chatbot are stored in your browser only.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={clearAll}>
            <Trash2 /> Clear history
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <h3 className="font-display text-base font-semibold">Responsible AI</h3>
        </div>
        <Separator className="my-4" />
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li>
            <strong className="text-foreground">Always review outputs.</strong> AI can make
            mistakes — verify facts, names, and figures before sending anything
            externally.
          </li>
          <li>
            <strong className="text-foreground">Keep data confidential.</strong> Don't paste
            secrets, personal data, or regulated information into prompts.
          </li>
          <li>
            <strong className="text-foreground">Inclusive language.</strong> Read drafts
            for tone and bias; adjust to match your audience and culture.
          </li>
          <li>
            <strong className="text-foreground">No harmful prompts.</strong> Nova declines
            requests that promote harm, illegal activity, or deception.
          </li>
          <li>
            <strong className="text-foreground">Human in the loop.</strong> Treat Nova as
            a co-pilot, not a decision maker. You own the final output.
          </li>
        </ul>
      </Card>

      <p className="text-center text-xs text-muted-foreground">
        Nova v1.0 — built with Lovable AI.
      </p>
    </ToolShell>
  );
}
