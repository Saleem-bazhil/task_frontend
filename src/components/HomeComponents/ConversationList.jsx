import React, { useState, useEffect } from "react";
import { Search, Plus, X } from "lucide-react";
import api from "../../api/Api";

const ConversationList = ({ onSelectRoom, activeRoom, currentUser }) => {
  const [conversations, setConversations] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [showNewChatList, setShowNewChatList] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    api
      .get("/api/conversations/")
      .then((res) => setConversations(res.data))
      .catch(console.error);
  }, []);

  const handleStartNewChat = async () => {
    try {
      const res = await api.get("/api/users/");
      const data = res.data;

      setAllUsers(data.filter((u) => u.username !== currentUser));
      setShowNewChatList(true);
    } catch (err) {
      console.error(err);
    }
  };

  const openChat = (target) => {
    const room = [currentUser, target].sort().join("_");
    onSelectRoom(room);
    setShowNewChatList(false);
  };

  const filtered = conversations.filter(c =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border h-full flex flex-col">

      {/* HEADER */}
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-bold">
          {showNewChatList ? "Select User" : "Messages"}
        </h2>

        {showNewChatList ? (
          <X onClick={() => setShowNewChatList(false)} className="cursor-pointer" />
        ) : (
          <Plus onClick={handleStartNewChat} className="cursor-pointer" />
        )}
      </div>

      {/* SEARCH */}
      {!showNewChatList && (
        <div className="p-3">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full border p-2 rounded"
          />
        </div>
      )}

      {/* LIST */}
      <div className="flex-1 overflow-y-auto">

        {showNewChatList ? (
          allUsers.map(u => (
            <div
              key={u.id}
              onClick={() => openChat(u.username)}
              className="p-3 hover:bg-gray-100 cursor-pointer"
            >
              {u.username}
            </div>
          ))
        ) : (
          filtered.map(c => (
            <div
              key={c.room_name}
              onClick={() => onSelectRoom(c.room_name)}
              className={`p-3 cursor-pointer ${
                activeRoom === c.room_name ? "bg-pink-100" : ""
              }`}
            >
              {c.name}
            </div>
          ))
        )}

      </div>
    </div>
  );
};

export default ConversationList;
