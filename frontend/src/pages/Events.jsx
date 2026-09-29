import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RotateCcw } from 'lucide-react';
import EventCard from '../components/events/EventCard';
import SearchFilterBar from '../components/events/SearchFilterBar';
import EmptyState from '../components/common/EmptyState';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { eventService } from '../services/eventService';
import { initialEvents } from '../services/sampleData';

export default function Events() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get('category') || 'All';

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [sortBy, setSortBy] = useState('date-asc');

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await eventService.getEvents();
        setEvents(data && data.length > 0 ? data : initialEvents);
      } catch {
        setEvents(initialEvents);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: cat });
    }
  };

  const categoryCounts = useMemo(() => {
    const counts = { total: events.length };
    events.forEach((ev) => {
      const cat = ev.category || 'Other';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [events]);

  const filteredEvents = useMemo(() => {
    let result = [...events];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (e) =>
          e.title?.toLowerCase().includes(query) ||
          e.description?.toLowerCase().includes(query) ||
          e.venue?.toLowerCase().includes(query) ||
          e.category?.toLowerCase().includes(query)
      );
    }

    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter(
        (e) => e.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'date-asc') {
        return new Date(a.date) - new Date(b.date);
      }
      if (sortBy === 'date-desc') {
        return new Date(b.date) - new Date(a.date);
      }
      if (sortBy === 'title-asc') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'title-desc') {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });

    return result;
  }, [events, searchQuery, selectedCategory, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    handleCategoryChange('All');
    setSortBy('date-asc');
  };

  return (
    <div className="page-body">
      <div className="page-container">
        {/* Page Header */}
        <div className="max-w-2xl mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
            Explore Campus Events
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1.5 font-normal">
            Discover opportunities, workshops, hackathons, and activities across campus.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="mb-8">
          <SearchFilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={handleCategoryChange}
            sortBy={sortBy}
            setSortBy={setSortBy}
            categoryCounts={categoryCounts}
          />
        </div>

        {/* Results Count & Reset Trigger */}
        <div className="flex items-center justify-between pb-3 mb-6 border-b border-white/10 text-xs text-slate-400">
          <span>
            Showing <strong className="text-white font-bold">{filteredEvents.length}</strong> {filteredEvents.length === 1 ? 'event' : 'events'}
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </span>
          {(searchQuery || selectedCategory !== 'All') && (
            <button
              onClick={resetFilters}
              className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold transition-colors"
            >
              <RotateCcw size={12} />
              <span>Reset filters</span>
            </button>
          )}
        </div>

        {/* Content Grid */}
        {loading ? (
          <LoadingSkeleton count={6} />
        ) : filteredEvents.length === 0 ? (
          <EmptyState
            title="No events found"
            description={
              searchQuery
                ? `No events matched your search for "${searchQuery}". Try searching with a different term.`
                : `There are currently no events listed under the "${selectedCategory}" category.`
            }
            onAction={resetFilters}
            actionLabel="View all events"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {filteredEvents.map((event) => (
              <EventCard key={event._id || event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
