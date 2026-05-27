import { AlertTriangle } from "lucide-react";

export function AiDisclaimer({ className }: { className?: string }) {
  return (
    <div
      className={
        "flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/5 px-3 py-2 text-xs text-muted-foreground " +
        (className ?? "")
      }
    >
      <AlertTriangle className="h-4 w-4 shrink-0 text-warning" />
      <p>
        <span className="font-medium text-foreground">AI disclaimer:</span> Outputs may
        contain errors or bias. Review and edit before professional use. Avoid sharing
        confidential information.
      </p>
    </div>
  );
}
