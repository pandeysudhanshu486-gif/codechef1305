import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Shield, Lock, User, Eye, EyeOff, AlertCircle, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true);

    try {
      await login(username, password);
      const destination = location.state?.from?.pathname || '/admin/dashboard';
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid administrator credentials. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center px-5 py-10"
      style={{ minHeight: 'calc(100vh - 72px)' }}
    >
      <div className="w-full max-w-md">
          {/* Back Link */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft size={14} />
            <span>Return to Homepage</span>
          </Link>

          {/* Card Container */}
          <div className="card-clean p-8 bg-[#101728] border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden">
            {/* Ambient Glow */}
            <div className="absolute -top-16 -right-16 w-36 h-36 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="text-center space-y-2 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400 mb-3 shadow-lg shadow-indigo-500/10">
                <Shield size={28} />
              </div>
              <h1 className="text-2xl font-extrabold text-white">
                Admin Portal
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm">
                Sign in to manage club events, approve registrations, and view analytics.
              </p>
            </div>

            {/* Demo Credentials Helper Pill */}
            <div className="mb-6 p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-cyan-400 shrink-0" />
                <span>Default: <strong>admin</strong> / <strong>admin123</strong></span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setUsername('admin');
                  setPassword('admin123');
                }}
                className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
              >
                Fill Demo
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-fade-in">
                <AlertCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-group mb-4">
                <label className="form-label" htmlFor="username">
                  Username
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter admin username"
                    className="form-input pl-10"
                    required
                  />
                </div>
              </div>

              <div className="form-group mb-6">
                <label className="form-label" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="form-input pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full"
              >
                <span>Sign In to Dashboard</span>
                <ArrowRight size={16} />
              </Button>
            </form>
          </div>
        </div>
    </div>
  );
}
