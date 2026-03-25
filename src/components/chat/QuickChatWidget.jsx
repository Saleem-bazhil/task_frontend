import { useEffect, useState } from "react";
import { ChevronLeft, Loader2, MessageSquare, X } from "lucide-react";

import { useAuth } from "../../context/useAuth";
import { fetchConversations } from "../../services/chat";
import ChatPanel from "./ChatPanel";

export default function QuickChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeConversation, setActiveConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && conversations.length === 0) {
      loadConversations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  async function loadConversations() {
    setIsLoading(true);
    try {
      const data = await fetchConversations();
      const sorted = [...data].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
      setConversations(sorted);
    } catch (err) {
      console.error("Failed to load conversations:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed bottom-24 right-4 z-[60] flex flex-col items-end md:bottom-10 md:right-10">
      {isOpen && (
        <div className="mb-4 flex h-[calc(100vh-160px)] min-h-[400px] max-h-[550px] w-[350px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg transition-all duration-300 sm:w-[400px]">
          {activeConversation ? (
            <div className="flex w-full h-full flex-col overflow-hidden [&>section]:!border-0 [&>section]:!shadow-none [&>section]:!rounded-none">
              <ChatPanel 
                conversation={activeConversation} 
                currentUser={user} 
                onBack={() => setActiveConversation(null)}
              />
            </div>
          ) : (
            <div className="flex h-full flex-col">
              <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
                <h3 className="font-semibold text-slate-800">Quick Chat</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-2 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-2 py-2">
                {isLoading ? (
                  <div className="flex h-32 items-center justify-center text-slate-400">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="flex h-32 flex-col items-center justify-center px-4 text-center">
                    <p className="text-sm text-slate-500">No recent conversations.</p>
                    <p className="mt-1 text-xs text-slate-400">Visit Messages to start a new chat.</p>
                  </div>
                ) : (
                  conversations.map((conv) => (
                    <button
                      key={conv.room_id}
                      onClick={() => setActiveConversation(conv)}
                      className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition hover:bg-slate-50"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E41F6A]/10 font-semibold text-[#E41F6A]">
                        {(conv.other_user?.username || "U").slice(0, 1).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-900">
                          {conv.other_user?.username}
                        </p>
                        {conv.last_message && (
                          <p className="truncate text-xs text-slate-500">
                            {conv.last_message.content}
                          </p>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 items-center justify-center gap-2.5 rounded-full bg-[#E41F6A] px-6 text-white shadow-md transition-colors hover:bg-pink-700 focus:outline-none focus:ring-4 focus:ring-pink-500/20"
        aria-label="Toggle Quick Chat"
      >
        {isOpen ? (
          <>
            <X className="h-5 w-5" />
            <span className="font-medium">Close</span>
          </>
        ) : (
          <>
            <MessageSquare className="h-5 w-5" />
            <span className="font-medium">Quick Chat</span>
          </>
        )}
      </button>
    </div>
  );
}
