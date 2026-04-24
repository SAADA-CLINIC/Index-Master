import React from 'react';
import { AnimatePresence } from 'motion/react';
import SplashScreen from './components/SplashScreen';
import Sidebar from './components/Sidebar';
import FileGrid from './components/FileGrid';
import { FileItem, FileCategory, ViewMode, SortField, SortOrder } from './types';
import { MOCK_FILES_DATA } from './constants';

export default function App() {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [activeCategory, setActiveCategory] = React.useState<FileCategory>('All');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [viewMode, setViewMode] = React.useState<ViewMode>('medium');
  const [sortField, setSortField] = React.useState<SortField>('name');
  const [sortOrder, setSortOrder] = React.useState<SortOrder>('asc');

  // Format initial mock data to our interface
  const initialFiles: FileItem[] = React.useMemo(() => {
    const files = MOCK_FILES_DATA.map((f, i) => {
      const ext = f.name.substring(f.name.lastIndexOf('.')).toLowerCase();
      let category: FileCategory = 'Word Files';
      if (ext === '.pdf' || ext === '.epub' || ext === '.azw3' || ext === '.mobi') category = 'PDF & E-books';
      else if (['.mp4', '.mkv', '.avi', '.mov', '.wmv'].includes(ext)) category = 'Videos';
      
      return {
        id: `file-${i}`,
        name: f.name,
        path: f.path,
        size: f.size,
        dateModified: new Date(f.date),
        category,
        extension: ext
      };
    });

    // Detect duplicates by name and size
    const fileMap = new Map<string, number>();
    files.forEach(f => {
      const uniqueKey = `${f.name}-${f.size}`;
      fileMap.set(uniqueKey, (fileMap.get(uniqueKey) || 0) + 1);
    });
    return files.map(f => ({
      ...f,
      isDuplicate: fileMap.get(`${f.name}-${f.size}`)! > 1
    }));
  }, []);

  // Filtering and Sorting logic
  const filteredAndSortedFiles = React.useMemo(() => {
    let result = [...initialFiles];

    // Filter by Category
    if (activeCategory !== 'All') {
      result = result.filter(f => f.category === activeCategory);
    }

    // Filter by Search Query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(f => 
        f.name.toLowerCase().includes(query) || 
        f.path.toLowerCase().includes(query) ||
        f.category.toLowerCase().includes(query)
      );
    }

    // Sort
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
  }, [initialFiles, activeCategory, searchQuery, sortField, sortOrder]);

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
        />
        
        <div className="ml-64 flex-1">
          <FileGrid 
            files={filteredAndSortedFiles}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            sortField={sortField}
            onSortFieldChange={setSortField}
            sortOrder={sortOrder}
            onToggleSortOrder={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
          />
        </div>
      </div>
    </div>
  );
}
