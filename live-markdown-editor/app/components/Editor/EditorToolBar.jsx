"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { 
  Bold, Italic, List, ListOrdered, Heading1, Heading2, 
  Heading3, Quote, Link, Code, Image, Undo, Redo, 
  FileDown, FileUp, Clipboard, Eye, Edit, X,
  Settings, Search, ZoomIn, ZoomOut, AlignLeft, AlignCenter, AlignRight, MoreHorizontal, 
  Save, Table, Hash, Strikethrough, Underline, Highlighter, Download, Upload
} from "lucide-react";
import useIsMobile from "@/app/hooks/useIsMobile";

const EditorToolbar = ({ 
  onFormat, 
  onUndo, 
  onRedo, 
  canUndo, 
  canRedo, 
  viewMode, 
  setViewMode, 
  onCopy, 
  onDownload, 
  onImport, 
  onSave,
  zoom, 
  setZoom, 
  showToolbar = true, 
  onToggleToolbar,
}) => {
  const [showFormatDropdown, setShowFormatDropdown] = useState(false);
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const moreDropdownRef = useRef(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowFormatDropdown(false);
      }
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target)) {
        setShowMoreDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const ToolbarButton = ({ icon, title, onClick, active = false, disabled = false, className = "" }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-2 hover:bg-gray-100 rounded transition-colors ${className} ${
        active ? "text-blue-600 bg-blue-50" : "text-gray-700"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "hover:text-blue-600"}`}
      title={title}
    >
      {icon}
    </button>
  );

  const ToolbarSeparator = () => <div className="w-px h-6 bg-gray-300 mx-1" />;

  if (isMobile && !showToolbar) {
    return null;
  }

  if (isMobile) {
    return (
      <div className="border-b shadow-sm bg-violet-200">
        <div className="px-3 py-2 flex flex-wrap items-center gap-1">
          <div className="flex items-center ">
            <ToolbarButton icon={<Undo size={15} />} title="Undo" onClick={onUndo} disabled={!canUndo} />
            <ToolbarButton icon={<Redo size={15} />} title="Redo" onClick={onRedo} disabled={!canRedo} />
            <ToolbarButton icon={<Bold size={15} />} title="Bold" onClick={() => onFormat("bold")} />
            <ToolbarButton icon={<Italic size={15} />} title="Italic" onClick={() => onFormat("italic")} />
            <ToolbarButton icon={<Heading1 size={15} />} title="Heading 1" onClick={() => onFormat("h1")} />
            <ToolbarButton icon={<List size={15} />} title="Bullet List" onClick={() => onFormat("ul")} />
            <ToolbarButton icon={<Link size={15} />} title="Insert Link" onClick={() => onFormat("link")} />
          </div>
          
          <div className="flex items-center bg-gray-100 rounded-lg p-0.5 ml-2">
            <button onClick={() => setViewMode("edit")} className={`px-2 py-1 rounded text-xs transition-all ${
              viewMode === "edit" ? "bg-violet-400 shadow-sm text-gray-900" : "text-gray-600"
            }`}>
              <Edit size={12} className="inline mr-1" />
            </button>
            <button onClick={() => setViewMode("preview")} className={`px-2 py-1 rounded text-xs transition-all ${
              viewMode === "preview" ? "bg-violet-400 shadow-sm text-gray-900" : "text-gray-600"
            }`}>
              <Eye size={12} className="inline mr-1" />
            </button>
          </div>
          
          <div className="ml-auto relative" ref={moreDropdownRef}>
            <ToolbarButton icon={<MoreHorizontal size={15} />} title="More options" 
                          onClick={() => setShowMoreDropdown(!showMoreDropdown)} />
            {showMoreDropdown && (
              <div className="absolute top-full right-0 bg-purple-50 border rounded-lg shadow-lg mt-4 py-2 z-20 w-48">
                <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">Advanced Tools</div>
                <div className="flex flex-wrap gap-1 px-4 py-2">
                  <ToolbarButton icon={<Heading2 size={15} />} title="Heading 2" onClick={() => onFormat("h2")} />
                  <ToolbarButton icon={<Heading3 size={15} />} title="Heading 3" onClick={() => onFormat("h3")} />
                  <ToolbarButton icon={<Quote size={15} />} title="Quote" onClick={() => onFormat("quote")} />
                  <ToolbarButton icon={<Code size={15} />} title="Code Block" onClick={() => onFormat("code")} />
                  <ToolbarButton icon={<Image size={15} />} title="Insert Image" onClick={() => onFormat("image")} />
                  <ToolbarButton icon={<ListOrdered size={15} />} title="Numbered List" onClick={() => onFormat("ol")} />
                  <ToolbarButton icon={<Strikethrough size={15} />} title="Strikethrough" onClick={() => onFormat("strikethrough")} />
                  <ToolbarButton icon={<Underline size={15} />} title="Underline" onClick={() => onFormat("underline")} />
                </div>
                <hr className="my-2" />
                <button onClick={() => { onDownload(); setShowMoreDropdown(false); }}
                        className="flex items-center px-4 py-2 w-full text-left hover:bg-gray-100 text-sm">
                  <FileDown size={16} className="mr-3" />
                  Download
                </button>
                <label className="flex items-center px-4 py-2 w-full text-left hover:bg-gray-100 cursor-pointer text-sm">
                  <FileUp size={16} className="mr-3" />
                  Import File
                  <input type="file" accept=".md,.markdown,.txt" onChange={onImport} className="hidden" />
                </label>
                <hr className="my-2" />
                <div className="px-4 py-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">Zoom</span>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => setZoom(Math.max(50, zoom - 10))} disabled={zoom <= 50}
                              className="p-1 hover:bg-gray-100 rounded disabled:opacity-50">
                        <ZoomOut size={14} />
                      </button>
                      <span className="text-xs min-w-[40px] text-center">{zoom}%</span>
                      <button onClick={() => setZoom(Math.min(200, zoom + 10))} disabled={zoom >= 200}
                              className="p-1 hover:bg-gray-100 rounded disabled:opacity-50">
                        <ZoomIn size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-violet-200 border-b shadow-sm">
      <div className="px-4 py-2 flex flex-wrap items-center gap-1">
        <div className="flex items-center">
          <ToolbarButton icon={<Save size={18} />} title="Save (Ctrl+S)" onClick={onSave} />
          <ToolbarButton icon={<Undo size={18} />} title="Undo (Ctrl+Z)" onClick={onUndo} disabled={!canUndo} />
          <ToolbarButton icon={<Redo size={18} />} title="Redo (Ctrl+Y)" onClick={onRedo} disabled={!canRedo} />
        </div>
        <ToolbarSeparator />
        
        <div className="flex items-center">
          <ToolbarButton icon={<ZoomOut size={18} />} title="Zoom Out" 
                        onClick={() => setZoom(Math.max(50, zoom - 10))} disabled={zoom <= 50} />
          <span className="text-sm text-gray-600 min-w-[50px] text-center">{zoom}%</span>
          <ToolbarButton icon={<ZoomIn size={18} />} title="Zoom In" 
                        onClick={() => setZoom(Math.min(200, zoom + 10))} disabled={zoom >= 200} />
        </div>
        <ToolbarSeparator />
        
        <div className="flex items-center">
          <ToolbarButton icon={<Bold size={18} />} title="Bold (Ctrl+B)" onClick={() => onFormat("bold")} />
          <ToolbarButton icon={<Italic size={18} />} title="Italic (Ctrl+I)" onClick={() => onFormat("italic")} />
          <ToolbarButton icon={<Underline size={18} />} title="Underline (Ctrl+U)" onClick={() => onFormat("underline")} />
          <ToolbarButton icon={<Strikethrough size={18} />} title="Strikethrough" onClick={() => onFormat("strikethrough")} />
          <ToolbarButton icon={<Highlighter size={18} />} title="Highlight" onClick={() => onFormat("highlight")} />
        </div>
        <ToolbarSeparator />
        
        <div className="flex items-center">
          <ToolbarButton icon={<Heading1 size={18} />} title="Heading 1" onClick={() => onFormat("h1")} />
          <ToolbarButton icon={<Heading2 size={18} />} title="Heading 2" onClick={() => onFormat("h2")} />
          <ToolbarButton icon={<Heading3 size={18} />} title="Heading 3" onClick={() => onFormat("h3")} />
          <ToolbarButton icon={<Hash size={18} />} title="Normal Text" onClick={() => onFormat("normal")} />
        </div>
        <ToolbarSeparator />
        
        <div className="flex items-center">
          <ToolbarButton icon={<List size={18} />} title="Bullet List" onClick={() => onFormat("ul")} />
          <ToolbarButton icon={<ListOrdered size={18} />} title="Numbered List" onClick={() => onFormat("ol")} />
          <ToolbarButton icon={<Quote size={18} />} title="Quote" onClick={() => onFormat("quote")} />
          <ToolbarButton icon={<Code size={18} />} title="Code Block" onClick={() => onFormat("code")} />
          <ToolbarButton icon={<Link size={18} />} title="Insert Link" onClick={() => onFormat("link")} />
          <ToolbarButton icon={<Image size={18} />} title="Insert Image" onClick={() => onFormat("image")} />
          <ToolbarButton icon={<Table size={18} />} title="Insert Table" onClick={() => onFormat("table")} />
        </div>
        <ToolbarSeparator />
        
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button onClick={() => setViewMode("edit")} className={`px-3 py-1 rounded text-xs transition-all ${
            viewMode === "edit" ? "bg-violet-400 shadow-sm text-gray-900" : "text-gray-600 hover:text-gray-800"
          }`}>
            <Edit size={16} className="inline mr-1" />
            Edit
          </button>
          <button onClick={() => setViewMode("split")} className={`px-3 py-1 rounded text-xs transition-all ${
            viewMode === "split" ? "bg-violet-400 shadow-sm text-gray-900" : "text-gray-600 hover:text-gray-800"
          }`}>
            Split
          </button>
          <button onClick={() => setViewMode("preview")} className={`px-3 py-1 rounded text-xs transition-all ${
            viewMode === "preview" ? "bg-violet-400 shadow-sm text-gray-900" : "text-gray-600 hover:text-gray-800"
          }`}>
            <Eye size={16} className="inline mr-1" />
            Preview
          </button>
        </div>
        <ToolbarSeparator />
        
        <div className="flex items-center">
          <div className="relative" ref={moreDropdownRef}>
            <ToolbarButton icon={<MoreHorizontal size={18} />} title="More options"
                          onClick={() => setShowMoreDropdown(!showMoreDropdown)} />
            {showMoreDropdown && (
              <div className="absolute top-full right-0 bg-purple-50 border rounded-lg shadow-lg py-2 z-20 w-48 text-sm">
                <button onClick={() => { onCopy(); setShowMoreDropdown(false); }}
                        className="flex items-center px-4 py-2 w-full text-left hover:bg-purple-200">
                  <Clipboard size={16} className="mr-3" />
                  Copy
                </button>
                <button onClick={() => { onDownload(); setShowMoreDropdown(false); }}
                        className="flex items-center px-4 py-2 w-full text-left hover:bg-purple-200">
                  <FileDown size={16} className="mr-3" />
                  Download
                </button>
                <label className="flex items-center px-4 py-2 w-full text-left hover:bg-purple-200 cursor-pointer">
                  <FileUp size={16} className="mr-3" />
                  Import File
                  <input type="file" accept=".md,.markdown,.txt" onChange={onImport} className="hidden" />
                </label>
                <hr className="my-2" />
                <button className="flex items-center px-4 py-2 w-full text-left hover:bg-purple-200">
                  <Search size={16} className="mr-3" />
                  Find & Replace
                </button>
                <button className="flex items-center px-4 py-2 w-full text-left hover:bg-purple-200">
                  <Settings size={16} className="mr-3" />
                  Preferences
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorToolbar;