import { useDeferredValue, useMemo } from "react";
import { MessageSquarePlus, Search } from "lucide-react";

export default function ConversationSidebar({
  currentUser,
  users,
  conversations,
  activeRoomId,
  isCreatingRoom,
  mode,
  onModeChange,
  onOpenConversation,
  onCreateConversation,
  search,
  onSearchChange,
}) {
  const deferredSearch = useDeferredValue(search);

  const filteredConversations = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase();
    if (!query) {
      return conversations;
    }
    return conversations.filter((conversation) =>
      conversation.other_user.username.toLowerCase().includes(query)
    );
  }, [conversations, deferredSearch]);

  const filteredUsers = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase();
    if (!query) {
      return users;
    }
    return users.filter((user) => user.username.toLowerCase().includes(query));
  }, [deferredSearch, users]);

  const items = mode === "new" ? filteredUsers : filteredConversations;

  return (
    <aside className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50/50 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Live Chat</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">{currentUser.username}</h2>
            <p className="text-sm text-slate-500">{currentUser.role === "admin" ? "Administrator" : "Employee"}</p>
          </div>

          <button
            type="button"
            onClick={() => onModeChange(mode === "new" ? "inbox" : "new")}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
            title={mode === "new" ? "Back to inbox" : "Start a new chat"}
          >
            <MessageSquarePlus className="h-5 w-5" />
          </button>
        </div>

        <label className="mt-5 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm transition-colors focus-within:border-pink-500 focus-within:ring-1 focus-within:ring-pink-500">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            placeholder={mode === "new" ? "Find a teammate" : "Search conversations"}
          />
        </label>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/80 p-6 text-sm text-slate-500">
            {mode === "new" ? "No users available to chat with." : "No conversations yet. Start a new one from the top-right button."}
          </div>
        ) : null}

        <div className="space-y-3">
          {mode === "new"
            ? items.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => onCreateConversation(user)}
                  disabled={isCreatingRoom}
                  className="flex w-full items-center justify-between rounded-xl border border-transparent px-4 py-3 text-left transition-colors hover:bg-slate-50"
                >
                  <div>
                    <p className="font-medium text-slate-900">{user.username}</p>
                    <p className="text-sm text-slate-500">{user.role}</p>
                  </div>
                  <span className="text-xs uppercase tracking-[0.24em] text-slate-400">
                    {isCreatingRoom ? "Opening" : "Chat"}
                  </span>
                </button>
              ))
            : items.map((conversation) => {
                const isActive = activeRoomId === conversation.room_id;
                return (
                  <button
                    key={conversation.room_id}
                    type="button"
                    onClick={() => onOpenConversation(conversation)}
                  className={`w-full rounded-xl px-4 py-3 text-left transition-colors ${
                      isActive
                        ? "bg-pink-50/50"
                        : "bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-900">{conversation.other_user.username}</p>
                        <p className="mt-1 truncate text-sm text-slate-500">
                          {conversation.last_message?.content || "No messages yet"}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs text-slate-500 font-semibold">                        {conversation.last_message
                          ? new Date(conversation.last_message.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </span>
                    </div>
                  </button>
                );
              })}
        </div>
      </div>
    </aside>
  );
}


