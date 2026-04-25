import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MoreVertical, FolderOpen, ExternalLink, Trash2, 
  LayoutGrid, List, ChevronDown, SortAsc, SortDesc, 
  FileText, Book, Film, AlertCircle, HardDrive 
} from 'lucide-react';
import { FileItem, ViewMode, SortField, SortOrder } from '../types';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

interface FileGridProps {
  files: FileItem[];
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sortField: SortField;
  onSortFieldChange: (field: SortField) => void;
  sortOrder: SortOrder;
  onToggleSortOrder: () => void;
}

export default function FileGrid({ 
  files, 
  viewMode, 
  onViewModeChange,
  sortField,
  onSortFieldChange,
  sortOrder,
  onToggleSortOrder
}: FileGridProps) {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [contextMenu, setContextMenu] = React.useState<{ x: number, y: number, fileId: string | null } | null>(null);

  const toggleSelection = (e: React.MouseEvent, id: string) => {
    if (e.ctrlKey || e.metaKey) {
      setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    } else {
      setSelectedIds([id]);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, fileId: id });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // دالة ترجع أيقونة الملف مع الخلفية الصلبة حسب الفئة (مكبرة)
  const getFileIcon = (category: string, isSelected: boolean) => {
    // ضاعفنا الأحجام: للشبكة 56px، للقائمة 36px
    const sizeIcon = viewMode === 'list' ? 28 : 48;
    let icon;
    let bgColor;
    
    switch (category) {
      case 'Word Files':
        icon = <FileText size={sizeIcon} className="text-white" />;
        bgColor = 'bg-blue-500';
        break;
      case 'PDF & E-books':
        icon = <Book size={sizeIcon} className="text-white" />;
        bgColor = 'bg-red-500';
        break;
      case 'Videos':
        icon = <Film size={sizeIcon} className="text-white" />;
        bgColor = 'bg-purple-500';
        break;
      case 'Images':
        icon = <FileText size={sizeIcon} className="text-white" />; // يمكن استبداله بـ ImageIcon
        bgColor = 'bg-green-500';
        break;
      default:
        icon = <FileText size={sizeIcon} className="text-white" />;
        bgColor = 'bg-gray-500';
    }

    // أحجام الحاوية مكبرة أيضًا: للشبكة 20×20 (تعادل 80px)، للقائمة 12×12 (48px)
    const containerSize = viewMode === 'list' ? 'w-14 h-14' : 'w-20 h-20 mb-4';

    return (
      <div className={cn(
        'flex items-center justify-center rounded-xl transition-all', // rounded-xl أنعم
        bgColor,
        isSelected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-bg-main' : '',
        containerSize
      )}>
        {icon}
      </div>
    );
  };

  // معالج فتح الملف (إذا كان Electron)
  const handleOpenFile = (filePath: string) => {
    try {
      // @ts-ignore
      const { shell } = window.require('electron');
      shell.openPath(filePath);
    } catch (error) {
      console.error("Failed to open file:", error);
    }
  };

  const getFilePathById = (id: string): string | undefined => {
    const file = files.find(f => f.id === id);
    return file?.path;
  };

  const handleContextMenuAction = (action: string, fileId: string | null) => {
    if (!fileId) return;
    const filePath = getFilePathById(fileId);
    if (!filePath) return;

    switch (action) {
      case 'open':
        handleOpenFile(filePath);
        break;
      case 'loc':
        try {
          const { shell } = window.require('electron');
          shell.showItemInFolder(filePath);
        } catch (error) {
          console.error("Failed to show file location:", error);
        }
        break;
      // delete etc...
    }
    setContextMenu(null);
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-bg-main text-text-main relative transition-colors duration-300">
      
      {/* Toolbar */}
      <header className="h-16 border-b border-border-subtle flex items-center justify-between px-8 bg-opacity-5 backdrop-blur-md">
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <span className="hover:text-blue-500 cursor-pointer transition-colors">Root</span>
          <span>/</span>
          <span className="font-medium uppercase tracking-wider text-[10px]">Disk Index</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-black/5 rounded-lg p-1 border border-border-subtle">
            {(['name', 'size', 'dateModified'] as SortField[]).map((field) => (
              <button
                key={field}
                onClick={() => onSortFieldChange(field)}
                className={cn(
                  "px-3 py-1 text-[10px] font-bold uppercase tracking-tight transition-all",
                  sortField === field 
                    ? "bg-blue-600 text-white rounded-md shadow-sm" 
                    : "text-zinc-500 hover:text-text-main"
                )}
              >
                {field.replace('Modified', '')}
                {sortField === field && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
              </button>
            ))}
          </div>
          
          <div className="w-[1px] h-4 bg-border-subtle"></div>

          <div className="flex gap-1">
            {(['list', 'medium'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => onViewModeChange(mode)}
                className={cn(
                  "p-1.5 rounded-md transition-all",
                  viewMode === (mode === 'medium' ? 'medium' : 'list') 
                    ? "text-blue-500 bg-blue-500/10" 
                    : "text-zinc-500 hover:text-text-main"
                )}
              >
                {mode === 'list' ? <List size={16} /> : <LayoutGrid size={16} />}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        {files.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-500">
            <FolderOpen size={64} strokeWidth={1} className="mb-4 opacity-20" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em]">No indexed files found</p>
          </div>
        ) : (
          <div className={cn(
            "grid gap-6", // زيادة الفراغ بين العناصر
            viewMode === 'list' 
              ? "grid-cols-1" 
              : "grid-cols-[repeat(auto-fill,minmax(160px,1fr))]" // عرض أدنى أكبر
          )}>
            {files.map((file) => (
              <motion.div
                layout
                key={file.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={(e) => toggleSelection(e, file.id)}
                onDoubleClick={() => {
                  const filePath = getFilePathById(file.id);
                  if (filePath) handleOpenFile(filePath);
                }}
                onContextMenu={(e) => handleContextMenu(e, file.id)}
                className={cn(
                  "relative group flex cursor-pointer transition-all rounded-xl border",
                  viewMode === 'list' 
                    ? "flex-row items-center gap-6 px-5 py-4 border-transparent hover:bg-black/5" // مساحات أكبر
                    : "flex-col items-center p-6 border-transparent hover:bg-black/5 hover:border-border-subtle", // padding أكبر
                  selectedIds.includes(file.id) && "bg-blue-600/10 border-blue-600/30 shadow-[inset_0_0_20px_rgba(59,130,246,0.05)]"
                )}
              >
                {/* أيقونة الملف مع الخلفية الصلبة */}
                {getFileIcon(file.category, selectedIds.includes(file.id))}

                {/* بيانات الملف */}
                <div className={cn(
                  "flex flex-col overflow-hidden",
                  viewMode === 'list' ? "flex-1" : "items-center text-center w-full"
                )}>
                  <span className={cn(
                    "font-semibold truncate w-full",
                    viewMode === 'list' ? "text-sm" : "text-[13px]" // نصوص أكبر
                  )}>
                    {file.name}
                  </span>
                  
                  <span className={cn(
                    "text-zinc-500 mt-1 font-bold uppercase",
                    viewMode === 'list' ? "text-[11px]" : "text-[11px]"
                  )}>
                    {formatFileSize(file.size)} • {file.extension.replace('.', '')}
                  </span>
                </div>

                {file.isDuplicate && (
                  <div className="absolute top-2 right-2 text-orange-500" title="Duplicate Found">
                    <AlertCircle size={16} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setContextMenu(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ left: contextMenu.x, top: contextMenu.y }}
              className="fixed z-50 min-w-[180px] bg-bg-sidebar border border-border-subtle rounded-lg shadow-2xl py-1.5"
            >
              {[
                { label: 'Open', action: 'open' },
                { label: 'Open Location', action: 'loc' },
                { separator: true },
                { label: 'Copy', action: 'copy' },
                { label: 'Cut', action: 'cut' },
                { separator: true },
                { label: 'Delete', action: 'delete', textClass: 'text-red-500 hover:bg-red-500 hover:text-white' },
              ].map((item, idx) => (
                item.separator ? (
                  <div key={idx} className="h-[1px] bg-border-subtle my-1" />
                ) : (
                  <button
                    key={idx}
                    onClick={() => handleContextMenuAction(item.action, contextMenu.fileId)}
                    className={cn(
                      "w-full px-4 py-1.5 text-[11px] font-medium text-left transition-colors flex justify-between items-center",
                      item.textClass ? item.textClass : "text-zinc-500 hover:bg-blue-600 hover:text-white"
                    )}
                  >
                    {item.label}
                  </button>
                )
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="h-8 border-t border-border-subtle flex items-center justify-between px-6 bg-black/5 text-[9px] text-zinc-500 font-bold uppercase tracking-wider">
        <div className="flex items-center gap-4">
          <span>{files.length.toLocaleString()} Files Found</span>
          <div className="w-[1px] h-3 bg-border-subtle"></div>
          {selectedIds.length > 0 && (
            <span className="text-blue-500">{selectedIds.length} Selected</span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
            <span>System Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
