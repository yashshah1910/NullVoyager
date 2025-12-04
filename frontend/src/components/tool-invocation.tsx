"use client";

import { ToolInvocation } from "ai";
import { DestinationsCard, DestinationsCardSkeleton } from "./cards/destinations-card";
import { FlightsCard, FlightsCardSkeleton } from "./cards/flights-card";
import { HotelsCard, HotelsCardSkeleton } from "./cards/hotels-card";
import { Loader2, AlertCircle } from "lucide-react";

interface ToolInvocationRendererProps {
  toolInvocation: ToolInvocation;
}

export function ToolInvocationRenderer({ toolInvocation }: ToolInvocationRendererProps) {
  const { toolName, state } = toolInvocation;
  const isLoading = state !== "result";
  const result = state === "result" ? toolInvocation.result : null;

  // Render loading state
  if (isLoading) {
    return <LoadingState toolName={toolName} />;
  }

  // Handle error state
  if (result?.error) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-red-400">
        <AlertCircle className="h-4 w-4" />
        <span className="text-sm">Failed to fetch results. Please try again.</span>
      </div>
    );
  }

  // Render tool-specific results
  switch (toolName) {
    case "suggest_destinations":
      return <DestinationsCard data={result} />;

    case "search_flights":
      return <FlightsCard data={result} />;

    case "search_hotels":
      return <HotelsCard data={result} />;

    default:
      return (
        <div className="rounded-lg border border-dark-border bg-dark-bg-secondary p-3">
          <p className="text-sm text-dark-text-muted">
            Tool: {toolName}
          </p>
          <pre className="mt-2 overflow-x-auto text-xs text-dark-text">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      );
  }
}

function LoadingState({ toolName }: { toolName: string }) {
  const loadingMessages: Record<string, string> = {
    suggest_destinations: "Finding perfect destinations for you...",
    search_flights: "Searching for the best flights...",
    search_hotels: "Looking for accommodations...",
  };

  const message = loadingMessages[toolName] || "Processing...";

  // Render tool-specific skeletons
  switch (toolName) {
    case "suggest_destinations":
      return <DestinationsCardSkeleton message={message} />;

    case "search_flights":
      return <FlightsCardSkeleton message={message} />;

    case "search_hotels":
      return <HotelsCardSkeleton message={message} />;

    default:
      return (
        <div className="flex items-center gap-2 rounded-lg border border-dark-border bg-dark-bg-secondary p-4">
          <Loader2 className="h-4 w-4 animate-spin text-dark-accent" />
          <span className="text-sm text-dark-text-muted">{message}</span>
        </div>
      );
  }
}
