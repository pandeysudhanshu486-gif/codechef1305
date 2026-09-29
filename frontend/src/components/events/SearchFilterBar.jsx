import React from 'react';
import { Search, X, ArrowUpDown } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Technical',
  'Cultural',
  'Sports',
  'Workshop',
  'Competition'
];

export default function SearchFilterBar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  categoryCounts = {}
}) {
  return (
    <div className="space-y-4">
      {/* Search Input & Sort Dropdown */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Field */}
        <div className="relative flex-grow">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search events by name, venue or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#131929] border border-white/10 hover:border-white/20 focus:border-indigo-500 rounded-xl pl-10 pr-9 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Sort Selector */}
        <div className="relative min-w-[200px]">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <ArrowUpDown size={14} />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-[#131929] border border-white/10 hover:border-white/20 focus:border-indigo-500 rounded-xl pl-9 pr-8 py-2.5 text-xs sm:text-sm font-medium text-slate-200 focus:outline-none appearance-none cursor-pointer transition-all"
          >
            <option value="date-asc">Date: Upcoming First</option>
            <option value="date-desc">Date: Furthest First</option>
            <option value="title-asc">Title: A to Z</option>
            <option value="title-desc">Title: Z to A</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs">
            ▼
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-semibold text-slate-400 mr-1 shrink-0">
          Category:
        </span>
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
          const count = cat === 'All' ? categoryCounts.total : categoryCounts[cat];

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-sm font-bold'
                  : 'bg-[#131929] text-slate-300 hover:text-white hover:bg-white/5 border border-white/10'
              }`}
            >
              <span>{cat}</span>
              {count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                    isSelected
                      ? 'bg-indigo-700 text-indigo-100'
                      : 'bg-white/10 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
