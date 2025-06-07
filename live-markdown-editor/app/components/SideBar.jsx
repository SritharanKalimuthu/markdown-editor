"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, Settings, LogOut, PenBoxIcon, X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

export default function FuturisticSideBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Add mount check for animation
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const menuItems = [
    { path: "/pages/dashboard", label: "Board", icon: <LayoutDashboard className="w-5 h-5" /> },
    { path: "/pages/dashboard/settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
  ];

  const toggleSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleNavigation = (path) => {
    router.push(path);
    setIsMobileOpen(false); 
  };

  return (
    <>
      {/* Mobile Hamburger Icon */}
      <button
        onClick={toggleSidebar}
        className="sm:hidden fixed top-4 left-4 z-50 p-3 rounded-xl bg-white/80 backdrop-blur-lg border border-gray-200/50 shadow-lg hover:bg-white/90 hover:shadow-xl transition-all duration-300 hover:scale-105 z-20"
      >
        {isMobileOpen ? null : <PenBoxIcon className="w-4 h-4 text-indigo-600" />}
      </button>

      {/* Backdrop for Mobile */}
      {isMobileOpen && (
        <div
          onClick={toggleSidebar}
          className="sm:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-all duration-300"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed sm:relative h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50 backdrop-blur-xl border-r border-gray-200/50 shadow-2xl z-50
          ${isMounted ? 'transition-all duration-300 ease-in-out' : ''}
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isMobileOpen ? 'left-0' : '-left-full sm:left-0'}`}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/30 via-transparent to-purple-100/30 pointer-events-none"></div>
        
        <div className="relative flex flex-col justify-between h-full">
          {/* Top Section */}
          <div>
            {/* Company Logo */}
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-6 border-b border-gray-200/30`}>
              {!isCollapsed && (
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6 text-white"
                      >
                        <path fillRule="evenodd" d="M17.834 6.166a8.25 8.25 0 1 0 0 11.668.75.75 0 0 1 1.06 1.06c-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788 3.807-3.808 9.98-3.808 13.788 0A9.722 9.722 0 0 1 21.75 12c0 .975-.296 1.887-.809 2.571-.514.685-1.28 1.179-2.191 1.179-.904 0-1.666-.487-2.18-1.164a5.25 5.25 0 1 1-.82-6.26V8.25a.75.75 0 0 1 1.5 0V12c0 .682.208 1.27.509 1.671.3.401.659.579.991.579.332 0 .69-.178.991-.579.3-.4.509-.99.509-1.671a8.222 8.222 0 0 0-2.416-5.834ZM15.75 12a3.75 3.75 0 1 0-7.5 0 3.75 3.75 0 0 0 7.5 0Z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      MDEditor
                    </h1>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Sparkles className="w-3 h-3 text-indigo-400" />
                      <span className="text-xs text-gray-500 font-medium">Pro</span>
                    </div>
                  </div>
                </div>
              )}
              
              {isCollapsed && (
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6 text-white"
                    >
                      <path fillRule="evenodd" d="M17.834 6.166a8.25 8.25 0 1 0 0 11.668.75.75 0 0 1 1.06 1.06c-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788 3.807-3.808 9.98-3.808 13.788 0A9.722 9.722 0 0 1 21.75 12c0 .975-.296 1.887-.809 2.571-.514.685-1.28 1.179-2.191 1.179-.904 0-1.666-.487-2.18-1.164a5.25 5.25 0 1 1-.82-6.26V8.25a.75.75 0 0 1 1.5 0V12c0 .682.208 1.27.509 1.671.3.401.659.579.991.579.332 0 .69-.178.991-.579.3-.4.509-.99.509-1.671a8.222 8.222 0 0 0-2.416-5.834ZM15.75 12a3.75 3.75 0 1 0-7.5 0 3.75 3.75 0 0 0 7.5 0Z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
                </div>
              )}
              
              {/* Collapse Button (Desktop) */}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden sm:block p-2 hover:bg-white/70 rounded-xl transition-all duration-200 hover:shadow-md backdrop-blur-sm border border-gray-200/50"
              >
                {isCollapsed ? (
                  <ChevronRight className="w-4 h-4 text-indigo-600" />
                ) : (
                  <ChevronLeft className="w-4 h-4 text-indigo-600" />
                )}
              </button>
            </div>

            {/* Close Button for Mobile */}
            {isMobileOpen && (
              <button
                onClick={toggleSidebar}
                className="sm:hidden absolute top-4 right-4 p-2 hover:bg-white/70 rounded-xl transition-colors duration-200 backdrop-blur-sm border border-gray-200/50"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            )}

            {/* Navigation Menu */}
            <nav className="flex flex-col gap-2 px-4 mt-6">
              {menuItems.map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleNavigation(item.path)}
                  className={`relative group flex items-center gap-3 p-3 rounded-xl transition-all duration-300 hover:shadow-lg
                    ${pathname === item.path 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25' 
                      : 'hover:bg-white/70 text-gray-700 hover:text-indigo-600 backdrop-blur-sm border border-transparent hover:border-gray-200/50'
                    }
                    ${isCollapsed ? 'justify-center' : ''}`}
                >
                  {/* Active indicator */}
                  {pathname === item.path && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-lg"></div>
                  )}
                  
                  <div className={`relative ${pathname === item.path ? 'text-white' : 'text-gray-600 group-hover:text-indigo-600'}`}>
                    {item.icon}
                    {pathname === item.path && (
                      <div className="absolute inset-0 bg-white/20 rounded-lg animate-pulse"></div>
                    )}
                  </div>
                  
                  {!isCollapsed && (
                    <span className={`text-sm font-medium transition-colors duration-200
                      ${pathname === item.path ? 'text-white font-semibold' : 'text-gray-700 group-hover:text-indigo-600'}`}>
                      {item.label}
                    </span>
                  )}
                  
                  {/* Hover effect */}
                  {pathname !== item.path && (
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Bottom Section */}
          <div className="p-4 border-t border-gray-200/30">
            <button
              onClick={() => {
                // Note: localStorage usage removed for Claude.ai artifact compatibility
                // In a real implementation, you would use localStorage here:
                // localStorage.removeItem("user");
                // localStorage.removeItem("updatedUser");
                router.push("/");
              }}
              className={`group relative flex items-center gap-3 p-3 w-full rounded-xl hover:bg-red-50/80 text-red-600 transition-all duration-300 hover:shadow-lg backdrop-blur-sm border border-transparent hover:border-red-200/50
                ${isCollapsed ? 'justify-center' : ''}`}
            >
              <LogOut className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              {!isCollapsed && (
                <span className="font-medium transition-colors duration-200">Logout</span>
              )}
              
              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>

        {/* Bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent"></div>
      </aside>
    </>
  );
}