import React from 'react';
import { ListTodo, Clock, PlayCircle, CheckCircle2, TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, count, icon: Icon, color, trend, trendValue, subtitle }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-800">{count}</h3>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      
      <div className="flex items-center text-sm">
        {trend === 'up' ? (
          <span className="flex items-center text-emerald-600 font-medium">
            <TrendingUp className="w-4 h-4 mr-1" />
            {trendValue}
          </span>
        ) : (
          <span className="flex items-center text-rose-600 font-medium">
            <TrendingDown className="w-4 h-4 mr-1" />
            {trendValue}
          </span>
        )}
        <span className="text-gray-400 ml-2">{subtitle}</span>
      </div>
    </div>
  );
};

const DashboardCards = () => {
  const cards = [
    {
      title: "Total Tasks",
      count: "128",
      icon: ListTodo,
      color: "bg-blue-50 text-blue-600",
      trend: "up",
      trendValue: "12%",
      subtitle: "from last month"
    },
    {
      title: "Pending Tasks",
      count: "32",
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
      trend: "down",
      trendValue: "4%",
      subtitle: "from last week"
    },
    {
      title: "In Progress",
      count: "18",
      icon: PlayCircle,
      color: "bg-indigo-50 text-indigo-600",
      trend: "up",
      trendValue: "8%",
      subtitle: "currently active"
    },
    {
      title: "Completed",
      count: "78",
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600",
      trend: "up",
      trendValue: "24%",
      subtitle: "from last month"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  );
};

export default DashboardCards;
