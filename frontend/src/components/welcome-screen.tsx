"use client";

import { Plane, MapPin, Sparkles, Compass, Globe, Zap, Shield } from "lucide-react";

interface WelcomeScreenProps {
  onPromptClick: (prompt: string) => void;
  prompts: string[];
}

export function WelcomeScreen({ onPromptClick, prompts }: WelcomeScreenProps) {
  const icons = [Plane, MapPin, Sparkles, Compass];

  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Animated Logo */}
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-dark-accent via-emerald-500 to-teal-400 blur-2xl opacity-30 animate-pulse" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-dark-accent via-emerald-500 to-teal-400 shadow-2xl shadow-dark-accent/30">
          <Plane className="h-10 w-10 text-white" />
        </div>
        <div className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-dark-bg border-2 border-dark-accent shadow-lg">
          <Sparkles className="h-4 w-4 text-dark-accent animate-pulse" />
        </div>
      </div>

      {/* Title & Description */}
      <div className="text-center mb-8">
        <h1 className="mb-3 text-3xl font-bold text-dark-text tracking-tight">
          Welcome to <span className="bg-gradient-to-r from-dark-accent via-emerald-400 to-teal-400 bg-clip-text text-transparent">NullVoyager</span>
        </h1>
        <p className="text-dark-text-muted max-w-lg mx-auto leading-relaxed">
          Your AI-powered travel concierge. I help you discover destinations,
          find flights, and book hotels for your perfect adventure.
        </p>
      </div>

      {/* Hackathon Badge */}
      <div className="mb-8 flex items-center gap-2 rounded-full bg-dark-bg-secondary px-4 py-2 border border-dark-border">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-dark-accent/20">
          <Zap className="h-3 w-3 text-dark-accent" />
        </div>
        <span className="text-xs text-dark-text-muted">
          Built for <span className="text-dark-accent font-medium">NullShot Hacks S0</span>
        </span>
      </div>

      {/* Suggested Prompts */}
      <div className="w-full max-w-2xl mb-10">
        <p className="text-xs text-dark-text-muted text-center mb-4 uppercase tracking-wider">Try asking</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {prompts.map((prompt, index) => {
            const Icon = icons[index % icons.length];
            return (
              <button
                key={index}
                onClick={() => onPromptClick(prompt)}
                className="group flex items-start gap-3 rounded-xl border border-dark-border bg-dark-bg-secondary p-4 text-left transition-all duration-300 hover:border-dark-accent/50 hover:bg-dark-bg-tertiary hover:shadow-lg hover:shadow-dark-accent/5 card-hover"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-dark-bg-tertiary group-hover:bg-dark-accent/20 transition-colors">
                  <Icon className="h-4 w-4 text-dark-text-muted group-hover:text-dark-accent transition-colors" />
                </div>
                <span className="text-sm text-dark-text group-hover:text-white transition-colors">{prompt}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Features */}
      <div className="flex flex-wrap justify-center gap-6 text-xs text-dark-text-muted">
        <div className="flex items-center gap-2 bg-dark-bg-secondary px-3 py-1.5 rounded-full border border-dark-border">
          <Plane className="h-3 w-3 text-dark-accent" />
          <span>Real-time flights</span>
        </div>
        <div className="flex items-center gap-2 bg-dark-bg-secondary px-3 py-1.5 rounded-full border border-dark-border">
          <MapPin className="h-3 w-3 text-dark-accent" />
          <span>Hotel search</span>
        </div>
        <div className="flex items-center gap-2 bg-dark-bg-secondary px-3 py-1.5 rounded-full border border-dark-border">
          <Globe className="h-3 w-3 text-dark-accent" />
          <span>Smart destinations</span>
        </div>
        <div className="flex items-center gap-2 bg-dark-bg-secondary px-3 py-1.5 rounded-full border border-dark-border">
          <Shield className="h-3 w-3 text-dark-accent" />
          <span>Stateful sessions</span>
        </div>
      </div>
    </div>
  );
}
