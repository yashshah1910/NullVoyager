"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { Send, Loader2, Sparkles, RotateCcw } from "lucide-react";
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
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-dark-accent">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <Loader2 className="h-4 w-4 animate-spin text-dark-text-muted" />
                    <span className="text-sm text-dark-text-muted">Thinking...</span>
                  </div>
                </div>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-dark-border bg-dark-bg p-4">
        <div className="mx-auto max-w-3xl">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative flex items-end rounded-2xl border border-dark-border bg-dark-bg-secondary focus-within:border-dark-text-muted transition-colors">
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder="Plan your next adventure..."
                className="max-h-[200px] min-h-[52px] w-full resize-none bg-transparent px-4 py-3.5 pr-24 text-dark-text placeholder-dark-text-muted focus:outline-none"
                rows={1}
                disabled={isLoading}
              />
              <div className="absolute bottom-2 right-2 flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={() => reload()}
                    disabled={isLoading}
                    className={cn(
                      "rounded-lg p-2 transition-colors",
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
                    "rounded-lg p-2 transition-colors",
                    input.trim() && !isLoading
                      ? "bg-dark-accent text-white hover:bg-dark-accent-hover"
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
          <p className="mt-2 text-center text-xs text-dark-text-muted">
            NullVoyager can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </div>
  );
}
