import React from 'react';
import { MoreVertical, Check, Eye, Play } from 'lucide-react';

const RecentTasks = () => {
  const tasks = [
    {
      id: 1,
      name: 'Design Dashboard UI',
      assignedBy: 'Sarah Connor',
      priority: 'High',
      status: 'In Progress',
      dueDate: 'Oct 24, 2026',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Connor&background=random'
    },
    {
      id: 2,
      name: 'API Integration',
      assignedBy: 'John Smith',
      priority: 'Medium',
      status: 'Pending',
      dueDate: 'Oct 26, 2026',
      avatar: 'https://ui-avatars.com/api/?name=John+Smith&background=random'
    },
    {
      id: 3,
      name: 'Fix Login Bug',
      assignedBy: 'Mike Ross',
      priority: 'High',
      status: 'Completed',
      dueDate: 'Oct 22, 2026',
      avatar: 'https://ui-avatars.com/api/?name=Mike+Ross&background=random'
    },
    {
      id: 4,
      name: 'Update Documentation',
      assignedBy: 'Sarah Connor',
      priority: 'Low',
      status: 'Pending',
      dueDate: 'Oct 30, 2026',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Connor&background=random'
    },
    {
      id: 5,
      name: 'Client Meeting Prep',
      assignedBy: 'David Chen',
      priority: 'Medium',
      status: 'In Progress',
      dueDate: 'Oct 25, 2026',
      avatar: 'https://ui-avatars.com/api/?name=David+Chen&background=random'
    }
  ];

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'Medium': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Low': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'text-emerald-700 bg-emerald-100';
      case 'In Progress': return 'text-indigo-700 bg-indigo-100';
      case 'Pending': return 'text-amber-700 bg-amber-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mt-8 overflow-hidden">
      <div className="flex justify-between items-center p-6 border-b border-gray-100">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Recent Tasks</h2>
          <p className="text-sm text-gray-500 mt-1">Your latest assignments and track progress</p>
        </div>
        <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
          View All
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <th className="p-4 font-medium pl-6">Task Name</th>
              <th className="p-4 font-medium">Assigned By</th>
              <th className="p-4 font-medium">Priority</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Due Date</th>
              <th className="p-4 font-medium text-right pr-6">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50 transition-colors group">
                <td className="p-4 pl-6">
                  <div className="font-medium text-gray-800">{task.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">ID: #TSK-{8000 + task.id}</div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={task.avatar} alt={task.assignedBy} className="w-8 h-8 rounded-full border border-gray-200" />
                    <span className="text-sm text-gray-700 font-medium">{task.assignedBy}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${getStatusColor(task.status).split(' ')[0].replace('text-', 'bg-')}`}></span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-600 font-medium">{task.dueDate}</td>
                <td className="p-4 text-right pr-6">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors tooltip" title="View Details">
                      <Eye className="w-4 h-4" />
                    </button>
                    {task.status === 'Pending' && (
                      <button className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors tooltip" title="Accept Task">
                        <Play className="w-4 h-4" />
                      </button>
                    )}
                    {task.status !== 'Completed' && (
                      <button className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors tooltip" title="Mark Completed">
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTasks;
