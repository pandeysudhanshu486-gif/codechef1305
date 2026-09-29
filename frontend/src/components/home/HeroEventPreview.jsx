import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowRight, Sparkles } from 'lucide-react';

export default function HeroEventPreview({ event }) {
  if (!event) return null;

  const {
    _id,
    id,
    title,
    category = 'Technical',
    date,
    time,
    venue,
    image,
    registeredCount = 0,
    capacity = 100
  } = event;

  const eventId = _id || id;
  const isFull = registeredCount >= capacity;

  const formatDate = (d) => {
    try {
      const dateObj = new Date(d);
      if (isNaN(dateObj.getTime())) return d;
      return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return d;
    }
  };

  const getFallbackImage = (cat) => {
    const c = (cat || '').toLowerCase();
    if (c.includes('tech') || c.includes('code')) {
      return 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop';
    }
    if (c.includes('cultur') || c.includes('music')) {
      return 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop';
    }
    return 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop';
  };

  const bannerImage = image || getFallbackImage(category);

  return (
    <div className="relative rounded-2xl border border-white/10 bg-[#111827] overflow-hidden shadow-2xl group transition-all duration-300 hover:border-white/20">
      {/* Background Banner with Overlay */}
      <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-900">
        <img
          src={bannerImage}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = getFallbackImage(category);
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/40 to-transparent" />
        
        {/* Next Event Badge */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase bg-indigo-600/90 text-white shadow-md border border-indigo-400/30">
            <Sparkles size={11} /> Next Event
          </span>
          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase bg-slate-950/70 text-slate-300 border border-white/10 backdrop-blur-sm">
            {category}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 pt-2 space-y-3.5">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white leading-snug line-clamp-1 group-hover:text-indigo-300 transition-colors">
            {title}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-1">
            Central Campus Club Activity
          </p>
        </div>

        {/* Quick Details Chips */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 border-t border-white/5 pt-3">
          <div className="flex items-center gap-1.5 truncate">
            <Calendar size={13} className="text-indigo-400 shrink-0" />
            <span className="truncate">{formatDate(date)}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Clock size={13} className="text-slate-400 shrink-0" />
            <span className="truncate">{time || '10:00 AM'}</span>
          </div>
          <div className="col-span-2 flex items-center gap-1.5 truncate">
            <MapPin size={13} className="text-slate-400 shrink-0" />
            <span className="truncate">{venue || 'Campus Main Hall'}</span>
          </div>
        </div>

        {/* CTA Link */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-400">
            {isFull ? 'Capacity Reached' : `${capacity - registeredCount} Seats Open`}
          </span>
          <Link
            to={isFull ? `/events/${eventId}` : `/events/${eventId}/register`}
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300 group-hover:translate-x-0.5 transition-all"
          >
            <span>{isFull ? 'View Event' : 'Register →'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
