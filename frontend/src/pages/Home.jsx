import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Hero from '../components/home/Hero';
import Stats from '../components/home/Stats';
import FeaturedEvent from '../components/events/FeaturedEvent';
import EventCard from '../components/events/EventCard';
import WhyClubSphere from '../components/home/WhyClubSphere';
import CategoryGrid from '../components/home/CategoryGrid';
import CTA from '../components/home/CTA';
import { eventService } from '../services/eventService';
import { registrationService } from '../services/registrationService';
import { initialEvents } from '../services/sampleData';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [featuredEvent, setFeaturedEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [eventsData, regsData] = await Promise.all([
          eventService.getEvents(),
          registrationService.getAllRegistrations()
        ]);
        const allEvents = eventsData && eventsData.length > 0 ? eventsData : initialEvents;
        setEvents(allEvents);
        setRegistrations(regsData || []);
        const featured = allEvents.find((e) => e.isFeatured) || allEvents[0];
        setFeaturedEvent(featured);
      } catch {
        setEvents(initialEvents);
        setFeaturedEvent(initialEvents[0]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const categoryCounts = useMemo(() => {
    const counts = { total: events.length };
    events.forEach((ev) => {
      const cat = ev.category || 'Other';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [events]);

  const upcomingEvents = events.slice(0, 3);

  return (
    <div className="bg-[#070A12] text-slate-100 min-h-screen">
      {/* 1. TWO-COLUMN HERO */}
      <Hero featuredEvent={featuredEvent} />

      {/* 2. QUICK STATS */}
      <Stats events={events} registrations={registrations} />

      {/* 3. FEATURED EVENT SECTION */}
      {featuredEvent && (
        <section
          id="featured-event"
          className="py-12 md:py-16 border-b border-white/10 bg-[#070A12]"
          style={{ scrollMarginTop: '84px' }}
        >
          <div className="page-container">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                  Featured Event
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/25 px-2.5 py-0.5 rounded-full">
                  Spotlight
                </span>
              </div>
              <Link
                to="/events"
                className="text-xs sm:text-sm font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
              >
                <span>View all events</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <FeaturedEvent event={featuredEvent} />
          </div>
        </section>
      )}

      {/* 4. UPCOMING EVENTS */}
      <section className="py-12 md:py-16 border-b border-white/10 bg-[#0D1220]">
        <div className="page-container">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Upcoming Events
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Discover what's happening next on campus.
              </p>
            </div>
            <Link
              to="/events"
              className="text-xs sm:text-sm font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors self-start sm:self-auto"
            >
              <span>View all →</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event._id || event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY CLUBSPHERE */}
      <WhyClubSphere />

      {/* 6. EVENT CATEGORIES */}
      <CategoryGrid categoryCounts={categoryCounts} />

      {/* 7. FINAL CTA */}
      <CTA />
    </div>
  );
}
