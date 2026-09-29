import React from 'react';

export default function WhyClubSphere() {
  const pillars = [
    {
      number: '01',
      title: 'DISCOVER',
      headline: 'Find relevant campus events quickly.',
      text: 'Search and filter activities across technical, cultural, sports, and workshop categories from all college clubs.'
    },
    {
      number: '02',
      title: 'PARTICIPATE',
      headline: 'Register without paperwork or confusion.',
      text: 'Get verified digital entry passes instantly with clean registration passes ready for event check-in.'
    },
    {
      number: '03',
      title: 'CONNECT',
      headline: 'Meet students and communities with shared interests.',
      text: 'Build connections with peer student communities, club leaders, and faculty coordinators across campus.'
    }
  ];

  return (
    <section
      id="about"
      className="py-14 md:py-20 border-b border-white/10 bg-[#070A12]"
      style={{ scrollMarginTop: '84px' }}
    >
      <div className="page-container">
        {/* Section Header */}
        <div className="max-w-xl mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">
            Why ClubSphere?
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Designed for modern college campus communities.
          </h2>
        </div>

        {/* 3 Column Numbered Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {pillars.map((item) => (
            <div
              key={item.number}
              className="flex flex-col space-y-3 p-6 rounded-2xl bg-[#0D1220] border border-white/10 relative group hover:border-indigo-500/30 transition-all"
            >
              <div className="text-2xl sm:text-3xl font-black font-mono text-indigo-400/90">
                {item.number}
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {item.title}
              </h3>
              <p className="text-base font-bold text-white leading-snug">
                {item.headline}
              </p>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal pt-1">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
