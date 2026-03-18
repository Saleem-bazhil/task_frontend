import { useEffect, useRef, useState } from "react";
import { AlertCircle, SendHorizonal, Wifi, WifiOff } from "lucide-react";

import { useChatSocket } from "../../hooks/useChatSocket";
import { fetchMessages } from "../../services/chat";
import { getAccessToken } from "../../services/storage";

function upsertMessage(existingMessages, nextMessage) {
  if (existingMessages.some((message) => message.id === nextMessage.id)) {
    return existingMessages;
  }
  return [...existingMessages, nextMessage];
}

function ConnectionBadge({ status }) {
  const config = {
    connected: { icon: Wifi, label: "Connected", className: "bg-emerald-50 text-emerald-700" },
    connecting: { icon: Wifi, label: "Connecting", className: "bg-amber-50 text-amber-700" },
    reconnecting: { icon: Wifi, label: "Reconnecting", className: "bg-amber-50 text-amber-700" },
    failed: { icon: WifiOff, label: "Connection failed", className: "bg-rose-50 text-rose-700" },
    error: { icon: AlertCircle, label: "Socket error", className: "bg-rose-50 text-rose-700" },
    idle: { icon: WifiOff, label: "Offline", className: "bg-slate-100 text-slate-600" },
  }[status] || { icon: WifiOff, label: "Offline", className: "bg-slate-100 text-slate-600" };

  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${config.className}`}>
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}

export default function ChatPanel({ conversation, currentUser, onMessagePersisted }) {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const bottomRef = useRef(null);
  const accessToken = getAccessToken();

  useEffect(() => {
    if (!conversation?.room_id) {
      setMessages([]);
      setLoadError("");
      return;
    }

    let cancelled = false;

    async function loadMessages() {
      setIsLoading(true);
      setLoadError("");
      try {
        const response = await fetchMessages(conversation.room_id);
        if (!cancelled) {
          setMessages(response);
        }
      } catch {
        if (!cancelled) {
          setLoadError("We couldn't load this conversation. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadMessages();
    return () => {
      cancelled = true;
    };
  }, [conversation?.room_id]);

  const { status, sendMessage } = useChatSocket({
    roomId: conversation?.room_id,
    token: accessToken,
    onMessage: (message) => {
      setMessages((current) => upsertMessage(current, message));
      onMessagePersisted?.(message);
    },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const content = draft.trim();
    if (!content) {
      return;
    }

    const sent = sendMessage(content);
    if (!sent) {
      setLoadError("Connection is not ready. Please wait a moment and try again.");
      return;
    }

    setDraft("");
    setLoadError("");
  };

  if (!conversation) {
    return (
      <section className="flex h-full items-center justify-center rounded-[2rem] border border-slate-200 bg-[linear-gradient(145deg,_rgba(255,255,255,0.95),_rgba(240,249,255,0.85))] p-10 text-center shadow-[0_30px_70px_-50px_rgba(14,165,233,0.4)]">
        <div className="max-w-md">
          <p className="text-xs uppercase tracking-[0.32em] text-sky-700">Messages</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">Choose a conversation</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Start with a teammate from the sidebar and the app will create or reuse the correct room automatically.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_25px_70px_-45px_rgba(15,23,42,0.4)]">
      <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-[linear-gradient(120deg,_#ffffff,_#f8fafc)] px-6 py-5">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-sky-700">Active room</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">{conversation.other_user.username}</h2>
          <p className="text-sm text-slate-500">{conversation.room_id}</p>
        </div>
        <ConnectionBadge status={status} />
      </header>

      <div className="flex-1 overflow-y-auto bg-[linear-gradient(180deg,_#f8fafc,_#ffffff_26%,_#f8fafc)] px-4 py-6 sm:px-6">
        {isLoading ? <p className="text-sm text-slate-500">Loading messages...</p> : null}
        {loadError ? <p className="mb-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{loadError}</p> : null}

        <div className="space-y-3">
          {messages.map((message) => {
            const isOwnMessage = message.sender.id === currentUser.id;
            return (
              <article key={message.id} className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[78%] rounded-[1.7rem] px-4 py-3 shadow-sm ${
                    isOwnMessage
                      ? "rounded-br-md bg-sky-600 text-white"
                      : "rounded-bl-md border border-slate-200 bg-white text-slate-900"
                  }`}
                >
                  <p className={`text-xs font-medium ${isOwnMessage ? "text-sky-100" : "text-slate-500"}`}>
                    {message.sender.username}
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-6">{message.content}</p>
                  <p className={`mt-2 text-[11px] ${isOwnMessage ? "text-sky-100" : "text-slate-400"}`}>
                    {new Date(message.timestamp).toLocaleString()}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t border-slate-200 bg-white px-4 py-4 sm:px-6">
        <div className="flex items-end gap-3 rounded-[1.7rem] border border-slate-200 bg-slate-50 px-4 py-3">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSubmit(event);
              }
            }}
            rows={1}
            placeholder={`Message ${conversation.other_user.username}`}
            className="max-h-40 min-h-8 w-full resize-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
          <button
            type="submit"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-600 text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            disabled={!draft.trim() || status === "failed"}
          >
            <SendHorizonal className="h-4 w-4" />
          </button>
        </div>
      </form>
    </section>
  );
}
