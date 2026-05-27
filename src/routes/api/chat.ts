import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { DEFAULT_MODEL, getGateway } from "@/lib/ai-gateway.server";

const SYSTEM = `You are Nova, a friendly and knowledgeable AI workplace productivity assistant.
Help professionals with productivity tips, workflow advice, communication, time management,
meeting facilitation, and general workplace questions. Be concise, warm, and actionable.
Use markdown formatting (lists, bold) where helpful. Refuse harmful, unethical, or
inappropriate requests politely.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as { messages: UIMessage[] };
        if (!Array.isArray(messages)) {
          return new Response("messages required", { status: 400 });
        }
        const gateway = getGateway();
        const result = streamText({
          model: gateway(DEFAULT_MODEL),
          system: SYSTEM,
          messages: await convertToModelMessages(messages),
        });
        return result.toUIMessageStreamResponse({ originalMessages: messages });
      },
    },
  },
});
