import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin } from 'lucide-react';
import Badge from '../common/Badge';

export default function EventCard({ event }) {
  if (!event) return null;

  const {
    _id,
    id,
    title,
    description,
    category,
    date,
    time,
    venue,
    image,
    capacity = 100,
    registeredCount = 0
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
    if (c.includes('cultur') || c.includes('music') || c.includes('art')) {
      return 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop';
    }
    if (c.includes('compet') || c.includes('hack')) {
      return 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop';
    }
    if (c.includes('work') || c.includes('bootcamp')) {
      return 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop';
    }
    if (c.includes('sport') || c.includes('game')) {
      return 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop';
    }
    return 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=800&auto=format&fit=crop';
  };

  const imageUrl = image || getFallbackImage(category);

  return (
    <div className="card-clean flex flex-col h-full overflow-hidden group">
      {/* 1. EVENT IMAGE (16:9 Aspect Ratio) */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900 shrink-0">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = getFallbackImage(category);
          }}
        />
        {/* Category Badge Overlay Top-Left */}
        <div className="absolute top-3 left-3 z-10">
          <Badge category={category} />
        </div>
      </div>

      {/* 2. CARD CONTENT (Flex Column Layout) */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-2.5">
          {/* Title */}
          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#38BDF8] transition-colors line-clamp-1 leading-snug">
            <Link to={`/events/${eventId}`} className="hover:underline">
              {title}
            </Link>
          </h3>

          {/* Description line clamped */}
          <p className="text-slate-300 text-xs sm:text-sm line-clamp-2 leading-relaxed font-normal">
            {description}
          </p>

          {/* Metadata */}
          <div className="space-y-1.5 text-xs text-slate-300 border-t border-white/5 pt-3">
            <div className="flex items-center gap-2">
              <Calendar size={13} className="text-indigo-400 shrink-0" />
              <span>{formatDate(date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={13} className="text-slate-400 shrink-0" />
              <span className="truncate">{time || '10:00 AM - 01:00 PM'}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={13} className="text-slate-400 shrink-0" />
              <span className="truncate">{venue || 'Campus Main Hall'}</span>
            </div>
          </div>
        </div>

        {/* 3. ACTIONS & STATUS (Pinned via mt-auto) */}
        <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2 mt-auto">
          <Badge variant={isFull ? 'closed' : 'open'} size="sm">
            {isFull ? 'Registration Closed' : 'Registration Open'}
          </Badge>

          <div className="flex items-center gap-2">
            <Link
              to={`/events/${eventId}`}
              className="text-xs font-semibold text-slate-300 hover:text-white transition-colors px-1"
            >
              Details
            </Link>
            {!isFull && (
              <Link
                to={`/events/${eventId}/register`}
                className="btn btn-primary btn-sm text-xs py-1 px-3"
              >
                Register
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
