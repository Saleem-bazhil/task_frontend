import React from 'react';
import ProfileCard from '../components/HomeComponents/ProfileCard';

const Profile = () => {
  return (
    <div className="p-4 md:p-6 lg:p-10 w-full h-full min-h-[calc(100vh-80px)] animate-fade-in">
       <ProfileCard />
    </div>
  );
};

export default Profile;
