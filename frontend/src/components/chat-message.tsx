"use client";

import { Message } from "ai";
import { User, Plane } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { ToolInvocationRenderer } from "./tool-invocation";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex items-start gap-4 message-fade-in", isUser && "flex-row-reverse")}>
      {/* Avatar */}
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl shadow-lg",
          isUser 
            ? "bg-dark-bg-tertiary shadow-black/20" 
            : "bg-gradient-to-br from-dark-accent via-emerald-500 to-teal-400 shadow-dark-accent/20"
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-dark-text" />
        ) : (
          <Plane className="h-4 w-4 text-white" />
        )}
      </div>

      {/* Content */}
      <div className={cn("flex-1 space-y-3", isUser && "flex justify-end")}>
        {/* Text content */}
        {message.content && (
          <div
            className={cn(
              "rounded-2xl px-4 py-3",
              isUser
                ? "bg-gradient-to-r from-dark-accent to-emerald-600 text-white max-w-[85%] ml-auto shadow-lg shadow-dark-accent/10"
                : "bg-dark-bg-secondary text-dark-text border border-dark-border/50"
            )}
          >
            {isUser ? (
              <p className="whitespace-pre-wrap">{message.content}</p>
            ) : (
              <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-p:text-dark-text prose-strong:text-white prose-headings:text-white">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
                    ul: ({ children }) => <ul className="mb-3 list-disc pl-4 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="mb-3 list-decimal pl-4 space-y-1">{children}</ol>,
                    li: ({ children }) => <li className="text-dark-text-secondary">{children}</li>,
                    strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                    code: ({ children, className }) => {
                      const isInline = !className;
                      return isInline ? (
                        <code className="rounded-md bg-dark-bg-tertiary px-1.5 py-0.5 text-sm text-dark-accent font-mono">
                          {children}
                        </code>
                      ) : (
                        <code className={className}>{children}</code>
                      );
                    },
                    pre: ({ children }) => (
                      <pre className="overflow-x-auto rounded-xl bg-dark-bg-tertiary p-4 text-sm my-3 border border-dark-border">
                        {children}
                      </pre>
                    ),
                    a: ({ children, href }) => (
                      <a href={href} className="text-dark-accent hover:underline" target="_blank" rel="noopener noreferrer">
                        {children}
                      </a>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        )}

        {/* Tool invocations */}
        {message.toolInvocations && message.toolInvocations.length > 0 && (
          <div className="space-y-3">
            {message.toolInvocations.map((toolInvocation) => (
              <ToolInvocationRenderer
                key={toolInvocation.toolCallId}
                toolInvocation={toolInvocation}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
