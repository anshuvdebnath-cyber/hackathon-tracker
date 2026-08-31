import React, { useState, useEffect } from 'react';
import { Hackathon } from '../types';
import { getCountdown, formatDateRange, formatDateTime } from '../utils';

interface DetailModalProps {
  hackathon: Hackathon | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (h: Hackathon) => void;
  onDelete: (id: string, name: string) => void;
  onSetReminder: (h: Hackathon) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  hackathon,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onSetReminder,
}) => {
  if (!isOpen || !hackathon) return null;

  // Countdown timer for detail view
  const [countdown, setCountdown] = useState(() =>
    getCountdown(
      hackathon.status === 'upcoming'
        ? hackathon.registrationDeadline || hackathon.startTime
        : hackathon.endTime
    )
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(
        getCountdown(
          hackathon.status === 'upcoming'
            ? hackathon.registrationDeadline || hackathon.startTime
            : hackathon.endTime
        )
      );
    }, 1000);
    return () => clearInterval(timer);
  }, [hackathon]);

  const isOngoing = hackathon.status === 'ongoing';
  const isUpcoming = hackathon.status === 'upcoming';
  const isCompleted = hackathon.status === 'completed';

  return (
    <div
      id="detail-modal-backdrop"
      className="fixed inset-0 z-50 bg-[#1a1c1c]/80 overflow-y-auto flex items-start justify-center p-2 sm:p-4 backdrop-blur-xs"
    >
      <div
        id="detail-modal-card"
        className="w-full max-w-lg bg-[#f9f9f9] border-[3px] border-[#1a1c1c] neo-shadow-xl my-4 sm:my-8 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Top Navigation Bar (Matching Image 9) */}
        <header className="sticky top-0 z-20 bg-[#f9f9f9] border-b-[3px] border-[#1a1c1c] px-4 py-2.5 flex items-center justify-between shadow-[0px_4px_0px_0px_rgba(0,0,0,0.1)]">
          <button
            id="detail-back-btn"
            onClick={onClose}
            aria-label="Go Back"
            className="text-[#1a1c1c] p-1.5 hover:bg-[#e2e2e2] border-[2px] border-[#1a1c1c] neo-btn-sm"
          >
            <span className="material-symbols-outlined text-xl font-bold">arrow_back</span>
          </button>

          <div className="flex gap-2">
            <button
              id="detail-edit-btn"
              onClick={() => onEdit(hackathon)}
              className="text-[#1a1c1c] px-3 py-1 bg-[#ffffff] border-[2px] border-[#1a1c1c] neo-btn-sm font-mono text-xs font-black uppercase flex items-center gap-1 hover:bg-[#ffe16d]"
            >
              <span className="material-symbols-outlined text-base">edit</span>
              <span>EDIT</span>
            </button>

            <button
              id="detail-delete-btn"
              onClick={() => onDelete(hackathon.id, hackathon.name)}
              className="text-[#ba1a1a] px-3 py-1 bg-[#ffffff] border-[2px] border-[#1a1c1c] neo-btn-sm font-mono text-xs font-black uppercase flex items-center gap-1 hover:bg-[#ffdad6]"
            >
              <span className="material-symbols-outlined text-base">delete</span>
              <span>DEL</span>
            </button>
          </div>
        </header>

        {/* Content Container */}
        <main className="p-4 sm:p-5 flex flex-col gap-4">
          {/* HERO CARD */}
          <article className="bg-[#ffffff] border-[3px] border-[#1a1c1c] neo-shadow-lg flex flex-col overflow-hidden">
            {/* Top Status Header */}
            <div className="bg-[#ffd700] border-b-[3px] border-[#1a1c1c] px-3 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full border border-[#1a1c1c] ${
                    isOngoing ? 'bg-[#ba1a1a] animate-ping' : isUpcoming ? 'bg-[#705e00]' : 'bg-[#7e775f]'
                  }`}
                ></div>
                <span className="font-mono text-xs font-black uppercase tracking-wider text-[#1a1c1c]">
                  {hackathon.status}
                </span>
              </div>

              <span className="text-xs font-mono font-bold text-[#705e00]">
                ID: {hackathon.id}
              </span>
            </div>

            {/* Hero Body */}
            <div className="p-4 flex flex-col gap-3">
              <h1 className="font-black text-2xl md:text-3xl text-[#1a1c1c] uppercase tracking-tight leading-tight">
                {hackathon.name}
              </h1>

              {/* Meta Pills */}
              <div className="flex flex-wrap gap-2">
                <span className="border-[2px] border-[#1a1c1c] bg-[#eeeeee] px-2.5 py-1 font-mono text-xs font-bold uppercase flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">
                    {hackathon.mode === 'online' ? 'language' : 'location_on'}
                  </span>
                  <span>{hackathon.mode}</span>
                </span>

                <span className="border-[2px] border-[#1a1c1c] bg-[#72ebff] text-[#001f24] px-2.5 py-1 font-mono text-xs font-bold uppercase flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">calendar_month</span>
                  <span>{formatDateRange(hackathon.startTime, hackathon.endTime)}</span>
                </span>
              </div>

              {hackathon.venue && (
                <div className="text-xs font-mono font-bold text-[#4d4732] flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">pin_drop</span>
                  <span>{hackathon.venue}</span>
                </div>
              )}

              {/* Event Link */}
              {hackathon.link && (
                <a
                  id="detail-event-link"
                  href={hackathon.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#1a1c1c] bg-[#ffe16d] hover:bg-[#ffd700] px-3 py-1.5 border-[2px] border-[#1a1c1c] neo-btn-sm w-fit"
                >
                  <span className="material-symbols-outlined text-sm">link</span>
                  <span>{hackathon.link.replace(/^https?:\/\//, '')}</span>
                  <span className="material-symbols-outlined text-xs">open_in_new</span>
                </a>
              )}
            </div>
          </article>

          {/* OUTCOME BANNER */}
          {hackathon.resultsReceived && hackathon.outcome !== 'pending' && (
            <section
              className={`border-[3px] border-[#1a1c1c] p-4 flex items-center justify-center neo-shadow-lg ${
                hackathon.outcome === 'won'
                  ? 'bg-[#ffd700] text-[#1a1c1c]'
                  : hackathon.outcome === 'finalist'
                  ? 'bg-[#fd68b3] text-[#1a1c1c]'
                  : hackathon.outcome === 'participant'
                  ? 'bg-[#72ebff] text-[#1a1c1c]'
                  : hackathon.outcome === 'failed'
                  ? 'bg-[#ffdad6] text-[#93000a] border-[#ba1a1a]'
                  : 'bg-[#2f3131] text-[#ffb4ab]'
              }`}
            >
              <h2 className="font-mono font-black text-xl md:text-2xl uppercase tracking-tighter text-center flex items-center gap-2">
                <span>
                  {hackathon.outcome === 'won' && '🏆 1ST PLACE WINNER!!!'}
                  {hackathon.outcome === 'finalist' && '⭐ FINALIST / TOP 10!!!'}
                  {hackathon.outcome === 'participant' && '🎖️ PARTICIPATED'}
                  {hackathon.outcome === 'failed' && '❌ FAILED / ELIMINATED'}
                  {hackathon.outcome === 'disqualified' && '🚫 DISQUALIFIED'}
                </span>
              </h2>
            </section>
          )}

          {/* COUNTDOWN TIMER SECTION */}
          {!isCompleted && (
            <section className="bg-[#f3f3f3] border-[3px] border-[#1a1c1c] p-4 flex flex-col gap-3 neo-shadow-lg">
              <h3 className="font-mono text-xs font-black uppercase text-[#1a1c1c] tracking-widest text-center">
                {isOngoing ? 'UNTIL HACKATHON CONCLUDES' : 'UNTIL REGISTRATION CLOSES'}
              </h3>

              <div className="flex justify-center gap-2 items-center">
                <div className="flex flex-col items-center">
                  <div className="bg-[#ffffff] border-[2px] border-[#1a1c1c] px-3 py-1.5 neo-shadow-sm font-mono text-xl font-black text-center min-w-[54px]">
                    {String(countdown.days).padStart(2, '0')}
                  </div>
                  <span className="font-mono text-[10px] font-bold uppercase mt-1">D</span>
                </div>
                <div className="font-mono text-xl font-black -mt-4">:</div>
                <div className="flex flex-col items-center">
                  <div className="bg-[#ffffff] border-[2px] border-[#1a1c1c] px-3 py-1.5 neo-shadow-sm font-mono text-xl font-black text-center min-w-[54px]">
                    {String(countdown.hours).padStart(2, '0')}
                  </div>
                  <span className="font-mono text-[10px] font-bold uppercase mt-1">H</span>
                </div>
                <div className="font-mono text-xl font-black -mt-4">:</div>
                <div className="flex flex-col items-center">
                  <div className="bg-[#ffffff] border-[2px] border-[#1a1c1c] px-3 py-1.5 neo-shadow-sm font-mono text-xl font-black text-center min-w-[54px]">
                    {String(countdown.minutes).padStart(2, '0')}
                  </div>
                  <span className="font-mono text-[10px] font-bold uppercase mt-1">M</span>
                </div>
                <div className="font-mono text-xl font-black -mt-4">:</div>
                <div className="flex flex-col items-center">
                  <div className="bg-[#ffffff] border-[2px] border-[#1a1c1c] px-3 py-1.5 neo-shadow-sm font-mono text-xl font-black text-[#ba1a1a] text-center min-w-[54px] animate-pulse">
                    {String(countdown.seconds).padStart(2, '0')}
                  </div>
                  <span className="font-mono text-[10px] font-bold uppercase mt-1">S</span>
                </div>
              </div>

              {/* Set Reminder CTA */}
              <button
                id="detail-reminder-btn"
                onClick={() => onSetReminder(hackathon)}
                className="w-full bg-[#1a1c1c] text-[#f9f9f9] py-2.5 px-4 border-[2px] border-[#1a1c1c] neo-btn-sm font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#2f3131]"
              >
                <span className="material-symbols-outlined text-base text-[#ffd700]">
                  notifications_active
                </span>
                <span>SET REMINDER ALERT</span>
              </button>
            </section>
          )}

          {/* TIMELINE SECTION (Matching Image 9) */}
          <section className="bg-[#ffffff] border-[3px] border-[#1a1c1c] neo-shadow-lg p-4 flex flex-col gap-4 relative overflow-hidden">
            <h3 className="font-mono text-xs font-bold uppercase text-[#705e00] tracking-wider border-b-[2px] border-[#1a1c1c] pb-1">
              EVENT TIMELINE
            </h3>

            <div className="relative pl-6 space-y-4">
              {/* Vertical connecting bar */}
              <div className="absolute left-[11px] top-2 bottom-2 w-1 bg-[#1a1c1c] z-0"></div>

              {/* Step 1: Registration */}
              <div className="relative z-10 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full border-[2px] border-[#1a1c1c] bg-[#ffd700] shrink-0 -ml-[19px] mt-0.5 flex items-center justify-center">
                  <span className="w-2 h-2 bg-[#1a1c1c] rounded-full"></span>
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-xs font-bold uppercase text-[#1a1c1c]">
                    Registration Closes
                  </span>
                  <span className="font-mono text-xs text-[#4d4732]">
                    {formatDateTime(hackathon.registrationDeadline || hackathon.startTime)}
                  </span>
                </div>
              </div>

              {/* Step 2: Hack Starts */}
              <div className="relative z-10 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full border-[2px] border-[#1a1c1c] bg-[#ffe16d] shrink-0 -ml-[19px] mt-0.5 flex items-center justify-center">
                  <span className="w-2 h-2 bg-[#1a1c1c] rounded-full"></span>
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-xs font-bold uppercase text-[#1a1c1c]">
                    Hackathon Kickoff
                  </span>
                  <span className="font-mono text-xs text-[#4d4732]">
                    {formatDateTime(hackathon.startTime)}
                  </span>
                </div>
              </div>

              {/* Step 3: Project Due */}
              <div className="relative z-10 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full border-[2px] border-[#1a1c1c] bg-[#dadada] shrink-0 -ml-[19px] mt-0.5 flex items-center justify-center">
                  <span className="w-2 h-2 bg-[#1a1c1c] rounded-full"></span>
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-xs font-bold uppercase text-[#1a1c1c]">
                    Project Submission Due
                  </span>
                  <span className="font-mono text-xs text-[#4d4732]">
                    {formatDateTime(hackathon.endTime)}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* NOTES & TECH STACK */}
          {hackathon.notes && (
            <section className="bg-[#ffffff] border-[3px] border-[#1a1c1c] neo-shadow-sm p-4 flex flex-col gap-2">
              <h3 className="font-mono text-xs font-bold uppercase text-[#1a1c1c] border-b border-[#eeeeee] pb-1">
                PROJECT NOTES &amp; FEEDBACK
              </h3>
              <p className="text-xs md:text-sm text-[#1a1c1c] whitespace-pre-wrap font-medium">
                {hackathon.notes}
              </p>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};
