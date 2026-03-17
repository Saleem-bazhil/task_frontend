import React from 'react';
import { Menu } from 'lucide-react';

const Header = ({ toggleSidebar }) => {
  return (
    <header className="flex justify-between items-center bg-white p-6 shadow-sm border-b border-gray-100 z-10 sticky top-0">
      <div className="flex items-center gap-3">
        <button onClick={toggleSidebar} className="md:hidden p-1 -ml-1 text-gray-500 hover:text-gray-700 transition-colors focus:outline-none">
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800 hidden sm:block">Dashboard</h1>
      </div>
      
      <div className="flex items-center space-x-6">
        {/* Search bar */}
        <div className="relative hidden md:block">
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-gray-50 border border-gray-200 text-gray-700 rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
          />
          <svg className="w-5 h-5 text-gray-400 absolute right-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        
        {/* Notification icon */}
        <button className="text-gray-500 hover:text-blue-600 relative transition-colors focus:outline-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
        </button>
        
        {/* User profile avatar */}
        <div className="flex items-center space-x-3 cursor-pointer">
          <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-200">
            <img 
              className="w-full h-full object-cover" 
              src="https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff" 
              alt="User Avatar" 
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
