import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { FolderOpen } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

// رسائل تحميل عشوائية لإضفاء الحيوية
const loadingMessages = [
  "Synchronizing Files",
  "Indexing Metadata",
  "Calibrating Core",
  "Loading Database",
  "Connecting to Engine",
];

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const onCompleteRef = useRef(onComplete);

  // تحديث المرجع عند تغير onComplete دون إعادة تشغيل التأثير
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // إدارة شريط التقدم والرسائل النصية
  useEffect(() => {
    // مدة التحميل الكلية (بالمللي ثانية)
    const totalDuration = 2000;
    // الفاصل الزمني بين التحديثات (مثلاً 20ms يعطينا 100 تحديث)
    const stepTime = 20;
    const steps = totalDuration / stepTime;
    const increment = 100 / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      setProgress((prev) => {
        const next = Math.min(prev + increment, 100);
        return next;
      });

      // تغيير الرسالة كل 20% من التقدم
      if (currentStep % Math.floor(steps / loadingMessages.length) === 0) {
        setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }

      if (currentStep >= steps) {
        clearInterval(interval);
        // إكمال الحركة والتأخير قبل استدعاء onComplete
        setTimeout(() => {
          onCompleteRef.current();
        }, 400);
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, []); // تنفيذ مرة واحدة فقط عند التركيب

  // قيمة مئوية صحيحة للعرض
  const displayProgress = Math.round(progress);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg-deep text-white"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        {/* أيقونة محاطة بهالة نابضة */}
        <div className="relative mb-8">
          <div className="absolute inset-0 animate-pulse rounded-full bg-blue-500/10 blur-3xl" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-[0_0_30px_rgba(37,99,235,0.3)]">
            <FolderOpen size={48} strokeWidth={1.5} />
          </div>
        </div>

        {/* عنوان التطبيق */}
        <h1 className="mb-2 text-4xl font-bold tracking-tight">INDEXMASTER</h1>
        
        {/* شعار ديناميكي يدل على العملية الجارية */}
        <p className="mb-12 text-sm font-medium tracking-[0.2em] text-blue-400 opacity-80 uppercase">
          Neural Indexing Core
        </p>

        {/* شريط التقدم والرسالة */}
        <div className="w-64">
          <div className="mb-2 flex justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            <span>{loadingMessages[messageIndex]}</span>
            <span>{displayProgress}%</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-900 border border-border-subtle">
            <motion.div
              className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear", duration: 0.02 }}
            />
          </div>
        </div>
      </motion.div>

      {/* تذييل الشاشة */}
      <div className="absolute bottom-12 text-[10px] font-medium tracking-widest text-zinc-600 uppercase">
        Local Environment • Build 24.04
      </div>
    </motion.div>
  );
}
