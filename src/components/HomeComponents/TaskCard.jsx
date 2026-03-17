import React from 'react';
import { Calendar, Clock, CheckCircle2, Play, Users } from 'lucide-react';

const TaskCard = ({ task, isAccepted = false, isCompleted = false }) => {
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'Medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Low': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'In Progress': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 p-6 flex flex-col h-full relative group">
      {/* Top Section */}
      <div className="flex justify-between items-start mb-4">
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${getPriorityBadge(task.priority)}`}>
          {task.priority} Priority
        </span>
        <button className="text-gray-400 hover:text-gray-600 focus:outline-none">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-grow">
        <h3 className="text-lg font-bold text-gray-800 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">
          {task.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
          {task.description}
        </p>
      </div>

      {/* Footer Details */}
      <div className="space-y-3 mt-auto">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-500">
            <Calendar className="w-4 h-4 mr-1.5" />
            <span>Due: <span className="text-gray-700 font-medium">{task.dueDate}</span></span>
          </div>
          <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusBadge(task.status)}`}>
            {task.status}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm border-t border-gray-50 pt-3">
           <div className="flex items-center gap-2">
            <img src={task.assignedByAvatar || `https://ui-avatars.com/api/?name=${task.assignedBy}&background=random`} alt={task.assignedBy} className="w-6 h-6 rounded-full" />
            <span className="text-gray-600 text-xs">Assigned by <span className="font-medium text-gray-800">{task.assignedBy}</span></span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
          {!isAccepted && !isCompleted && (
             <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl text-sm font-medium transition-colors shadow-sm flex justify-center items-center gap-1.5 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1">
              <CheckCircle2 className="w-4 h-4" />
              Accept Task
            </button>
          )}

          {isAccepted && !isCompleted && (
            <>
              <button className="flex-1 bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 py-2 rounded-xl text-sm font-medium transition-colors flex justify-center items-center gap-1">
                <Play className="w-4 h-4" />
                Start
              </button>
              <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-sm font-medium transition-colors shadow-sm flex justify-center items-center gap-1 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1">
                <CheckCircle2 className="w-4 h-4" />
                Complete
              </button>
            </>
          )}
          
          {isCompleted && (
             <button className="flex-1 bg-gray-50 text-gray-500 py-2 rounded-xl text-sm font-medium border border-gray-200 cursor-not-allowed flex justify-center items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Completed on {task.completedDate || 'Oct 24, 2026'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
