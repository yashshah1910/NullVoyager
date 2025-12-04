"use client";

import { ToolInvocation } from "ai";
import { DestinationsCard, DestinationsCardSkeleton } from "./cards/destinations-card";
import { FlightsCard, FlightsCardSkeleton } from "./cards/flights-card";
import { HotelsCard, HotelsCardSkeleton } from "./cards/hotels-card";
import { Loader2, AlertCircle, Wrench } from "lucide-react";

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
      <div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/20">
          <AlertCircle className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-medium">Failed to fetch results</p>
          <p className="text-xs text-red-400/70">Please try again or rephrase your request.</p>
        </div>
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
        <div className="rounded-xl border border-dark-border bg-dark-bg-secondary p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-dark-bg-tertiary">
              <Wrench className="h-3 w-3 text-dark-accent" />
            </div>
            <p className="text-sm font-medium text-dark-text-muted">
              {toolName}
            </p>
          </div>
          <pre className="overflow-x-auto text-xs text-dark-text-secondary bg-dark-bg-tertiary rounded-lg p-3 border border-dark-border">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      );
  }
}

function LoadingState({ toolName }: { toolName: string }) {
  const loadingMessages: Record<string, { title: string; subtitle: string }> = {
    suggest_destinations: { 
      title: "Discovering destinations", 
      subtitle: "Finding perfect places for you..." 
    },
    search_flights: { 
      title: "Searching flights", 
      subtitle: "Checking available routes and prices..." 
    },
    search_hotels: { 
      title: "Finding accommodations", 
      subtitle: "Looking for the best stays..." 
    },
  };

  const message = loadingMessages[toolName] || { title: "Processing", subtitle: "Please wait..." };

  // Render tool-specific skeletons
  switch (toolName) {
    case "suggest_destinations":
      return <DestinationsCardSkeleton message={message.subtitle} />;

    case "search_flights":
      return <FlightsCardSkeleton message={message.subtitle} />;

    case "search_hotels":
      return <HotelsCardSkeleton message={message.subtitle} />;

    default:
      return (
        <div className="flex items-center gap-3 rounded-xl border border-dark-border bg-dark-bg-secondary p-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-dark-accent/20">
            <Loader2 className="h-4 w-4 animate-spin text-dark-accent" />
          </div>
          <div>
            <p className="text-sm font-medium text-dark-text">{message.title}</p>
            <p className="text-xs text-dark-text-muted">{message.subtitle}</p>
          </div>
        </div>
      );
  }
}
