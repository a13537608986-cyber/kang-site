import { createChatHandler } from "@/lib/chat/server";

export const runtime = "nodejs";
export const maxDuration = 60;
export const POST = createChatHandler();
