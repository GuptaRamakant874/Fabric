import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({ message = 'No items found', description = 'Check back later or try adjusting your filters.' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-lg border border-dashed border-industrial-border bg-industrial-gray/50">
      <Inbox className="h-12 w-12 text-industrial-muted mb-4" />
      <h3 className="text-lg font-semibold text-industrial-light">{message}</h3>
      <p className="mt-2 text-sm text-industrial-muted max-w-sm">{description}</p>
    </div>
  );
};

export default EmptyState;
