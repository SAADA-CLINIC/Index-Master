const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "IndexMaster",
    autoHideMenuBar: true, // لإعطاء شكل احترافي بدون شريط القوائم التقليدي
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // في نسخة الـ EXE، البرنامج يقرأ ملفات الـ dist التي ينتجها Vite
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  win.loadFile(indexPath).catch(() => {
    // في حالة التطوير فقط، يقرأ من السيرفر المحلي
    win.loadURL('http://localhost:3000');
  });
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