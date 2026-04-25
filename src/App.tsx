import React, { useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import SplashScreen from './components/SplashScreen';
import Sidebar from './components/Sidebar';
import FileGrid from './components/FileGrid';
import { FileItem, FileCategory, ViewMode, SortField, SortOrder } from './types';
import { FolderOpen } from 'lucide-react';

export default function App() {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [activeCategory, setActiveCategory] = React.useState<FileCategory>('All');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [viewMode, setViewMode] = React.useState<ViewMode>('medium');
  const [sortField, setSortField] = React.useState<SortField>('name');
  const [sortOrder, setSortOrder] = React.useState<SortOrder>('asc');
  const [localFiles, setLocalFiles] = React.useState<FileItem[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // دالة فهرسة المجلدات الحقيقية من الهارد ديسك
  const handleFolderScan = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const parsedFiles: FileItem[] = Array.from(files).map((file, i) => {
      const f = file as any; // للوصول إلى المسار الكامل في Electron
      const ext = f.name.substring(f.name.lastIndexOf('.')).toLowerCase();
      let category: FileCategory = 'Word Files';

      if (['.pdf', '.epub', '.azw3', '.mobi'].includes(ext)) category = 'PDF & E-books';
      else if (['.mp4', '.mkv', '.avi', '.mov', '.wmv'].includes(ext)) category = 'Videos';
      else if (['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.ico'].includes(ext)) category = 'Images';
      else category = 'All'; // أنواع غير مدعومة

      return {
        id: `file-${Date.now()}-${i}`,
        name: f.name,
        path: f.path || f.webkitRelativePath || f.name,
        size: f.size,
        dateModified: new Date(f.lastModified),
        category,
        extension: ext
      };
    }).filter(f => f.category !== 'All'); // إزالة الملفات غير المدعومة

    // اكتشاف المكررات
    const fileMap = new Map<string, number>();
    parsedFiles.forEach(f => {
      const key = `${f.name}-${f.size}`;
      fileMap.set(key, (fileMap.get(key) || 0) + 1);
    });

    const finalFiles = parsedFiles.map(f => ({
      ...f,
      isDuplicate: fileMap.get(`${f.name}-${f.size}`)! > 1
    }));

    setLocalFiles(finalFiles);

    // تفريغ قيمة الحقل للسماح بإعادة مسح نفس المجلد
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  // الفلترة والترتيب
  const filteredAndSortedFiles = React.useMemo(() => {
    let result = [...localFiles];

    if (activeCategory !== 'All') {
      result = result.filter(f => f.category === activeCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(f =>
        f.name.toLowerCase().includes(query) ||
        f.path.toLowerCase().includes(query) ||
        f.category.toLowerCase().includes(query)
      );
    }

    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'size') {
        comparison = a.size - b.size;
      } else if (sortField === 'dateModified') {
        comparison = a.dateModified.getTime() - b.dateModified.getTime();
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [localFiles, activeCategory, searchQuery, sortField, sortOrder]);

  return (
    <div className="min-h-screen bg-bg-deep">
      {/* الواجهة الترحيبية (Splash) */}
      <AnimatePresence>
        {!isLoaded && (
          <SplashScreen onComplete={() => setIsLoaded(true)} />
        )}
      </AnimatePresence>

      {/* التطبيق الرئيسي مع تأثير ظهور بعد اختفاء السبلاش */}
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
            // يمكن تمرير ref داخليًا إذا أردت، لكن الزر مخفي داخل الـ Sidebar
          />

          <div className="ml-64 flex-1 p-6">
            {localFiles.length === 0 ? (
              // شاشة ترحيبية عند عدم وجود ملفات
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center justify-center h-[80vh] text-center"
              >
                <div className="w-24 h-24 mb-6 rounded-full bg-blue-500/10 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.15)]">
                  <FolderOpen size={40} className="text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-text-main mb-2">
                  Welcome to IndexMaster
                </h2>
                <p className="text-zinc-500 max-w-sm mb-6">
                  Your intelligent file indexing companion. Scan a folder to start organizing your documents, videos, and images.
                </p>
                <button
                  onClick={() => {
                    // محاكاة ضغطة على زر المسح في الـ Sidebar
                    document.querySelector<HTMLInputElement>('input[webkitdirectory]')?.click();
                  }}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                >
                  Scan a Folder
                </button>
              </motion.div>
            ) : (
              <FileGrid
                files={filteredAndSortedFiles}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                sortField={sortField}
                onSortFieldChange={setSortField}
                sortOrder={sortOrder}
                onToggleSortOrder={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              />
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
