import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // تحميل جميع متغيرات البيئة من المجلد الجذر
  const env = loadEnv(mode, '.', '');

  // التحقق من وجود مفتاح Gemini API وتنبيه المطور
  if (!env.GEMINI_API_KEY) {
    console.warn(
      '⚠️  GEMINI_API_KEY غير موجود في متغيرات البيئة. بعض الميزات قد لا تعمل.'
    );
  }

  return {
    plugins: [react(), tailwindcss()],

    // المسار النسبي ليعمل التطبيق بعد البناء بشكل صحيح على أي مسار
    base: './',

    // تعريف ثوابت عالمية للتطبيق (قابلة للاستخدام في `process.env.GEMINI_API_KEY`)
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
    },

    // اختصارات المسارات باستخدام `@` للإشارة إلى مجلد `src`
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'), // يُفضل الإشارة إلى `src` بدلاً من الجذر
      },
    },

    server: {
      // تفعيل HMR بشكل ذكي: يُعطَّل فقط عند ضبط DISABLE_HMR=true (مفيد في بيئات التحرير المباشر)
      hmr: process.env.DISABLE_HMR === 'true' ? false : undefined,
    },

    // تحسينات إضافية للبناء (اختياري)
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development', // خرائط المصدر في وضع التطوير فقط
    },
  };
});
