// import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { Agent } from "@convex-dev/agent";
import { components } from "../../../_generated/api";

export const supportAgent = new Agent(components.agent, {
    chat: google.chat("gemini-1.5-flash"),
    instructions: `You are a customer support agent. Use "resolveConversation" tool when user express finalization of the conversation. Use "escalateConversation" tool when user express frustration or need human assistance , or request a human explicitly.`,
});
