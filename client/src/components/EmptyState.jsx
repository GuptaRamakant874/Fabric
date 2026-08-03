import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({ message = 'No items found', description = 'Check back later or try adjusting your filters.' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl border border-slate-200 bg-white shadow-sm">
      <Inbox className="h-12 w-12 text-sky-500 mb-4" />
      <h3 className="text-lg font-semibold text-slate-950">{message}</h3>
      <p className="mt-2 text-sm text-slate-500 max-w-sm">{description}</p>
    </div>
  );
};

export default EmptyState;
