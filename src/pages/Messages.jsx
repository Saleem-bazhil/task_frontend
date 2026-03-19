import { startTransition, useEffect, useState } from "react";

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
    <div className="h-full bg-[linear-gradient(180deg,_#eff6ff,_#f8fafc_20%,_#f8fafc)] px-4 py-5 md:px-6 lg:px-8">
      <div className="mx-auto grid h-full max-w-[1700px] grid-cols-1 gap-5 xl:grid-cols-[380px_minmax(0,1fr)]">
        <div className="min-h-[36rem] xl:h-[calc(100vh-9rem)]">
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
            }}
            onCreateConversation={handleCreateConversation}
            search={search}
            onSearchChange={setSearch}
          />
        </div>

        <div className="min-h-[36rem] xl:h-[calc(100vh-9rem)]">
          {pageError ? (
            <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {pageError}
            </div>
          ) : null}

          <ChatPanel
            key={activeConversation?.room_id || "empty-room"}
            conversation={activeConversation}
            currentUser={user}
            onMessagePersisted={handleMessagePersisted}
          />
        </div>
      </div>
    </div>
  );
}
