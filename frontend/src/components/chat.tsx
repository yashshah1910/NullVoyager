"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { Send, Loader2, Sparkles, RotateCcw, Plane } from "lucide-react";
import { ChatMessage } from "./chat-message";
import { WelcomeScreen } from "./welcome-screen";
import { cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

export function Chat() {
  const [sessionId] = useState(() => crypto.randomUUID());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, reload, stop } =
    useChat({
      api: `${API_URL}/agent/chat/${sessionId}`,
      streamProtocol: "text",
      onError: (error) => {
        console.error("Chat error:", error);
      },
    });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange(e);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px";
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
        if (inputRef.current) {
          inputRef.current.style.height = "auto";
        }
      }
    }
  };

  const suggestedPrompts = [
    "I want a relaxing beach vacation",
    "Find me a cultural trip to Japan",
    "Plan a luxury trip to Dubai",
    "Suggest adventure destinations",
  ];

  const handleSuggestedPrompt = (prompt: string) => {
    const syntheticEvent = {
      target: { value: prompt },
    } as React.ChangeEvent<HTMLTextAreaElement>;
    handleInputChange(syntheticEvent);
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-6">
          {messages.length === 0 ? (
            <WelcomeScreen
              onPromptClick={handleSuggestedPrompt}
              prompts={suggestedPrompts}
            />
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex items-start gap-4 message-fade-in">
                  <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-dark-accent via-emerald-500 to-teal-400">
                    <Plane className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex items-center gap-3 pt-1.5">
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-dark-accent animate-bounce [animation-delay:-0.3s]" />
                      <div className="h-2 w-2 rounded-full bg-dark-accent animate-bounce [animation-delay:-0.15s]" />
                      <div className="h-2 w-2 rounded-full bg-dark-accent animate-bounce" />
                    </div>
                    <span className="text-sm text-dark-text-muted">Planning your journey...</span>
                  </div>
                </div>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-dark-border bg-dark-bg/80 backdrop-blur-xl p-4">
        <div className="mx-auto max-w-3xl">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative flex items-end rounded-2xl border border-dark-border bg-dark-bg-secondary focus-within:border-dark-accent/50 focus-within:shadow-lg focus-within:shadow-dark-accent/5 transition-all duration-300">
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder="Where would you like to travel? ✈️"
                className="max-h-[200px] min-h-[56px] w-full resize-none bg-transparent px-4 py-4 pr-24 text-dark-text placeholder-dark-text-muted focus:outline-none"
                rows={1}
                disabled={isLoading}
              />
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={() => reload()}
                    disabled={isLoading}
                    className={cn(
                      "rounded-lg p-2 transition-all duration-200",
                      "text-dark-text-muted hover:text-dark-text hover:bg-dark-bg-tertiary",
                      "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                    title="Regenerate response"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className={cn(
                    "rounded-xl p-2.5 transition-all duration-200",
                    input.trim() && !isLoading
                      ? "bg-gradient-to-r from-dark-accent to-emerald-500 text-white shadow-lg shadow-dark-accent/25 hover:shadow-dark-accent/40 hover:scale-105"
                      : "text-dark-text-muted bg-dark-bg-tertiary cursor-not-allowed"
                  )}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </form>
          <p className="mt-3 text-center text-xs text-dark-text-muted">
            NullVoyager is powered by <a href="https://nullshot.ai" target="_blank" rel="noopener noreferrer" className="text-dark-accent hover:underline">NullShot</a> • Built for NullShot Hacks S0
          </p>
        </div>
      </div>
    </div>
  );
}
