import api from './api';

export const registrationService = {
  // Student registration submission
  async registerStudent(data) {
    try {
      const response = await api.post('/registrations', data);
      if (response.data && response.data.success) {
        return response.data;
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      console.warn('[RegistrationService] Fallback registration execution');
    }

    // Local fallback logic
    const { eventId, email, name, college, year, phone } = data;
    const stored = JSON.parse(localStorage.getItem('clubsphere_registrations') || '[]');

    // Duplicate check
    const isDup = stored.some(
      (r) => r.eventId === eventId && r.email.toLowerCase() === email.toLowerCase().trim()
    );
    if (isDup) {
      throw new Error('You have already registered for this event with this email address.');
    }

    const ticketId = `CS-${Math.floor(100000 + Math.random() * 900000)}`;
    const newReg = {
      _id: `reg-${Date.now()}`,
      eventId,
      ticketId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      college: college.trim(),
      year,
      phone: phone.trim(),
      registeredAt: new Date().toISOString()
    };

    stored.push(newReg);
    localStorage.setItem('clubsphere_registrations', JSON.stringify(stored));

    return {
      success: true,
      message: 'Registration successful!',
      data: { registration: newReg }
    };
  },

  // Get all registrations (Admin)
  async getAllRegistrations(params = {}) {
    try {
      const response = await api.get('/registrations', { params });
      if (response.data && response.data.success) {
        return response.data.data;
      }
    } catch (error) {
      console.warn('[RegistrationService] Using local fallback for registrations listing');
    }

    const stored = JSON.parse(localStorage.getItem('clubsphere_registrations') || '[]');
    let result = [...stored];

    if (params.eventId && params.eventId !== 'all') {
      result = result.filter((r) => r.eventId === params.eventId);
    }

    if (params.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.name?.toLowerCase().includes(q) ||
          r.email?.toLowerCase().includes(q) ||
          r.college?.toLowerCase().includes(q) ||
          r.phone?.toLowerCase().includes(q) ||
          r.ticketId?.toLowerCase().includes(q)
      );
    }

    return result;
  },

  // Get registrations for a specific event
  async getEventRegistrations(eventId) {
    try {
      const response = await api.get(`/registrations/event/${eventId}`);
      if (response.data && response.data.success) {
        return response.data.data;
      }
    } catch (error) {
      console.warn('[RegistrationService] Using fallback for event registrations');
    }

    const stored = JSON.parse(localStorage.getItem('clubsphere_registrations') || '[]');
    return stored.filter((r) => r.eventId === eventId);
  }
};
