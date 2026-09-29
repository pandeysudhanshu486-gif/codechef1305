import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Palette, Trophy, Cpu, Zap } from 'lucide-react';

export default function CategoryGrid({ categoryCounts = {} }) {
  const categories = [
    { name: 'Technical', icon: Code2, desc: 'Coding, Dev & AI', countKey: 'Technical' },
    { name: 'Cultural', icon: Palette, desc: 'Music, Drama & Arts', countKey: 'Cultural' },
    { name: 'Sports', icon: Trophy, desc: 'Tournaments & E-Sports', countKey: 'Sports' },
    { name: 'Workshop', icon: Cpu, desc: 'Hands-on Learning', countKey: 'Workshop' },
    { name: 'Competition', icon: Zap, desc: 'Hackathons & Contests', countKey: 'Competition' },
  ];

  return (
    <section className="py-14 md:py-20 bg-[#0D1220]">
      <div className="page-container">
        <div className="text-center max-w-xl mx-auto mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">
            Categories
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Explore Events by Interest
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
            Discover campus activities tailored to your passion.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const count = categoryCounts[cat.countKey];

            return (
              <Link
                key={cat.name}
                to={`/events?category=${cat.name}`}
                className="card-clean p-4 sm:p-5 flex flex-col items-center text-center justify-between hover:border-indigo-500/40 group transition-all h-full rounded-xl"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white transition-all mb-3">
                  <Icon size={18} />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                    {cat.desc}
                  </p>
                </div>
                {count !== undefined && (
                  <span className="mt-3 text-[10px] font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                    {count} {count === 1 ? 'event' : 'events'}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
