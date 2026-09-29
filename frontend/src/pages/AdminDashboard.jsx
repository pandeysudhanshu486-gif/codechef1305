import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  Users,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  LogOut,
  Sparkles,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { eventService } from '../services/eventService';
import { registrationService } from '../services/registrationService';
import { authService } from '../services/authService';
import StatsCard from '../components/admin/StatsCard';
import EventModal from '../components/admin/EventModal';
import ConfirmDeleteModal from '../components/admin/ConfirmDeleteModal';
import RegistrationTable from '../components/admin/RegistrationTable';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';

export default function AdminDashboard() {
  const { adminUser, logout } = useAuth();
  const navigate = useNavigate();

  // Active view tab: 'events' | 'registrations'
  const [activeTab, setActiveTab] = useState('events');

  // Data states
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    totalRegistrations: 0
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Search & filter for admin events table
  const [eventSearch, setEventSearch] = useState('');
  const [eventCategoryFilter, setEventCategoryFilter] = useState('All');

  // Modal states
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingEventId, setDeletingEventId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch all admin data
  const fetchData = async () => {
    setRefreshing(true);
    try {
      const [eventsData, regsData, statsData] = await Promise.all([
        eventService.getEvents(),
        registrationService.getAllRegistrations(),
        authService.getDashboardStats()
      ]);

      setEvents(eventsData || []);
      setRegistrations(regsData || []);
      if (statsData) {
        setStats({
          totalEvents: statsData.totalEvents || (eventsData ? eventsData.length : 0),
          upcomingEvents: statsData.upcomingEvents || 0,
          totalRegistrations: statsData.totalRegistrations || (regsData ? regsData.length : 0)
        });
      }
    } catch (err) {
      console.error('Failed to load admin dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingEvent(null);
    setIsEventModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (event) => {
    setEditingEvent(event);
    setIsEventModalOpen(true);
  };

  // Save Event (Add or Edit)
  const handleSaveEvent = async (formData) => {
    setModalLoading(true);
    try {
      if (editingEvent) {
        const eventId = editingEvent._id || editingEvent.id;
        await eventService.updateEvent(eventId, formData);
        showToast('Event updated successfully!');
      } else {
        await eventService.createEvent(formData);
        showToast('New event created successfully!');
      }
      setIsEventModalOpen(false);
      await fetchData();
    } catch (err) {
      showToast(err.message || 'Failed to save event', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  // Open Delete Confirmation
  const handleOpenDeleteModal = (eventId) => {
    setDeletingEventId(eventId);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete Event
  const handleConfirmDelete = async () => {
    if (!deletingEventId) return;
    setDeleteLoading(true);
    try {
      await eventService.deleteEvent(deletingEventId);
      showToast('Event and associated registrations deleted successfully.');
      setIsDeleteModalOpen(false);
      setDeletingEventId(null);
      await fetchData();
    } catch (err) {
      showToast(err.message || 'Failed to delete event', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filtered admin events
  const filteredEvents = events.filter((ev) => {
    const matchesCategory =
      eventCategoryFilter === 'All' ||
      ev.category?.toLowerCase() === eventCategoryFilter.toLowerCase();
    const q = eventSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      ev.title?.toLowerCase().includes(q) ||
      ev.venue?.toLowerCase().includes(q) ||
      ev.description?.toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="page-body">
      <div className="page-container">
        {/* Toast Notification Popup */}
        {toast && (
          <div
            className={`fixed top-20 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-semibold animate-fade-in ${
              toast.type === 'error'
                ? 'bg-rose-950/95 border-rose-500/40 text-rose-200'
                : 'bg-emerald-950/95 border-emerald-500/40 text-emerald-200'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle size={18} className="text-rose-400" />
            ) : (
              <CheckCircle2 size={18} className="text-emerald-400" />
            )}
            <span>{toast.message}</span>
          </div>
        )}

        {/* Top Bar: Admin Info & Quick Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Admin Console
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
              ClubSphere Control Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Welcome back, <strong className="text-white">{adminUser?.username || 'Admin'}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              loading={refreshing}
              onClick={fetchData}
            >
              Refresh
            </Button>

            <Button
              variant="danger"
              size="sm"
              icon={LogOut}
              onClick={handleLogout}
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* KPI Stats Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          <StatsCard
            title="Total Events"
            value={stats.totalEvents || events.length}
            icon={Calendar}
            color="indigo"
            changeText="Created in system"
          />
          <StatsCard
            title="Upcoming Events"
            value={stats.upcomingEvents || events.filter((e) => e.status === 'Upcoming').length}
            icon={Sparkles}
            color="cyan"
            changeText="Scheduled on campus"
          />
          <StatsCard
            title="Total Registrations"
            value={stats.totalRegistrations || registrations.length}
            icon={Users}
            color="emerald"
            changeText="Verified student passes"
          />
        </div>

        {/* Navigation Tabs & Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#101728] border border-white/10 w-fit">
            <button
              onClick={() => setActiveTab('events')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'events'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Events Management ({events.length})
            </button>
            <button
              onClick={() => setActiveTab('registrations')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'registrations'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Student Registrations ({registrations.length})
            </button>
          </div>

          {activeTab === 'events' && (
            <Button
              variant="primary"
              size="md"
              icon={Plus}
              onClick={handleOpenAddModal}
            >
              Add New Event
            </Button>
          )}
        </div>

        {/* TAB 1: Events Management */}
        {activeTab === 'events' && (
          <div className="space-y-6 animate-fade-in">
            {/* Search & Category Filter for Admin */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search managed events by title or venue..."
                  value={eventSearch}
                  onChange={(e) => setEventSearch(e.target.value)}
                  className="w-full bg-[#131c31] border border-white/10 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none transition-all"
                />
              </div>

              <div className="relative min-w-[180px]">
                <select
                  value={eventCategoryFilter}
                  onChange={(e) => setEventCategoryFilter(e.target.value)}
                  className="w-full bg-[#131c31] border border-white/10 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  <option value="Technical">Technical</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Sports">Sports</option>
                  <option value="Management">Management</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs">
                  ▼
                </div>
              </div>
            </div>

            {/* Events Table */}
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#101728] shadow-xl">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-slate-900/60 text-slate-400 uppercase tracking-wider text-[11px] font-semibold">
                    <th className="py-3.5 px-4">Event</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Date & Time</th>
                    <th className="py-3.5 px-4">Venue</th>
                    <th className="py-3.5 px-4">Registrations</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {filteredEvents.map((ev) => {
                    const eventId = ev._id || ev.id;
                    const regCount = ev.registeredCount || 0;
                    const capacity = ev.capacity || 100;

                    return (
                      <tr key={eventId} className="hover:bg-white/[0.02] transition-colors">
                        {/* Title & Badge */}
                        <td className="py-4 px-4">
                          <div className="font-bold text-white text-sm hover:text-indigo-300 transition-colors">
                            <Link to={`/events/${eventId}`}>{ev.title}</Link>
                          </div>
                          {ev.isFeatured && (
                            <span className="inline-block mt-1 text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 rounded">
                              Flagship Spotlight
                            </span>
                          )}
                        </td>

                        {/* Category */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <Badge category={ev.category} size="sm" />
                        </td>

                        {/* Date & Time */}
                        <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-300">
                          <div className="font-medium text-white">{ev.date}</div>
                          <div className="text-slate-400 text-[11px] mt-0.5">{ev.time || '10:00 AM'}</div>
                        </td>

                        {/* Venue */}
                        <td className="py-4 px-4 text-xs text-slate-300">
                          <span className="truncate max-w-[150px] inline-block">{ev.venue}</span>
                        </td>

                        {/* Capacity & Registered Count */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-bold text-white">{regCount}</span>
                            <span className="text-slate-500">/</span>
                            <span className="text-slate-400">{capacity}</span>
                          </div>
                          <div className="w-20 bg-slate-800 rounded-full h-1.5 mt-1.5 overflow-hidden">
                            <div
                              className="bg-indigo-500 h-full rounded-full"
                              style={{ width: `${Math.min(100, (regCount / capacity) * 100)}%` }}
                            />
                          </div>
                        </td>

                        {/* Action buttons */}
                        <td className="py-4 px-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              to={`/events/${eventId}`}
                              title="View Public Page"
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                            >
                              <ExternalLink size={14} />
                            </Link>
                            <button
                              onClick={() => handleOpenEditModal(ev)}
                              title="Edit Event"
                              className="p-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 hover:text-indigo-300 border border-indigo-500/20 transition-colors cursor-pointer"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleOpenDeleteModal(eventId)}
                              title="Delete Event"
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 transition-colors cursor-pointer"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Student Registrations Explorer */}
        {activeTab === 'registrations' && (
          <div className="animate-fade-in">
            <RegistrationTable
              registrations={registrations}
              events={events}
              loading={loading}
            />
          </div>
        )}

        {/* Add / Edit Event Modal */}
        <EventModal
          isOpen={isEventModalOpen}
          onClose={() => setIsEventModalOpen(false)}
          onSave={handleSaveEvent}
          event={editingEvent}
          loading={modalLoading}
        />

        {/* Delete Confirmation Modal */}
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
          loading={deleteLoading}
        />
      </div>
    </div>
  );
}
