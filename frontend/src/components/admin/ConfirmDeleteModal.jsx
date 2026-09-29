import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from '../common/Button';

export default function ConfirmDeleteModal({
  isOpen,
  title = 'Delete Event',
  message = 'Are you sure you want to delete this event? This action will permanently remove the event and all associated student registrations.',
  onConfirm,
  onCancel,
  loading = false
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="card w-full max-w-md bg-[#101728] border border-rose-500/30 rounded-3xl shadow-2xl p-6 sm:p-8 relative">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4 mx-auto">
          <AlertTriangle size={28} />
        </div>

        <h3 className="text-xl font-bold text-white text-center mb-2">
          {title}
        </h3>
        <p className="text-slate-400 text-xs sm:text-sm text-center mb-6 leading-relaxed">
          {message}
        </p>

        <div className="flex items-center justify-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={onConfirm}
            loading={loading}
            className="flex-1"
          >
            Yes, Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
