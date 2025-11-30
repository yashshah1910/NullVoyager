import { Hono } from "hono";
import { cors } from "hono/cors";
import { ToolboxService } from "@nullshot/agent";
import { stepCountIs, type LanguageModel, type Provider } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { AiSdkAgent, AIUISDKMessage } from "@nullshot/agent";
import mcpConfig from "../mcp.json";
import { createOpenAI } from "@ai-sdk/openai";
import type { VoyagerState, AgentMode } from "./types";

// Define environment bindings interface for TypeScript so env.AI_PROVIDER_API_KEY and other bindings are recognized
declare global {
  interface Env {
    AGENT: DurableObjectNamespace;
    AI_PROVIDER: "openai" | "anthropic";
    AI_PROVIDER_API_KEY: string;
    MODEL_ID: string;
  }
}

// Default initial state for new voyagers
const DEFAULT_VOYAGER_STATE: VoyagerState = {
  mode: "INSPIRATION",
  preferences: {
    travelers: 1,
  },
  cart: {},
};

// Dynamic system prompt based on agent mode
function getSystemPrompt(state: VoyagerState): string {
  const baseContext = `You are NullVoyager, an expert Travel Concierge AI assistant. You help users plan and book their perfect trips.

Current User Context:
- Travelers: ${state.preferences.travelers}
${state.preferences.originCity ? `- Origin: ${state.preferences.originCity}` : ""}
${state.preferences.destinationCity ? `- Destination: ${state.preferences.destinationCity}` : ""}
${state.preferences.dates ? `- Travel Dates: ${state.preferences.dates.start} to ${state.preferences.dates.end}` : ""}
${state.preferences.budget ? `- Budget: $${state.preferences.budget}` : ""}

You have access to the following tools:
- search_flights: Search for available flights between cities
- google_hotels: Search for hotels at a destination
- suggest_destinations: Get destination recommendations based on preferences

`;

  const modeInstructions: Record<AgentMode, string> = {
    INSPIRATION: `CURRENT MODE: INSPIRATION
You are in discovery mode. Your goal is to inspire the user and help them explore potential destinations.
- Ask about their travel style, interests, and what kind of experience they're looking for
- Use the suggest_destinations tool to recommend places that match their preferences
- Share interesting facts about destinations to spark their curiosity
- Help them narrow down their options before moving to detailed planning
- Once they express interest in a specific destination, suggest transitioning to PLANNING mode`,

    PLANNING: `CURRENT MODE: PLANNING
You are in planning mode. The user has a destination in mind and needs help with logistics.
- Help them finalize travel dates and number of travelers
- Use search_flights to find the best flight options
- Use google_hotels to find accommodation that fits their budget and preferences
- Provide detailed comparisons of options (price, amenities, location)
- Help them understand the full cost breakdown
- Once they're ready to make selections, suggest transitioning to BOOKING mode`,

    BOOKING: `CURRENT MODE: BOOKING
You are in booking mode. The user is ready to finalize their trip.
- Review their selected flights and hotels from the cart
- Confirm all details before proceeding (names, dates, special requests)
- Guide them through the booking process step by step
- Provide confirmation details and next steps
- Offer tips for their upcoming trip`,
  };

  return baseContext + modeInstructions[state.mode];
}

// Instantiate application with Hono
const app = new Hono<{ Bindings: Env }>();

app.use(
  "*",
  cors({
    origin: "*", // Allow any origin for development; restrict this in production
    allowMethods: ["POST", "GET", "OPTIONS"],
    allowHeaders: ["Content-Type"],
    exposeHeaders: ["X-Session-Id"],
    maxAge: 86400, // 24 hours
  })
);

// Route all requests to the durable object instance based on session
app.all("/agent/chat/:sessionId?", async (c) => {
  const { AGENT } = c.env;
  var sessionIdStr = c.req.param("sessionId");

  if (!sessionIdStr || sessionIdStr == "") {
    sessionIdStr = crypto.randomUUID();
  }

  const id = AGENT.idFromName(sessionIdStr);

  const forwardRequest = new Request("https://internal.com/agent/chat/" + sessionIdStr, {
    method: c.req.method,
    body: c.req.raw.body,
  });

  // Forward to Durable Object and get response
  return await AGENT.get(id).fetch(forwardRequest);
});

// Storage key for persisting voyager state
const VOYAGER_STATE_KEY = "voyager_state";

export class TravelConciergeAgent extends AiSdkAgent<Env> {
  constructor(state: DurableObjectState, env: Env) {
    // Use string model identifier - AI SDK v5 supports this directly
    let provider: Provider;
    let model: LanguageModel;
    switch (env.AI_PROVIDER) {
      case "openai":
        provider = createOpenAI({ apiKey: env.AI_PROVIDER_API_KEY });
        model = provider.languageModel(env.MODEL_ID);
        break;

      case "anthropic":
        provider = createAnthropic({
          apiKey: env.AI_PROVIDER_API_KEY,
        });

        // Get the actual model object
        model = provider.languageModel(env.MODEL_ID);
        break;
      default:
        // This should never happen due to validation above, but TypeScript requires this
        throw new Error(`Unsupported AI provider: ${env.AI_PROVIDER}`);
    }

    super(state, env, model, [new ToolboxService(env, mcpConfig)]);
  }

  // Load voyager state from Durable Object storage
  private async loadVoyagerState(): Promise<VoyagerState> {
    const stored = await this.state.storage.get<VoyagerState>(VOYAGER_STATE_KEY);
    return stored ?? { ...DEFAULT_VOYAGER_STATE };
  }

  // Save voyager state to Durable Object storage
  private async saveVoyagerState(voyagerState: VoyagerState): Promise<void> {
    await this.state.storage.put(VOYAGER_STATE_KEY, voyagerState);
  }

  // Update specific fields in voyager state
  async updateVoyagerState(updates: Partial<VoyagerState>): Promise<VoyagerState> {
    const current = await this.loadVoyagerState();
    const updated: VoyagerState = {
      ...current,
      ...updates,
      preferences: {
        ...current.preferences,
        ...(updates.preferences ?? {}),
      },
      cart: {
        ...current.cart,
        ...(updates.cart ?? {}),
      },
    };
    await this.saveVoyagerState(updated);
    return updated;
  }

  // Transition to a new mode
  async transitionMode(newMode: AgentMode): Promise<VoyagerState> {
    return this.updateVoyagerState({ mode: newMode });
  }

  async processMessage(sessionId: string, messages: AIUISDKMessage): Promise<Response> {
    // Load the current voyager state for this session
    const voyagerState = await this.loadVoyagerState();

    // Generate dynamic system prompt based on current state
    const systemPrompt = getSystemPrompt(voyagerState);

    // Use the protected streamTextWithMessages method - model is handled automatically by the agent
    const result = await this.streamTextWithMessages(sessionId, messages.messages, {
      system: systemPrompt,
      maxSteps: 10,
      stopWhen: stepCountIs(10),
      // Enable MCP tools from imported mcp.json
      experimental_toolCallStreaming: true,
      onError: (error: unknown) => {
        console.error("Error processing message", error);
      },
    });

    return result.toTextStreamResponse();
  }
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return app.fetch(request, env, ctx);
  },
};
