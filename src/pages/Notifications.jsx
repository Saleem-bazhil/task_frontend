import React from 'react';
import NotificationsList from '../components/HomeComponents/NotificationsList';

const Notifications = () => {
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto h-full min-h-[calc(100vh-80px)] animate-fade-in">
       <NotificationsList />
    </div>
  );
};

export default Notifications;
