import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import HeroEventPreview from './HeroEventPreview';

export default function Hero({ featuredEvent }) {
  return (
    <section className="py-12 md:py-16 border-b border-white/10 bg-[#070A12] flex items-center">
      <div className="page-container w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
          {/* LEFT COLUMN: Main Hero Copy (~55%) */}
          <div className="lg:col-span-7 space-y-5 text-left">
            {/* Small Eyebrow */}
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">
              COLLEGE CLUB EVENTS
            </p>

            {/* Large Headline */}
            <h1
              className="font-extrabold text-white leading-tight"
              style={{
                fontSize: 'clamp(2.25rem, 4.5vw, 4.25rem)',
                letterSpacing: '0.01em',
                wordSpacing: '0.05em',
                lineHeight: 1.2,
              }}
            >
              Discover campus.<br className="hidden sm:inline" /> Participate in{' '}
              <span className="text-[#38BDF8]">what matters.</span>
            </h1>

            {/* Subtext */}
            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed font-normal">
              Explore workshops, hackathons, competitions, cultural events and student activities happening across campus.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link to="/events" className="btn btn-primary btn-lg">
                <Calendar className="w-4 h-4" />
                <span>Explore Events</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              {featuredEvent && (
                <Link to="/#featured-event" className="btn btn-secondary btn-lg">
                  View Featured Event
                </Link>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Next Event Live Preview Card (~45%) */}
          <div className="lg:col-span-5">
            <HeroEventPreview event={featuredEvent} />
          </div>
        </div>
      </div>
    </section>
  );
}
