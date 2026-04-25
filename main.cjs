const { app, BrowserWindow, nativeImage } = require('electron');
const path = require('path');

// تعيين اسم التطبيق على جميع المنصات
app.setName('IndexMaster');

// 📦 إعدادات النافذة القابلة للثبات (اختياري: حفظ حجم ومكان النافذة بين الجلسات)
let mainWindow = null;

function createWindow() {
  // 📌 أيقونة التطبيق – تدعم Windows و macOS و Linux من نفس الملف المصدر
  const iconPath = path.join(__dirname, 'icon.ico');
  const appIcon = nativeImage.createFromPath(iconPath);

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,          // أصغر حجم مقبول – يحسن تجربة المستخدم
    minHeight: 600,
    title: 'IndexMaster',
    icon: appIcon,          // أيقونة تظهر في شريط المهام وهيدر النافذة
    backgroundColor: '#08080a', // لون خلفية بلون السمة الغامقة يمنع الوميض الأبيض
    show: false,            // إخفاء النافذة حتى اكتمال التحميل
    autoHideMenuBar: true,  // شريط قوائم مخفي – مظهر حديث
    webPreferences: {
      nodeIntegration: true,      // مطلوب لاستخدام require داخل React
      contextIsolation: false,    // تعطيل العزل للسماح بـ window.require
      enableRemoteModule: false,  // تعطيل remote إن لم تحتج إليه (أفضل أمانًا)
    },
  });

  // 🧠 تحميل الواجهة تلقائيًا سواء في بيئة التطوير أو الإنتاج
  const isDev = process.env.NODE_ENV === 'development' || process.argv.includes('--dev');

  if (isDev) {
    // أثناء التطوير: الاتصال بخادم Vite
    mainWindow.loadURL('http://localhost:5173');
    // فتح أدوات المطور اختياريًا (أزل التعليق إن أردت)
    // mainWindow.webContents.openDevTools();
  } else {
    // بعد البناء: تحميل ملف index.html من مجلد dist
    const indexPath = path.join(__dirname, 'dist', 'index.html');
    mainWindow.loadFile(indexPath);
  }

  // 🎬 إظهار النافذة عندما تصبح الواجهة جاهزة – يمنع وميض التحميل
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // 🧹 تنظيف عند إغلاق النافذة
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 🚀 تشغيل التطبيق
app.whenReady().then(() => {
  createWindow();

  // خاصية macOS: إعادة إنشاء النافذة عند النقر على أيقونة التطبيق
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 🛑 الخروج من التطبيق عند إغلاق جميع النوافذ (باستثناء macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// ⚡ تأمين إضافي: منع تشغيل أكثر من نسخة واحدة من التطبيق
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    // إذا حاول المستخدم فتح نسخة ثانية، نعيد تركيز النافذة الموجودة
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}
