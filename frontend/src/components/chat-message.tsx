"use client";

import { Message } from "ai";
import { User, Sparkles } from "lucide-react";
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
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          isUser ? "bg-dark-bg-tertiary" : "bg-dark-accent"
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-dark-text" />
        ) : (
          <Sparkles className="h-4 w-4 text-white" />
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
                ? "bg-dark-accent text-white max-w-[85%] ml-auto"
                : "bg-dark-bg-secondary text-dark-text"
            )}
          >
            {isUser ? (
              <p className="whitespace-pre-wrap">{message.content}</p>
            ) : (
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    ul: ({ children }) => <ul className="mb-2 list-disc pl-4">{children}</ul>,
                    ol: ({ children }) => <ol className="mb-2 list-decimal pl-4">{children}</ol>,
                    li: ({ children }) => <li className="mb-1">{children}</li>,
                    code: ({ children, className }) => {
                      const isInline = !className;
                      return isInline ? (
                        <code className="rounded bg-dark-bg-tertiary px-1.5 py-0.5 text-sm">
                          {children}
                        </code>
                      ) : (
                        <code className={className}>{children}</code>
                      );
                    },
                    pre: ({ children }) => (
                      <pre className="overflow-x-auto rounded-lg bg-dark-bg-tertiary p-3 text-sm">
                        {children}
                      </pre>
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
