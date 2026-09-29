import api from './api';
import { initialEvents } from './sampleData';

export const eventService = {
  // Fetch all events with search, category, and sort parameters
  async getEvents(params = {}) {
    try {
      const response = await api.get('/events', { params });
      if (response.data && response.data.success) {
        // Cache to localStorage for offline resilience
        localStorage.setItem('clubsphere_events', JSON.stringify(response.data.data));
        return response.data.data;
      }
    } catch (error) {
      console.warn('[EventService] Falling back to local events cache:', error.message);
    }

    // Fallback logic
    const stored = localStorage.getItem('clubsphere_events');
    let events = stored ? JSON.parse(stored) : initialEvents;

    if (params.category && params.category !== 'All') {
      events = events.filter(
        (e) => e.category?.toLowerCase() === params.category.toLowerCase()
      );
    }

    if (params.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      events = events.filter(
        (e) =>
          e.title?.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q) ||
          e.venue?.toLowerCase().includes(q)
      );
    }

    return events;
  },

  // Fetch single event by ID
  async getEventById(id) {
    try {
      const response = await api.get(`/events/${id}`);
      if (response.data && response.data.success) {
        return response.data.data;
      }
    } catch (error) {
      console.warn('[EventService] Falling back to local cache for event:', id);
    }

    const stored = localStorage.getItem('clubsphere_events');
    const events = stored ? JSON.parse(stored) : initialEvents;
    return events.find((e) => (e._id || e.id) === id) || null;
  },

  // Create event (Admin)
  async createEvent(eventData) {
    try {
      const response = await api.post('/events', eventData);
      if (response.data && response.data.success) {
        return response.data.data;
      }
    } catch (error) {
      console.warn('[EventService] Using local fallback for event creation');
      const newEvent = {
        _id: `evt-${Date.now()}`,
        ...eventData,
        registeredCount: 0,
        createdAt: new Date().toISOString()
      };
      const stored = JSON.parse(localStorage.getItem('clubsphere_events') || JSON.stringify(initialEvents));
      stored.unshift(newEvent);
      localStorage.setItem('clubsphere_events', JSON.stringify(stored));
      return newEvent;
    }
  },

  // Update event (Admin)
  async updateEvent(id, eventData) {
    try {
      const response = await api.put(`/events/${id}`, eventData);
      if (response.data && response.data.success) {
        return response.data.data;
      }
    } catch (error) {
      console.warn('[EventService] Using local fallback for event update');
      const stored = JSON.parse(localStorage.getItem('clubsphere_events') || JSON.stringify(initialEvents));
      const updated = stored.map((e) => ((e._id || e.id) === id ? { ...e, ...eventData } : e));
      localStorage.setItem('clubsphere_events', JSON.stringify(updated));
      return { _id: id, ...eventData };
    }
  },

  // Delete event (Admin)
  async deleteEvent(id) {
    try {
      const response = await api.delete(`/events/${id}`);
      return response.data;
    } catch (error) {
      console.warn('[EventService] Using local fallback for event deletion');
      const stored = JSON.parse(localStorage.getItem('clubsphere_events') || JSON.stringify(initialEvents));
      const filtered = stored.filter((e) => (e._id || e.id) !== id);
      localStorage.setItem('clubsphere_events', JSON.stringify(filtered));
      return { success: true };
    }
  }
};
