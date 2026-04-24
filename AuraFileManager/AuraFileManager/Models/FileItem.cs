using System;

namespace AuraFileManager.Models
{
    public class FileItem
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Name { get; set; } = string.Empty;
        public string Path { get; set; } = string.Empty;
        public long Size { get; set; }
        public DateTime DateModified { get; set; }
        public string Category { get; set; } = string.Empty;
        public string Extension { get; set; } = string.Empty;
        public bool IsDuplicate { get; set; }

        public string FormattedSize => FormatSize(Size);

        private static string FormatSize(long bytes)
        {
            string[] sizes = { "B", "KB", "MB", "GB", "TB" };
            double len = bytes;
            int order = 0;
            while (len >= 1024 && order < sizes.Length - 1)
            {
                order++;
                len = len / 1024;
            }
            return $"{len:0.##} {sizes[order]}";
        }
    }
}
