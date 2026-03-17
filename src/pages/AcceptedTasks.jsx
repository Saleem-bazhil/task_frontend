import React, { useState, useEffect } from 'react';
import TaskCard from '../components/HomeComponents/TaskCard';
import { LayoutGrid, List } from 'lucide-react';
import api from '../api/Api';

const AcceptedTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAcceptedTasks = async () => {
      try {
        const res = await api.get('/api/tasks/?status=in_progress');
        setTasks(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Could not load active tasks', err);
        setError('Unable to fetch active tasks from backend.');
      }
    };
    fetchAcceptedTasks();
  }, []);

  const handleCompleteTask = async (taskId) => {
    try {
      await api.patch(`/api/tasks/${taskId}/`, { status: 'completed' });
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (err) {
      console.error("Failed to complete task", err);
      alert("Error completing task.");
    }
  };

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-[1600px] mx-auto animate-fade-in">
      {error && <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>}
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Active Tasks</h1>
          <p className="text-gray-500 mt-1">Manage tasks you are currently working on.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {tasks.map(task => (
           <TaskCard 
             key={task.id} 
             task={task} 
             isAccepted={true} 
             onComplete={() => handleCompleteTask(task.id)} 
           />
        ))}
        {tasks.length === 0 && !error && <p className="text-gray-500 col-span-full">No active tasks found.</p>}
      </div>
    </div>
  );
};

export default AcceptedTasks;