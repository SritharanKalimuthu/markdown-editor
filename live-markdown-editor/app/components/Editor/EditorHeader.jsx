import React, { useEffect, useRef } from "react";
import { 
  ArrowLeft, Search, Bell, HelpCircle, User, Share, Star, StarOff, Menu,
} from "lucide-react";
import useIsMobile from "@/app/hooks/useIsMobile";

// EditorHeader Component
const EditorHeader = ({ 
  title, 
  setTitle, 
  isEditingTitle, 
  setIsEditingTitle, 
  isSaved, 
  lastSaved, 
  onBack, 
  isStarred, 
  setIsStarred, 
  onShare, 
  showToolbar, 
  setShowToolbar, 
  collaborators = [],
}) => {
  const titleInputRef = useRef(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "Escape") {
      setIsEditingTitle(false);
    }
  };

  const formatLastSaved = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    if (diffInMinutes < 1) return isMobile ? "Just now" : "Just now";
    if (diffInMinutes === 1) return isMobile ? "1 min ago" : "1 minute ago";
    if (diffInMinutes < 60) return isMobile ? `${diffInMinutes}m ago` : `${diffInMinutes} minutes ago`;
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
  };

  if (isMobile) {
    return (
      <div className="bg-white border-b shadow-sm">
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center space-x-2">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft size={18} />
            </button>
            {setShowToolbar && (
              <button onClick={() => setShowToolbar(!showToolbar)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Menu size={18} />
              </button>
            )}
          </div>
          <div className="flex-1 mx-3">
            {!isEditingTitle ? (
              <h1 className="text-sm md:text-lg font-medium text-gray-800 truncate cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition-colors"
                  onClick={() => setIsEditingTitle(true)}>
                {title}
              </h1>
            ) : (
              <input
                ref={titleInputRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleTitleKeyDown}
                onBlur={() => setIsEditingTitle(false)}
                className="w-full text-lg px-2 py-1 outline-none border-2 border-blue-500 rounded"
              />
            )}
          </div>
          <div className="flex items-center space-x-1">
            <button onClick={() => setIsStarred(!isStarred)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              {isStarred ? (
                <Star size={16} className="text-yellow-500 fill-current" />
              ) : (
                <StarOff size={16} className="text-gray-400" />
              )}
            </button>
            <button onClick={onShare} className="hidden sm:flex items-center px-3 py-1.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors text-sm">
              <Share size={14} className="mr-1" />
              Share
            </button>
          </div>
        </div>
        {/* <div className="px-3 py-1 flex items-center justify-between text-xs text-gray-500 border-t">
          <span className="flex items-center">
            <div className={`w-1.5 h-1.5 rounded-full mr-2 ${isSaved ? 'bg-green-500' : 'bg-orange-500'}`}></div>
            {isSaved ? `Saved ${formatLastSaved(lastSaved)}` : "Saving..."}
          </span>
        </div> */}
      </div>
    );
  }

  return (
    <div className="w-full bg-white border-b shadow-sm px-4 py-2 flex items-center justify-between text-sm space-x-2">
      <div className="flex items-center space-x-3">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors" title="Back">
          <ArrowLeft size={18} />
        </button>
        {!isEditingTitle ? (
          <h1 className="text-gray-800 font-medium px-2 py-1 rounded hover:bg-gray-100 cursor-pointer transition-colors"
              onClick={() => setIsEditingTitle(true)}>
            {title}
          </h1>
        ) : (
          <input
            ref={titleInputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleTitleKeyDown}
            onBlur={() => setIsEditingTitle(false)}
            className="text-gray-800 text-sm px-2 py-1 border border-blue-500 rounded outline-none"
          />
        )}
        <button onClick={() => setIsStarred(!isStarred)} className="text-gray-500 hover:text-yellow-500 transition-colors"
                title={isStarred ? "Unstar" : "Star"}>
          {isStarred ? (
            <Star size={16} className="fill-yellow-400 text-yellow-400" />
          ) : (
            <StarOff size={16} />
          )}
        </button>
        <span className="text-gray-400 text-xs">
          {isSaved ? `Saved ${formatLastSaved(lastSaved)}` : "Saving..."}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
          <Search size={16} />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
          <Bell size={16} />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
          <HelpCircle size={16} />
        </button>
        <div className="w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center">
          <User size={14} className="text-white" />
        </div>
        {collaborators.length > 0 && (
          <div className="flex items-center space-x-1">
            {collaborators.slice(0, 3).map((c, i) => (
              <div key={i} className="w-6 h-6 text-xs rounded-full text-white flex items-center justify-center"
                   style={{ backgroundColor: c.color }} title={c.name}>
                {c.name.charAt(0).toUpperCase()}
              </div>
            ))}
            {collaborators.length > 3 && (
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs text-gray-600">
                +{collaborators.length - 3}
              </div>
            )}
          </div>
        )}
        <button onClick={onShare} className="px-3 py-1.5 bg-violet-500 text-white rounded-full hover:bg-violet-600 flex items-center space-x-1 text-sm transition-colors">
          <Share size={14} />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};

export default EditorHeader;