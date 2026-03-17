import React from 'react';
import TaskCard from '../components/HomeComponents/TaskCard';
import { DownloadCloud, CheckCircle2 } from 'lucide-react';

const CompletedTasks = () => {
  const completedTasks = [
    {
       id: 1,
       title: 'Build Authentication UI',
       description: 'Create the login, registration, and forgot password pages following the new design system guidelines provided by the UI team.',
       priority: 'High',
       status: 'Completed',
       dueDate: 'Oct 15, 2026',
       completedDate: 'Oct 14, 2026',
       assignedBy: 'Sarah Connor'
    },
    {
       id: 2,
       title: 'Set up CI/CD Pipeline',
       description: 'Configure GitHub Actions to automatically run tests and deploy to the staging environment upon pull requests to the main branch.',
       priority: 'High',
       status: 'Completed',
       dueDate: 'Oct 18, 2026',
       completedDate: 'Oct 17, 2026',
       assignedBy: 'Mike Ross'
    },
    {
       id: 3,
       title: 'Update Node Packages',
       description: 'Audit and update all out-of-date npm packages in the repository. Ensure there are no breaking changes in React 18 upgrade.',
       priority: 'Low',
       status: 'Completed',
       dueDate: 'Oct 20, 2026',
       completedDate: 'Oct 21, 2026',
       assignedBy: 'John Smith'
    },
    {
       id: 4,
       title: 'Fix Sidebar Toggle Bug',
       description: 'The mobile menu toggle on the sidebar component is failing to close when screen size changes. Resolve state synchronization issue.',
       priority: 'Medium',
       status: 'Completed',
       dueDate: 'Oct 22, 2026',
       completedDate: 'Oct 22, 2026',
       assignedBy: 'David Chen'
    }
  ];

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-[1600px] mx-auto animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
            Completed Tasks <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          </h1>
          <p className="text-gray-500 mt-1">Review your previously completed assignments and history.</p>
        </div>
        
        <button className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2 focus:ring-2 focus:ring-indigo-500 w-fit">
          <DownloadCloud className="w-4 h-4" />
          Export History
        </button>
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {completedTasks.map(task => (
           <TaskCard key={task.id} task={task} isAccepted={false} isCompleted={true} />
        ))}
      </div>
    </div>
  );
};

export default CompletedTasks;
