import React, { useState } from 'react';
import { Send, Paperclip, CheckCircle2, MoreVertical, Search, Phone, Video } from 'lucide-react';

const ChatWindow = () => {
  const [message, setMessage] = useState('');

  const messages = [
    {
      id: 1,
      sender: 'Manager',
      text: 'Hi, how is the dashboard design coming along?',
      timestamp: '10:30 AM',
      isMe: false,
      avatar: 'https://ui-avatars.com/api/?name=Manager+Sarah&background=random'
    },
    {
      id: 2,
      sender: 'Admin',
      text: 'Hi Sarah! It is going well. I have completed the layout and am currently working on the responsive grid for the cards.',
      timestamp: '10:32 AM',
      isMe: true,
      status: 'read'
    },
    {
      id: 3,
      sender: 'Manager',
      text: 'Great! Make sure to use Tailwind classes for the shadow effects.',
      timestamp: '10:35 AM',
      isMe: false,
      avatar: 'https://ui-avatars.com/api/?name=Manager+Sarah&background=random'
    },
    {
      id: 4,
      sender: 'Admin',
      text: 'Will do. I will send you a preview link soon.',
      timestamp: '10:40 AM',
      isMe: true,
      status: 'delivered'
    }
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="relative">
             <img src="https://ui-avatars.com/api/?name=Manager+Sarah&background=random" alt="Manager" className="w-10 h-10 rounded-full border border-gray-200" />
             <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800 leading-tight">Sarah Connor</h2>
            <p className="text-xs text-emerald-600 font-medium tracking-wide">Online</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors hidden sm:block">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors hidden sm:block">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors">
            <Video className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-gray-200 mx-1 hidden sm:block"></div>
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-xl transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
        <div className="text-center rounded-lg mt-2 mb-6">
           <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs text-gray-500 font-medium shadow-sm">Today</span>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} group animate-fade-in`}>
            <div className={`flex gap-3 max-w-[85%] sm:max-w-[70%] ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
              
              {!msg.isMe && (
                 <img src={msg.avatar} alt={msg.sender} className="w-8 h-8 rounded-full self-end border border-gray-200 shadow-sm" />
              )}
              
              <div className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-2 mb-1 pl-1">
                   <span className="text-xs font-semibold text-gray-600">{msg.sender}</span>
                   <span className="text-[10px] text-gray-400">{msg.timestamp}</span>
                </div>
                
                <div className={`px-4 py-2.5 rounded-2xl shadow-sm ${
                  msg.isMe 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                }`}>
                  <p className="text-[15px] leading-relaxed break-words">{msg.text}</p>
                </div>
                
                {msg.isMe && (
                  <div className="flex items-center gap-1 mt-1 pr-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] text-gray-400 capitalize">{msg.status}</span>
                    {msg.status === 'read' && <CheckCircle2 className="w-3 h-3 text-indigo-500" />}
                    {msg.status === 'delivered' && <CheckCircle2 className="w-3 h-3 text-gray-400" />}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex items-center gap-3 relative">
          <button className="p-2.5 text-gray-400 hover:text-indigo-600 bg-gray-50 hover:bg-indigo-50 rounded-xl transition-all focus:outline-none flex-shrink-0">
            <Paperclip className="w-5 h-5" />
          </button>
          
          <input 
            type="text" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..." 
            className="flex-1 bg-gray-50 border-0 focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-3 sm:py-3.5 text-sm text-gray-700 transition-all placeholder-gray-400 shadow-inner"
            onKeyDown={(e) => e.key === 'Enter' && message.trim() && setMessage('')}
          />
          
          <button 
            disabled={!message.trim()}
            onClick={() => message.trim() && setMessage('')}
            className={`p-3 rounded-xl transition-all flex items-center justify-center flex-shrink-0
              ${message.trim() 
                ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700 hover:shadow-lg focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
          >
            <Send className="w-5 h-5 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
