using System;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Input;
using AuraFileManager.Models;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace AuraFileManager.ViewModels
{
    public partial class MainViewModel : ObservableObject
    {
        [ObservableProperty]
        private string searchQuery = string.Empty;

        [ObservableProperty]
        private string activeCategory = "All";

        [ObservableProperty]
        private ObservableCollection<FileItem> filteredFiles = new();

        private List<FileItem> _allFiles = new();

        public MainViewModel()
        {
            _ = InitializeAsync();
        }

        private async Task InitializeAsync()
        {
            // Simulate Disk Scan in Background
            await Task.Run(() =>
            {
                // In a real app, you would use Directory.GetFiles
                // For this example, we populate the same mock data as the web prototype
                SeedMockData();
            });

            ApplyFilters();
        }

        [RelayCommand]
        private void ChangeCategory(string category)
        {
            ActiveCategory = category;
            ApplyFilters();
        }

        [RelayCommand]
        private void SortBySize(bool descending)
        {
            var sorted = descending 
                ? FilteredFiles.OrderByDescending(f => f.Size).ToList()
                : FilteredFiles.OrderBy(f => f.Size).ToList();
            
            FilteredFiles = new ObservableCollection<FileItem>(sorted);
        }

        partial void OnSearchQueryChanged(string value) => ApplyFilters();

        private void ApplyFilters()
        {
            var query = SearchQuery.ToLower();
            var result = _allFiles.AsEnumerable();

            if (ActiveCategory != "All")
                result = result.Where(f => f.Category == ActiveCategory);

            if (!string.IsNullOrWhiteSpace(query))
                result = result.Where(f => f.Name.ToLower().Contains(query) || f.Path.ToLower().Contains(query));

            FilteredFiles = new ObservableCollection<FileItem>(result);
        }

        private void SeedMockData()
        {
            // Mocking logic similar to types.ts
            _allFiles = new List<FileItem> {
                new FileItem { Name = "Annual Report.docx", Size = 555000, DateModified = DateTime.Now, Category = "Word Files", Path = "C:\\Docs\\Report.docx" },
                // ... add other files here
            };
        }
    }
}
