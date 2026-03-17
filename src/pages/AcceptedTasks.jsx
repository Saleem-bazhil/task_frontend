import React from 'react';
import TaskCard from '../components/HomeComponents/TaskCard';
import { LayoutGrid, List } from 'lucide-react';

const AcceptedTasks = () => {
  const activeTasks = [
    {
      id: 1,
      title: 'Database Schema Migration',
      description: 'Update the user table to include new preferences JSON structures and run the migration scripts on the staging environment for testing.',
      priority: 'High',
      status: 'In Progress',
      dueDate: 'Oct 23, 2026',
      assignedBy: 'John Smith'
    },
    {
      id: 2,
      title: 'Payment Gateway Integration',
      description: 'Integrate Stripe API for the new subscription checkout flow. Ensure error handling for declined cards is properly displayed to the user.',
      priority: 'High',
      status: 'In Progress',
      dueDate: 'Oct 26, 2026',
      assignedBy: 'Sarah Connor'
    },
    {
      id: 3,
      title: 'Optimize Image Loading',
      description: 'Implement lazy loading for all images on the marketing landing pages to improve Lighthouse performance scores by at least 15 points.',
      priority: 'Medium',
      status: 'In Progress',
      dueDate: 'Oct 27, 2026',
      assignedBy: 'David Chen'
    }
  ];

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-[1600px] mx-auto animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Active Tasks</h1>
          <p className="text-gray-500 mt-1">Manage tasks you are currently working on.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg border border-gray-200 w-fit">
           <button className="bg-white text-gray-800 p-1.5 rounded shadow-sm focus:outline-none">
             <LayoutGrid className="w-4 h-4" />
           </button>
           <button className="text-gray-500 hover:text-gray-800 p-1.5 rounded transition-colors focus:outline-none">
             <List className="w-4 h-4" />
           </button>
        </div>
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {activeTasks.map(task => (
           <TaskCard key={task.id} task={task} isAccepted={true} />
        ))}
      </div>
    </div>
  );
};

export default AcceptedTasks;
