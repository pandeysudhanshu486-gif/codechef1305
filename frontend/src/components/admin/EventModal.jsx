import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, Image, Tag, Users, Sparkles, Check, AlertCircle } from 'lucide-react';
import Button from '../common/Button';

export default function EventModal({
  isOpen,
  onClose,
  onSave,
  event = null,
  loading = false
}) {
  const isEditing = Boolean(event);

  const initialForm = {
    title: '',
    description: '',
    category: 'Technical',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM - 01:00 PM',
    venue: '',
    image: '',
    capacity: 100,
    isFeatured: false,
    status: 'Upcoming'
  };

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        category: event.category || 'Technical',
        date: event.date ? event.date.split('T')[0] : '',
        time: event.time || '',
        venue: event.venue || '',
        image: event.image || '',
        capacity: event.capacity || 100,
        isFeatured: Boolean(event.isFeatured),
        status: event.status || 'Upcoming'
      });
    } else {
      setFormData(initialForm);
    }
    setErrors({});
  }, [event, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time.trim()) newErrors.time = 'Time is required';
    if (!formData.venue.trim()) newErrors.venue = 'Venue is required';
    if (!formData.capacity || Number(formData.capacity) <= 0)
      newErrors.capacity = 'Capacity must be greater than 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="card w-full max-w-2xl bg-[#101728] border border-white/15 rounded-3xl shadow-2xl p-6 sm:p-8 my-8 relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            {isEditing ? 'Update Event' : 'Create New Event'}
          </span>
          <h2 className="text-2xl font-extrabold text-white mt-1">
            {isEditing ? 'Edit Event Details' : 'Publish Campus Event'}
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="title">
              Event Title <span className="required">*</span>
            </label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. HackSphere 2026: Annual College Hackathon"
              className={`form-input ${errors.title ? 'error' : ''}`}
            />
            {errors.title && <p className="form-error">{errors.title}</p>}
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label" htmlFor="category">
                Category <span className="required">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-select cursor-pointer"
              >
                <option value="Technical">Technical</option>
                <option value="Workshop">Workshop</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Cultural">Cultural</option>
                <option value="Sports">Sports</option>
                <option value="Management">Management</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="status">
                Event Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select cursor-pointer"
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Date, Time & Venue */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="form-group">
              <label className="form-label" htmlFor="date">
                Date <span className="required">*</span>
              </label>
              <input
                id="date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`form-input ${errors.date ? 'error' : ''}`}
              />
              {errors.date && <p className="form-error">{errors.date}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="time">
                Time <span className="required">*</span>
              </label>
              <input
                id="time"
                type="text"
                name="time"
                value={formData.time}
                onChange={handleChange}
                placeholder="10:00 AM - 01:00 PM"
                className={`form-input ${errors.time ? 'error' : ''}`}
              />
              {errors.time && <p className="form-error">{errors.time}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="capacity">
                Seat Capacity <span className="required">*</span>
              </label>
              <input
                id="capacity"
                type="number"
                name="capacity"
                min="1"
                value={formData.capacity}
                onChange={handleChange}
                className={`form-input ${errors.capacity ? 'error' : ''}`}
              />
              {errors.capacity && <p className="form-error">{errors.capacity}</p>}
            </div>
          </div>

          {/* Venue */}
          <div className="form-group">
            <label className="form-label" htmlFor="venue">
              Venue / Location <span className="required">*</span>
            </label>
            <input
              id="venue"
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              placeholder="e.g. Auditorium Hall 2 / CS Block Lab 4"
              className={`form-input ${errors.venue ? 'error' : ''}`}
            />
            {errors.venue && <p className="form-error">{errors.venue}</p>}
          </div>

          {/* Image URL */}
          <div className="form-group">
            <label className="form-label" htmlFor="image">
              Cover Image URL (Optional)
            </label>
            <input
              id="image"
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="form-input"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Leave blank to automatically use a curated category theme image.
            </p>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="description">
              Event Description & Schedule <span className="required">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Provide event overview, rules, prerequisite knowledge, and perks..."
              className={`form-textarea ${errors.description ? 'error' : ''}`}
            />
            {errors.description && <p className="form-error">{errors.description}</p>}
          </div>

          {/* Featured Checkbox */}
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
            <input
              type="checkbox"
              id="isFeatured"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <label htmlFor="isFeatured" className="text-xs sm:text-sm font-medium text-slate-200 cursor-pointer select-none">
              Mark as <strong className="text-indigo-400">Featured Spotlight Event</strong> on Homepage
            </label>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              icon={Check}
            >
              {isEditing ? 'Save Changes' : 'Create Event'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
