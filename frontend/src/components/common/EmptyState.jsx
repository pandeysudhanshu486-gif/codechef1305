import React from 'react';
import { SearchX, CalendarX, RotateCcw } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
  title = 'No events found',
  description = 'We couldn\'t find any events matching your current search or filter criteria.',
  icon: Icon = SearchX,
  actionLabel = 'Reset Filters',
  onAction
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 my-8 rounded-3xl bg-[#101728]/60 border border-white/10 max-w-lg mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-5">
        <Icon size={32} />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm mb-6 leading-relaxed max-w-sm">
        {description}
      </p>
      {onAction && (
        <Button variant="secondary" size="sm" icon={RotateCcw} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
