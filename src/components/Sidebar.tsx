import React, { useState } from 'react';
import { 
  Search, FileText, Book, Film, Database, Settings, HardDrive, 
  Moon, Sun, Coffee, RefreshCw, Image as ImageIcon, FolderOpen 
} from 'lucide-react';
import { FileCategory } from '../types';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeCategory: FileCategory;
  onCategoryChange: (category: FileCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onScanFolder: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

// تعريف إضافي ليدعم webkitdirectory في TypeScript بدون @ts-ignore
declare module 'react' {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    webkitdirectory?: string;
    directory?: string;
  }
}

export default function Sidebar({ activeCategory, onCategoryChange, searchQuery, onSearchChange, onScanFolder }: SidebarProps) {
  const [showSettings, setShowSettings] = useState(false);

  const navItems = [
    { id: 'All', icon: Database, label: 'All Files' },
    { id: 'Word Files', icon: FileText, label: 'Word Files' },
    { id: 'PDF & E-books', icon: Book, label: 'PDF & E-books' },
    { id: 'Videos', icon: Film, label: 'Videos' },
    { id: 'Images', icon: ImageIcon, label: 'Images' },
  ];

  // تحسين: تغيير الثيم عبر State بدل التلاعب المباشر بالـ DOM
  const applyTheme = (theme: string) => {
    document.documentElement.className = theme; // يمكن استبدالها بـ Context إذا أردت
    setShowSettings(false); // إغلاق القائمة بعد الاختيار
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-bg-sidebar border-r border-border-subtle flex flex-col pt-8 z-10 shadow-xl transition-colors duration-300">
      
      {/* Logo Section */}
      <div className="p-6 mb-2 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.5)]">
          <HardDrive size={18} className="text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight text-text-main">IndexMaster</span>
      </div>

      {/* Scan Folder Button */}
      <div className="px-4 mb-6">
        <label className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg cursor-pointer transition-all shadow-lg shadow-blue-500/20 text-sm font-bold active:scale-95">
          <FolderOpen size={18} />
          Scan Folder
          <input
            type="file"
            webkitdirectory=""
            directory=""
            multiple
            className="hidden"
            onChange={onScanFolder}
          />
        </label>
      </div>

      {/* Global Search */}
      <div className="px-4 mb-6">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-black/10 border border-transparent focus:border-blue-500 text-sm rounded-lg py-2 pl-10 pr-4 outline-none transition-all placeholder-zinc-500 text-text-main"
          />
        </div>
      </div>

      {/* Navigation Categories */}
      <nav className="flex-1 space-y-0">
        <div className="text-[10px] uppercase tracking-widest text-zinc-500 px-6 mb-2 font-semibold">Categories</div>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onCategoryChange(item.id as FileCategory)}
            className={cn(
              "w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all relative",
              activeCategory === item.id 
                ? "bg-blue-600/10 text-text-main border-l-2 border-blue-500 shadow-[inset_10px_0_20px_-10px_rgba(59,130,246,0.2)]" 
                : "text-zinc-400 hover:text-text-main hover:bg-black/5 border-l-2 border-transparent"
            )}
          >
            <item.icon size={18} className={cn(
              "transition-colors",
              activeCategory === item.id ? "text-blue-400" : "text-inherit"
            )} />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Bottom Section: Storage & Settings */}
      <div className="p-4 border-t border-border-subtle mt-auto">
        <div className="mt-2 flex flex-col gap-2 relative">
          {/* Settings Popup */}
          {showSettings && (
            <div className="absolute bottom-full left-0 mb-2 w-full bg-bg-sidebar border border-border-subtle rounded-xl p-2 shadow-2xl flex flex-col gap-2 z-50">
              <div className="text-[10px] uppercase px-2 text-zinc-500 font-bold">Themes</div>
              <div className="flex justify-between bg-black/10 p-1 rounded-lg">
                <button onClick={() => applyTheme('')} className="p-2 hover:bg-black/10 rounded text-zinc-500 hover:text-blue-400 transition-all" title="Dark Mode"><Moon size={14} /></button>
                <button onClick={() => applyTheme('theme-light')} className="p-2 hover:bg-black/10 rounded text-zinc-500 hover:text-blue-500 transition-all" title="Light Mode"><Sun size={14} /></button>
                <button onClick={() => applyTheme('theme-beige')} className="p-2 hover:bg-black/10 rounded text-zinc-500 hover:text-amber-700 transition-all" title="Beige Mode"><Coffee size={14} /></button>
              </div>
            </div>
          )}

          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-xs font-medium transition-colors rounded-lg",
              showSettings ? "bg-blue-600/10 text-blue-400" : "text-zinc-500 hover:text-text-main hover:bg-black/5"
            )}
          >
            <Settings size={14} />
            System Settings
          </button>
        </div>
      </div>
    </aside>
  );
}
