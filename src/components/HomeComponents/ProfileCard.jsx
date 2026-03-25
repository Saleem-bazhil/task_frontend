import React, { useState } from 'react';
import { Mail, Briefcase, Building, MapPin, Camera, User, Lock, Save, Edit3 } from 'lucide-react';

const ProfileCard = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@taskflow.com',
    role: 'Senior Project Manager',
    department: 'Engineering',
    location: 'San Francisco, CA',
    bio: 'Experienced project manager specializing in Agile methodologies and cross-functional team leadership. Passionate about delivering high-quality software solutions.'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full max-w-4xl mx-auto group">
      {/* Cover and Avatar Section */}
      <div className="relative h-48 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500">
        <div className="absolute top-4 right-4 z-10">
          <button className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/30 transition-colors shadow-sm focus:ring-2 focus:ring-white/50 flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Edit Cover
          </button>
        </div>
        
        {/* Profile Image Avatar overlaps the cover */}
        <div className="absolute -bottom-16 left-8">
          <div className="relative inline-block">
            <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-md bg-white">
              <img 
                src="https://ui-avatars.com/api/?name=Admin+User&background=4f46e5&color=fff&size=200" 
                alt="Profile Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute bottom-1 right-1 bg-gray-900 border-2 border-white text-white p-2 rounded-full hover:bg-gray-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500">
              <Camera className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Profile Details Content */}
      <div className="pt-20 px-8 pb-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            {isEditing ? (
              <input 
                type="text" 
                name="name" 
                value={profile.name} 
                onChange={handleChange} 
                className="text-2xl font-bold text-gray-900 bg-gray-50 border border-pink-200 focus:ring-2 focus:ring-pink-500 rounded-lg px-3 py-1 mb-1 shadow-inner focus:outline-none w-full" 
              />
            ) : (
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">{profile.name}</h1>
            )}
            
            {isEditing ? (
              <input 
                type="text" 
                name="role" 
                value={profile.role} 
                onChange={handleChange} 
                className="text-pink-600 bg-gray-50 border border-pink-200 focus:ring-2 focus:ring-pink-500 rounded-lg px-3 py-1 text-sm font-medium shadow-inner focus:outline-none w-full mt-2" 
              />
            ) : (
              <p className="text-pink-600 font-semibold tracking-wide mt-1">{profile.role}</p>
            )}
          </div>
          
          <div className="flex gap-3">
            {!isEditing ? (
              <>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="bg-white hover:bg-pink-50 text-pink-700 border border-pink-200 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm flex items-center gap-2 focus:ring-2 focus:ring-pink-500"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
                <button className="bg-pink-600 hover:bg-pink-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm flex items-center gap-2 focus:ring-2 focus:ring-pink-500 focus:ring-offset-1">
                  <Lock className="w-4 h-4" />
                  Password
                </button>
              </>
            ) : (
              <button 
                onClick={() => setIsEditing(false)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm flex items-center gap-2 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">About</h3>
              {isEditing ? (
                <textarea 
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full text-gray-600 bg-gray-50 border border-pink-200 focus:ring-2 focus:ring-pink-500 rounded-xl px-4 py-3 leading-relaxed shadow-inner focus:outline-none resize-none"
                />
              ) : (
                <p className="text-gray-600 leading-relaxed max-w-2xl bg-gray-50 p-4 rounded-xl border border-gray-100">{profile.bio}</p>
              )}
            </div>
            
             <div>
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8">
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 group-hover:bg-pink-50/30 transition-colors">
                  <div className="p-2 bg-pink-100 text-pink-600 rounded-lg">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Email Address</p>
                    {isEditing ? (
                       <input type="email" name="email" value={profile.email} onChange={handleChange} className="w-full text-gray-800 font-medium bg-white border border-pink-200 mt-1 focus:ring-1 focus:ring-pink-500 rounded px-2 text-sm" />
                    ) : (
                      <p className="text-gray-800 font-medium">{profile.email}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 group-hover:bg-amber-50/30 transition-colors">
                  <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Department</p>
                    {isEditing ? (
                       <input type="text" name="department" value={profile.department} onChange={handleChange} className="w-full text-gray-800 font-medium bg-white border border-pink-200 mt-1 focus:ring-1 focus:ring-pink-500 rounded px-2 text-sm" />
                    ) : (
                      <p className="text-gray-800 font-medium">{profile.department}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 group-hover:bg-emerald-50/30 transition-colors">
                   <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Company</p>
                    <p className="text-gray-800 font-medium">TaskFlow Inc.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 group-hover:bg-rose-50/30 transition-colors">
                   <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Location</p>
                    {isEditing ? (
                       <input type="text" name="location" value={profile.location} onChange={handleChange} className="w-full text-gray-800 font-medium bg-white border border-pink-200 mt-1 focus:ring-1 focus:ring-pink-500 rounded px-2 text-sm" />
                    ) : (
                      <p className="text-gray-800 font-medium">{profile.location}</p>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Sidebar / Stats Section */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 flex flex-col justify-center items-center shadow-inner mt-6 md:mt-0">
             <div className="text-center mb-6">
                <h4 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Performance Goal</h4>
                <div className="mt-4 relative inline-flex items-center justify-center">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle className="text-gray-200" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="48" cy="48" />
                    <circle className="text-pink-600" strokeWidth="8" strokeDasharray="251" strokeDashoffset="62" strokeLinecap="round" stroke="currentColor" fill="transparent" r="40" cx="48" cy="48" />
                  </svg>
                  <span className="absolute text-xl font-bold text-gray-800">75%</span>
                </div>
                <p className="text-xs text-pink-600 font-medium mt-3 bg-pink-100 px-3 py-1 rounded-full inline-block">On track</p>
             </div>

             <div className="w-full space-y-3 border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-gray-500 flex items-center gap-2"><User className="w-4 h-4 text-emerald-500"/> Team Managed</span>
                  <span className="text-gray-900 bg-white px-2 py-0.5 rounded shadow-sm border border-gray-100">12 members</span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-gray-500 flex items-center gap-2"><Briefcase className="w-4 h-4 text-pink-500"/> Active Projects</span>
                  <span className="text-gray-900 bg-white px-2 py-0.5 rounded shadow-sm border border-gray-100">4 projects</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
