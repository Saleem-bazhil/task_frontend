import React from 'react';
import { UserPlus, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';

const ActivityTimeline = () => {
  const activities = [
    {
      id: 1,
      icon: UserPlus,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      title: 'Task "UI Design" assigned',
      description: 'by Admin Sarah Connor',
      time: '2 hours ago'
    },
    {
      id: 2,
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      title: 'Task "API Integration" marked completed',
      description: 'You completed this task ahead of schedule.',
      time: '5 hours ago'
    },
    {
      id: 3,
      icon: MessageSquare,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
      title: 'New message from Manager',
      description: '"Can we review the dashboard mockups?"',
      time: 'Yesterday, 3:45 PM'
    },
    {
      id: 4,
      icon: AlertCircle,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
      title: 'Deadline approaching for task',
      description: '"Database Migration" is due tomorrow.',
      time: 'Yesterday, 9:20 AM'
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mt-8 xl:mt-0 p-6 h-full min-h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-800">Activity Timeline</h2>
        <button className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors">
          Filters
        </button>
      </div>

      <div className="relative border-l border-gray-100 ml-3 space-y-8 mt-4">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          const isLast = index === activities.length - 1;

          return (
            <div key={activity.id} className="relative pl-6 sm:pl-8 group">
              {/* Timeline dot/icon */}
              <div className={`absolute -left-4 sm:-left-3.5 top-0 p-1.5 rounded-full border ${activity.color} ring-4 ring-white z-10 transition-transform group-hover:scale-110`}>
                <Icon className="w-4 h-4" />
              </div>

              {/* Connecting line to next item (if not last) */}
              {!isLast && (
                <div className="absolute left-[-1px] top-8 bottom-[-2rem] w-[2px] bg-gray-100 group-hover:bg-indigo-50 transition-colors"></div>
              )}

              {/* Content */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer">
                <div className="flex justify-between items-start gap-4 mb-1">
                  <h4 className="text-sm font-semibold text-gray-800 leading-tight">
                    {activity.title}
                  </h4>
                  <span className="text-xs font-medium text-gray-400 whitespace-nowrap shrink-0">
                    {activity.time}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {activity.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      <button className="w-full mt-8 py-2.5 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200 border-dashed">
        Load More Activity
      </button>
    </div>
  );
};

export default ActivityTimeline;
