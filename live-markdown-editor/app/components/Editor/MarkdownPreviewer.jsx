"use client";
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import { Eye } from "lucide-react";
import useMDXcomponents from "@/app/hooks/useMDXcomponents";
import useIsMobile from "@/app/hooks/useIsMobile";

const MarkdownPreviewer = ({ markdown, zoom = 100 }) => {
  // Detect mobile screen size if isMobile prop is not provided
  const [screenIsMobile, setScreenIsMobile] = useState(false);
  const isMobile = useIsMobile();
  const components = useMDXcomponents();

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
    <div className={`h-full flex flex-col ${isActuallyMobile ? 'bg-white' : 'bg-gray-100'}`}>
      {/* Header */}
      <div className="bg-gray-50 px-4 py-2 text-xs font-medium border-b flex items-center">
        <Eye size={16} className="mr-2" />
        Markdown & HTML Preview
      </div>
      
      <div 
        className={`flex-1 overflow-auto ${
          isActuallyMobile 
            ? 'p-4 bg-white md:p-8 md:bg-gray-100' 
            : 'p-8 bg-gray-100'
        }`}
        style={{ 
          fontSize: `${Math.max(
            isActuallyMobile ? 12 : 11, 
            (zoom / 100) * (isActuallyMobile ? 14 : 13)
          )}px` 
        }}
      >
        <div className={`prose max-w-none ${isActuallyMobile ? 'prose-sm md:prose-lg' : 'prose-lg'}`}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight, rehypeRaw]} 
            components={components}
          >
            {markdown || "Start writing to see the preview..."}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default MarkdownPreviewer;