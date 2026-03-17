import React from 'react';

const ConversationList = ({ onSelectChat }) => {

  const chats = [
    { id: "task1", name: "Sarah" },
    { id: "task2", name: "Team" }
  ];

  return (
    <div className="w-1/3 bg-white p-4">

      {chats.map(chat => (
        <div
          key={chat.id}
          onClick={() => onSelectChat(chat)}
          className="p-3 border cursor-pointer hover:bg-gray-100"
        >
          {chat.name}
        </div>
      ))}

    </div>
  );
};

export default ConversationList;