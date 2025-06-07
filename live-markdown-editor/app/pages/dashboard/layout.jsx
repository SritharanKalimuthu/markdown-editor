"use client";
import React from "react";
import SideBar from "@/app/components/SideBar";
import TopBar from "@/app/components/TopBar";
import usePageLoaded from "@/app/hooks/usePageLoaded";
import Loader from "@/app/components/Loader/Loader";

export default function DashboardLayout({ children }) {

  const isLoaded = usePageLoaded();

  if(!isLoaded) {
    return ( 
    <div className="h-screen">
        <Loader/>
    </div>
    );
  }
  
  return (
    <div className="flex sm:h-screen min-h-screen">
      {/* Sidebar */}
      <SideBar />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top bar */}
        <TopBar />

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <div className="fixed top-0 left-0 bg-river w-full sm:h-full min-h-full z-[0] "></div>
            <div className="fixed top-0 left-0 bg-white opacity-40 w-full min-h-full z-[0] "></div>
            {children}
        </main>
      </div>
    </div>
  );
}
