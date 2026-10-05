import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorToastProps {
  message: string | null;
}

export const ErrorToast: React.FC<ErrorToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed top-14 sm:top-16 left-1/2 -translate-x-1/2 z-50 pointer-events-none w-max max-w-[92vw] sm:max-w-md animate-in fade-in slide-in-from-top-3 duration-200">
      <div className="py-2 px-4 bg-slate-900/95 text-white border border-rose-500/40 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 shadow-2xl backdrop-blur-md">
        <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 animate-pulse" />
        <span className="tracking-tight">{message}</span>
      </div>
    </div>
  );
};
