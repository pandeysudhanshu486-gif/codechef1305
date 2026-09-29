import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import Badge from '../common/Badge';

export default function FeaturedEvent({ event }) {
  if (!event) return null;

  const {
    _id,
    id,
    title,
    description,
    category = 'Technical',
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
        weekday: 'short',
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
    if (c.includes('work')) {
      return 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop';
    }
    if (c.includes('sport')) {
      return 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop';
    }
    return 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=800&auto=format&fit=crop';
  };

  const bannerImage = image || getFallbackImage(category);

  return (
    <div className="card-clean p-6 sm:p-8 bg-[#111827] border border-white/10 rounded-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        {/* LEFT COLUMN: Event Details (~55%) */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-4">
          {/* Category & Status */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge category={category} />
            <Badge variant={isFull ? 'closed' : 'open'}>
              {isFull ? 'Registration Closed' : 'Registration Open'}
            </Badge>
          </div>

          {/* Event Title */}
          <h3
            className="font-extrabold text-white leading-snug"
            style={{
              fontSize: 'clamp(1.5rem, 2.25vw, 2.25rem)',
              lineHeight: 1.3,
              letterSpacing: '0.01em',
              wordSpacing: '0.04em'
            }}
          >
            {title}
          </h3>

          {/* Short Description */}
          <p
            className="text-slate-300 text-xs sm:text-sm line-clamp-3 font-normal"
            style={{ lineHeight: 1.65, wordSpacing: '0.03em' }}
          >
            {description}
          </p>

          {/* Metadata Chips: Date, Time, Venue */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-4 sm:gap-6 pt-1 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Calendar size={15} className="text-indigo-400 shrink-0" />
              <span className="font-medium text-slate-200">{formatDate(date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={15} className="text-slate-400 shrink-0" />
              <span className="font-medium text-slate-200">{time || '10:00 AM - 01:00 PM'}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={15} className="text-slate-400 shrink-0" />
              <span className="font-medium text-slate-200">{venue || 'Campus Main Hall'}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {!isFull ? (
              <Link
                to={`/events/${eventId}/register`}
                className="btn btn-primary"
              >
                <span>Register Now</span>
                <ArrowRight size={15} />
              </Link>
            ) : (
              <span className="btn btn-primary disabled opacity-50 cursor-not-allowed">
                Registration Closed
              </span>
            )}
            <Link
              to={`/events/${eventId}`}
              className="btn btn-secondary"
            >
              <span>View Event</span>
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: Event Image (~45%) — desktop height ~340px */}
        <div className="lg:col-span-5">
          <div className="rounded-xl overflow-hidden border border-white/10 bg-slate-900 shadow-md h-[240px] sm:h-[280px] lg:h-[340px]">
            <img
              src={bannerImage}
              alt={title}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = getFallbackImage(category);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
