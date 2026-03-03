"use client";

import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowUp, Heart } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { messageFadeUp } from "@/lib/animations";

interface Message {
  id: string;
  sender: "maya" | "user";
  text: string;
  timestamp: string;
}

const MAX_MESSAGES = 30;

function TypingIndicator() {
  return (
    <motion.div
      className="flex items-end gap-2.5 self-start"
      {...messageFadeUp}
    >
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
        style={{
          background: "rgba(196,149,106,0.06)",
          border: "1px solid rgba(196,149,106,0.08)",
        }}
      >
        <span className="text-xs font-light text-amber-200/50">DM</span>
      </div>
      <div
        className="rounded-2xl rounded-bl-md px-5 py-3.5"
        style={{ background: "rgba(255,255,255,0.035)" }}
      >
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full bg-white/20"
            style={{ animation: "dotBounce 1.2s ease-in-out infinite", animationDelay: "0ms" }}
          />
          <span
            className="inline-block h-1.5 w-1.5 rounded-full bg-white/20"
            style={{ animation: "dotBounce 1.2s ease-in-out infinite", animationDelay: "200ms" }}
          />
          <span
            className="inline-block h-1.5 w-1.5 rounded-full bg-white/20"
            style={{ animation: "dotBounce 1.2s ease-in-out infinite", animationDelay: "400ms" }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function RelationshipChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [userMessageCount, setUserMessageCount] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const remaining = MAX_MESSAGES - userMessageCount;

  const formatTime = () => {
    const now = new Date();
    let hrs = now.getHours();
    const mins = now.getMinutes().toString().padStart(2, "0");
    const ampm = hrs >= 12 ? "PM" : "AM";
    hrs = hrs % 12 || 12;
    return `${hrs}:${mins} ${ampm}`;
  };

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const adjustTextareaHeight = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    const maxHeight = 6 * parseFloat(getComputedStyle(ta).lineHeight || "24");
    ta.style.height = `${Math.min(ta.scrollHeight, maxHeight)}px`;
  };

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping || remaining <= 0) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: trimmed,
      timestamp: formatTime(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setUserMessageCount((c) => c + 1);
    setInput("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    setIsTyping(true);

    try {
      // Send message history (excluding the current one, which is in 'message')
      const history = messages.map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await fetch("/api/chat/relationships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history }),
      });

      if (!res.ok) {
        throw new Error("Chat error");
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let mayaText = "";
      const mayaId = `m-${Date.now()}`;

      setMessages((prev) => [
        ...prev,
        { id: mayaId, sender: "maya", text: "", timestamp: formatTime() },
      ]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const parsed = JSON.parse(line.slice(6));
                if (parsed.text) {
                  mayaText += parsed.text;
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === mayaId ? { ...m, text: mayaText } : m
                    )
                  );
                }
                if (parsed.done) break;
              } catch {
                // Skip malformed SSE
              }
            }
          }
        }
      }
    } catch (err) {
      console.error("Send error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "maya",
          text: "I'm sorry, I had trouble processing that. Could you try again?",
          timestamp: formatTime(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const shouldShowTimestamp = (idx: number) => {
    if (idx === 0) return true;
    const prev = messages[idx - 1];
    const curr = messages[idx];
    return prev.sender !== curr.sender || prev.timestamp !== curr.timestamp;
  };

  const isButtonEnabled = !!(input.trim()) && !isTyping && remaining > 0;

  return (
    <div className="flex h-dvh flex-col font-sans text-white">
      {/* HEADER */}
      <header
        className="sticky top-0 z-40 border-b border-white/[0.03] backdrop-blur-2xl"
        style={{ background: "rgba(8,8,8,0.3)" }}
      >
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/relationships"
              className="flex h-9 w-9 items-center justify-center rounded-full text-white/40 transition-all duration-350 hover:bg-white/[0.03] hover:text-white/60"
              aria-label="Back to relationships"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>

            <div className="relative">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{
                  background: "rgba(196,149,106,0.06)",
                  border: "1px solid rgba(196,149,106,0.08)",
                }}
              >
                <span className="text-xs font-light text-amber-200/50">DM</span>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 block h-3 w-3 rounded-full border-2 border-[#0A0A0A] bg-emerald-400/50" />
            </div>

            <div className="leading-tight">
              <p className="text-sm font-normal text-white/70">Dr. Maya</p>
              <p className="text-xs font-light text-amber-300/40">Relationships</p>
            </div>
          </div>

          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-300/[0.06]">
            <Heart className="h-4 w-4 text-amber-300/35" />
          </div>
        </div>
      </header>

      {/* MESSAGES AREA */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 sm:px-6"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255,255,255,0.05) transparent",
        }}
      >
        <div className="mx-auto flex max-w-2xl flex-col gap-1">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center py-12 text-center px-6"
            >
              <div
                className="mb-4 flex h-14 w-14 items-center justify-center rounded-full"
                style={{
                  background: "rgba(196,149,106,0.06)",
                  border: "1px solid rgba(196,149,106,0.08)",
                }}
              >
                <span className="text-lg font-light text-amber-200/50">DM</span>
              </div>
              <p className="text-sm font-light text-white/50">
                Relationship Coaching
              </p>
              <p className="mt-2 text-sm font-light text-white/50 max-w-xs">
                Talk to Dr. Maya about communication, intimacy, partner dynamics, and building confidence in your relationship.
              </p>

              {/* Suggested prompts */}
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {[
                  "How do I talk to my partner about this?",
                  "I\u2019m struggling with intimacy",
                  "Help me build confidence",
                ].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => {
                      setInput(prompt);
                      textareaRef.current?.focus();
                    }}
                    className="rounded-full px-4 py-2.5 text-xs font-light text-white/45 transition-all duration-300 active:scale-95 hover:text-white/60"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((msg, idx) => {
                const isMaya = msg.sender === "maya";
                const showTime = shouldShowTimestamp(idx);
                const isLastInGroup =
                  idx === messages.length - 1 ||
                  messages[idx + 1].sender !== msg.sender ||
                  messages[idx + 1].timestamp !== msg.timestamp;

                return (
                  <motion.div
                    key={msg.id}
                    layout
                    {...messageFadeUp}
                    className={`flex flex-col ${
                      isMaya ? "items-start" : "items-end"
                    } ${showTime && idx !== 0 ? "mt-4" : "mt-1"}`}
                  >
                    <div
                      className={`flex items-end gap-2.5 ${
                        isMaya ? "self-start" : "flex-row-reverse self-end"
                      }`}
                      style={{ maxWidth: "85%" }}
                    >
                      {isMaya ? (
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                            isLastInGroup ? "visible" : "invisible"
                          }`}
                          style={{
                            background: "rgba(196,149,106,0.06)",
                            border: "1px solid rgba(196,149,106,0.08)",
                          }}
                        >
                          <span className="text-xs font-light text-amber-200/50">DM</span>
                        </div>
                      ) : null}

                      {isMaya ? (
                        <div
                          className="rounded-2xl rounded-bl-md px-5 py-3.5 text-sm font-light leading-relaxed text-white/70 whitespace-pre-wrap"
                          style={{ background: "rgba(255,255,255,0.035)" }}
                        >
                          {msg.text}
                        </div>
                      ) : (
                        <div
                          className="rounded-2xl rounded-br-md px-5 py-3.5 text-sm font-light leading-relaxed text-amber-100/80"
                          style={{
                            background: "rgba(196,149,106,0.1)",
                            border: "1px solid rgba(196,149,106,0.08)",
                          }}
                        >
                          {msg.text}
                        </div>
                      )}
                    </div>

                    {isLastInGroup && (
                      <span
                        className={`mt-1.5 font-light text-[11px] text-white/50 ${
                          isMaya ? "ml-[42px]" : "mr-1"
                        }`}
                      >
                        {isMaya && <span className="text-white/50">Dr. Maya · </span>}
                        {msg.timestamp}
                      </span>
                    )}
                  </motion.div>
                );
              })}

              {isTyping && (
                <div className="mt-4">
                  <TypingIndicator />
                </div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* MESSAGE INPUT */}
      <div
        className="border-t border-white/[0.03] backdrop-blur-2xl"
        style={{ background: "rgba(8,8,8,0.4)" }}
      >
        <div className="mx-auto max-w-2xl px-4 pt-2 sm:px-6">
          <p className="text-center text-xs font-light text-white/50">
            Messages remaining:{" "}
            <span
              className={
                remaining <= 5
                  ? "font-light text-amber-200/50"
                  : "font-light text-amber-300/40"
              }
            >
              {remaining}/{MAX_MESSAGES}
            </span>
          </p>
        </div>

        <div className="mx-auto flex max-w-2xl items-end gap-3 px-4 pb-2 pt-2 sm:px-6">
          <div
            className="flex-1 rounded-2xl px-4 py-2.5 transition-all duration-500"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: isFocused
                ? "1px solid rgba(196,149,106,0.12)"
                : "1px solid rgba(255,255,255,0.04)",
            }}
          >
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChange={(e) => {
                setInput(e.target.value);
                adjustTextareaHeight();
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ask about relationships..."
              className="w-full resize-none bg-transparent text-sm font-light leading-relaxed text-white/70 outline-none placeholder:text-white/40"
              style={{ maxHeight: "6lh" }}
              disabled={remaining <= 0}
            />
          </div>

          <button
            onClick={sendMessage}
            disabled={!isButtonEnabled}
            className={`mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-500 ${
              isButtonEnabled
                ? "text-amber-200/80 hover:shadow-[0_0_25px_rgba(196,149,106,0.1)]"
                : "bg-white/[0.03] text-white/15 cursor-not-allowed"
            }`}
            style={
              isButtonEnabled
                ? {
                    background: "rgba(196,149,106,0.15)",
                    border: "1px solid rgba(196,149,106,0.15)",
                  }
                : {}
            }
            aria-label="Send message"
          >
            <ArrowUp className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        <div className="h-[60px]" />
      </div>

      <BottomNav activeTab="Home" />
    </div>
  );
}
