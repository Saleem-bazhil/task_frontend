import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ListTodo, 
  CheckSquare, 
  CheckCircle, 
  MessageSquare, 
  Bell, 
  User, 
  LogOut,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  // Define the menu items based on your requirements
  const menuItems = [
    { name: 'Dashboard', path: '/app', icon: LayoutDashboard },
    { name: 'My Tasks', path: '/app/my-tasks', icon: ListTodo },
    { name: 'Accepted Tasks', path: '/app/accepted-tasks', icon: CheckSquare },
    { name: 'Completed Tasks', path: '/app/completed-tasks', icon: CheckCircle },
    { name: 'Messages / Chat', path: '/app/messages', icon: MessageSquare },
    { name: 'Notifications', path: '/app/notifications', icon: Bell },
    { name: 'Profile', path: '/app/profile', icon: User },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/50 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out dark:bg-slate-900 dark:border-slate-800 
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Logo / Brand Area */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200 dark:border-slate-800">
          <Link to="/app" className="flex items-center gap-2 font-bold text-xl text-indigo-600 dark:text-indigo-400">
            <CheckSquare className="h-6 w-6" />
            <span>TaskFlow</span>
          </Link>
          {/* Mobile Close Button */}
          <button onClick={toggleSidebar} className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 text-sm font-medium">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' 
                    : 'text-gray-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout Section at the bottom */}
        <div className="p-4 border-t border-gray-200 dark:border-slate-800">
          <button 
            className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            onClick={() => console.log('Handle Logout')}
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;