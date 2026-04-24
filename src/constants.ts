import { FileCategory } from './types';

export const FILE_EXTENSIONS: Record<Exclude<FileCategory, 'All'>, string[]> = {
  'Word Files': ['.doc', '.docx', '.rtf'],
  'PDF & E-books': ['.pdf', '.epub', '.azw3', '.mobi'],
  Videos: ['.mp4', '.mkv', '.avi', '.mov', '.wmv'],
};

export const MOCK_FILES_DATA = [
  { name: 'Annual Report.docx', size: 1024 * 542, date: '2024-03-15T10:00:00Z', path: 'C:\\Documents\\Work\\Annual Report.docx' },
  { name: 'Architecture_Plan.pdf', size: 1024 * 1024 * 4.2, date: '2024-04-01T15:30:00Z', path: 'C:\\Documents\\Project\\Architecture_Plan.pdf' },
  { name: 'Client_Meeting_Notes.rtf', size: 1024 * 12, date: '2024-02-28T09:15:00Z', path: 'C:\\Meetings\\2024\\Client_Meeting_Notes.rtf' },
  { name: 'Presentation_Draft.docx', size: 1024 * 850, date: '2024-04-10T14:20:00Z', path: 'D:\\Backups\\Presentation_Draft.docx' },
  { name: 'Product_Demo.mp4', size: 1024 * 1024 * 245, date: '2024-04-20T11:00:00Z', path: 'E:\\Media\\Videos\\Product_Demo.mp4' },
  { name: 'User_Guide.pdf', size: 1024 * 1024 * 1.5, date: '2024-01-20T16:45:00Z', path: 'C:\\Users\\Public\\User_Guide.pdf' },
  { name: 'Architecture_Plan.pdf', size: 1024 * 1024 * 4.2, date: '2024-04-01T15:30:00Z', path: 'D:\\Archive\\Project_X\\Architecture_Plan.pdf' }, // Duplicate name, different path
  { name: 'Vacation_Vlog.mkv', size: 1024 * 1024 * 1200, date: '2023-12-25T20:10:00Z', path: 'E:\\Media\\Videos\\Vacation\\Vacation_Vlog.mkv' },
  { name: 'System_Manual.azw3', size: 1024 * 890, date: '2024-03-05T12:00:00Z', path: 'C:\\E-books\\Tech\\System_Manual.azw3' },
  { name: 'Project_Tutorial.wmv', size: 1024 * 1024 * 85, date: '2024-04-15T08:30:00Z', path: 'E:\\Work\\Tutorials\\Project_Tutorial.wmv' },
];
