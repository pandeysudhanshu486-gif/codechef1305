import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  MapPin, 
  Clock, 
  ArrowLeft, 
  Ticket, 
  Download,
  ShieldCheck
} from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { eventService } from '../services/eventService';
import { registrationService } from '../services/registrationService';

export default function Register() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: '',
    year: '1st Year',
    phone: ''
  });

  // Validation errors
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [serverError, setServerError] = useState('');
  const [ticketData, setTicketData] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoadingEvent(true);
      try {
        const found = await eventService.getEventById(id);
        setEvent(found);
      } catch {
        setEvent(null);
      } finally {
        setLoadingEvent(false);
      }
    };
    load();
  }, [id]);

  const validateField = (field, value) => {
    let error = '';
    switch (field) {
      case 'name':
        if (!value.trim()) error = 'Full name is required';
        else if (value.trim().length < 3) error = 'Name must be at least 3 characters';
        break;
      case 'email':
        if (!value.trim()) error = 'Email address is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
          error = 'Please enter a valid email address';
        break;
      case 'college':
        if (!value.trim()) error = 'College / University name is required';
        break;
      case 'phone':
        if (!value.trim()) error = 'Phone number is required';
        else if (!/^\+?[0-9\s-]{10,15}$/.test(value.trim().replace(/\s+/g, '')))
          error = 'Please enter a valid 10-digit phone number';
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const fieldError = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
    }
    if (serverError) setServerError('');
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      college: true,
      year: true,
      phone: true
    });
    return Object.keys(newErrors).length === 0;
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const eventId = event._id || event.id;
      const res = await registrationService.registerStudent({
        eventId,
        name: formData.name,
        email: formData.email,
        college: formData.college,
        year: formData.year,
        phone: formData.phone
      });

      const reg = res?.data?.registration || {
        ...formData,
        eventId,
        ticketId: `CS-${Math.floor(100000 + Math.random() * 900000)}`,
        registeredAt: new Date().toISOString()
      };

      setTicketData(reg);
      setSubmitSuccess(true);
      triggerConfetti();
    } catch (err) {
      setServerError(err.message || 'Failed to submit registration. Please check details and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingEvent) {
    return (
      <div className="page-body">
        <div className="page-container max-w-lg text-center">
          <div className="skeleton h-6 w-36 mx-auto mb-4" />
          <div className="skeleton h-56 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="page-body">
        <div className="page-container text-center max-w-md mx-auto">
          <div className="card-clean p-8 rounded-xl">
            <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-white mb-2">Event Not Found</h2>
            <Link to="/events" className="btn btn-primary btn-sm mt-3">
              Browse Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-body">
      <div className="page-container max-w-3xl">
        {/* Back Link */}
        <Link
          to={`/events/${id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={13} />
          <span>Back to Event Details</span>
        </Link>

        {/* SUCCESS CONFIRMATION VIEW */}
        {submitSuccess && ticketData ? (
          <div className="space-y-6 max-w-xl mx-auto">
            {/* Header */}
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 size={28} />
              </div>
              <h1 className="text-2xl font-extrabold text-white">Registration Confirmed</h1>
              <p className="text-slate-300 text-xs">
                Your digital entry pass is confirmed for <strong className="text-white">{event.title}</strong>.
              </p>
            </div>

            {/* Digital Ticket Pass Card */}
            <div className="rounded-2xl bg-[#10172a] border border-indigo-500/30 p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-dashed border-white/15 pb-3">
                <div className="flex items-center gap-2">
                  <Ticket className="text-indigo-400" size={18} />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Student Entry Pass
                  </span>
                </div>
                <span className="font-mono text-xs font-bold text-indigo-300 bg-indigo-500/15 px-2.5 py-0.5 rounded border border-indigo-500/25">
                  {ticketData.ticketId}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{event.title}</h3>
                <Badge category={event.category} size="sm" className="mt-1" />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 text-xs">
                <div>
                  <p className="text-slate-400 font-medium">Student Name</p>
                  <p className="font-bold text-white text-sm mt-0.5">{ticketData.name}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Academic Year</p>
                  <p className="font-bold text-white text-sm mt-0.5">{ticketData.year}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-slate-400 font-medium">Institution</p>
                  <p className="font-bold text-white text-sm mt-0.5">{ticketData.college}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 border-t border-white/10 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-indigo-400 shrink-0" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={13} className="text-slate-400 shrink-0" />
                  <span className="truncate">{event.time || '10:00 AM - 01:00 PM'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-slate-400 shrink-0" />
                  <span className="truncate">{event.venue}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-dashed border-white/15 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={13} className="text-emerald-400" /> Verified Pass
                </span>
                <span className="font-mono text-[10px] text-slate-500">|||| ||||| ||||</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="btn btn-secondary btn-sm inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Download size={14} />
                <span>Print Pass</span>
              </button>
              <Link to="/events" className="btn btn-primary btn-sm">
                Explore More Events
              </Link>
            </div>
          </div>
        ) : (
          /* REGISTRATION FORM VIEW */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left Column: Event Summary (Span 5) */}
            <div className="md:col-span-5 space-y-4">
              <div className="card-clean p-5 bg-[#10172a] rounded-xl space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                  Registering For
                </span>
                <h2 className="text-base font-bold text-white leading-snug">
                  {event.title}
                </h2>
                <Badge category={event.category} size="sm" />

                <div className="space-y-2 pt-2 border-t border-white/10 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Calendar size={13} className="text-indigo-400 shrink-0" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={13} className="text-slate-400 shrink-0" />
                    <span>{event.time || '10:00 AM - 01:00 PM'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={13} className="text-slate-400 shrink-0" />
                    <span className="truncate">{event.venue}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Form (Span 7) */}
            <div className="md:col-span-7">
              <div className="card-clean p-6 bg-[#10172a] rounded-xl space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white">Student Registration Form</h3>
                  <p className="text-xs text-slate-400">Please enter your academic details accurately.</p>
                </div>

                {serverError && (
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                    <AlertCircle size={15} className="text-rose-400 shrink-0 mt-0.5" />
                    <span>{serverError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {/* Full Name */}
                  <div className="form-group mb-0">
                    <label className="form-label" htmlFor="name">
                      Full Name <span className="required">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      placeholder="e.g. Alex Johnson"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`form-input ${touched.name && errors.name ? 'error' : ''}`}
                    />
                    {touched.name && errors.name && (
                      <p className="form-error">{errors.name}</p>
                    )}
                  </div>

                  {/* Email Address */}
                  <div className="form-group mb-0">
                    <label className="form-label" htmlFor="email">
                      College / Personal Email <span className="required">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="alex.j@university.edu"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`form-input ${touched.email && errors.email ? 'error' : ''}`}
                    />
                    {touched.email && errors.email && (
                      <p className="form-error">{errors.email}</p>
                    )}
                  </div>

                  {/* College & Year */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="form-group mb-0">
                      <label className="form-label" htmlFor="college">
                        College Name <span className="required">*</span>
                      </label>
                      <input
                        id="college"
                        type="text"
                        name="college"
                        placeholder="e.g. Institute of Tech"
                        value={formData.college}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`form-input ${touched.college && errors.college ? 'error' : ''}`}
                      />
                      {touched.college && errors.college && (
                        <p className="form-error">{errors.college}</p>
                      )}
                    </div>

                    <div className="form-group mb-0">
                      <label className="form-label" htmlFor="year">
                        Academic Year <span className="required">*</span>
                      </label>
                      <select
                        id="year"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        className="form-select cursor-pointer"
                      >
                        <option value="1st Year">1st Year (Freshman)</option>
                        <option value="2nd Year">2nd Year (Sophomore)</option>
                        <option value="3rd Year">3rd Year (Junior)</option>
                        <option value="4th Year">4th Year (Senior)</option>
                        <option value="PG/Other">Postgraduate / Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="form-group mb-0">
                    <label className="form-label" htmlFor="phone">
                      Phone Number <span className="required">*</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`form-input ${touched.phone && errors.phone ? 'error' : ''}`}
                    />
                    {touched.phone && errors.phone && (
                      <p className="form-error">{errors.phone}</p>
                    )}
                  </div>

                  {/* Submit CTA */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      loading={submitting}
                      className="w-full"
                    >
                      Confirm Registration
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
