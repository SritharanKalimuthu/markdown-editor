"use client"
import { useState, useEffect } from 'react';

const usePageLoaded = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const handleLoad = () => setIsLoaded(true);

    if (document.readyState === 'complete') {
      // If already loaded
      setIsLoaded(true);
    } else {
      // Listen for the load event
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  return isLoaded;
};

export default usePageLoaded;
