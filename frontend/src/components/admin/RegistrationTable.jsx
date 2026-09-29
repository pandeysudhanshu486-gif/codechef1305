import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, Ticket, Mail, Phone, Building, Calendar, RotateCcw, User } from 'lucide-react';
import Badge from '../common/Badge';
import EmptyState from '../common/EmptyState';

export default function RegistrationTable({
  registrations = [],
  events = [],
  loading = false
}) {
  const [selectedEventId, setSelectedEventId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter registrations based on selected event and search term
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {
      const regEventId = typeof reg.eventId === 'object' ? reg.eventId?._id : reg.eventId;
      const matchesEvent = selectedEventId === 'all' || regEventId === selectedEventId;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        reg.name?.toLowerCase().includes(q) ||
        reg.email?.toLowerCase().includes(q) ||
        reg.college?.toLowerCase().includes(q) ||
        reg.phone?.toLowerCase().includes(q) ||
        reg.ticketId?.toLowerCase().includes(q);

      return matchesEvent && matchesSearch;
    });
  }, [registrations, selectedEventId, searchQuery]);

  // Export registrations to CSV
  const handleExportCSV = () => {
    if (!filteredRegistrations.length) return;

    const headers = ['Ticket ID', 'Student Name', 'Email', 'College', 'Academic Year', 'Phone', 'Event Title', 'Registered At'];
    const rows = filteredRegistrations.map((reg) => {
      const eventTitle = typeof reg.eventId === 'object' ? reg.eventId?.title : (events.find(e => (e._id || e.id) === reg.eventId)?.title || 'N/A');
      return [
        `"${reg.ticketId || ''}"`,
        `"${reg.name || ''}"`,
        `"${reg.email || ''}"`,
        `"${reg.college || ''}"`,
        `"${reg.year || ''}"`,
        `"${reg.phone || ''}"`,
        `"${eventTitle}"`,
        `"${reg.registeredAt ? new Date(reg.registeredAt).toLocaleString() : ''}"`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `clubsphere_registrations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (d) => {
    try {
      return new Date(d).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return d;
    }
  };

  const getEventTitle = (reg) => {
    if (typeof reg.eventId === 'object' && reg.eventId?.title) {
      return reg.eventId.title;
    }
    const found = events.find((e) => (e._id || e.id) === reg.eventId);
    return found ? found.title : 'General Campus Event';
  };

  return (
    <div className="space-y-6">
      {/* Controls: Event Filter Dropdown, Search Input, and CSV Export */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by student name, email, college, phone, or ticket ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#131c31] border border-white/10 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>

        {/* Filter by event */}
        <div className="flex items-center gap-3">
          <div className="relative min-w-[220px]">
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full bg-[#131c31] border border-white/10 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none appearance-none cursor-pointer"
            >
              <option value="all">All Events ({registrations.length})</option>
              {events.map((ev) => (
                <option key={ev._id || ev.id} value={ev._id || ev.id}>
                  {ev.title}
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs">
              ▼
            </div>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExportCSV}
            disabled={!filteredRegistrations.length}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-white/10 text-xs sm:text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <Download size={14} className="text-cyan-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Registrations Data Table */}
      {filteredRegistrations.length === 0 ? (
        <EmptyState
          title="No student registrations found"
          description={
            searchQuery || selectedEventId !== 'all'
              ? 'No registration records match your current search or event filter.'
              : 'There are currently no registrations recorded in the system.'
          }
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedEventId('all');
          }}
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#101728] shadow-xl">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-slate-900/60 text-slate-400 uppercase tracking-wider text-[11px] font-semibold">
                <th className="py-3.5 px-4">Pass ID</th>
                <th className="py-3.5 px-4">Student Details</th>
                <th className="py-3.5 px-4">College & Year</th>
                <th className="py-3.5 px-4">Registered Event</th>
                <th className="py-3.5 px-4">Date Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filteredRegistrations.map((reg) => (
                <tr key={reg._id || reg.ticketId} className="hover:bg-white/[0.02] transition-colors">
                  {/* Ticket Badge */}
                  <td className="py-4 px-4 font-mono font-bold text-indigo-400 whitespace-nowrap">
                    <span className="bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-1 rounded text-xs">
                      {reg.ticketId || 'CS-PASS'}
                    </span>
                  </td>

                  {/* Student Details */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="font-bold text-white text-sm flex items-center gap-1.5">
                      <User size={14} className="text-slate-400" />
                      {reg.name}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Mail size={12} /> {reg.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone size={12} /> {reg.phone}
                      </span>
                    </div>
                  </td>

                  {/* College & Year */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="text-slate-200 font-medium flex items-center gap-1.5">
                      <Building size={13} className="text-slate-400" />
                      <span className="truncate max-w-[200px]">{reg.college}</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5 font-semibold">
                      {reg.year}
                    </div>
                  </td>

                  {/* Event */}
                  <td className="py-4 px-4">
                    <div className="font-semibold text-indigo-300 line-clamp-1 max-w-[220px]">
                      {getEventTitle(reg)}
                    </div>
                  </td>

                  {/* Registered Timestamp */}
                  <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-400">
                    {formatDate(reg.registeredAt || reg.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
