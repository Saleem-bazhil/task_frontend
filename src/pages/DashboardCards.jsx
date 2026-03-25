import React from 'react';

const DashboardCards = () => {
  const cards = [
    {
      title: "Total Tasks",
      count: "124",
      iconClass: "bg-pink-50 text-pink-600",
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
    },
    {
      title: "Pending Tasks",
      count: "32",
      iconClass: "bg-yellow-50 text-yellow-600",
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
    },
    {
      title: "In Progress Tasks",
      count: "18",
      iconClass: "bg-purple-50 text-purple-600",
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
    },
    {
      title: "Completed Tasks",
      count: "74",
      iconClass: "bg-green-50 text-green-600",
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-xl p-6 shadow-sm shadow-gray-200/50 border border-gray-100 flex items-center space-x-5 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
          <div className={`p-4 rounded-xl ${card.iconClass}`}>
            {card.icon}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{card.title}</p>
            <h3 className="text-3xl font-bold text-gray-800 tracking-tight">{card.count}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;

