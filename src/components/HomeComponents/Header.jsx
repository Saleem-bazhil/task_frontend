import React, { useState, useRef, useEffect } from 'react';
import { Menu, User, Settings, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = ({ toggleSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="flex justify-between items-center bg-white p-4 md:p-6 shadow-sm border-b border-gray-100 z-10 sticky top-0">
      <div className="flex items-center gap-3">
        <button onClick={toggleSidebar} className="md:hidden p-1 -ml-1 text-gray-500 hover:text-gray-700 transition-colors focus:outline-none">
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 hidden sm:block">Dashboard</h1>
      </div>
      
      <div className="flex items-center space-x-4 md:space-x-6">
        {/* Search bar */}
        <div className="relative hidden md:block">
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-gray-50 border border-gray-200 text-gray-700 rounded-lg px-4 py-2 w-48 lg:w-64 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm transition-all shadow-inner"
          />
          <svg className="w-5 h-5 text-gray-400 absolute right-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        
        {/* Notification icon */}
        <button className="text-gray-500 hover:text-pink-600 relative transition-colors focus:outline-none p-1 rounded-full hover:bg-pink-50">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
        </button>
        
        {/* User profile avatar with Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            className="flex items-center space-x-3 cursor-pointer focus:outline-none rounded-full ring-2 ring-transparent hover:ring-pink-100 transition-all"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden border border-gray-200 shadow-sm">
              <img 
                className="w-full h-full object-cover" 
                src="https://ui-avatars.com/api/?name=Admin+User&background=4f46e5&color=fff" 
                alt="User Avatar" 
              />
            </div>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 transform opacity-100 scale-100 transition-all origin-top-right">
              <div className="px-4 py-3 border-b border-gray-50">
                <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
                <p className="text-xs text-gray-500 truncate">admin@taskflow.com</p>
              </div>
              
              <div className="py-1">
                <Link 
                  to="/profile" 
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
                <button 
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
              </div>
              
              <div className="py-1 border-t border-gray-50">
                <button 
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

