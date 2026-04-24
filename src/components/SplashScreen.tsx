import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FolderOpen } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg-deep text-white">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <div className="relative mb-8">
          <div className="absolute inset-0 animate-pulse rounded-full bg-blue-500/10 blur-3xl" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-[0_0_30px_rgba(37,99,235,0.3)]">
            <FolderOpen size={48} strokeWidth={1.5} />
          </div>
        </div>

        <h1 className="mb-2 text-4xl font-bold tracking-tight">INDEXMASTER</h1>
        <p className="mb-12 text-sm font-medium tracking-[0.2em] text-blue-400 opacity-80 uppercase">
          Neural Indexing Core
        </p>

        <div className="w-64">
          <div className="mb-2 flex justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            <span>Synchronizing Files</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-900 border border-border">
            <motion.div
              className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
        </div>
      </motion.div>

      <div className="absolute bottom-12 text-[10px] font-medium tracking-widest text-zinc-600 uppercase">
        Local Environment • Build 24.04
      </div>
    </div>
  );
}
