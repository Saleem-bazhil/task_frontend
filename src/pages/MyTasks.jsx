import React from 'react';
import TaskCard from '../components/HomeComponents/TaskCard';
import { Filter, Search } from 'lucide-react';

const MyTasks = () => {
  const tasks = [
    {
      id: 1,
      title: 'Update Authentication Flow',
      description: 'Implement JWT token refresh cycle and update the Login component to handle expired sessions gracefully without redirecting to the home page immediately.',
      priority: 'High',
      status: 'Pending',
      dueDate: 'Oct 25, 2026',
      assignedBy: 'Sarah Connor'
    },
    {
      id: 2,
      title: 'Design Dashboard UI',
      description: 'Create responsive mockups for the new analytics dashboard based on the client requirements gathered on Monday.',
      priority: 'Medium',
      status: 'Pending',
      dueDate: 'Oct 28, 2026',
      assignedBy: 'David Chen'
    },
    {
      id: 3,
      title: 'Fix Navigation Bug on iOS',
      description: 'Users are reporting that the bottom navigation bar covers content on iPhone 12 and newer models. Needs immediate CSS fix in safe-area-inset.',
      priority: 'High',
      status: 'Pending',
      dueDate: 'Oct 24, 2026',
      assignedBy: 'Sarah Connor'
    },
    {
      id: 4,
      title: 'Write API Documentation',
      description: 'Document the new REST endpoints for the user profile service using Swagger/OpenAPI specs.',
      priority: 'Low',
      status: 'Pending',
      dueDate: 'Nov 02, 2026',
      assignedBy: 'John Smith'
    }
  ];

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-[1600px] mx-auto animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">My Assigned Tasks</h1>
          <p className="text-gray-500 mt-1">Review and accept your new assignments here.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="relative">
            <input 
              type="text" 
              placeholder="Search tasks..." 
              className="bg-white border border-gray-200 text-gray-700 rounded-lg pl-10 pr-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm shadow-sm"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>
          <button className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2 focus:ring-2 focus:ring-indigo-500">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {tasks.map(task => (
           <TaskCard key={task.id} task={task} isAccepted={false} />
        ))}
      </div>
    </div>
  );
};

export default MyTasks;
