"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { Edit } from "lucide-react";
import useIsMobile from "@/app/hooks/useIsMobile";

const MarkdownTextArea = ({ 
  markdown, 
  setMarkdown, 
  textareaRef, 
  onFormat, 
  onCursorMove,
  zoom = 100, 
  wordCount, 
  charCount
}) => {

  const isMobile = useIsMobile();

  const handleKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          onFormat("bold");
          break;
        case 'i':
          e.preventDefault();
          onFormat("italic");
          break;
        case 'u':
          e.preventDefault();
          onFormat("underline");
          break;
        case 'k':
          e.preventDefault();
          onFormat("link");
          break;
        default:
          break;
      }
    }
  };

  const handleChange = (e) => {
    setMarkdown(e.target.value);
    if (onCursorMove) {
      setTimeout(onCursorMove, 0);
    }
  };

  const handleClick = () => {
    if (onCursorMove) {
      setTimeout(onCursorMove, 0);
    }
  };

  const handleKeyUp = () => {
    if (onCursorMove) {
      setTimeout(onCursorMove, 0);
    }
  };

  const getFontSize = () => {
    const baseSize = isMobile ? 14 : 16;
    const zoomedSize = (zoom / 100) * baseSize;
    return Math.max(isMobile ? 12 : 14, zoomedSize);
  };

  const getPadding = () => {
    return isMobile ? 'p-4' : 'p-6';
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {!isMobile && (
        <div className="bg-gray-50 px-4 py-2 text-sm font-medium border-b flex justify-between items-center">
          <span className="flex items-center">
            <Edit size={16} className="mr-2" />
            Markdown Editor
          </span>
          <span className="text-xs text-gray-500">
            {wordCount} words, {charCount} characters
          </span>
        </div>
      )}

      {isMobile && (
        <div className="bg-gray-50 px-3 py-1 text-xs border-b flex justify-between items-center">
          <span className="flex items-center text-gray-600">
            <Edit size={12} className="mr-1" />
            Editor
          </span>
          <span className="text-gray-500">
            {wordCount}w • {charCount}c
          </span>
        </div>
      )}

      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={markdown}
          onChange={handleChange}
          onClick={handleClick}
          onKeyUp={handleKeyUp}
          onKeyDown={handleKeyDown}
          className={`w-full h-full ${getPadding()} resize-none font-mono bg-white focus:outline-none text-gray-800 leading-relaxed transition-all duration-200`}
          style={{
            fontSize: `${getFontSize()}px`,
            lineHeight: isMobile ? '1.5' : '1.6'
          }}
          placeholder={isMobile ? "Start writing..." : "Start writing your markdown here..."}
          spellCheck="true"
          autoCapitalize={isMobile ? "sentences" : "off"}
          autoCorrect={isMobile ? "on" : "off"}
        />
      </div>
    </div>
  );
};

export default MarkdownTextArea;