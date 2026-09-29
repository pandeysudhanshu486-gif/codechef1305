import React from 'react';

export default function StatsCard({ title, value, icon: Icon, change, changeText, color = 'indigo' }) {
  const colorSchemes = {
    indigo: {
      border: 'border-indigo-500/30',
      bg: 'bg-indigo-500/10',
      text: 'text-indigo-400',
      shadow: 'shadow-indigo-500/5'
    },
    cyan: {
      border: 'border-cyan-500/30',
      bg: 'bg-cyan-500/10',
      text: 'text-cyan-400',
      shadow: 'shadow-cyan-500/5'
    },
    emerald: {
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      shadow: 'shadow-emerald-500/5'
    },
    amber: {
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      shadow: 'shadow-amber-500/5'
    }
  };

  const scheme = colorSchemes[color] || colorSchemes.indigo;

  return (
    <div className={`card bg-[#101728] border ${scheme.border} p-6 rounded-2xl shadow-lg ${scheme.shadow} transition-all duration-300 hover:translate-y-[-2px]`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <h3 className="text-3xl font-extrabold text-white mt-1">
            {value}
          </h3>
        </div>
        <div className={`w-12 h-12 rounded-xl ${scheme.bg} border ${scheme.border} flex items-center justify-center ${scheme.text}`}>
          <Icon size={22} />
        </div>
      </div>
      {changeText && (
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-1.5 text-xs text-slate-400">
          <span className="text-emerald-400 font-semibold">{change}</span>
          <span>{changeText}</span>
        </div>
      )}
    </div>
  );
}
