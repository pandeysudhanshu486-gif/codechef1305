import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Menu, X, Shield, Compass } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'About', path: '/#about' },
  ];

  const handleLinkClick = (path) => {
    setIsOpen(false);
    if (path.includes('#')) {
      const targetId = path.split('#')[1];
      const target = document.getElementById(targetId);
      if (target) {
        setTimeout(() => {
          const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top, behavior: 'smooth' });
        }, 50);
      }
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled
          ? 'bg-[#070A12]/95 backdrop-blur-md border-b border-white/10 shadow-lg'
          : 'bg-[#070A12] border-b border-white/5'
      }`}
      style={{
        height: '68px',
        WebkitBackdropFilter: isScrolled ? 'blur(12px)' : 'none',
      }}
    >
      <div className="site-container h-full flex items-center justify-between">
        {/* LEFT: Logo & Wordmark */}
        <Link
          to="/"
          onClick={() => handleLinkClick('/')}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#5B4BFF] flex items-center justify-center shadow-md shadow-indigo-600/30 group-hover:bg-indigo-500 transition-colors">
            <Compass className="w-4 h-4 text-white" />
          </div>
          <span className="text-base sm:text-lg font-extrabold text-white group-hover:text-indigo-300 transition-colors">
            Club<span className="text-[#38BDF8]">Sphere</span>
          </span>
        </Link>

        {/* CENTER: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive =
              link.path === '/'
                ? location.pathname === '/' && !location.hash
                : location.pathname === link.path || (link.path.includes('#') && location.hash === link.path.replace('/', ''));

            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => handleLinkClick(link.path)}
                className={`text-sm font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? 'text-[#38BDF8] font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT: Find Events & Admin */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/events"
            onClick={() => setIsOpen(false)}
            className="btn btn-primary btn-sm flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Find Events</span>
          </Link>
          <Link
            to="/admin/login"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/25 transition-all"
          >
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            <span>Admin</span>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg bg-slate-900/90 text-slate-300 hover:text-white border border-white/10 focus:outline-none"
          aria-label="Toggle Navigation"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="md:hidden bg-[#0D1220] border-b border-white/10 px-5 py-6 shadow-2xl animate-fade-in">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => handleLinkClick(link.path)}
                className="px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-200 hover:bg-white/5 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <hr className="border-white/10 my-2" />
            <Link
              to="/events"
              onClick={() => setIsOpen(false)}
              className="btn btn-primary text-center justify-center text-sm py-2.5"
            >
              <Calendar className="w-4 h-4 mr-1.5" />
              <span>Find Events</span>
            </Link>
            <Link
              to="/admin/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white py-2"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Management</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
