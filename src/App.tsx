import React from 'react';
import { AnimatePresence } from 'motion/react';
import SplashScreen from './components/SplashScreen';
import Sidebar from './components/Sidebar';
import FileGrid from './components/FileGrid';
import { FileItem, FileCategory, ViewMode, SortField, SortOrder } from './types';

export default function App() {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [activeCategory, setActiveCategory] = React.useState<FileCategory>('All');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [viewMode, setViewMode] = React.useState<ViewMode>('medium');
  const [sortField, setSortField] = React.useState<SortField>('name');
  const [sortOrder, setSortOrder] = React.useState<SortOrder>('asc');

  // مساحة تخزين الملفات الحقيقية (بدل البيانات الوهمية)
  const [localFiles, setLocalFiles] = React.useState<FileItem[]>([]);

  // دالة فهرسة المجلدات الحقيقية من الهارد ديسك
  const handleFolderScan = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    // تحويل الملفات الحقيقية للصيغة اللي بيفهمها البرنامج
    const parsedFiles: FileItem[] = Array.from(files).map((file, i) => {
      const f = file as any; // To access electron absolute path
      const ext = f.name.substring(f.name.lastIndexOf('.')).toLowerCase();
      let category: FileCategory = 'Word Files';

      if (['.pdf', '.epub', '.azw3', '.mobi'].includes(ext)) category = 'PDF & E-books';
      else if (['.mp4', '.mkv', '.avi', '.mov', '.wmv'].includes(ext)) category = 'Videos';
      else if (['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.ico'].includes(ext)) category = 'Images';
      else category = 'All';

      return {
        id: `file-${Date.now()}-${i}`,
        name: f.name,
        path: f.path || f.webkitRelativePath || f.name, // سحب المسار الحقيقي للملف
        size: f.size,
        dateModified: new Date(f.lastModified),
        category,
        extension: ext
      };
    }).filter(f => f.category !== 'All'); // استبعاد الملفات غير المدعومة لتخفيف الضغط

    // اكتشاف الملفات المكررة بناءً على الاسم والحجم
    const fileMap = new Map<string, number>();
    parsedFiles.forEach(f => {
      const uniqueKey = `${f.name}-${f.size}`;
      fileMap.set(uniqueKey, (fileMap.get(uniqueKey) || 0) + 1);
    });

    const finalFiles = parsedFiles.map(f => ({
      ...f,
      isDuplicate: fileMap.get(`${f.name}-${f.size}`)! > 1
    }));

    setLocalFiles(finalFiles);
  };

  // الفلترة والترتيب بناءً على الملفات الحقيقية
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
      <AnimatePresence>
        {!isLoaded && (
          <SplashScreen onComplete={() => setIsLoaded(true)} />
        )}
      </AnimatePresence>

      <div className="flex">
        <Sidebar 
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onScanFolder={handleFolderScan} // ربط زرار الفهرسة
        />
        
        <div className="ml-64 flex-1 p-6">
          {localFiles.length === 0 ? (
            // الشاشة الترحيبية قبل إضافة أي ملفات
            <div className="flex flex-col items-center justify-center h-[80vh] text-zinc-500">
              <div className="w-24 h-24 mb-6 rounded-full bg-blue-500/10 flex items-center justify-center">
                <span className="text-4xl">📂</span>
              </div>
              <h2 className="text-2xl font-bold text-text-main mb-2">Welcome to IndexMaster</h2>
              <p>Please click "Scan Folder" in the sidebar to start indexing your files.</p>
            </div>
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
      </div>
    </div>
  );
}
