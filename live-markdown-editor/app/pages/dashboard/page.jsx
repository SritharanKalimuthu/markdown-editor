"use client";
import { useState, useEffect, useRef } from "react";
import { Plus, File as FileIcon, Clock, Share2, MoreHorizontal, FolderOpen, Edit3, Trash2, Info, DownloadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import { createAndUploadFile, getFiles } from "@/app/api/files.service";
import markdownText from "@/app/utils/data/markdownText";
import toast from "react-hot-toast";
import { getUsername, getuserKey } from "@/app/utils/getUsername";

export default function Page() {
  const router = useRouter();
  const userKey = getuserKey();
  const user = getUsername();
  const [boards, setBoards] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const res = await getFiles(userKey);
        if (res.status == 200) {
          setBoards(res.data.files);
          toast.success("Boards Fetched Successfully!");
        }
      } catch (err) {
        console.log(err);
        toast.error("Failed to fetch boards");
      }
    }
    fetchBoards();
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const options = { month: 'short', day: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const handleCreateBoard = async () => {
    const blob = new Blob([markdownText], { type: "text/markdown" });

    const file = new File([blob], "unknown document.md", {
      type: "text/markdown",
    });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userKey", userKey);

    try {
      const res = await createAndUploadFile(formData);
      const boardId = res.data.file.id;
      if (res.status == 200) {
        console.log(res)
        toast.success("Board Created Successfully!");
        router.push(`/pages/board/${boardId}`);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleBoardClick = (boardId) => {
    if (activeDropdown === null) {
      router.push(`/pages/board/${boardId}`);
    }
  };

  const handleMoreOptionsClick = (e, boardId) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === boardId ? null : boardId);
  };

  const handleDropdownAction = (action, board) => {
    setActiveDropdown(null);
    
    switch (action) {
      case 'open':
        toast.success(`Opening ${board.fileName}`);
        // router.push(`/pages/board/${board.id}`);
        break;
      case 'download':
        toast.success(`downloading ${board.fileName}`);
        // router.push(`/pages/board/${board.id}`);
        break;
      case 'rename':
        toast.success(`Rename functionality for ${board.fileName}`);
        // Add rename logic here
        break;
      case 'remove':
        toast.success(`Remove functionality for ${board.fileName}`);
        // Add remove logic here
        break;
      case 'properties':
        toast.success(`Properties for ${board.fileName}`);
        // Add properties logic here
        break;
      default:
        break;
    }
  };

  const dropdownOptions = [
    { id: 'open', label: 'Open', icon: FolderOpen, color: 'text-blue-600' },
    { id: 'download', label: 'Download', icon: DownloadCloud, color: 'text-green-600' },
    { id: 'rename', label: 'Rename', icon: Edit3, color: 'text-orange-600' },
    { id: 'remove', label: 'Remove', icon: Trash2, color: 'text-red-600' },
    { id: 'properties', label: 'Properties', icon: Info, color: 'text-purple-600' },
  ];

  return (
    <div className="relative container mx-auto p-6 mt-18 sm:mt-4">
      <h1 className="text-xl sm:text-2xl text-violet-800 font-bold mb-8">PLAYGROUND</h1>
      
      {/* Create Board Section */}
      <div className="mb-12">
        <h2 className="text-sm sm:text:md md:text-xl text-gray-700 font-semibold mb-4">Create Board</h2>
        <div 
          className="border border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={handleCreateBoard}
          style={{ width:"160px", height: "200px" }}
        >
          <div className="bg-white border border-gray-200 rounded-md shadow-lg p-6 flex items-center justify-center mb-4" style={{ width: "80px", height: "140px" }}>
            <Plus size={32} className="text-blue-500" />
          </div>
          <p className="text-xs sm:text:md text-gray-700">New board</p>
        </div>
      </div>
      
      {/* Previous Boards Section */}
      <div>
        <h2 className="text-sm sm:text:md md:text-xl font-semibold mb-4 text-gray-700">Recent Boards</h2>
        {boards.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {boards.map((board) => (
                <div key={board.driveFileId} className="relative">
                  <div 
                    className={`border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer shadow-lg relative ${
                      activeDropdown === board.driveFileId 
                        ? 'blur-sm scale-95 shadow-2xl' 
                        : 'hover:scale-105'
                    }`}
                    onClick={() => handleBoardClick(board.driveFileId)}
                  >
                    <div className="bg-purple-400 p-2 border-b border-gray-200">
                      <div className="flex items-center">
                        <FileIcon size={18} className="text-gray-50 mr-2" />
                        <span className="text-xs sm:text-sm font-medium truncate flex-1 text-white">
                          {board.fileName}
                        </span>
                        <button 
                          className="p-1 hover:bg-purple-500 rounded-full transition-all duration-200 hover:scale-110 active:scale-95" 
                          onClick={(e) => handleMoreOptionsClick(e, board.driveFileId)}
                        >
                          <MoreHorizontal size={16} className="text-gray-50" />
                        </button>
                      </div>
                    </div>
                    <div className="p-6 bg-gray-100 flex items-center justify-center">
                      <div className="bg-gray-50 shadow-sm rounded w-full h-24"></div>
                    </div>
                    <div className="bg-white text-xs text-gray-900">
                      <div className="p-3 flex items-center justify-between mb-1">
                        <span>Owner: {user}</span>
                      </div>
                      <div className="text-[10px] sm:text-xs flex items-center pb-3 px-3">
                        <Clock size={14} className="text-gray-400 mr-1" />
                        <span>{formatDate(board.uploadedAt)}</span>
                        <div className="flex-1"></div>
                        <Share2 size={14} className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors" />
                      </div>
                    </div>
                  </div>

                  {/* Advanced Dropdown Menu */}
                  {activeDropdown === board.driveFileId && (
                    <div 
                      ref={dropdownRef}
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white/80 rounded-xl shadow-2xl border border-gray-200 min-w-40 sm:min-w-44 animate-in fade-in zoom-in duration-200"
                      style={{
                        animation: 'dropdownSlide 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    >
                      <div className="p-2">
                        <div className="text-xs text-gray-500 p-2 font-medium border-b border-gray-100">
                          {board.fileName.length > 16 ? board.fileName.substring(0, 16) + '...' : board.fileName}
                        </div>
                        {dropdownOptions.map((option, index) => {
                          const IconComponent = option.icon;
                          return (
                            <button
                              key={option.id}
                              onClick={() => handleDropdownAction(option.id, board)}
                              className="w-full flex items-center px-3 py-2 text-xs md:text-sm text-gray-700 hover:bg-gray-50 transition-all duration-150 rounded-lg group"
                              style={{
                                animationDelay: `${index * 50}ms`,
                                animation: 'slideInFromLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                                opacity: 0,
                                transform: 'translateX(-10px)',
                              }}
                            >
                              <IconComponent 
                                size={16} 
                                className={`mr-3 transition-all duration-200 group-hover:scale-110 ${option.color}`} 
                              />
                              <span className="font-medium">{option.label}</span>
                              {option.id === 'remove' && (
                                <div className="ml-auto">
                                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full opacity-60"></div>
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                      {/* <div className="absolute -top-2 right-0 transform -translate-x-1/2">
                        <div className="w-4 h-4 bg-white border border-gray-200 rotate-45 border-b-0 border-r-0"></div>
                      </div> */}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-xs sm:text:sm text-gray-400 mx-auto">No Boards Created</p>
        )}
      </div>

      <style jsx>{`
        @keyframes dropdownSlide {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1) translateY(0);
          }
        }

        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}