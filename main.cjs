const { app, BrowserWindow, nativeImage } = require('electron');
const path = require('path');

// تعيين اسم التطبيق
app.setName('IndexMaster');

// أيقونة التطبيق – تدعم Windows و macOS و Linux
const iconPath = path.join(__dirname, 'icon.ico');
const appIcon = nativeImage.createFromPath(iconPath);

// في ويندوز، ربط التطبيق بأيقونة شريط المهام
if (process.platform === 'win32') {
  app.setAppUserModelId('com.indexmaster.app');
}

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: 'IndexMaster',
    icon: appIcon,            // الأيقونة تظهر في شريط العنوان وشريط المهام
    backgroundColor: '#08080a',
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: false,
    },
  });

  // تحميل الواجهة
  const isDev = process.env.NODE_ENV === 'development' || process.argv.includes('--dev');

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    // mainWindow.webContents.openDevTools();
  } else {
    const indexPath = path.join(__dirname, 'dist', 'index.html');
    mainWindow.loadFile(indexPath);
  }

  // إظهار النافذة بعد الجاهزية
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// تشغيل التطبيق
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// قفل نسخة واحدة
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}
