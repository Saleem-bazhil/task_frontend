import React from 'react';
import ConversationList from '../components/HomeComponents/ConversationList';
import ChatWindow from '../components/HomeComponents/ChatWindow';

const Messages = () => {
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto h-full animate-fade-in">
       <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[calc(100vh-140px)]">
         {/* Sidebar / Conversation List */}
         <div className="w-full lg:w-1/3 xl:w-1/4 h-[400px] lg:h-full flex flex-col">
            <ConversationList />
         </div>

         {/* Main Chat Area */}
         <div className="w-full lg:w-2/3 xl:w-3/4 h-[600px] lg:h-full flex flex-col">
            <ChatWindow />
         </div>
       </div>
    </div>
  );
};

export default Messages;
