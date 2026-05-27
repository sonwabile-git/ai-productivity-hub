import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { DEFAULT_MODEL, getGateway } from "./ai-gateway.server";

const BLOCKED = /\b(kill|bomb|weapon|hack into|illegal drugs|child|nsfw)\b/i;

function guard(text: string) {
  if (BLOCKED.test(text)) {
    throw new Error(
      "This request appears to violate our responsible AI policy. Please rephrase.",
    );
  }
}

async function run(system: string, prompt: string) {
  guard(prompt);
  const { text } = await generateText({
    model: getGateway()(DEFAULT_MODEL),
    system,
    prompt,
  });
  return { text };
}

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      topic: z.string().min(3).max(2000),
      recipient: z.string().max(200).optional(),
      tone: z.enum(["Formal", "Friendly", "Persuasive"]),
    }),
  )
  .handler(({ data }) =>
    run(
      `You are an expert email writer. Write a clear, ${data.tone.toLowerCase()} professional email.
Output only the email (Subject line + greeting + body + sign-off). Use markdown.`,
      `Recipient: ${data.recipient || "[recipient]"}\nTopic / context:\n${data.topic}`,
    ),
  );

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator(z.object({ notes: z.string().min(20).max(20000) }))
  .handler(({ data }) =>
    run(
      `You are a meeting analyst. Given raw meeting notes, produce a structured markdown summary with these exact sections:
## Overview
A 2-3 sentence summary.
## Key Discussion Points
- bullet list
## Decisions Made
- bullet list
## Action Items
- [ ] Owner — task
## Deadlines
- date — what is due
If a section has no content, write "_None_".`,
      data.notes,
    ),
  );

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      goals: z.string().min(5).max(4000),
      horizon: z.enum(["Day", "Week"]),
    }),
  )
  .handler(({ data }) =>
    run(
      `You are a productivity coach. Build a prioritized ${data.horizon.toLowerCase()} plan using the Eisenhower matrix.
Output markdown with:
## Priorities (P1 / P2 / P3)
A ranked checklist with estimated time and category tag.
## Schedule
Time-blocked schedule (table) with focus blocks and breaks.
## Tips
2-3 actionable productivity tips for this plan.`,
      data.goals,
    ),
  );

export const researchTopic = createServerFn({ method: "POST" })
  .inputValidator(z.object({ query: z.string().min(3).max(2000) }))
  .handler(({ data }) =>
    run(
      `You are a research assistant. Provide a concise briefing on the user's topic.
Output markdown with:
## Summary
2-3 paragraphs of neutral, factual overview.
## Key Insights
- 5 bullet insights
## Recommendations
- 3 actionable recommendations
## Further Exploration
- suggested subtopics to investigate
Note: Knowledge may not include the latest events. Recommend verifying time-sensitive facts.`,
      data.query,
    ),
  );
