import React from 'react';

export default function LoadingSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl bg-[#131c31] border border-white/5 overflow-hidden flex flex-col h-[400px]"
        >
          <div className="skeleton h-48 w-full" />
          <div className="p-5 flex flex-col justify-between flex-grow space-y-4">
            <div className="space-y-3">
              <div className="skeleton h-5 w-3/4 rounded" />
              <div className="skeleton h-4 w-full rounded" />
              <div className="skeleton h-4 w-5/6 rounded" />
            </div>
            <div className="space-y-2 pt-3 border-t border-white/5">
              <div className="skeleton h-3.5 w-1/2 rounded" />
              <div className="skeleton h-3.5 w-2/3 rounded" />
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <div className="skeleton h-4 w-16 rounded" />
              <div className="skeleton h-8 w-24 rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
