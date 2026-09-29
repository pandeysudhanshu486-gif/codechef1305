import React from 'react';
import { Calendar, CheckCircle2, Layers, Users } from 'lucide-react';

export default function Stats({ events = [], registrations = [] }) {
  const totalEvents = events.length;
  const openRegistrations = events.filter((e) => (e.registeredCount || 0) < (e.capacity || 100)).length;
  const categoriesCount = new Set(events.map((e) => e.category)).size || 5;
  const totalRegs =
    registrations.length > 0
      ? registrations.length
      : events.reduce((acc, ev) => acc + (ev.registeredCount || 0), 0);

  const statItems = [
    { label: 'Upcoming Events', value: totalEvents, icon: Calendar },
    { label: 'Open Registrations', value: openRegistrations, icon: CheckCircle2 },
    { label: 'Active Categories', value: categoriesCount, icon: Layers },
    { label: 'Total Registrations', value: totalRegs, icon: Users },
  ];

  return (
    <section className="py-6 border-b border-white/10 bg-[#0D1220]">
      <div className="page-container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-stretch">
          {statItems.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3.5 p-4 rounded-xl bg-[#111827] border border-white/10 shadow-sm transition-all hover:border-white/20"
              >
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                  <Icon size={20} />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-white leading-none">
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-400 font-medium mt-1 leading-snug">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
