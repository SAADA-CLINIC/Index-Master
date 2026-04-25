import React, { useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import SplashScreen from './components/SplashScreen';
import Sidebar from './components/Sidebar';
import FileGrid from './components/FileGrid';
import { FileItem, FileCategory, ViewMode, SortField, SortOrder } from './types';
import { FILE_EXTENSIONS } from './constants';
import { FolderOpen } from 'lucide-react';

export default function App() {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [activeCategory, setActiveCategory] = React.useState<FileCategory>('All');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [viewMode, setViewMode] = React.useState<ViewMode>('medium');
  const [sortField, setSortField] = React.useState<SortField>('name');
  const [sortOrder, setSortOrder] = React.useState<SortOrder>('asc');
  const [localFiles, setLocalFiles] = React.useState<FileItem[]>([]);
  const [isScanning, setIsScanning] = React.useState(false);
  const [scanProgress, setScanProgress] = React.useState(0);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // تصنيف يعتمد على جدول الامتدادات الكامل (يشمل Word)
  const classifyFile = (ext: string): FileCategory => {
    if (FILE_EXTENSIONS['Word Files'].includes(ext)) return 'Word Files';
    if (FILE_EXTENSIONS['PDF & E-books'].includes(ext)) return 'PDF & E-books';
    if (FILE_EXTENSIONS['Videos'].includes(ext)) return 'Videos';
    if (FILE_EXTENSIONS['Images'].includes(ext)) return 'Images';
    return 'All';
  };

  // دالة آمنة لتشغيل نافذة اختيار المجلد
  const triggerScan = () => {
    if (isScanning) return; // ممنوع أثناء المسح

    if (localFiles.length > 0) {
      const ok = window.confirm(
        'Scanning a new folder will replace all indexed files. Continue?'
      );
      if (!ok) return;
    }

    document.querySelector<HTMLInputElement>('input[webkitdirectory]')?.click();
  };

  // المسح غير المتزامن مع شريط تقدم
  const handleFolderScan = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsScanning(true);
    setScanProgress(0);

    const total = files.length;
    const parsedFiles: FileItem[] = [];
    const CHUNK_SIZE = 200;

    const fileArray = Array.from(files);

    for (let i = 0; i < total; i += CHUNK_SIZE) {
      const chunk = fileArray.slice(i, i + CHUNK_SIZE);

      for (const file of chunk) {
        const f = file as any;
        const ext = f.name.substring(f.name.lastIndexOf('.')).toLowerCase();
        const cat = classifyFile(ext);
        if (cat === 'All') continue;

        parsedFiles.push({
          id: `file-${Date.now()}-${i}-${parsedFiles.length}`,
          name: f.name,
          path: f.path || f.webkitRelativePath || f.name,
          size: f.size,
          dateModified: new Date(f.lastModified),
          category: cat,
          extension: ext,
        });
      }

      const progress = Math.round(((i + chunk.length) / total) * 100);
      setScanProgress(progress);

      // تنفيس الخيط الرئيسي
      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    // المكررات
    const map = new Map<string, number>();
    parsedFiles.forEach((f) => {
      const key = `${f.name}-${f.size}`;
      map.set(key, (map.get(key) || 0) + 1);
    });

    const finalFiles = parsedFiles.map((f) => ({
      ...f,
      isDuplicate: map.get(`${f.name}-${f.size}`)! > 1,
    }));

    setLocalFiles(finalFiles);
    setIsScanning(false);
    setScanProgress(100);

    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  // الفلترة والترتيب
  const filteredAndSortedFiles = React.useMemo(() => {
    let result = [...localFiles];

    if (activeCategory !== 'All') result = result.filter((f) => f.category === activeCategory);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.path.toLowerCase().includes(q) ||
          f.category.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortField === 'size') cmp = a.size - b.size;
      else if (sortField === 'dateModified') cmp = a.dateModified.getTime() - b.dateModified.getTime();
      return sortOrder === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [localFiles, activeCategory, searchQuery, sortField, sortOrder]);

  return (
    <div className="min-h-screen bg-bg-deep">
      <AnimatePresence>
        {!isLoaded && <SplashScreen onComplete={() => setIsLoaded(true)} />}
      </AnimatePresence>

      {isLoaded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex"
        >
          <Sidebar
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onScanFolder={handleFolderScan}
            isScanning={isScanning}
          />

          <div className="ml-64 flex-1 p-6">
            {isScanning && (
              <div className="flex flex-col items-center justify-center h-[80vh] text-center">
                <div className="w-24 h-24 mb-6 rounded-full bg-blue-500/10 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.15)] animate-pulse">
                  <FolderOpen size={40} className="text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-text-main mb-2">Scanning…</h2>
                <p className="text-zinc-500 mb-6">{scanProgress}% complete</p>
                <div className="w-64 h-1 bg-zinc-900 rounded-full border border-border-subtle overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-500"
                    animate={{ width: `${scanProgress}%` }}
                    transition={{ ease: 'linear', duration: 0.1 }}
                  />
                </div>
              </div>
            )}

            {!isScanning && localFiles.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-[80vh] text-center"
              >
                <div className="w-24 h-24 mb-6 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <FolderOpen size={40} className="text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-text-main mb-2">Welcome to IndexMaster</h2>
                <p className="text-zinc-500 max-w-sm mb-6">
                  Your intelligent file indexing companion. Scan a folder to start organizing.
                </p>
                <button
                  onClick={triggerScan}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                >
                  Scan a Folder
                </button>
              </motion.div>
            )}

            {!isScanning && localFiles.length > 0 && (
              <FileGrid
                files={filteredAndSortedFiles}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                sortField={sortField}
                onSortFieldChange={setSortField}
                sortOrder={sortOrder}
                onToggleSortOrder={() =>
                  setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
                }
              />
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
