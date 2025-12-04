"use client";

import { Plane, MapPin, Sparkles, Compass } from "lucide-react";

interface WelcomeScreenProps {
  onPromptClick: (prompt: string) => void;
  prompts: string[];
}

export function WelcomeScreen({ onPromptClick, prompts }: WelcomeScreenProps) {
  const icons = [Plane, MapPin, Sparkles, Compass];

  return (
    <div className="flex flex-col items-center justify-center py-16">
      {/* Logo */}
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-dark-accent to-emerald-600">
        <Plane className="h-8 w-8 text-white" />
      </div>

      {/* Title */}
      <h1 className="mb-2 text-2xl font-semibold text-dark-text">
        Welcome to NullVoyager
      </h1>
      <p className="mb-8 text-center text-dark-text-muted max-w-md">
        Your AI-powered travel concierge. I can help you discover destinations,
        find flights, and book hotels for your perfect trip.
      </p>

      {/* Suggested Prompts */}
      <div className="grid w-full max-w-2xl gap-3 sm:grid-cols-2">
        {prompts.map((prompt, index) => {
          const Icon = icons[index % icons.length];
          return (
            <button
              key={index}
              onClick={() => onPromptClick(prompt)}
              className="flex items-start gap-3 rounded-xl border border-dark-border bg-dark-bg-secondary p-4 text-left transition-all hover:border-dark-text-muted hover:bg-dark-bg-tertiary card-hover"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-dark-bg-tertiary">
                <Icon className="h-4 w-4 text-dark-accent" />
              </div>
              <span className="text-sm text-dark-text">{prompt}</span>
            </button>
          );
        })}
      </div>

      {/* Features */}
      <div className="mt-12 flex flex-wrap justify-center gap-6 text-xs text-dark-text-muted">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-dark-accent" />
          <span>Real-time flight search</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-dark-accent" />
          <span>Hotel recommendations</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-dark-accent" />
          <span>Personalized suggestions</span>
        </div>
      </div>
    </div>
  );
}
