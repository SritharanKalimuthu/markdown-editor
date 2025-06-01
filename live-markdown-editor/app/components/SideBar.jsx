"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, Settings, LogOut, PenBoxIcon , X, ChevronLeft, ChevronRight } from "lucide-react";

export default function SideBar() {
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
        className="sm:hidden fixed top-4 left-4 z-50 p-2 rounded-lg shadow-lg hover:bg-gray-100 transition-all duration-300"
      >
        {isMobileOpen ? null : <PenBoxIcon className="w-5 h-5" />}
      </button>

      {/* Backdrop for Mobile */}
      {isMobileOpen && (
        <div
          onClick={toggleSidebar}
          className="sm:hidden fixed inset-0 z-40 transition-opacity duration-300"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed sm:relative h-screen bg-gradient-to-b from-gray-50 to-violet-50 shadow-xl z-50
          ${isMounted ? 'transition-all duration-300' : ''}
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isMobileOpen ? 'left-0' : '-left-full sm:left-0'}`}
      >
        <div className="flex flex-col justify-between h-full">
          {/* Top Section */}
          <div>
            {/* Company Logo */}
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-6`}>
              {!isCollapsed && (
                <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-8 h-8 "
                  >
                    <path fillRule="evenodd" d="M17.834 6.166a8.25 8.25 0 1 0 0 11.668.75.75 0 0 1 1.06 1.06c-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788 3.807-3.808 9.98-3.808 13.788 0A9.722 9.722 0 0 1 21.75 12c0 .975-.296 1.887-.809 2.571-.514.685-1.28 1.179-2.191 1.179-.904 0-1.666-.487-2.18-1.164a5.25 5.25 0 1 1-.82-6.26V8.25a.75.75 0 0 1 1.5 0V12c0 .682.208 1.27.509 1.671.3.401.659.579.991.579.332 0 .69-.178.991-.579.3-.4.509-.99.509-1.671a8.222 8.222 0 0 0-2.416-5.834ZM15.75 12a3.75 3.75 0 1 0-7.5 0 3.75 3.75 0 0 0 7.5 0Z" clipRule="evenodd" />
                  </svg>
                  MDEditor
                </h1>
              )}
              
              {/* Collapse Button (Desktop) */}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden sm:block p-2 hover:bg-violet-100 rounded-full transition-colors duration-200"
              >
                {isCollapsed ? (
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>

            {/* Navigation Menu */}
            <nav className="flex flex-col gap-1 px-4 mt-4">
              {menuItems.map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200
                    ${pathname === item.path ? 'bg-violet-100 text-violet-700' : 'hover:bg-violet-50 text-gray-600'}
                    ${isCollapsed ? 'justify-center' : ''}`}
                >
                  {item.icon}
                  {!isCollapsed && (
                    <span className={`text-sm sm:text-md font-medium ${pathname === item.path ? 'font-semibold' : ''}`}>
                      {item.label}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Bottom Section */}
          <div className="p-4">
            <button
              onClick={() => {
                localStorage.removeItem("user");
                localStorage.removeItem("updatedUser");
                router.push("/");
              }}
              className={`flex items-center gap-3 p-3 w-full rounded-lg hover:bg-red-50 text-red-600 transition-colors duration-200
                ${isCollapsed ? 'justify-center' : ''}`}
            >
              <LogOut className="w-5 h-5" />
              {!isCollapsed && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}