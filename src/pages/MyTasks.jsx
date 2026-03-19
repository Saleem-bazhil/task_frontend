import React, { useEffect, useState } from 'react';
import TaskCard from '../components/HomeComponents/TaskCard';
import { Filter, Search } from 'lucide-react';
import api from '../api/Api';

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get('/api/tasks/?status=pending');
        setTasks(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Could not load tasks', err);
        setError('Unable to fetch tasks from backend.');
      }
    };
    fetchTasks();
  }, []);

  const handleAcceptTask = async (taskId) => {
    try {
      await api.patch(`/api/tasks/${taskId}/`, { status: 'in_progress' });
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (err) {
      console.error("Failed to accept task", err);
      alert("Error accepting task.");
    }
  };

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-[1600px] mx-auto animate-fade-in">
      {error && <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>}
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">My Assigned Tasks</h1>
          <p className="text-gray-500 mt-1">Review and accept your new assignments here.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {tasks.map(task => (
           <TaskCard 
             key={task.id} 
             task={task} 
             isAccepted={false} 
             onAccept={() => handleAcceptTask(task.id)} 
           />
        ))}
        {tasks.length === 0 && <p className="text-gray-500 col-span-full">No pending tasks available.</p>}
      </div>
    </div>
  );
};

export default MyTasks;