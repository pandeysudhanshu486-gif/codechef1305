import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-14 md:py-18 border-b border-white/10 bg-[#070A12] text-center">
      <div className="page-container max-w-2xl mx-auto">
        <div className="p-8 sm:p-10 rounded-2xl bg-[#0D1220] border border-white/10 relative overflow-hidden shadow-2xl space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">
            Get Started
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
            Don't miss what's happening on campus.
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
            Discover your next event and join workshops, hackathons, and activities today.
          </p>
          <div className="pt-2">
            <Link to="/events" className="btn btn-primary btn-lg">
              <Calendar size={18} />
              <span>Explore Events</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
