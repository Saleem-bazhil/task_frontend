import React from 'react';

const RecentTasks = () => {
  const tasks = [
    { id: 1, name: 'UI Design for Dashboard', assignedBy: 'Admin', priority: 'High', status: 'In Progress', date: 'Oct 24, 2023' },
    { id: 2, name: 'API Integration', assignedBy: 'Manager', priority: 'High', status: 'Pending', date: 'Oct 25, 2023' },
    { id: 3, name: 'Fix Navigation Bug', assignedBy: 'QA Team', priority: 'Medium', status: 'Completed', date: 'Oct 22, 2023' },
    { id: 4, name: 'Update Documentation', assignedBy: 'Alice Freeman', priority: 'Low', status: 'Pending', date: 'Oct 28, 2023' },
    { id: 5, name: 'Database Migration', assignedBy: 'Admin', priority: 'High', status: 'Completed', date: 'Oct 20, 2023' },
  ];

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-700 bg-red-100 ring-red-600/20';
      case 'Medium': return 'text-yellow-700 bg-yellow-100 ring-yellow-600/20';
      case 'Low': return 'text-green-700 bg-green-100 ring-green-600/20';
      default: return 'text-gray-700 bg-gray-100 ring-gray-600/20';
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-50 text-green-700 border-green-200';
      case 'In Progress': return 'bg-pink-50 text-pink-700 border-pink-200';
      case 'Pending': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm shadow-gray-200/50 border border-gray-100 overflow-hidden mb-8">
      <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
        <h2 className="text-lg font-bold text-gray-800">Recent Tasks</h2>
        <button className="text-sm text-pink-600 font-semibold hover:text-pink-700 transition-colors">View All</button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50/80 text-xs font-semibold uppercase text-gray-500 border-b border-gray-100 tracking-wider">
              <th className="px-6 py-4">Task Name</th>
              <th className="px-6 py-4">Assigned By</th>
              <th className="px-6 py-4">Priority</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Due Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50/80 transition-colors group">
                <td className="px-6 py-4 font-medium text-gray-900">{task.name}</td>
                <td className="px-6 py-4 text-gray-600">{task.assignedBy}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ring-1 ring-inset ${getPriorityStyles(task.priority)}`}>
                    {task.priority}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusStyles(task.status)}`}>
                    {task.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">{task.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTasks;

