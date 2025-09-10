
import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brand-500"></div>
      <h2 className="text-xl font-semibold mt-4 text-slate-700 dark:text-slate-300">Generating Your Masterpiece...</h2>
      <p className="text-slate-500 dark:text-slate-400 mt-2">The AI is working its magic. This can take a moment.</p>
    </div>
  );
};
