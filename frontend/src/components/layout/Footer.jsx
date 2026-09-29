import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Shield } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#070A12] text-slate-400 py-12 md:py-16">
      <div className="site-container">
        {/* Multi-column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12">
          {/* Column 1: Brand & Tagline (Span 4) */}
          <div className="lg:col-span-4 space-y-3.5">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-[#5B4BFF] flex items-center justify-center shadow-md">
                <Compass className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-extrabold text-white">
                Club<span className="text-[#38BDF8]">Sphere</span>
              </span>
            </Link>
            <p className="text-xs font-semibold text-slate-300">
              Discover. Participate. Connect.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The official centralized platform for college club activities, workshops, hackathons, and student community registrations.
            </p>
          </div>

          {/* Column 2: Navigation (Span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-slate-400 hover:text-white transition-colors">
                  Events Directory
                </Link>
              </li>
              <li>
                <Link to="/#about" className="text-slate-400 hover:text-white transition-colors">
                  About ClubSphere
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Event Categories (Span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Categories
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/events?category=Technical" className="text-slate-400 hover:text-white transition-colors">
                  Technical & Coding
                </Link>
              </li>
              <li>
                <Link to="/events?category=Cultural" className="text-slate-400 hover:text-white transition-colors">
                  Cultural & Arts
                </Link>
              </li>
              <li>
                <Link to="/events?category=Sports" className="text-slate-400 hover:text-white transition-colors">
                  Sports & Tournaments
                </Link>
              </li>
              <li>
                <Link to="/events?category=Workshop" className="text-slate-400 hover:text-white transition-colors">
                  Hands-on Workshops
                </Link>
              </li>
              <li>
                <Link to="/events?category=Competition" className="text-slate-400 hover:text-white transition-colors">
                  Competitions & Hackathons
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Admin Portal (Span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Admin Console
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Club presidents and faculty coordinators can sign in to manage listings and student passes.
            </p>
            <div className="pt-1">
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white py-2 px-3.5 rounded-lg bg-white/5 border border-white/10 hover:border-white/25 transition-all"
              >
                <Shield size={13} className="text-indigo-400" />
                <span>Admin Portal</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© {currentYear} ClubSphere. Built for College Campus Communities.</p>
          <div className="flex items-center gap-2 text-slate-400">
            <span>Discover • Participate • Connect</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
