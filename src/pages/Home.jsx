import React from 'react';
import DashboardCards from '../components/HomeComponents/DashboardCards';
import RecentTasks from '../components/HomeComponents/RecentTasks';
import ActivityTimeline from '../components/HomeComponents/ActivityTimeline';

const Home = () => {
  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-[1600px] mx-auto space-y-8 animate-fade-in">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Welcome back, Admin 👋</h2>
        <p className="text-gray-500 mt-1">Here is what's happening with your projects today.</p>
      </div>
      
      <DashboardCards />
      
      <div className="flex flex-col xl:flex-row gap-8">
        <div className="w-full xl:w-2/3 flex flex-col">
          <RecentTasks />
        </div>
        
        <div className="w-full xl:w-1/3 flex flex-col">
          <ActivityTimeline />
        </div>
      </div>
    </div>
  );
};

export default Home;