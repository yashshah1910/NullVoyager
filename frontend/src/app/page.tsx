"use client";

import { Chat } from "@/components/chat";
import { Plane } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-dark-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-dark-border bg-dark-bg/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-dark-accent">
              <Plane className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-dark-text">NullVoyager</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-dark-text-muted">AI Travel Concierge</span>
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
