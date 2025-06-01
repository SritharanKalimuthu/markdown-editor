"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";
import useIsMobile from "@/app/hooks/useIsMobile";

const StatusBar = ({ 
  isSaved, 
  wordCount, 
  charCount, 
  currentLine = 1, 
  currentColumn = 1,
  language = "Markdown",
}) => {
  // Detect mobile screen size if isMobile prop is not provided
  const [screenIsMobile, setScreenIsMobile] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const checkScreenSize = () => {
      setScreenIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Use prop isMobile if provided, otherwise use detected screen size
  const isActuallyMobile = isMobile || screenIsMobile;

  return (
    <div className={`bg-gray-100 border-t border-gray-200 text-xs text-gray-600 flex justify-between items-center ${
      isActuallyMobile ? 'px-3 py-2' : 'px-4 py-2'
    }`}>
      {/* Left side content */}
      <div className={`flex items-center ${isActuallyMobile ? 'space-x-2' : 'space-x-4'}`}>
        <span className={`flex items-center ${isSaved ? 'text-green-600' : 'text-orange-600'}`}>
          <div className={`rounded-full mr-2 ${
            isActuallyMobile ? 'w-1.5 h-1.5' : 'w-2 h-2'
          } ${isSaved ? 'bg-green-500' : 'bg-orange-500'}`}></div>
          {isActuallyMobile 
            ? (isSaved ? "Saved" : "Saving...") 
            : (isSaved ? "All changes saved" : "Saving...")
          }
        </span>
        
        {/* Show line/column info only on desktop or larger mobile screens */}
        {!isActuallyMobile && (
          <span>Line {currentLine}, Column {currentColumn}</span>
        )}
      </div>

      {/* Right side content */}
      <div className={`flex items-center ${isActuallyMobile ? 'space-x-2' : 'space-x-4'}`}>
        {/* Mobile layout - compact */}
        {isActuallyMobile ? (
          <>
            <span className="hidden sm:inline">{language}</span>
            <span>{wordCount}w • {charCount}c</span>
          </>
        ) : (
          /* Desktop layout - full info */
          <>
            <span>{language}</span>
            <span>{wordCount} words</span>
            <span>{charCount} characters</span>
            <button className="hover:text-gray-800 transition-colors">
              UTF-8
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default StatusBar;