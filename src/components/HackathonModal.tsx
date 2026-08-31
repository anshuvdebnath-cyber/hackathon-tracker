import React, { useState, useEffect } from 'react';
import { Hackathon, HackathonFormData, HackathonMode, HackathonOutcome } from '../types';
import { toDatetimeLocalValue } from '../utils';

interface HackathonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Hackathon>) => Promise<void>;
  editItem?: Hackathon | null;
}

export const HackathonModal: React.FC<HackathonModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editItem,
}) => {
  const isEditing = Boolean(editItem);

  // Form State
  const [formData, setFormData] = useState<HackathonFormData>({
    name: '',
    mode: 'online',
    venue: '',
    link: '',
    registrationDeadline: '',
    startTime: '',
    endTime: '',
    tags: '',
    resultsReceived: false,
    outcome: 'pending',
    notes: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill form when editing or initialize with sensible defaults
  useEffect(() => {
    if (editItem) {
      setFormData({
        name: editItem.name || '',
        mode: editItem.mode || 'online',
        venue: editItem.venue || '',
        link: editItem.link || '',
        registrationDeadline: toDatetimeLocalValue(editItem.registrationDeadline),
        startTime: toDatetimeLocalValue(editItem.startTime),
        endTime: toDatetimeLocalValue(editItem.endTime),
        tags: (editItem.tags || []).join(', '),
        resultsReceived: Boolean(editItem.resultsReceived),
        outcome: editItem.outcome || 'pending',
        notes: editItem.notes || '',
      });
    } else {
      const now = new Date();
      const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
      const in5Days = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
      const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      setFormData({
        name: '',
        mode: 'online',
        venue: '',
        link: '',
        registrationDeadline: toDatetimeLocalValue(in3Days.toISOString()),
        startTime: toDatetimeLocalValue(in5Days.toISOString()),
        endTime: toDatetimeLocalValue(in7Days.toISOString()),
        tags: '',
        resultsReceived: false,
        outcome: 'pending',
        notes: '',
      });
    }
    setFormErrors({});
  }, [editItem, isOpen]);

  if (!isOpen) return null;

  // Validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) {
      errors.name = 'Hackathon name is required';
    }
    if (!formData.startTime) {
      errors.startTime = 'Start time is required';
    }
    if (!formData.endTime) {
      errors.endTime = 'End time is required';
    } else if (formData.startTime && new Date(formData.endTime) <= new Date(formData.startTime)) {
      errors.endTime = 'End time must be after start time';
    }
    if (formData.link && !/^https?:\/\//i.test(formData.link)) {
      errors.link = 'Link should start with http:// or https://';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload: Partial<Hackathon> = {
        name: formData.name.trim(),
        mode: formData.mode,
        venue: formData.venue.trim(),
        link: formData.link.trim(),
        registrationDeadline: formData.registrationDeadline
          ? new Date(formData.registrationDeadline).toISOString()
          : new Date(formData.startTime).toISOString(),
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
        tags: formData.tags
          ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
        resultsReceived: formData.resultsReceived,
        outcome: formData.resultsReceived ? formData.outcome : 'pending',
        notes: formData.notes.trim(),
      };

      await onSave(payload);
      onClose();
    } catch (err: any) {
      setFormErrors({ submit: err.message || 'Failed to save hackathon' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="hackathon-modal-backdrop"
      className="fixed inset-0 z-50 bg-[#1a1c1c]/80 overflow-y-auto flex items-start justify-center p-2 sm:p-4 backdrop-blur-xs"
    >
      {/* Modal Container */}
      <div
        id="hackathon-modal-card"
        className="w-full max-w-2xl bg-[#f9f9f9] border-[3px] border-[#1a1c1c] neo-shadow-xl my-4 sm:my-8 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Sticky Header with Back & Save Buttons (Matching Image 1) */}
        <div className="sticky top-0 z-20 bg-[#f9f9f9] border-b-[3px] border-[#1a1c1c] px-4 py-2.5 flex items-center justify-between shadow-[0px_4px_0px_0px_rgba(0,0,0,0.1)]">
          <button
            id="modal-close-btn"
            type="button"
            onClick={onClose}
            className="flex items-center justify-center p-1.5 text-[#1a1c1c] hover:bg-[#e2e2e2] border-[2px] border-[#1a1c1c] neo-btn-sm"
            aria-label="Back"
          >
            <span className="material-symbols-outlined text-xl font-bold">arrow_back</span>
          </button>

          <h2 className="font-mono font-black text-lg md:text-xl uppercase tracking-tight text-[#1a1c1c]">
            {isEditing ? 'EDIT HACKATHON' : 'ADD HACKATHON'}
          </h2>

          <button
            id="modal-header-save-btn"
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="bg-[#ffd700] text-[#1a1c1c] px-3 py-1 border-[2px] border-[#1a1c1c] neo-btn-sm text-xs md:text-sm font-mono font-black uppercase flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-base">save</span>
            <span>{isSubmitting ? 'SAVING...' : 'SAVE'}</span>
          </button>
        </div>

        {/* Global Error Banner */}
        {formErrors.submit && (
          <div className="bg-[#ffdad6] border-b-[3px] border-[#ba1a1a] p-3 text-xs font-mono font-bold text-[#93000a] flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            <span>{formErrors.submit}</span>
          </div>
        )}

        {/* Main Form Body */}
        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-6">
          {/* SECTION 1: EVENT DETAILS */}
          <section className="border-[3px] border-[#1a1c1c] bg-[#ffffff] neo-shadow-sm flex flex-col">
            <div className="border-b-[3px] border-[#1a1c1c] bg-[#f3f3f3] px-3 py-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#705e00] text-lg font-bold">
                event_note
              </span>
              <h3 className="font-mono font-bold text-xs md:text-sm uppercase tracking-wider text-[#1a1c1c]">
                EVENT DETAILS
              </h3>
            </div>

            <div className="p-4 space-y-4">
              {/* Name */}
              <div>
                <label className="block font-mono text-xs font-bold uppercase mb-1 text-[#1a1c1c]">
                  NAME <span className="text-[#ba1a1a]">*</span>
                </label>
                <input
                  id="form-input-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Global Tech Challenge"
                  className={`neo-input w-full p-2.5 font-medium text-sm ${
                    formErrors.name ? 'border-[#ba1a1a] bg-[#ffdad6]/20' : ''
                  }`}
                />
                {formErrors.name && (
                  <p className="text-[#ba1a1a] text-xs font-mono mt-1 font-bold">
                    {formErrors.name}
                  </p>
                )}
              </div>

              {/* Mode Toggle (Online / In-Person) */}
              <div>
                <label className="block font-mono text-xs font-bold uppercase mb-1 text-[#1a1c1c]">
                  MODE
                </label>
                <div className="flex border-[3px] border-[#1a1c1c] bg-[#ffffff] overflow-hidden neo-shadow-sm">
                  <button
                    type="button"
                    id="mode-online-btn"
                    onClick={() => setFormData({ ...formData, mode: 'online' })}
                    className={`flex-1 py-2 text-center font-mono text-xs font-bold uppercase border-r-[3px] border-[#1a1c1c] transition-colors ${
                      formData.mode === 'online'
                        ? 'bg-[#ffd700] text-[#1a1c1c]'
                        : 'bg-[#ffffff] text-[#1a1c1c] hover:bg-[#eeeeee]'
                    }`}
                  >
                    ONLINE
                  </button>
                  <button
                    type="button"
                    id="mode-inperson-btn"
                    onClick={() => setFormData({ ...formData, mode: 'in-person' })}
                    className={`flex-1 py-2 text-center font-mono text-xs font-bold uppercase transition-colors ${
                      formData.mode === 'in-person'
                        ? 'bg-[#ffd700] text-[#1a1c1c]'
                        : 'bg-[#ffffff] text-[#1a1c1c] hover:bg-[#eeeeee]'
                    }`}
                  >
                    IN-PERSON
                  </button>
                </div>
              </div>

              {/* Venue */}
              <div>
                <label className="block font-mono text-xs font-bold uppercase mb-1 text-[#1a1c1c]">
                  VENUE / PLATFORM
                </label>
                <input
                  id="form-input-venue"
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  placeholder="e.g. San Francisco / Discord / Devpost"
                  className="neo-input w-full p-2.5 font-medium text-sm"
                />
              </div>

              {/* Link */}
              <div>
                <label className="block font-mono text-xs font-bold uppercase mb-1 text-[#1a1c1c]">
                  EVENT LINK
                </label>
                <input
                  id="form-input-link"
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="https://..."
                  className={`neo-input w-full p-2.5 font-medium text-sm ${
                    formErrors.link ? 'border-[#ba1a1a]' : ''
                  }`}
                />
                {formErrors.link && (
                  <p className="text-[#ba1a1a] text-xs font-mono mt-1 font-bold">
                    {formErrors.link}
                  </p>
                )}
              </div>

              {/* Tech Stack Tags */}
              <div>
                <label className="block font-mono text-xs font-bold uppercase mb-1 text-[#1a1c1c]">
                  TAGS / TECH STACK <span className="text-[#7e775f]">(Comma separated)</span>
                </label>
                <input
                  id="form-input-tags"
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="e.g. Solidity, React, AI, Python"
                  className="neo-input w-full p-2.5 font-mono text-xs font-bold uppercase"
                />
              </div>
            </div>
          </section>

          {/* SECTION 2: DATES & TIMES */}
          <section className="border-[3px] border-[#1a1c1c] bg-[#ffffff] neo-shadow-sm flex flex-col">
            <div className="border-b-[3px] border-[#1a1c1c] bg-[#f3f3f3] px-3 py-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ac2471] text-lg font-bold">
                calendar_clock
              </span>
              <h3 className="font-mono font-bold text-xs md:text-sm uppercase tracking-wider text-[#1a1c1c]">
                DATES &amp; TIMES
              </h3>
            </div>

            <div className="p-4 space-y-4">
              {/* Registration Deadline */}
              <div>
                <label className="block font-mono text-xs font-bold uppercase mb-1 text-[#1a1c1c]">
                  REGISTRATION DEADLINE
                </label>
                <input
                  id="form-input-reg-deadline"
                  type="datetime-local"
                  value={formData.registrationDeadline}
                  onChange={(e) =>
                    setFormData({ ...formData, registrationDeadline: e.target.value })
                  }
                  className="neo-input w-full p-2.5 font-mono text-sm"
                />
              </div>

              {/* Start & End Times Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs font-bold uppercase mb-1 text-[#ac2471]">
                    START TIME <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <input
                    id="form-input-start-time"
                    type="datetime-local"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className={`neo-input w-full p-2.5 font-mono text-sm ${
                      formErrors.startTime ? 'border-[#ba1a1a]' : ''
                    }`}
                  />
                  {formErrors.startTime && (
                    <p className="text-[#ba1a1a] text-xs font-mono mt-1 font-bold">
                      {formErrors.startTime}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-mono text-xs font-bold uppercase mb-1 text-[#1a1c1c]">
                    END TIME <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <input
                    id="form-input-end-time"
                    type="datetime-local"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className={`neo-input w-full p-2.5 font-mono text-sm ${
                      formErrors.endTime ? 'border-[#ba1a1a]' : ''
                    }`}
                  />
                  {formErrors.endTime && (
                    <p className="text-[#ba1a1a] text-xs font-mono mt-1 font-bold">
                      {formErrors.endTime}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: RESULTS (OPTIONAL) */}
          <section className="border-[3px] border-[#1a1c1c] bg-[#ffffff] neo-shadow-sm flex flex-col">
            <div className="border-b-[3px] border-[#1a1c1c] bg-[#e2e2e2] px-3 py-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006875] text-lg font-bold">
                emoji_events
              </span>
              <h3 className="font-mono font-bold text-xs md:text-sm uppercase tracking-wider text-[#1a1c1c]">
                RESULTS (OPTIONAL)
              </h3>
            </div>

            <div className="p-4 space-y-4">
              {/* Received Toggle */}
              <div>
                <label className="block font-mono text-xs font-bold uppercase mb-1 text-[#1a1c1c]">
                  RESULTS ANNOUNCED / RECEIVED?
                </label>
                <div className="flex border-[3px] border-[#1a1c1c] bg-[#ffffff] overflow-hidden neo-shadow-sm">
                  <button
                    type="button"
                    id="results-received-no"
                    onClick={() => setFormData({ ...formData, resultsReceived: false })}
                    className={`flex-1 py-2 text-center font-mono text-xs font-bold uppercase border-r-[3px] border-[#1a1c1c] transition-colors ${
                      !formData.resultsReceived
                        ? 'bg-[#fd68b3] text-[#1a1c1c]'
                        : 'bg-[#ffffff] text-[#1a1c1c] hover:bg-[#eeeeee]'
                    }`}
                  >
                    NO (PENDING)
                  </button>
                  <button
                    type="button"
                    id="results-received-yes"
                    onClick={() => setFormData({ ...formData, resultsReceived: true })}
                    className={`flex-1 py-2 text-center font-mono text-xs font-bold uppercase transition-colors ${
                      formData.resultsReceived
                        ? 'bg-[#72ebff] text-[#1a1c1c]'
                        : 'bg-[#ffffff] text-[#1a1c1c] hover:bg-[#eeeeee]'
                    }`}
                  >
                    YES (RECEIVED)
                  </button>
                </div>
              </div>

              {/* Outcome Select Dropdown */}
              {formData.resultsReceived && (
                <div>
                  <label className="block font-mono text-xs font-bold uppercase mb-1 text-[#1a1c1c]">
                    OUTCOME
                  </label>
                  <select
                    id="form-select-outcome"
                    value={formData.outcome}
                    onChange={(e) =>
                      setFormData({ ...formData, outcome: e.target.value as HackathonOutcome })
                    }
                    className="neo-input w-full p-2.5 font-mono text-sm font-bold uppercase bg-[#ffffff]"
                  >
                    <option value="won">🏆 1ST PLACE WINNER</option>
                    <option value="finalist">⭐ FINALIST / TOP 10</option>
                    <option value="participant">🎖️ PARTICIPANT</option>
                    <option value="pending">⏳ PENDING</option>
                  </select>
                </div>
              )}

              {/* Notes textarea */}
              <div>
                <label className="block font-mono text-xs font-bold uppercase mb-1 text-[#1a1c1c]">
                  NOTES / PROJECT DETAILS
                </label>
                <textarea
                  id="form-textarea-notes"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Project details, team members, feedback, submission link..."
                  className="neo-input w-full p-2.5 font-medium text-sm"
                ></textarea>
              </div>
            </div>
          </section>

          {/* Bottom Submit Button */}
          <div className="pt-2">
            <button
              id="form-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#ffd700] text-[#1a1c1c] font-black text-base md:text-lg py-3 px-6 neo-btn uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-2xl font-black">
                {isEditing ? 'check_circle' : 'add_circle'}
              </span>
              <span>{isSubmitting ? 'PROCESSING...' : isEditing ? 'SAVE CHANGES' : 'ADD HACKATHON'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
