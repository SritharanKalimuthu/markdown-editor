"use client";
import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import "highlight.js/styles/github.css";
import EditorHeader from "@/app/components/Editor/EditorHeader";
import EditorToolbar from "@/app/components/Editor/EditorToolBar";
import MarkdownPreview from "@/app/components/Editor/MarkdownPreviewer";
import MarkdownTextArea from "@/app/components/Editor/MarkdownTextArea";
import StatusBar from "@/app/components/Editor/StatusBar";
import toast from "react-hot-toast";
import { useRouter, useParams } from "next/navigation";
import useIsMobile from "@/app/hooks/useIsMobile";
import usePageLoaded from "@/app/hooks/usePageLoaded";
import Loader from "@/app/components/Loader/Loader";
import { getuserKey } from "@/app/utils/getUsername";
import { updateMarkdownFile, getFileData } from "@/app/api/files.service";

// Custom hooks for better separation of concerns
const useHistory = (initialValue = "") => {
  const [history, setHistory] = useState([initialValue]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const updateHistory = useCallback((newValue) => {
    if (newValue !== history[historyIndex]) {
      const newHistory = [...history.slice(0, historyIndex + 1), newValue].slice(-100);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      return history[historyIndex - 1];
    }
    return null;
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      return history[historyIndex + 1];
    }
    return null;
  }, [history, historyIndex]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return { updateHistory, undo, redo, canUndo, canRedo, current: history[historyIndex] };
};

const useAutoSave = (callback, delay = 5000) => {
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState(new Date());

  useEffect(() => {
    if (!isDirty) return;

    const timer = setTimeout(async () => {
      try {
        await callback();
        setIsDirty(false);
        setLastSaved(new Date());
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [isDirty, callback, delay]);

  const markDirty = useCallback(() => setIsDirty(true), []);
  const markClean = useCallback(() => setIsDirty(false), []);

  return { isDirty, lastSaved, markDirty, markClean };
};

const useTextStats = (text) => {
  return useMemo(() => {
    const cleanText = text.replace(/```[\s\S]*?```/g, '');
    const words = cleanText.match(/\S+/g) || [];
    return {
      wordCount: words.length,
      charCount: text.length
    };
  }, [text]);
};

const useCursorPosition = (textareaRef, text) => {
  const [position, setPosition] = useState({ line: 1, column: 1 });

  const updatePosition = useCallback(() => {
    if (textareaRef.current) {
      const { selectionStart } = textareaRef.current;
      const textBeforeCursor = text.substring(0, selectionStart);
      const lines = textBeforeCursor.split('\n');
      setPosition({
        line: lines.length,
        column: lines[lines.length - 1].length + 1
      });
    }
  }, [text, textareaRef]);

  return { position, updatePosition };
};

export default function MarkdownEditor() {
  const router = useRouter();
  const params = useParams();
  const fileId = params?.boardId;
  const userKey = getuserKey();
  const isMobile = useIsMobile();
  const isLoaded = usePageLoaded();
  const textareaRef = useRef(null);

  // State management
  const [title, setTitle] = useState("untitled document");
  const [originalTitle, setOriginalTitle] = useState("untitled document");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [markdown, setMarkdown] = useState("");
  const [viewMode, setViewMode] = useState(isMobile ? "edit" : "split");
  const [isStarred, setIsStarred] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [showToolbar, setShowToolbar] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Custom hooks
  const history = useHistory(markdown);
  const textStats = useTextStats(markdown);
  const cursorPosition = useCursorPosition(textareaRef, markdown);

  // Auto-save functionality
  const saveFile = useCallback(async () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const file = new File([blob], `${title}.md`, { type: "text/markdown" });
    const formData = new FormData();
    
    formData.append("file", file);
    formData.append("fileId", fileId);
    formData.append("userKey", userKey);
    formData.append("fileName", title); 

    const res = await updateMarkdownFile(formData);
    if (res.status !== 200) {
      throw new Error("Failed to save file");
    }
    
    // Update the original title after successful save
    setOriginalTitle(title);
    toast.success("File saved successfully");
  }, [markdown, title, fileId, userKey]);

  const autoSave = useAutoSave(saveFile);

  // Format insertion logic with better error handling
  const formatMap = useMemo(() => ({
    bold: (text) => text.startsWith('**') && text.endsWith('**') 
      ? text.slice(2, -2) 
      : `**${text || "bold text"}**`,
    italic: (text) => text.startsWith('*') && text.endsWith('*') && !text.startsWith('**')
      ? text.slice(1, -1)
      : `*${text || "italic text"}*`,
    underline: (text) => text.startsWith('<u>') && text.endsWith('</u>')
      ? text.slice(3, -4)
      : `<u>${text || "underlined text"}</u>`,
    strikethrough: (text) => text.startsWith('~~') && text.endsWith('~~')
      ? text.slice(2, -2)
      : `~~${text || "strikethrough text"}~~`,
    highlight: (text) => text.startsWith('==') && text.endsWith('==')
      ? text.slice(2, -2)
      : `==${text || "highlighted text"}==`,
    h1: (text) => `# ${text || "Heading 1"}`,
    h2: (text) => `## ${text || "Heading 2"}`,
    h3: (text) => `### ${text || "Heading 3"}`,
    normal: (text) => text.replace(/^#{1,6}\s/, ''),
    ul: (text) => `- ${text || "List item"}`,
    ol: (text) => `1. ${text || "List item"}`,
    quote: (text) => `> ${text || "Quote text"}`,
    code: (text) => text.includes('\n') 
      ? `\`\`\`\n${text || "code"}\n\`\`\``
      : `\`${text || "code"}\``,
    link: (text) => `[${text || "link text"}](https://example.com)`,
    image: (text) => `![${text || "alt text"}](image-url)`,
    table: () => `| Header 1 | Header 2 | Header 3 |\n|----------|----------|----------|\n| Cell 1 | Cell 2 | Cell 3 |\n| Cell 4 | Cell 5 | Cell 6 |`,
    hr: () => "\n---\n",
    checkbox: (text) => `- [ ] ${text || "Task item"}`
  }), []);

  // Load file data on mount
  useEffect(() => {
    const fetchFile = async () => {
      if (!fileId) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await getFileData(fileId);
        if (res.status === 200) {
          const { file, fileName } = res.data;
          setMarkdown(file);
          setTitle(fileName);
          setOriginalTitle(fileName);
          history.updateHistory(file);
        } else {
          throw new Error("Failed to fetch file");
        }
      } catch (error) {
        console.error("File fetch error:", error);
        setMarkdown("Error loading file content.");
        toast.error("Failed to load file");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFile();
  }, [fileId]);

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setViewMode("edit");
      } else if (viewMode === "edit" && width >= 1024) {
        setViewMode("split");
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!(e.ctrlKey || e.metaKey)) return;

      const shortcuts = {
        'b': () => insertFormat('bold'),
        'i': () => insertFormat('italic'),
        'u': () => insertFormat('underline'),
        'z': () => !e.shiftKey && handleUndo(),
        'y': () => handleRedo(),
        's': () => handleSave()
      };

      const action = shortcuts[e.key.toLowerCase()];
      if (action) {
        e.preventDefault();
        action();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update markdown with history and auto-save
  const updateMarkdown = useCallback((newValue) => {
    setMarkdown(newValue);
    history.updateHistory(newValue);
    autoSave.markDirty();
  }, [history, autoSave]);

  // Title change handler with validation
  const handleTitleChange = useCallback((newTitle) => {
    const sanitizedTitle = newTitle.trim() || "untitled document";
    setTitle(sanitizedTitle);
    if (sanitizedTitle !== originalTitle) {
      autoSave.markDirty();
    }
  }, [originalTitle, autoSave]);

  // Format insertion
  const insertFormat = useCallback((format) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart: start, selectionEnd: end } = textarea;
    const selectedText = markdown.substring(start, end);
    const formatter = formatMap[format];
    
    if (!formatter) return;

    const insertText = formatter(selectedText);
    const newValue = markdown.substring(0, start) + insertText + markdown.substring(end);
    
    updateMarkdown(newValue);

    // Handle cursor positioning
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = format === 'link' 
        ? start + insertText.indexOf('https://example.com')
        : format === 'image'
        ? start + insertText.indexOf('image-url')
        : start + insertText.length;
      
      const selectionLength = format === 'link' ? 19 : format === 'image' ? 9 : 0;
      textarea.setSelectionRange(newCursorPos, newCursorPos + selectionLength);
      cursorPosition.updatePosition();
    }, 0);
  }, [markdown, updateMarkdown, formatMap, cursorPosition]);

  // History handlers
  const handleUndo = useCallback(() => {
    const previousValue = history.undo();
    if (previousValue !== null) {
      setMarkdown(previousValue);
    }
  }, [history]);

  const handleRedo = useCallback(() => {
    const nextValue = history.redo();
    if (nextValue !== null) {
      setMarkdown(nextValue);
    }
  }, [history]);

  // File operations
  const handleSave = useCallback(async () => {
    try {
      await saveFile();
      autoSave.markClean();
    } catch (error) {
      toast.error("Failed to save file");
    }
  }, [saveFile, autoSave]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("File downloaded successfully!");
  }, [markdown, title]);

  const handleImport = useCallback((event) => {
    const file = event.target.files[0];
    if (!file || !(file.type === 'text/markdown' || file.type === 'text/plain' || file.name.endsWith('.md'))) {
      toast.error("Please select a valid markdown file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      updateMarkdown(e.target.result);
      handleTitleChange(file.name.replace(/\.[^/.]+$/, ""));
      toast.success("File imported successfully!");
    };
    reader.readAsText(file);
    event.target.value = '';
  }, [updateMarkdown, handleTitleChange]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      toast.success("Content copied to clipboard!");
    } catch {
      toast.error("Failed to copy content");
    }
  }, [markdown]);

  const handleShare = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title, text: markdown });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      } catch {
        toast.error("Failed to share");
      }
    }
  }, [title, markdown]);

  const handleBack = useCallback(() => {
    if (autoSave.isDirty && !window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
      return;
    }
    router.push("/pages/dashboard");
  }, [autoSave.isDirty, router]);

  const handleViewModeChange = useCallback((mode) => {
    if (isMobile && mode === "split") {
      toast.info("Split view not recommended on mobile. Using edit mode.", { duration: 2000 });
      setViewMode("edit");
    } else {
      setViewMode(mode);
    }
  }, [isMobile]);

  // Loading state
  if (!isLoaded || isLoading) {
    return (
      <div className="h-screen">
        <Loader />
      </div>
    );
  }

  const collaborators = [
    { name: "Alice Johnson", color: "#FF6B6B" },
    { name: "Bob Smith", color: "#4ECDC4" },
    { name: "Carol Davis", color: "#45B7D1" }
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-50 relative">
      <EditorHeader
        title={title}
        setTitle={handleTitleChange}
        isEditingTitle={isEditingTitle}
        setIsEditingTitle={setIsEditingTitle}
        isSaved={!autoSave.isDirty}
        lastSaved={autoSave.lastSaved}
        onBack={handleBack}
        isStarred={isStarred}
        setIsStarred={setIsStarred}
        onShare={handleShare}
        showToolbar={showToolbar}
        setShowToolbar={setShowToolbar}
        collaborators={collaborators}
      />

      {(showToolbar || !isMobile) && (
        <div className={`${isMobile ? 'absolute top-12 left-0 right-0 z-40 bg-white shadow-lg border-b' : ''}`}>
          <EditorToolbar
            onFormat={insertFormat}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={history.canUndo}
            canRedo={history.canRedo}
            viewMode={viewMode}
            setViewMode={handleViewModeChange}
            onCopy={handleCopy}
            onDownload={handleDownload}
            onImport={handleImport}
            onSave={handleSave}
            zoom={zoom}
            setZoom={setZoom}
            showToolbar={showToolbar}
            onToggleToolbar={isMobile ? () => setShowToolbar(!showToolbar) : undefined}
          />
        </div>
      )}

      <div className={`flex-1 flex overflow-hidden ${isMobile && showToolbar ? 'mt-[3rem]' : ''}`}>
        {viewMode === "edit" && (
          <div className="w-full">
            <MarkdownTextArea
              markdown={markdown}
              setMarkdown={updateMarkdown}
              textareaRef={textareaRef}
              onFormat={insertFormat}
              zoom={zoom}
              wordCount={textStats.wordCount}
              charCount={textStats.charCount}
              onCursorMove={cursorPosition.updatePosition}
            />
          </div>
        )}

        {viewMode === "split" && !isMobile && (
          <>
            <div className="flex-1 border-r border-gray-200">
              <MarkdownTextArea
                markdown={markdown}
                setMarkdown={updateMarkdown}
                textareaRef={textareaRef}
                onFormat={insertFormat}
                zoom={zoom}
                wordCount={textStats.wordCount}
                charCount={textStats.charCount}
                onCursorMove={cursorPosition.updatePosition}
              />
            </div>
            <div className="flex-1">
              <MarkdownPreview markdown={markdown} zoom={zoom} />
            </div>
          </>
        )}

        {viewMode === "preview" && (
          <div className="w-full">
            <MarkdownPreview markdown={markdown} zoom={zoom} />
          </div>
        )}
      </div>

      <StatusBar
        isSaved={!autoSave.isDirty}
        wordCount={textStats.wordCount}
        charCount={textStats.charCount}
        currentLine={cursorPosition.position.line}
        currentColumn={cursorPosition.position.column}
        language="Markdown"
        lastSaved={autoSave.lastSaved}
      />
    </div>
  );
}