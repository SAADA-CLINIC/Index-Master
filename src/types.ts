export type FileCategory = 'Word Files' | 'PDF & E-books' | 'Videos' | 'All';

export interface FileItem {
  id: string;
  name: string;
  path: string;
  size: number; // in bytes
  dateModified: Date;
  category: FileCategory;
  extension: string;
  isDuplicate?: boolean;
}

export type ViewMode = 'small' | 'medium' | 'large' | 'list';
export type SortField = 'name' | 'size' | 'dateModified';
export type SortOrder = 'asc' | 'desc';
