"use client";
import { useState, useEffect, useRef } from "react";
import { Plus, FileText, Clock, Share2, MoreHorizontal, Edit3, Trash2, TrendingUp, Users, Target, Zap, Activity, Calendar, Search, ChartNoAxesCombined, BarChart3, PieChart, ArrowUpRight, CheckCircle2, X, Grid3X3, List, Copy, Download, Archive, Star, Eye, ExternalLink, Settings, Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";
import { createAndUploadFile, getFiles, RenameFile, DeleteFile } from "@/app/api/files.service";
import { getUsername, getuserKey } from "@/app/utils/getUsername";
import markdownText from "@/app/utils/data/markdownText";
import toast from "react-hot-toast";
import SpinLoader from "@/app/components/Loader/SpinLoader";
import usePageLoaded from "@/app/hooks/usePageLoaded";

export default function FuturisticDashboard() {
  const router = useRouter();
  const userKey = getuserKey();
  const user = getUsername();
  const isLoaded = usePageLoaded();
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  
  // Simplified dropdown state - just track which board's dropdown is open
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  // Separate state for modals (rename/delete)
  const [activeAction, setActiveAction] = useState({ type: null, boardId: null, data: "" });
  
  const [stats, setStats] = useState({
    totalBoards: 0,
    teamMembers: 8,
    growthRate: 24.5,
    activeProjects: 0
  });
  
  // Single ref for dropdown - like the working version
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isLoaded) {
      fetchBoards();
    }
  }, [isLoaded]);

  // Simplified useEffect for outside clicks - like the working version
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchBoards = async () => {
    setLoading(true);
    try {
      const res = await getFiles(userKey);
      if (res.status === 200 && res.data && res.data.files) {
        setBoards(res.data.files);
        updateStats(res.data.files);
        toast.success("Boards loaded successfully!");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Failed to fetch boards:", err);
      toast.error("Failed to fetch boards");
      setBoards([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (boardsData) => {
    const now = new Date();
    const recentBoards = boardsData.filter(board => {
      const uploadDate = new Date(board.uploadedAt);
      const daysDiff = (now - uploadDate) / (1000 * 60 * 60 * 24);
      return daysDiff <= 30;
    });

    setStats({
      totalBoards: boardsData.length,
      teamMembers: 8,
      growthRate: boardsData.length > 0 ? Math.round((recentBoards.length / boardsData.length) * 100) : 0,
      activeProjects: Math.floor(boardsData.length * 0.7)
    });
  };

  const handleCreateBoard = async () => {
    setCreateLoading(true);
    try {
      if (!userKey) {
        throw new Error("User key not found");
      }

      const blob = new Blob([markdownText], { type: "text/markdown" });
      const file = new File([blob], "New Document.md", { type: "text/markdown" });
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userKey", userKey);

      const res = await createAndUploadFile(formData);
      if (res && res.status === 200 && res.data && res.data.file && res.data.file.id) {
        toast.success("Board created successfully!");
        router.push(`/pages/board/${res.data.file.id}`);
      } else {
        throw new Error(`Failed to create board: ${res?.statusText || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Creation failed:", error);
      toast.error(`Failed to create board: ${error.message}`);
    } finally {
      setCreateLoading(false);
    }
  };

  const executeAction = async (type, boardId, data = "") => {
    if (!boardId) {
      toast.error("Board ID is missing");
      return;
    }

    setLoading(true);
    try {
      switch (type) {
        case "rename":
          if (!data.trim()) {
            toast.error("Please enter a valid name");
            setLoading(false);
            return;
          }
          const renameRes = await RenameFile({ fileId: boardId, newFileName: data.trim() });
          if (renameRes && renameRes.status === 200) {
            toast.success(`Successfully renamed to ${data.trim()}`);
            await fetchBoards();
          } else {
            throw new Error("Rename failed");
          }
          break;

        case "delete":
          const deleteRes = await DeleteFile({fileId:boardId, userKey: userKey});
          if (deleteRes && deleteRes.status === 200) {
            const boardName = boards.find(b => b.id === boardId || b.driveFileId === boardId)?.fileName || "Board";
            toast.success(`Successfully deleted ${boardName}`);
            await fetchBoards();
          } else {
            throw new Error(`Delete failed with status: ${deleteRes?.status || 'Unknown'}`);
          }
          break;

        case "duplicate":
          toast.info("Duplicate feature coming soon!");
          break;

        case "archive":
          toast.info("Archive feature coming soon!");
          break;

        default:
          toast.error("Unknown action");
      }

      setActiveAction({ type: null, boardId: null, data: "" });
    } catch (error) {
      console.error(`${type} failed:`, error);
      toast.error(`Failed to ${type} board: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBoardClick = (boardId) => {
    // Only navigate if no dropdown is open
    if (activeDropdown === null) {
      router.push(`/pages/board/${boardId}`);
    }
  };

  // Fixed menu click handler - simplified like the working version
  const handleMenuClick = (e, boardId) => {
    e.stopPropagation();
    e.preventDefault();
    // Simple toggle logic - if same board clicked, close it, otherwise open the new one
    setActiveDropdown(activeDropdown === boardId ? null : boardId);
  };

  const filteredBoards = boards.filter(board => 
    board.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (isoString) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(isoString));
  };

  const StatCard = ({ icon: Icon, title, value, change, color }) => (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 sm:p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-r ${color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={20} className="text-white sm:w-6 sm:h-6" />
        </div>
        <div className="flex items-center text-emerald-600 font-semibold">
          <ArrowUpRight size={14} className="mr-1" />
          <span className="text-xs sm:text-sm">+{change}%</span>
        </div>
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-gray-600 text-xs sm:text-sm font-medium">{title}</p>
    </div>
  );

  const ActionModal = ({ isOpen, onClose, onConfirm, title, children, confirmText, confirmColor }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200 p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-md animate-in zoom-in-95 duration-300">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
          {children}
          <div className="flex gap-3 mt-4 sm:mt-6">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors duration-200"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 py-3 px-4 text-white ${confirmColor} hover:opacity-90 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2`}
              disabled={loading}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  {confirmText}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const DropdownMenu = ({ board, isOpen }) => {
    if (!isOpen) return null;

    return (
      <div
        ref={dropdownRef}
        className="absolute -right-4 -top-6 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 w-48 sm:w-52 z-[60] backdrop-blur-sm"
        style={{ zIndex: 9999 }}
      >
        <div className="px-3 py-2 border-b border-gray-100">
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Board Actions</span>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            setActiveDropdown(null);
            setActiveAction({ type: "rename", boardId: board.driveFileId, data: board.fileName.replace('.md', '') });
          }}
          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-left hover:bg-blue-50 flex items-center gap-2 sm:gap-3 text-gray-700 text-sm transition-colors"
        >
          <Edit3 size={14} className="sm:w-4 sm:h-4 text-blue-600" />
          <span>Rename Board</span>
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            setActiveDropdown(null);
            executeAction("duplicate", board.driveFileId);
          }}
          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-left hover:bg-green-50 flex items-center gap-2 sm:gap-3 text-gray-700 text-sm transition-colors"
        >
          <Copy size={14} className="sm:w-4 sm:h-4 text-green-600" />
          <span>Duplicate</span>
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            setActiveDropdown(null);
            window.open(`/pages/board/${board.driveFileId}`, '_blank');
          }}
          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-left hover:bg-purple-50 flex items-center gap-2 sm:gap-3 text-gray-700 text-sm transition-colors"
        >
          <ExternalLink size={14} className="sm:w-4 sm:h-4 text-purple-600" />
          <span>Open in New Tab</span>
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            setActiveDropdown(null);
            executeAction("archive", board.driveFileId);
          }}
          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-left hover:bg-yellow-50 flex items-center gap-2 sm:gap-3 text-gray-700 text-sm transition-colors"
        >
          <Archive size={14} className="sm:w-4 sm:h-4 text-yellow-600" />
          <span>Archive</span>
        </button>
        
        <div className="border-t border-gray-100 mt-1 pt-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveDropdown(null);
              setActiveAction({ type: "delete", boardId: board.driveFileId, data: "" });
            }}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-left hover:bg-red-50 flex items-center gap-2 sm:gap-3 text-red-600 text-sm transition-colors"
          >
            <Trash2 size={14} className="sm:w-4 sm:h-4" />
            <span>Delete Board</span>
          </button>
        </div>
      </div>
    );
  };

  const BoardCard = ({ board }) => (
    <div className="group bg-white rounded-3xl border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-visible hover:-translate-y-1 cursor-pointer relative">
      <div onClick={() => handleBoardClick(board.driveFileId)}>
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <FileText size={16} className="text-white flex-shrink-0 sm:w-[18px] sm:h-[18px]" />
              <span className="text-white font-medium text-xs sm:text-sm truncate">
                {board.fileName.replace('.md', '')}
              </span>
            </div>
            <div className="relative flex-shrink-0">
              <button
                onClick={(e) => handleMenuClick(e, board.driveFileId)}
                className="p-1.5 sm:p-2 hover:bg-white/20 rounded-full transition-colors duration-200 z-10 relative"
              >
                <MoreHorizontal size={14} className="text-white sm:w-4 sm:h-4" />
              </button>
              <DropdownMenu
                board={board}
                isOpen={activeDropdown === board.driveFileId}
              />
            </div>
          </div>
        </div>
        
        <div className="p-4 sm:p-6">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl h-20 sm:h-24 mb-3 sm:mb-4 flex items-center justify-center">
            <div className="text-gray-400">
              <BarChart3 size={24} className="sm:w-8 sm:h-8" />
            </div>
          </div>
          
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-gray-600">Owner</span>
              <span className="font-medium text-gray-900 truncate ml-2">{user}</span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-1 sm:gap-2 text-gray-600">
                <Clock size={10} className="sm:w-3 sm:h-3" />
                <span>{formatDate(board.uploadedAt)}</span>
              </div>
              <button
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <Share2 size={12} className="text-gray-400 sm:w-[14px] sm:h-[14px]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const BoardListItem = ({ board }) => (
    <div className="group bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-visible cursor-pointer p-4 sm:p-6 relative">
      <div
        onClick={() => handleBoardClick(board.driveFileId)}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
          <div className="p-2 sm:p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex-shrink-0">
            <FileText size={16} className="text-white sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate text-sm sm:text-base">
              {board.fileName.replace('.md', '')}
            </h3>
            <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-600 mt-1">
              <span>Owner: {user}</span>
              <span className="flex items-center gap-1">
                <Clock size={10} className="sm:w-3 sm:h-3" />
                {formatDate(board.uploadedAt)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <Share2 size={14} className="text-gray-400" />
          </button>
          <div className="relative">
            <button
              onClick={(e) => handleMenuClick(e, board.driveFileId)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <MoreHorizontal size={14} className="text-gray-400" />
            </button>
            <DropdownMenu
              board={board}
              isOpen={activeDropdown === board.driveFileId}
            />
          </div>
        </div>
      </div>
    </div>
  );

  if (!isLoaded || (loading && boards.length === 0)) {
    return (
      <div className="h-screen flex items-center justify-center">
        <SpinLoader />
      </div>
    );
  }

  return (
    <div className="relative pt-6 sm:pt-0">
      <div className="container mx-auto p-4 sm:p-6 pt-20 sm:pt-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl">
              <ChartNoAxesCombined size={20} className="text-white sm:w-6 sm:h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Command Center
            </h1>
          </div>
          <p className="text-gray-600 text-sm sm:text-base">Manage your projects with intelligent insights</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <StatCard
            icon={FileText}
            title="Total Boards"
            value={stats.totalBoards}
            change={12}
            color="from-blue-500 to-blue-600"
          />
          <StatCard
            icon={Users}
            title="Team Members"
            value={stats.teamMembers}
            change={8}
            color="from-emerald-500 to-emerald-600"
          />
          <StatCard
            icon={TrendingUp}
            title="Growth Rate"
            value={`${stats.growthRate}%`}
            change={stats.growthRate}
            color="from-purple-500 to-purple-600"
          />
          <StatCard
            icon={Target}
            title="Active Projects"
            value={stats.activeProjects}
            change={15}
            color="from-orange-500 to-orange-600"
          />
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search boards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-white rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm text-sm sm:text-base"
            />
          </div>
          
          <div className="flex bg-white rounded-2xl border border-gray-200 p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-4 py-3 rounded-xl flex items-center gap-2 font-medium transition-all duration-200 ${
                viewMode === "grid"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Grid3X3 size={16} />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-3 rounded-xl flex items-center gap-2 font-medium transition-all duration-200 ${
                viewMode === "list"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <List size={16} />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>
          
          <button
            onClick={handleCreateBoard}
            disabled={createLoading}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-50 text-sm sm:text-base min-w-[140px]"
          >
            {createLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <Plus size={18} className="sm:w-5 sm:h-5" />
                Create Board
              </>
            )}
          </button>
        </div>

        {/* Boards Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredBoards.map((board) => (
              <BoardCard key={board.driveFileId} board={board} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBoards.map((board) => (
              <BoardListItem key={board.driveFileId} board={board} />
            ))}
          </div>
        )}

        {filteredBoards.length === 0 && !loading && (
          <div className="text-center py-12 sm:py-16">
            <div className="text-gray-400 mb-4">
              <FileText size={48} className="mx-auto sm:w-16 sm:h-16" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No boards found</h3>
            <p className="text-gray-500 text-sm sm:text-base">
              {searchTerm ? `No boards match "${searchTerm}"` : "Create your first board to get started"}
            </p>
          </div>
        )}

        {/* Action Modals */}
        <ActionModal
          isOpen={activeAction.type === "rename"}
          onClose={() => setActiveAction({ type: null, boardId: null, data: "" })}
          onConfirm={() => executeAction("rename", activeAction.boardId, activeAction.data)}
          title="Rename Board"
          confirmText="Rename"
          confirmColor="bg-blue-600"
        >
          <input
            type="text"
            value={activeAction.data}
            onChange={(e) => setActiveAction(prev => ({ ...prev, data: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            placeholder="Enter new name"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                executeAction("rename", activeAction.boardId, activeAction.data);
              }
            }}
          />
        </ActionModal>

        <ActionModal
          isOpen={activeAction.type === "delete"}
          onClose={() => setActiveAction({ type: null, boardId: null, data: "" })}
          onConfirm={() => executeAction("delete", activeAction.boardId)}
          title="Delete Board"
          confirmText="Delete"
          confirmColor="bg-red-600"
        >
          <div className="text-gray-600">
            <p className="mb-4 text-sm sm:text-base">
              Are you sure you want to delete this board? This action cannot be undone.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4">
              <p className="text-red-800 text-xs sm:text-sm font-medium">
                ⚠️ This will permanently remove all data.
              </p>
            </div>
          </div>
        </ActionModal>
      </div>
    </div>
  );
}