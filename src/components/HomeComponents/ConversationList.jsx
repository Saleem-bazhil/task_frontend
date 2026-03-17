import React from 'react';
import { Search, Plus } from 'lucide-react';

const ConversationList = () => {
  const conversations = [
    {
      id: 1,
      name: 'Sarah Connor',
      role: 'Project Manager',
      lastMessage: 'Great! Make sure to use Tailwind...',
      time: '10:35 AM',
      unread: 0,
      isOnline: true,
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Connor&background=random'
    },
    {
      id: 2,
      name: 'Design Team',
      role: 'Group • 4 members',
      lastMessage: 'Mike: I updated the Figma file.',
      time: 'Yesterday',
      unread: 3,
      isOnline: false,
      avatar: 'https://ui-avatars.com/api/?name=Design+Team&background=0D8ABC&color=fff'
    },
    {
      id: 3,
      name: 'John Smith',
      role: 'Frontend Dev',
      lastMessage: 'Can you check the API response?',
      time: 'Tuesday',
      unread: 0,
      isOnline: true,
      avatar: 'https://ui-avatars.com/api/?name=John+Smith&background=random'
    },
    {
      id: 4,
      name: 'Client Updates',
      role: 'Channel',
      lastMessage: 'New requirements added to Jira.',
      time: 'Monday',
      unread: 5,
      isOnline: false,
      avatar: 'https://ui-avatars.com/api/?name=Client&background=random'
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">Messages</h2>
          <button className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <Plus className="w-5 h-5" />
          </button>
        </div>
        
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search conversations..." 
            className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.map((chat, index) => (
          <div 
            key={chat.id} 
            className={`p-4 flex items-center gap-4 cursor-pointer transition-all border-b border-gray-50 last:border-0 hover:bg-gray-50 ${index === 0 ? 'bg-indigo-50/50 relative' : ''}`}
          >
            {index === 0 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-r-md"></div>}
            
            <div className="relative flex-shrink-0">
              <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full border border-gray-200 shadow-sm" />
              {chat.isOnline && (
                <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold text-gray-800 truncate">{chat.name}</h3>
                <span className="text-xs font-medium text-gray-400 whitespace-nowrap ml-2">{chat.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <p className={`text-sm truncate ${chat.unread > 0 ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
                  {chat.lastMessage}
                </p>
                {chat.unread > 0 && (
                  <span className="flex-shrink-0 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ml-2">
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationList;
