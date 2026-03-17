import React from 'react';
import { Bell, CheckCircle2, MessageSquare, AlertCircle, Calendar } from 'lucide-react';

const NotificationsList = () => {
  const notifications = [
    {
      id: 1,
      type: 'assignment',
      icon: Bell,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      title: 'New Task Assigned',
      description: 'Manager Sarah assigned "Dashboard Component creation" to you.',
      time: '10 min ago',
      isUnread: true
    },
    {
      id: 2,
      type: 'status',
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      title: 'Task Approved',
      description: 'Your pull request for the "Login Bug Fix" was approved and merged.',
      time: '1 hour ago',
      isUnread: true
    },
    {
      id: 3,
      type: 'message',
      icon: MessageSquare,
      color: 'bg-blue-50 text-blue-600 border-blue-100',
      title: 'New Message',
      description: 'John Smith mentioned you in the Design Discussion channel.',
      time: '3 hours ago',
      isUnread: false
    },
    {
      id: 4,
      type: 'alert',
      icon: AlertCircle,
      color: 'bg-rose-50 text-rose-600 border-rose-100',
      title: 'Deadline Approaching',
      description: 'The "API Documentation update" task is due in 3 hours.',
      time: 'Yesterday',
      isUnread: false
    },
    {
      id: 5,
      type: 'meeting',
      icon: Calendar,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
      title: 'Client Sync Scheduled',
      description: 'Weekly sync with the Acme Corp team is starting in 30 mins.',
      time: 'Oct 23',
      isUnread: false
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white sticky top-0 z-10">
        <div>
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">Notifications</h2>
          <p className="text-sm text-gray-500 mt-1">You have 2 unread messages</p>
        </div>
        <div className="flex gap-2">
           <button className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors bg-gray-50 hover:bg-indigo-50 px-3 py-1.5 rounded-lg border border-gray-200">
            Mark all as read
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-50">
        {notifications.map((notification) => {
          const Icon = notification.icon;
          return (
            <div 
              key={notification.id} 
              className={`p-6 flex gap-5 hover:bg-gray-50 transition-colors cursor-pointer group relative ${notification.isUnread ? 'bg-indigo-50/20' : ''}`}
            >
              {notification.isUnread && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-r"></div>
              )}
              
              <div className="flex-shrink-0 pt-0.5">
                <div className={`p-3 rounded-2xl border ${notification.color} shadow-sm group-hover:scale-105 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <h3 className={`text-base font-semibold truncate ${notification.isUnread ? 'text-gray-900' : 'text-gray-800'}`}>
                    {notification.title}
                  </h3>
                  <span className="text-xs font-medium text-gray-400 whitespace-nowrap pt-1">
                    {notification.time}
                  </span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed pr-8">
                  {notification.description}
                </p>
                
                {/* Specific actions based on type */}
                {notification.type === 'assignment' && (
                  <div className="mt-4 flex gap-3">
                    <button className="text-sm font-medium bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">View Task</button>
                  </div>
                )}
                {notification.type === 'meeting' && (
                  <div className="mt-4 flex gap-3">
                    <button className="text-sm font-medium bg-amber-100 text-amber-700 border border-amber-200 px-4 py-1.5 rounded-lg hover:bg-amber-200 transition-colors">Join Call</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationsList;
