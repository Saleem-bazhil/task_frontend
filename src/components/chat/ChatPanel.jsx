import { useEffect, useRef, useState } from "react";
import { AlertCircle, ChevronLeft, SendHorizonal, Wifi, WifiOff } from "lucide-react";

import { useChatSocket } from "../../hooks/useChatSocket";
import { fetchMessages } from "../../services/chat";
import { getAccessToken } from "../../services/storage";

function upsertMessage(existingMessages, nextMessage) {
  if (existingMessages.some((message) => message.id === nextMessage.id)) {
    return existingMessages;
  }
  return [...existingMessages, nextMessage];
}

function isOwnMessage(message, currentUser) {
  const senderId = message?.sender?.id ?? message?.sender_id ?? message?.sender;
  const currentUserId = currentUser?.id;

  if (senderId != null && currentUserId != null) {
    return String(senderId) === String(currentUserId);
  }

  const senderUsername = message?.sender?.username ?? message?.sender_username;
  const currentUsername = currentUser?.username;

  if (senderUsername && currentUsername) {
    return senderUsername.toLowerCase() === currentUsername.toLowerCase();
  }

  return false;
}

function getSenderName(message, isCurrentUser) {
  if (isCurrentUser) {
    return "You";
  }

  return message?.sender?.username ?? message?.sender_username ?? "Client";
}

function ConnectionBadge({ status }) {
  const config = {
    connected: { icon: Wifi, label: "Connected", className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100" },
    connecting: { icon: Wifi, label: "Connecting", className: "bg-amber-50 text-amber-700 ring-1 ring-amber-100" },
    reconnecting: { icon: Wifi, label: "Reconnecting", className: "bg-amber-50 text-amber-700 ring-1 ring-amber-100" },
    failed: { icon: WifiOff, label: "Connection failed", className: "bg-rose-50 text-rose-700 ring-1 ring-rose-100" },
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

export default function ChatPanel({ conversation, currentUser, onMessagePersisted, onBack }) {
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
      <section className="flex h-full items-center justify-center rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <div className="max-w-md">
          <p className="text-xs uppercase tracking-wider text-slate-500 font-medium">Messages</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900">Choose a conversation</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Start with a teammate from the sidebar to create or continue a room.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 ring-slate-100/50">
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-100 bg-white px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex items-center gap-2 sm:gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-pink-600"
              aria-label="Back"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          <div>
            <p className="text-xs font-medium text-slate-500">Active chat</p>
            <h2 className="mt-0.5 text-lg font-semibold text-slate-900 sm:mt-1 sm:text-xl">
              {conversation.room_name || conversation.other_user?.username || "Chat"}
            </h2>
          </div>
        </div>
        <ConnectionBadge status={status} />
      </header>

      <div className="flex-1 overflow-y-auto bg-white px-5 py-6 sm:px-6">
        {isLoading ? <p className="text-sm text-slate-500">Loading messages...</p> : null}
        {loadError ? <p className="mb-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{loadError}</p> : null}

        {messages.length === 0 && !isLoading && !loadError ? (
          <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center text-sm text-slate-500">
            <p className="text-slate-700 font-medium">No messages yet</p>
            <p className="mt-1">Send the first message to start the conversation.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => {
              const ownMessage = isOwnMessage(message, currentUser);
              return (
                <article key={message.id} className={`flex ${ownMessage ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                      ownMessage
                        ? "rounded-br-sm bg-pink-600 text-white"
                        : "rounded-bl-sm border border-slate-100 bg-slate-50 text-slate-900"
                    }`}
                  >
                    <p className={`text-xs font-medium ${ownMessage ? "text-pink-100" : "text-slate-500"}`}>
                      {getSenderName(message, ownMessage)}
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-sm leading-6">{message.content}</p>
                    <p className={`mt-2 text-[11px] ${ownMessage ? "text-pink-100" : "text-slate-400"}`}>
                      {new Date(message.timestamp).toLocaleString()}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t border-slate-100 bg-white px-4 py-4 sm:px-6">
        <div className="flex items-end gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
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
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-600 text-white transition-colors hover:bg-pink-700 disabled:cursor-not-allowed disabled:bg-slate-200"
            disabled={!draft.trim() || status === "failed"}
          >
            <SendHorizonal className="h-4 w-4" />
          </button>
        </div>
      </form>
    </section>
  );
}


