import React from 'react';

export default function Badge({
  category,
  variant,
  children,
  className = '',
  size = 'md'
}) {
  const getCategoryClass = (cat) => {
    if (!cat) return 'badge-other';
    const c = cat.toLowerCase();
    if (c.includes('tech') || c.includes('code') || c.includes('ai') || c.includes('dev')) return 'badge-technical';
    if (c.includes('cultur') || c.includes('music') || c.includes('dance') || c.includes('art') || c.includes('fest')) return 'badge-cultural';
    if (c.includes('work') || c.includes('bootcamp') || c.includes('session')) return 'badge-workshop';
    if (c.includes('sport') || c.includes('esport') || c.includes('gaming')) return 'badge-sports';
    if (c.includes('compet') || c.includes('hack') || c.includes('thon') || c.includes('arena')) return 'badge-competition';
    if (c.includes('manage') || c.includes('lead') || c.includes('startup') || c.includes('biz')) return 'badge-management';
    if (c.includes('open')) return 'badge-open';
    if (c.includes('closed') || c.includes('full')) return 'badge-closed';
    return 'badge-other';
  };

  const badgeClass = variant ? `badge-${variant}` : getCategoryClass(category || children);

  return (
    <span className={`badge ${badgeClass} ${size === 'sm' ? 'text-[10px] py-0.5 px-2' : ''} ${className}`}>
      {children || category}
    </span>
  );
}
