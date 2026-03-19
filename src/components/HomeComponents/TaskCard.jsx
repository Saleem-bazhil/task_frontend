import React from 'react';
import { Calendar, CheckCircle2, Play } from 'lucide-react';

const TaskCard = ({ task, isAccepted = false, isCompleted = false, onAccept, onStart, onComplete }) => {
  if (!task) return null;

  // Grab values from backend or fallback to defaults
  const priority = task.priority || 'medium';
  const status = task.status || 'pending';

  // Format strings for clean UI display
  const displayPriority = priority.charAt(0).toUpperCase() + priority.slice(1);
  const displayStatus = status === 'in_progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1);

  const getPriorityBadge = (prio) => {
    switch (prio.toLowerCase()) {
      case 'high': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusBadge = (stat) => {
    switch(stat.toLowerCase()) {
      case 'completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'in_progress': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 p-6 flex flex-col h-full relative group">
      {/* Top Section */}
      <div className="flex justify-between items-start mb-4">
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${getPriorityBadge(priority)}`}>
          {displayPriority} Priority
        </span>
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
            <span>Due: <span className="text-gray-700 font-medium">{task.due_date ? new Date(task.due_date).toLocaleDateString() : 'TBD'}</span></span>
          </div>
          <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusBadge(status)}`}>
            {displayStatus}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
          {!isAccepted && !isCompleted && (
             <button onClick={onAccept} type="button" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl text-sm font-medium transition-colors shadow-sm flex justify-center items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Accept Task
            </button>
          )}

          {isAccepted && !isCompleted && (
            <>
              <button onClick={onStart} type="button" className="flex-1 bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 py-2 rounded-xl text-sm font-medium transition-colors flex justify-center items-center gap-1">
                <Play className="w-4 h-4" />
                Start
              </button>
              <button onClick={onComplete} type="button" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-sm font-medium transition-colors shadow-sm flex justify-center items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Complete
              </button>
            </>
          )}
          
          {isCompleted && (
             <button disabled className="flex-1 bg-gray-50 text-gray-500 py-2 rounded-xl text-sm font-medium border border-gray-200 cursor-not-allowed flex justify-center items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;