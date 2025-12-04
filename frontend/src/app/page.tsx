"use client";

import { Chat } from "@/components/chat";
import { Plane, Globe, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-dark-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-dark-border bg-dark-bg/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-dark-accent via-emerald-500 to-teal-400 shadow-lg shadow-dark-accent/20">
              <Plane className="h-4 w-4 text-white" />
              <div className="absolute -right-1 -top-1 flex h-3 w-3 items-center justify-center rounded-full bg-dark-bg">
                <Sparkles className="h-2 w-2 text-dark-accent" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-dark-text tracking-tight">NullVoyager</span>
              <span className="text-[10px] text-dark-text-muted -mt-0.5">AI Travel Concierge</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a 
              href="https://nullshot.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full bg-dark-bg-secondary px-3 py-1.5 text-xs text-dark-text-muted hover:text-dark-text hover:bg-dark-bg-tertiary transition-all border border-dark-border hover:border-dark-accent/50"
            >
              <Globe className="h-3 w-3" />
              <span>Powered by NullShot</span>
            </a>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1">
        <Chat />
      </div>
    </main>
  );
}
