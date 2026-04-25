const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "IndexMaster",
    autoHideMenuBar: true, // لإخفاء شريط القوائم العلوي وإعطاء شكل حديث
    icon: path.join(__dirname, 'icon.ico'), // <-- هذا هو السطر المسؤول عن إظهار الأيقونة في هيدر البرنامج وشريط المهام
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // توجيه البرنامج مباشرة لقراءة الواجهة النهائية بعد الـ Build
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  mainWindow.loadFile(indexPath);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
