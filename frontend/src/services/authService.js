import api from './api';

export const authService = {
  // Admin Login
  async login(username, password) {
    try {
      const response = await api.post('/auth/login', { username, password });
      if (response.data && response.data.success) {
        localStorage.setItem('clubsphere_admin_token', response.data.token);
        localStorage.setItem('clubsphere_admin_user', JSON.stringify(response.data.admin));
        return response.data;
      }
    } catch (error) {
      // If server is reachable and rejected password
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
    }

    // Local fallback authentication for offline dev
    if (username === 'admin' && password === 'admin123') {
      const mockAdmin = { id: 'mock-admin', username: 'admin', role: 'admin' };
      localStorage.setItem('clubsphere_admin_token', 'mock_jwt_token_clubsphere_2026');
      localStorage.setItem('clubsphere_admin_user', JSON.stringify(mockAdmin));
      return {
        success: true,
        token: 'mock_jwt_token_clubsphere_2026',
        admin: mockAdmin
      };
    }

    throw new Error('Invalid administrator credentials');
  },

  // Verify token session
  async verifySession() {
    try {
      const response = await api.get('/auth/verify');
      return response.data?.success;
    } catch {
      return !!localStorage.getItem('clubsphere_admin_token');
    }
  },

  // Get Admin Dashboard Stats
  async getDashboardStats() {
    try {
      const response = await api.get('/auth/stats');
      if (response.data && response.data.success) {
        return response.data.data;
      }
    } catch (error) {
      console.warn('[AuthService] Generating fallback stats from local storage');
    }

    const events = JSON.parse(localStorage.getItem('clubsphere_events') || '[]');
    const registrations = JSON.parse(localStorage.getItem('clubsphere_registrations') || '[]');

    return {
      totalEvents: events.length,
      upcomingEvents: events.filter((e) => e.status === 'Upcoming').length,
      totalRegistrations: registrations.length,
      categoryStats: [
        { _id: 'Technical', count: events.filter((e) => e.category === 'Technical').length },
        { _id: 'Workshop', count: events.filter((e) => e.category === 'Workshop').length },
        { _id: 'Hackathon', count: events.filter((e) => e.category === 'Hackathon').length },
        { _id: 'Cultural', count: events.filter((e) => e.category === 'Cultural').length }
      ],
      recentRegistrations: registrations.slice(-5).reverse()
    };
  },

  // Logout
  logout() {
    localStorage.removeItem('clubsphere_admin_token');
    localStorage.removeItem('clubsphere_admin_user');
  }
};
