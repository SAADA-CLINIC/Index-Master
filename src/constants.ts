import { FileCategory } from './types';

/**
 * 📁 ملحقات الملفات المدعومة حسب الفئة
 * يُستخدم هذا السجل لتحديد الفئة المناسبة لأي ملف بناءً على امتداده
 */
export const FILE_EXTENSIONS: Record<Exclude<FileCategory, 'All' | 'Images'>, string[]> & { Images: string[] } = {
  'Word Files': [
    '.doc', '.docx', '.rtf', '.odt', '.txt', '.md', 
    '.xls', '.xlsx', '.ppt', '.pptx', '.csv'
  ],
  'PDF & E-books': [
    '.pdf', '.epub', '.azw3', '.mobi', '.djvu', '.cbr', '.cbz'
  ],
  Videos: [
    '.mp4', '.mkv', '.avi', '.mov', '.wmv', '.webm', '.m4v', '.flv'
  ],
  Images: [
    '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.ico',
    '.tiff', '.tif', '.raw', '.heic', '.heif', '.avif'
  ],
};

/**
 * 🧪 بيانات وهمية لتطوير واختبار واجهة المستخدم
 * تُستخدم فقط عند عدم وجود ملفات حقيقية ممسوحة ضوئيًا
 */
export const MOCK_FILES_DATA: Array<{
  name: string;
  size: number;
  date: string;
  path: string;
}> = [
  // Word Files
  { 
    name: 'Annual_Report.docx', 
    size: 1024 * 542, 
    date: '2024-03-15T10:00:00Z', 
    path: 'C:\\Documents\\Work\\Annual_Report.docx' 
  },
  { 
    name: 'Client_Meeting_Notes.rtf', 
    size: 1024 * 12, 
    date: '2024-02-28T09:15:00Z', 
    path: 'C:\\Meetings\\2024\\Client_Meeting_Notes.rtf' 
  },
  { 
    name: 'Presentation_Draft.pptx', 
    size: 1024 * 850, 
    date: '2024-04-10T14:20:00Z', 
    path: 'D:\\Backups\\Presentation_Draft.pptx' 
  },
  { 
    name: 'Budget_2024.xlsx', 
    size: 1024 * 48, 
    date: '2024-04-05T11:00:00Z', 
    path: 'C:\\Finance\\Budget_2024.xlsx' 
  },
  
  // PDF & E-books
  { 
    name: 'Architecture_Plan.pdf', 
    size: 1024 * 1024 * 4.2, 
    date: '2024-04-01T15:30:00Z', 
    path: 'C:\\Documents\\Project\\Architecture_Plan.pdf' 
  },
  { 
    name: 'User_Guide.pdf', 
    size: 1024 * 1024 * 1.5, 
    date: '2024-01-20T16:45:00Z', 
    path: 'C:\\Users\\Public\\User_Guide.pdf' 
  },
  { 
    name: 'System_Manual.azw3', 
    size: 1024 * 890, 
    date: '2024-03-05T12:00:00Z', 
    path: 'C:\\E-books\\Tech\\System_Manual.azw3' 
  },
  { 
    name: 'Novel.epub', 
    size: 1024 * 612, 
    date: '2024-04-12T17:00:00Z', 
    path: 'D:\\Library\\Novel.epub' 
  },
  
  // Videos
  { 
    name: 'Product_Demo.mp4', 
    size: 1024 * 1024 * 245, 
    date: '2024-04-20T11:00:00Z', 
    path: 'E:\\Media\\Videos\\Product_Demo.mp4' 
  },
  { 
    name: 'Vacation_Vlog.mkv', 
    size: 1024 * 1024 * 1200, 
    date: '2023-12-25T20:10:00Z', 
    path: 'E:\\Media\\Videos\\Vacation\\Vacation_Vlog.mkv' 
  },
  { 
    name: 'Project_Tutorial.wmv', 
    size: 1024 * 1024 * 85, 
    date: '2024-04-15T08:30:00Z', 
    path: 'E:\\Work\\Tutorials\\Project_Tutorial.wmv' 
  },
  { 
    name: 'Recording.webm', 
    size: 1024 * 1024 * 47, 
    date: '2024-03-10T13:15:00Z', 
    path: 'C:\\Recordings\\Session.webm' 
  },
  
  // Images
  { 
    name: 'Logo_Design.png', 
    size: 1024 * 250, 
    date: '2024-04-22T09:00:00Z', 
    path: 'D:\\Design\\Assets\\Logo_Design.png' 
  },
  { 
    name: 'Family_Photo.jpg', 
    size: 1024 * 1024 * 3.5, 
    date: '2024-01-15T18:20:00Z', 
    path: 'E:\\Media\\Pictures\\Family_Photo.jpg' 
  },
  { 
    name: 'Screenshot_UI.bmp', 
    size: 1024 * 1024 * 2.1, 
    date: '2024-04-21T14:00:00Z', 
    path: 'C:\\Screenshots\\UI.bmp' 
  },
  { 
    name: 'Favicon.ico', 
    size: 1024 * 15, 
    date: '2024-02-10T08:00:00Z', 
    path: 'D:\\Web\\Assets\\Favicon.ico' 
  },
  
  // نسخة مكررة للاختبار
  { 
    name: 'Architecture_Plan.pdf', 
    size: 1024 * 1024 * 4.2, 
    date: '2024-04-01T15:30:00Z', 
    path: 'D:\\Archive\\Project_X\\Architecture_Plan.pdf' 
  },
];
