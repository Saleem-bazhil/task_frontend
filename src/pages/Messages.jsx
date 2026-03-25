import { startTransition, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import ChatPanel from "../components/chat/ChatPanel";
import ConversationSidebar from "../components/chat/ConversationSidebar";
import { useAuth } from "../context/useAuth";
import { fetchConversations, fetchUsers, getOrCreateRoom } from "../services/chat";

function sortByMostRecent(items) {
  return [...items].sort((left, right) => new Date(right.updated_at) - new Date(left.updated_at));
}

export default function Messages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("inbox");
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [pageError, setPageError] = useState("");
  const [isDesktop, setIsDesktop] = useState(false);
  const [isOverlayChatOpen, setIsOverlayChatOpen] = useState(false);

  useEffect(() => {
    const update = () => setIsDesktop(window.innerWidth >= 1280);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadSidebarData() {
      try {
        const [conversationResponse, usersResponse] = await Promise.all([fetchConversations(), fetchUsers()]);
        if (cancelled) {
          return;
        }
        const sortedConversations = sortByMostRecent(conversationResponse);
        setConversations(sortedConversations);
        setUsers(usersResponse);
        setActiveConversation((current) => current || sortedConversations[0] || null);
        setPageError("");
      } catch {
        if (!cancelled) {
          setPageError("We couldn't load your chat directory. Please refresh the page.");
        }
      }
    }

    loadSidebarData();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCreateConversation = async (selectedUser) => {
    setIsCreatingRoom(true);
    try {
      const room = await getOrCreateRoom(selectedUser.id);
      const existingConversation = conversations.find((conversation) => conversation.room_id === room.room_id);
      const nextConversation =
        existingConversation || {
          room_id: room.room_id,
          id: room.id,
          other_user: selectedUser,
          last_message: null,
          updated_at: room.updated_at,
        };

      startTransition(() => {
        setConversations((current) => {
          if (current.some((conversation) => conversation.room_id === nextConversation.room_id)) {
            return current;
          }
          return [nextConversation, ...current];
        });
        setActiveConversation(nextConversation);
        setMode("inbox");
        setSearch("");
        setPageError("");
        if (!isDesktop) {
          setIsOverlayChatOpen(true);
        }
      });
    } catch {
      setPageError("Unable to open that conversation right now.");
    } finally {
      setIsCreatingRoom(false);
    }
  };

  const handleMessagePersisted = (message) => {
    startTransition(() => {
      setConversations((current) => {
        const targetConversation = current.find((conversation) => conversation.room_id === message.room_id);
        if (!targetConversation) {
          return current;
        }

        const updatedConversation = {
          ...targetConversation,
          last_message: message,
          updated_at: message.timestamp,
        };

        return sortByMostRecent([
          updatedConversation,
          ...current.filter((conversation) => conversation.room_id !== message.room_id),
        ]);
      });
    });
  };

  return (
    // Replaced the blue gradient with the clean Renderways transparent background
    <div className="h-full w-full px-4 py-5 md:px-6 lg:px-8">
      
      {/* Animated Entrance for the entire Chat Interface */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mx-auto grid h-[calc(100vh-8rem)] min-h-[600px] max-w-7xl grid-cols-1 gap-6 xl:grid-cols-[380px_minmax(0,1fr)]"
      >
        
        {/* Sidebar Container - Crisp white card with soft border */}
        <div
          className={`${isDesktop ? "block" : isOverlayChatOpen ? "hidden" : "block"} flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300`}
        >
          <ConversationSidebar
            currentUser={user}
            users={users}
            conversations={conversations}
            activeRoomId={activeConversation?.room_id || null}
            isCreatingRoom={isCreatingRoom}
            mode={mode}
            onModeChange={setMode}
            onOpenConversation={(conversation) => {
              setActiveConversation(conversation);
              setMode("inbox");
              if (!isDesktop) {
                setIsOverlayChatOpen(true);
              }
            }}
            onCreateConversation={handleCreateConversation}
            search={search}
            onSearchChange={setSearch}
          />
        </div>

        {/* Chat Panel Container - Matches the sidebar styling */}
        <div
          className={`${isDesktop ? "block" : isOverlayChatOpen ? "block" : "hidden"} relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300`}
        >
          
          {/* Refined Error Alert */}
          <AnimatePresence>
            {pageError && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute left-0 right-0 top-0 z-10 m-4 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 shadow-sm backdrop-blur-md"
              >
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                  <p className="text-sm font-semibold text-rose-700">{pageError}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <ChatPanel
            key={activeConversation?.room_id || "empty-room"}
            conversation={activeConversation}
            currentUser={user}
            onMessagePersisted={handleMessagePersisted}
            onBack={!isDesktop ? () => setIsOverlayChatOpen(false) : undefined}
          />
        </div>
      </motion.div>
    </div>
  );
}