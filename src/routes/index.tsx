import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Mail,
  FileText,
  ListChecks,
  Search,
  MessageSquare,
  ArrowUpRight,
  Sparkles,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Nova" },
      {
        name: "description",
        content: "Your AI productivity command center. Generate emails, summarize meetings, plan tasks, and more.",
      },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    title: "Smart Email Generator",
    desc: "Draft polished emails in seconds — pick tone, edit, copy.",
    icon: Mail,
    href: "/email",
    color: "from-indigo-500 to-violet-500",
  },
  {
    title: "Meeting Summarizer",
    desc: "Turn raw notes into action items, decisions, and deadlines.",
    icon: FileText,
    href: "/summarize",
    color: "from-fuchsia-500 to-pink-500",
  },
  {
    title: "AI Task Planner",
    desc: "Prioritized daily or weekly schedules built around your goals.",
    icon: ListChecks,
    href: "/tasks",
    color: "from-emerald-500 to-teal-500",
  },
  {
    title: "Research Assistant",
    desc: "Briefings with insights, recommendations, and follow-ups.",
    icon: Search,
    href: "/research",
    color: "from-amber-500 to-orange-500",
  },
  {
    title: "AI Chatbot",
    desc: "A workplace co-pilot for quick questions and brainstorming.",
    icon: MessageSquare,
    href: "/chat",
    color: "from-sky-500 to-blue-500",
  },
];

const stats = [
  { label: "Tools", value: "5", icon: Sparkles },
  { label: "Avg. response", value: "<3s", icon: Zap },
  { label: "Ethical AI", value: "Built-in", icon: ShieldCheck },
];

function Dashboard() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 p-6 md:p-10">
      <motion.section
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl border border-border/60 bg-card p-8 shadow-elegant md:p-12"
      >
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-primary opacity-20 blur-3xl" />
        <div className="absolute -bottom-32 -left-10 h-72 w-72 rounded-full bg-primary-glow/20 blur-3xl" />
        <div className="relative">
          <Badge variant="secondary" className="mb-4 gap-1">
            <Sparkles className="h-3 w-3" /> Powered by Lovable AI
          </Badge>
          <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
            Your AI <span className="text-gradient">workplace co-pilot</span>
          </h1>
          <p className="mt-3 max-w-xl text-base text-muted-foreground md:text-lg">
            Draft emails, summarize meetings, plan your day, research anything, and chat —
            all from one elegant dashboard.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/chat"
              className="inline-flex h-10 items-center justify-center rounded-full bg-gradient-primary px-6 text-sm font-medium text-primary-foreground shadow-elegant transition-transform hover:scale-[1.02]"
            >
              Try the AI Chatbot
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
            <Link
              to="/email"
              className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-background px-6 text-sm font-medium hover:bg-accent"
            >
              Generate an email
            </Link>
          </div>
        </div>
      </motion.section>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <s.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                {s.label}
              </div>
              <div className="font-display text-xl font-semibold">{s.value}</div>
            </div>
          </Card>
        ))}
      </div>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-display text-xl font-semibold tracking-tight">Tools</h2>
          <p className="text-sm text-muted-foreground">Pick a workflow to get started</p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((t, i) => (
            <motion.div
              key={t.href}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Link to={t.href} className="group block">
                <Card className="h-full overflow-hidden p-5 transition-all hover:-translate-y-0.5 hover:shadow-elegant">
                  <div
                    className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${t.color} text-white shadow-soft`}
                  >
                    <t.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-lg font-semibold tracking-tight">
                    {t.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
                  <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    Open
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
