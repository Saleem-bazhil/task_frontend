import React from 'react';

const PlaceholderPage = ({ title }) => {
  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-[1600px] mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
          <p className="text-gray-500">This page is under construction. It matches the sidebar link.</p>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderPage;
