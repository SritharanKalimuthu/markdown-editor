"use client";
import React, { useEffect, useState } from "react";
import { User, Sparkles, Bell, Settings, Search } from "lucide-react";

// Mock getUsername function - replace with your actual implementation
const getUsername = () => {
  // Replace this with your actual getUsername function
  return localStorage?.getItem('username') || 'John Doe';
};

export default function FuturisticTopBar() {
  const [username, setUsername] = useState("");
  const [notifications, setNotifications] = useState(3);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchedUsername = getUsername();
    setUsername(fetchedUsername || "Guest");
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <header className="fixed sm:relative top-0 w-full bg-gradient-to-r from-indigo-50 via-white to-purple-50 backdrop-blur-lg border-b border-gray-200/20 shadow-lg z-10">
      <div className="flex justify-between items-center px-6 py-4">
        {/* Left Section - Logo & Brand */}
        <div className="flex items-center gap-4">
          {/* <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg">
              <Sparkles size={20} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                MDEditor 
              </h1>
            </div>
          </div> */}
          
          {/* Mobile Brand */}
          {/* <div className="sm:hidden flex items-center gap-2 ml-12">
            <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              MDEditor
            </h1>
          </div> */}
        </div>


        {/* Right Section - Time, Notifications & User */}
        <div className="flex items-center gap-4">
          {/* Time Display (Hidden on small screens) */}
          <div className="hidden md:flex flex-col items-end text-right">
            <div className="text-lg font-bold text-gray-900">
              {formatTime(currentTime)}
            </div>
            <div className="text-xs text-gray-500 -mt-1">
              {formatDate(currentTime)}
            </div>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button className="p-2 hover:bg-white/50 rounded-xl transition-colors duration-200 relative">
              <Bell size={20} className="text-gray-600" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium shadow-lg">
                  {notifications}
                </span>
              )}
            </button>
          </div>

          {/* Settings */}
          <button className="p-2 hover:bg-white/50 rounded-xl transition-colors duration-200 hidden sm:block">
            <Settings size={20} className="text-gray-600" />
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 bg-white/70 backdrop-blur-sm rounded-xl px-3 py-2 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="hidden sm:flex flex-col items-end text-right">
              <span className="text-sm font-semibold text-gray-900">
                Welcome, {username}
              </span>
              <span className="text-xs text-gray-500 -mt-0.5">
                Online
              </span>
            </div>
            <span className="sm:hidden text-[10px] font-medium text-gray-900">
              {username}
            </span>
            
            <div className="relative">
              <div className="w-5 h-5 sm:w-8 sm:h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <User size={16} className="text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 sm:w-3 sm:h-3 bg-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle gradient line at bottom */}
      <div className="h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent"></div>
    </header>
  );
}