import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import { AuthProvider } from './context/AuthContext';

// Safari & Cross-Browser Scroll Handler for Page Navigation and Hash Anchors
function ScrollToTopAndHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const targetId = hash.replace('#', '');
      const timer = setTimeout(() => {
        const elem = document.getElementById(targetId);
        if (elem) {
          const navOffset = 84;
          const elementPosition = elem.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: elementPosition - navOffset,
            behavior: 'smooth'
          });
        }
      }, 80);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

function NotFound() {
  return (
    <div className="page-body">
      <div className="site-container" style={{ maxWidth: '480px' }}>
        <div className="card-clean p-8 rounded-2xl text-center">
          <div className="text-5xl font-extrabold text-indigo-400 mb-2">404</div>
          <h2 className="text-2xl font-bold text-white mb-2">Page Not Found</h2>
          <p className="text-slate-400 text-sm mb-6">The page you are looking for does not exist or has been moved.</p>
          <Link to="/" className="btn btn-primary">Back to Homepage</Link>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTopAndHash />
        {/*
          LAYOUT ARCHITECTURE:
          - .site-layout: flex column, fills viewport
          - Navbar: position sticky (stays in document flow, content never hidden behind it)
          - .site-main: flex-grow, NO padding-top (not needed with sticky navbar)
          - Footer: at natural end of content
        */}
        <div
          className="site-layout"
          style={{
            backgroundColor: '#070b14',
            color: '#f1f5f9',
          }}
        >
          <Navbar />

          <main className="site-main">
            <Routes>
              {/* Public Student Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/events/:id/register" element={<Register />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin/dashboard"
                element={
                  <AdminProtectedRoute>
                    <AdminDashboard />
                  </AdminProtectedRoute>
                }
              />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
