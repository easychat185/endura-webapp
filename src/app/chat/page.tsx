"use client";

import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowUp, Heart } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { messageFadeUp } from "@/lib/animations";
import { createClient } from "@/lib/supabase/client";
import { trackEvent } from "@/lib/analytics";
import { hapticLight } from "@/lib/capacitor";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Message {
  id: string;
  sender: "maya" | "user";
  text: string;
  timestamp: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const DEFAULT_MAX_MESSAGES = 30;

/* ------------------------------------------------------------------ */
/*  Typing Indicator (3 bouncing dots)                                 */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Chat Page                                                          */
/* ------------------------------------------------------------------ */

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [sessionNumber, setSessionNumber] = useState(1);
  const [maxMessages, setMaxMessages] = useState(DEFAULT_MAX_MESSAGES);
  const [userMessageCount, setUserMessageCount] = useState(0);
  const [initializing, setInitializing] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);
  const [streamError, setStreamError] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const online = useOnlineStatus();
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastUserMessageRef = useRef<string>("");

  const remaining = maxMessages - userMessageCount;

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

  // Initialize session
  const initSession = useCallback(async () => {
    setInitializing(true);
    setInitError(null);
    try {
      // Check for active session
      const sessionRes = await fetch("/api/chat/session");
      if (!sessionRes.ok) {
        throw new Error("Failed to connect to chat service");
      }
      const sessionData = await sessionRes.json();

      if (sessionData.activeSession) {
        // Resume existing session
        setConversationId(sessionData.activeSession.id);
        setSessionNumber(sessionData.activeSession.session_number);

        // Load existing messages
        const msgRes = await fetch(
          `/api/chat/session?conversationId=${sessionData.activeSession.id}`
        );
        if (msgRes.ok) {
          const msgData = await msgRes.json();
          if (msgData.messages?.length > 0) {
            const loaded: Message[] = msgData.messages.map(
              (m: { id: string; sender: string; content: string; created_at: string }) => ({
                id: m.id,
                sender: m.sender as "maya" | "user",
                text: m.content,
                timestamp: new Date(m.created_at).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                }),
              })
            );
            setMessages(loaded);
            setUserMessageCount(loaded.filter((m) => m.sender === "user").length);
          }
        }
      } else {
        // Start new session
        const newRes = await fetch("/api/chat/session", { method: "POST" });
        const newData = await newRes.json();

        if (newData.error) {
          setInitError(
            newData.code === "SESSION_LIMIT"
              ? "You've reached your daily session limit. Come back tomorrow!"
              : newData.error
          );
          setConversationId(null);
          return;
        }
        setConversationId(newData.id);
        setSessionNumber(newData.session_number);
        trackEvent("session_started", { session_number: newData.session_number });
      }

      // Get tier and profile name
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("tier, display_name")
            .eq("id", user.id)
            .maybeSingle();
          if (profile?.tier === "premium") setMaxMessages(60);

          // Auto welcome message for new sessions with no messages
          setMessages((prev) => {
            if (prev.length > 0) return prev; // already has messages
            const firstName = profile?.display_name?.split(" ")[0] || "";
            const greeting = sessionData.totalSessions <= 1 && !sessionData.activeSession
              ? `Hi${firstName ? ` ${firstName}` : ""}! I\u2019m Dr. Maya. I\u2019ve reviewed your profile and I\u2019m here to help you build confidence and control. What would you like to focus on today?`
              : `Welcome back${firstName ? `, ${firstName}` : ""}. How have things been since our last session?`;
            return [{
              id: `welcome-${Date.now()}`,
              sender: "maya",
              text: greeting,
              timestamp: formatTime(),
            }];
          });
        }
      } catch {
        // Tier check failed — use default limit
      }
    } catch (err) {
      setInitError(err instanceof Error ? err.message : "Failed to start chat session");
    } finally {
      setInitializing(false);
    }
  }, []);

  useEffect(() => {
    initSession();
  }, [initSession]);

  // Auto-dismiss toast after 4 seconds
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const adjustTextareaHeight = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    const maxHeight = 6 * parseFloat(getComputedStyle(ta).lineHeight || "24");
    ta.style.height = `${Math.min(ta.scrollHeight, maxHeight)}px`;
  };

  /* -------- send message -------- */
  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping || remaining <= 0 || !conversationId) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: trimmed,
      timestamp: formatTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setUserMessageCount((c) => c + 1);
    setInput("");
    setStreamError(false);
    lastUserMessageRef.current = trimmed;
    trackEvent("message_sent", { conversationId });
    hapticLight();

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, conversationId }),
      });

      if (!res.ok) {
        const errData = await res.json();
        if (errData.code === "LIMIT_REACHED") {
          setIsTyping(false);
          setToastMessage("You\u2019ve used all messages for this session. Start a new session to continue.");
          return;
        }
        if (res.status === 429) {
          setIsTyping(false);
          setToastMessage("Please wait a moment before sending another message.");
          return;
        }
        throw new Error(errData.error || "Chat error");
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let mayaText = "";
      const mayaId = `m-${Date.now()}`;

      // Add empty Maya message
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
                if (parsed.error) {
                  setStreamError(true);
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === mayaId
                        ? { ...m, text: "Something went wrong while generating a response." }
                        : m
                    )
                  );
                  break;
                }
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
      setStreamError(true);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "maya",
          text: "Something went wrong while generating a response.",
          timestamp: formatTime(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const retryLastMessage = () => {
    if (!lastUserMessageRef.current || isTyping || !conversationId) return;
    // Remove the last Maya error message
    setMessages((prev) => {
      const lastMayaIdx = [...prev].reverse().findIndex((m) => m.sender === "maya");
      if (lastMayaIdx === -1) return prev;
      const actualIdx = prev.length - 1 - lastMayaIdx;
      return prev.filter((_, i) => i !== actualIdx);
    });
    setStreamError(false);
    setInput(lastUserMessageRef.current);
    // Trigger send on next tick after input is set
    setTimeout(() => {
      setInput("");
      sendWithText(lastUserMessageRef.current);
    }, 0);
  };

  const sendWithText = async (text: string) => {
    if (!text || isTyping || remaining <= 0 || !conversationId) return;

    setIsTyping(true);
    setStreamError(false);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, conversationId }),
      });

      if (!res.ok) {
        const errData = await res.json();
        if (errData.code === "LIMIT_REACHED") {
          setIsTyping(false);
          setToastMessage("You\u2019ve used all messages for this session. Start a new session to continue.");
          return;
        }
        if (res.status === 429) {
          setIsTyping(false);
          setToastMessage("Please wait a moment before sending another message.");
          return;
        }
        throw new Error(errData.error || "Chat error");
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
                if (parsed.error) {
                  setStreamError(true);
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === mayaId
                        ? { ...m, text: "Something went wrong while generating a response." }
                        : m
                    )
                  );
                  break;
                }
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
      console.error("Retry error:", err);
      setStreamError(true);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "maya",
          text: "Something went wrong while generating a response.",
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

  const isButtonEnabled = !!(input.trim()) && !isTyping && remaining > 0 && !!conversationId;

  return (
    <div className="flex h-dvh flex-col font-sans text-white">
      {/* CHAT HEADER */}
      <header
        className="sticky top-0 z-40 border-b border-white/[0.03] backdrop-blur-2xl"
        style={{ background: "rgba(8,8,8,0.3)" }}
      >
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="flex h-11 w-11 items-center justify-center rounded-full text-white/40 transition-all duration-350 hover:bg-white/[0.03] hover:text-white/60"
              aria-label="Back to dashboard"
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
              <p className="text-xs font-light text-amber-300/40">Online</p>
            </div>
          </div>

          <span className="rounded-full bg-white/[0.03] px-3 py-1 text-xs font-light text-white/30">
            Session {sessionNumber}
          </span>
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
          {initializing ? (
            <div className="flex items-center justify-center py-20">
              <div
                className="h-8 w-8 animate-spin rounded-full border-2 border-transparent"
                style={{
                  borderTopColor: "rgba(196,149,106,0.4)",
                  borderRightColor: "rgba(196,149,106,0.1)",
                }}
              />
            </div>
          ) : initError ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
              <p className="text-sm font-light text-red-400/60">{initError}</p>
              <button
                onClick={initSession}
                className="mt-4 rounded-full px-5 py-2.5 text-sm font-normal text-amber-200/70 transition-all duration-500 hover:text-amber-200/90"
                style={{
                  background: "rgba(196,149,106,0.1)",
                  border: "1px solid rgba(196,149,106,0.15)",
                }}
              >
                Try Again
              </button>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
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
                What would you like to talk about?
              </p>

              {/* Suggested prompts */}
              <div className="mt-6 flex flex-wrap justify-center gap-2 px-4">
                {[
                  "I\u2019m feeling anxious about tonight",
                  "Teach me a new technique",
                  "I want to talk about my progress",
                  "Help me with my relationship",
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

              <Link
                href="/relationships/chat"
                className="mt-6 flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-normal text-white/40 transition-all duration-500 hover:text-white/55"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <Heart className="h-4 w-4 text-amber-300/35" />
                Talk about Relationships instead
              </Link>
            </div>
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
                        className={`mt-1.5 font-light text-xs text-white/40 ${
                          isMaya ? "ml-[42px]" : "mr-1"
                        }`}
                      >
                        {isMaya && <span className="text-white/40">Dr. Maya · </span>}
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

              {streamError && !isTyping && (
                <motion.div
                  className="mt-3 flex items-center gap-3 self-start ml-[42px]"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-xs font-light text-red-400/60">
                    Failed to get a response.
                  </p>
                  <button
                    onClick={retryLastMessage}
                    className="rounded-full px-3.5 py-1.5 text-xs font-normal text-amber-200/70 transition-all duration-300 hover:text-amber-200/90"
                    style={{
                      background: "rgba(196,149,106,0.1)",
                      border: "1px solid rgba(196,149,106,0.15)",
                    }}
                  >
                    Retry
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* MESSAGE INPUT AREA */}
      <div
        className="border-t border-white/[0.03] backdrop-blur-2xl"
        style={{ background: "rgba(8,8,8,0.4)" }}
      >
        <div className="mx-auto max-w-2xl px-4 pt-2 sm:px-6">
          <p className="text-center text-xs font-light text-white/40">
            Messages remaining:{" "}
            <span
              className={
                remaining <= 5
                  ? "font-light text-amber-200/50"
                  : "font-light text-amber-300/40"
              }
            >
              {remaining}/{maxMessages}
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
              placeholder={online ? "Type your message..." : "You're offline..."}
              inputMode="text"
              className="w-full resize-none bg-transparent text-sm font-light leading-relaxed text-white/70 outline-none placeholder:text-white/20"
              style={{ maxHeight: "6lh" }}
              disabled={remaining <= 0 || !conversationId || !online}
            />
          </div>

          <button
            onClick={sendMessage}
            disabled={!isButtonEnabled}
            className={`mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-500 ${
              isButtonEnabled
                ? "text-amber-200/80 hover:shadow-[0_0_25px_rgba(196,149,106,0.1)]"
                : "bg-white/[0.03] text-white/40 cursor-not-allowed"
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

      {/* Toast notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-xl px-5 py-3 text-xs font-light text-white/80 shadow-lg"
            style={{
              background: "rgba(30,30,30,0.95)",
              border: "1px solid rgba(255,255,255,0.08)",
              maxWidth: "90vw",
            }}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav activeTab="Chat" />
    </div>
  );
}
