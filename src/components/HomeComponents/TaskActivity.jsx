import React from 'react';

const TaskActivity = () => {
  const activities = [
    {
      id: 1,
      text: "Task 'UI Design' assigned by Admin",
      time: "2 hours ago",
      iconClass: "bg-blue-100 text-blue-600 ring-blue-50",
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
    },
    {
      id: 2,
      text: "Task 'API Integration' marked completed",
      time: "4 hours ago",
      iconClass: "bg-green-100 text-green-600 ring-green-50",
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
    },
    {
      id: 3,
      text: "New message from Manager",
      time: "Yesterday",
      iconClass: "bg-purple-100 text-purple-600 ring-purple-50",
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm shadow-gray-200/50 border border-gray-100 mb-8 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-800">Task Activity Timeline</h2>
      </div>
      
      <div className="p-6">
        <div className="relative border-l-2 border-gray-100 ml-3 space-y-8">
          {activities.map((activity, index) => (
            <div key={activity.id} className="relative pl-8">
              {/* Timeline marker */}
              <span className={`absolute -left-[17px] top-1 flex items-center justify-center w-8 h-8 rounded-full ring-4 ${activity.iconClass}`}>
                {activity.icon}
              </span>
              
              {/* Content */}
              <div className="bg-gray-50/50 rounded-lg p-3 border border-gray-100 inline-block w-full max-w-2xl">
                <p className="text-sm font-medium text-gray-800">{activity.text}</p>
                <p className="text-xs text-gray-500 mt-1.5 flex items-center shadow-sm">
                  <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskActivity;
