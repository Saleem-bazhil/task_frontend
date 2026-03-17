import React, { useState } from 'react';
import ConversationList from '../components/HomeComponents/ConversationList';
import ChatWindow from '../components/HomeComponents/ChatWindow';

const Messages = () => {
  const [chat, setChat] = useState({
    id: "task1",
    name: "Sarah"
  });

  return (
    <div className="flex h-screen gap-4 p-4">
      <ConversationList onSelectChat={setChat} />
      <ChatWindow chat={chat} />
    </div>
  );
};

export default Messages;