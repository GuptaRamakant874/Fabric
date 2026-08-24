import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({ message = 'No items found', description = 'Check back later or try adjusting your filters.' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
      <Inbox className="h-12 w-12 text-sky-400 mb-4" />
      <h3 className="text-lg font-bold text-white">{message}</h3>
      <p className="mt-2 text-sm text-slate-300 max-w-sm leading-relaxed">{description}</p>
    </div>
  );
};

export default EmptyState;
