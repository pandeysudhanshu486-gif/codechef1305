import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Share2, 
  FileText, 
  ChevronRight,
  Send,
  CheckCircle2,
  AlertCircle,
  Users
} from 'lucide-react';
import Badge from '../components/common/Badge';
import { eventService } from '../services/eventService';

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const found = await eventService.getEventById(id);
        setEvent(found);
      } catch {
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const formatDate = (d) => {
    try {
      const dateObj = new Date(d);
      if (isNaN(dateObj.getTime())) return d;
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return d;
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getFallbackImage = (cat) => {
    const c = (cat || '').toLowerCase();
    if (c.includes('tech') || c.includes('code')) {
      return 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop';
    }
    if (c.includes('cultur') || c.includes('music')) {
      return 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop';
    }
    if (c.includes('compet') || c.includes('hack')) {
      return 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop';
    }
    if (c.includes('work')) {
      return 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop';
    }
    if (c.includes('sport')) {
      return 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop';
    }
    return 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1200&auto=format&fit=crop';
  };

  if (loading) {
    return (
      <div className="page-body">
        <div className="page-container max-w-4xl">
          <div className="skeleton h-6 w-48 mb-4" />
          <div className="skeleton h-72 w-full rounded-2xl mb-6" />
          <div className="skeleton h-10 w-2/3 mb-3" />
          <div className="skeleton h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="page-body">
        <div className="page-container text-center max-w-md mx-auto">
          <div className="card-clean p-8 rounded-2xl">
            <AlertCircle size={36} className="text-rose-400 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-white mb-2">Event Not Found</h2>
            <p className="text-slate-400 text-xs sm:text-sm mb-5">
              The event you are looking for does not exist or may have been removed.
            </p>
            <Link to="/events" className="btn btn-primary btn-sm">
              Back to All Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const {
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

  const isFull = registeredCount >= capacity;
  const seatsLeft = Math.max(0, capacity - registeredCount);
  const eventImageUrl = image || getFallbackImage(category);

  return (
    <div className="page-body">
      <div className="page-container max-w-4xl">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={13} className="text-slate-600" />
            <Link to="/events" className="hover:text-white transition-colors">Events</Link>
            <ChevronRight size={13} className="text-slate-600" />
            <span className="text-slate-300 truncate max-w-[200px] font-medium">{title}</span>
          </div>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all shrink-0 cursor-pointer"
          >
            <Share2 size={13} className={copied ? 'text-emerald-400' : 'text-slate-400'} />
            <span>{copied ? 'Link Copied' : 'Share'}</span>
          </button>
        </div>

        {/* Cover Image Banner */}
        <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-[21/9] min-h-[220px] bg-slate-900 mb-8 shadow-xl">
          <img
            src={eventImageUrl}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = getFallbackImage(category);
            }}
          />
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <Badge category={category} />
            <Badge variant={isFull ? 'closed' : 'open'}>
              {isFull ? 'Registration Closed' : 'Registration Open'}
            </Badge>
          </div>
        </div>

        {/* 2-Column Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Event Overview (Span 8) */}
          <div className="lg:col-span-8 space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-3">
                {title}
              </h1>

              {/* Metadata Chips */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3.5 rounded-xl bg-[#131929] border border-white/10 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Calendar size={15} className="text-indigo-400 shrink-0" />
                  <span className="truncate">{formatDate(date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={15} className="text-slate-400 shrink-0" />
                  <span className="truncate">{time || '10:00 AM - 01:00 PM'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={15} className="text-slate-400 shrink-0" />
                  <span className="truncate">{venue || 'Campus Main Hall'}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="card-clean p-6 bg-[#10172a] rounded-xl space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FileText size={16} className="text-indigo-400" />
                Event Description
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line font-normal">
                {description}
              </p>
            </div>

            {/* Key Guidelines */}
            <div className="card-clean p-6 bg-[#10172a] rounded-xl space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                Important Guidelines
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">•</span>
                  <span>Please bring your College Student ID card for venue check-in.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">•</span>
                  <span>Digital ticket pass with your unique pass number is required for entry.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">•</span>
                  <span>Participation certificates will be distributed to verified attendees.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Sticky Card (Span 4) */}
          <div className="lg:col-span-4">
            <div className="card-clean p-6 bg-[#131929] border-white/15 rounded-xl space-y-5 lg:sticky" style={{ top: '88px' }}>
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-semibold text-slate-400">Status</span>
                <Badge variant={isFull ? 'closed' : 'open'}>
                  {isFull ? 'Closed' : 'Open'}
                </Badge>
              </div>

              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex justify-between items-center">
                  <span>Registered Students:</span>
                  <span className="text-white font-bold">{registeredCount} / {capacity}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, (registeredCount / capacity) * 100)}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 pt-0.5">
                  {seatsLeft > 0 ? `${seatsLeft} seats remaining` : 'Capacity reached'}
                </p>
              </div>

              {/* Action CTA */}
              <div>
                <Link
                  to={`/events/${id}/register`}
                  className={`btn btn-primary w-full py-3 ${
                    isFull ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  <Send size={15} />
                  <span>{isFull ? 'Event Full' : 'Register for Event'}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
