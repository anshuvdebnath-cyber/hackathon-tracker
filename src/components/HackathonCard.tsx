import React, { useState, useEffect } from 'react';
import { Hackathon } from '../types';
import { getCountdown, formatDateRange } from '../utils';

interface HackathonCardProps {
  hackathon: Hackathon;
  onViewDetails: (h: Hackathon) => void;
  onEdit: (h: Hackathon) => void;
  onDelete: (id: string, name: string) => void;
}

export const HackathonCard: React.FC<HackathonCardProps> = ({
  hackathon,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  // Real-time ticking countdown
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
  }, [hackathon.registrationDeadline, hackathon.startTime, hackathon.endTime, hackathon.status]);

  // Status-specific badges
  const isOngoing = hackathon.status === 'ongoing';
  const isUpcoming = hackathon.status === 'upcoming';
  const isCompleted = hackathon.status === 'completed';

  return (
    <article
      id={`hackathon-card-${hackathon.id}`}
      className={`border-[3px] border-[#1a1c1c] neo-shadow-lg flex flex-col relative transition-all duration-150 group ${
        isCompleted ? 'bg-[#f3f3f3] opacity-95' : 'bg-[#ffffff]'
      }`}
    >
      {/* Top Banner Status Tag */}
      <div className="flex items-center justify-between border-b-[3px] border-[#1a1c1c] bg-[#eeeeee] px-3 py-1.5">
        {/* Mode Pill */}
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase bg-[#ffffff] border-[2px] border-[#1a1c1c] px-2 py-0.5 shadow-[2px_2px_0px_0px_#1a1c1c]">
          <span className="material-symbols-outlined text-sm leading-none">
            {hackathon.mode === 'online' ? 'wifi' : 'location_city'}
          </span>
          <span>{hackathon.mode}</span>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-1.5">
          {isOngoing && (
            <div className="bg-[#ffd700] text-[#1a1c1c] font-mono text-[11px] font-black uppercase px-2 py-0.5 border-[2px] border-[#1a1c1c] flex items-center gap-1.5 neo-pulse-ongoing">
              <span className="w-2.5 h-2.5 bg-[#ba1a1a] rounded-full animate-ping"></span>
              ONGOING
            </div>
          )}
          {isUpcoming && (
            <div className="bg-[#ffe16d] text-[#1a1c1c] font-mono text-[11px] font-bold uppercase px-2 py-0.5 border-[2px] border-[#1a1c1c]">
              UPCOMING
            </div>
          )}
          {isCompleted && (
            <div className="bg-[#dadada] text-[#4d4732] font-mono text-[11px] font-bold uppercase px-2 py-0.5 border-[2px] border-[#1a1c1c]">
              COMPLETED
            </div>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        {/* Title and Date Range */}
        <div>
          <h3
            onClick={() => onViewDetails(hackathon)}
            className={`font-black text-lg md:text-xl text-[#1a1c1c] tracking-tight uppercase cursor-pointer hover:underline decoration-3 underline-offset-2 ${
              isCompleted && hackathon.outcome === 'participant' ? 'line-through decoration-[#7e775f]' : ''
            }`}
          >
            {hackathon.name}
          </h3>

          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#705e00] mt-1">
            <span className="material-symbols-outlined text-sm">calendar_month</span>
            <span>{formatDateRange(hackathon.startTime, hackathon.endTime)}</span>
            {hackathon.venue && (
              <span className="text-[#4d4732] truncate">· {hackathon.venue}</span>
            )}
          </div>
        </div>

        {/* Outcome Badges for winners/finalists */}
        {hackathon.resultsReceived && hackathon.outcome !== 'pending' && (
          <div className="my-1">
            {hackathon.outcome === 'won' && (
              <div className="bg-[#ffd700] text-[#1a1c1c] border-[3px] border-[#1a1c1c] px-3 py-1.5 font-mono text-xs md:text-sm font-black uppercase tracking-wider flex items-center gap-2 neo-shadow-sm rotate-[-1deg]">
                <span className="text-base">🏆</span>
                <span>1ST PLACE WINNER!!!</span>
              </div>
            )}
            {hackathon.outcome === 'finalist' && (
              <div className="bg-[#fd68b3] text-[#1a1c1c] border-[3px] border-[#1a1c1c] px-3 py-1.5 font-mono text-xs md:text-sm font-black uppercase tracking-wider flex items-center gap-2 neo-shadow-sm rotate-[1deg]">
                <span className="text-base">⭐</span>
                <span>!!! FINALIST !!!</span>
              </div>
            )}
            {hackathon.outcome === 'participant' && (
              <div className="bg-[#72ebff] text-[#1a1c1c] border-[2px] border-[#1a1c1c] px-2 py-0.5 font-mono text-xs font-bold uppercase inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <span>PARTICIPATED</span>
              </div>
            )}
          </div>
        )}

        {/* Description / Notes snippet */}
        {hackathon.notes && (
          <p className="text-xs text-[#4d4732] line-clamp-2 font-medium">
            {hackathon.notes}
          </p>
        )}

        {/* Tech Stack / Tags */}
        {hackathon.tags && hackathon.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {hackathon.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 text-[11px] font-mono font-bold uppercase border-[2px] border-[#1a1c1c] bg-[#f9f9f9] text-[#1a1c1c]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Countdown Timer Block (for Upcoming & Ongoing) */}
        {!isCompleted && (
          <div className="mt-auto pt-2">
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#1a1c1c] mb-1 flex items-center justify-between">
              <span>{isOngoing ? '⏱️ HACKING ENDS IN:' : '⏳ UNTIL REG CLOSES:'}</span>
              {countdown.isExpired && <span className="text-[#ba1a1a]">PASSED</span>}
            </div>

            <div className="grid grid-cols-4 gap-1.5 text-center bg-[#1a1c1c] p-1.5 border-[2px] border-[#1a1c1c]">
              <div className="bg-[#ffffff] border-[1.5px] border-[#1a1c1c] p-1">
                <div className="font-mono text-sm md:text-base font-black leading-tight">
                  {String(countdown.days).padStart(2, '0')}
                </div>
                <div className="text-[9px] font-mono font-bold uppercase text-[#4d4732]">DAYS</div>
              </div>
              <div className="bg-[#ffffff] border-[1.5px] border-[#1a1c1c] p-1">
                <div className="font-mono text-sm md:text-base font-black leading-tight">
                  {String(countdown.hours).padStart(2, '0')}
                </div>
                <div className="text-[9px] font-mono font-bold uppercase text-[#4d4732]">HRS</div>
              </div>
              <div className="bg-[#ffffff] border-[1.5px] border-[#1a1c1c] p-1">
                <div className="font-mono text-sm md:text-base font-black leading-tight">
                  {String(countdown.minutes).padStart(2, '0')}
                </div>
                <div className="text-[9px] font-mono font-bold uppercase text-[#4d4732]">MIN</div>
              </div>
              <div className="bg-[#ffffff] border-[1.5px] border-[#1a1c1c] p-1">
                <div className="font-mono text-sm md:text-base font-black text-[#ba1a1a] leading-tight animate-pulse">
                  {String(countdown.seconds).padStart(2, '0')}
                </div>
                <div className="text-[9px] font-mono font-bold uppercase text-[#4d4732]">SEC</div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons Toolbar */}
        <div className="pt-3 border-t-[2px] border-[#1a1c1c] flex items-center justify-between gap-2 mt-1">
          {/* Main Card Action */}
          <button
            id={`card-view-btn-${hackathon.id}`}
            onClick={() => onViewDetails(hackathon)}
            className="flex-1 bg-[#ffd700] text-[#1a1c1c] py-1.5 px-3 border-[2px] border-[#1a1c1c] neo-btn-sm text-xs font-mono font-bold uppercase flex items-center justify-center gap-1"
          >
            <span>{isCompleted ? 'VIEW RESULT' : 'VIEW DETAILS'}</span>
            <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
          </button>

          {/* Quick Edit */}
          <button
            id={`card-edit-btn-${hackathon.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(hackathon);
            }}
            className="p-1.5 bg-[#ffffff] text-[#1a1c1c] border-[2px] border-[#1a1c1c] neo-btn-sm hover:bg-[#ffe16d]"
            title="Edit Hackathon"
            aria-label="Edit"
          >
            <span className="material-symbols-outlined text-base">edit</span>
          </button>

          {/* Quick Delete */}
          <button
            id={`card-delete-btn-${hackathon.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(hackathon.id, hackathon.name);
            }}
            className="p-1.5 bg-[#ffffff] text-[#ba1a1a] border-[2px] border-[#1a1c1c] neo-btn-sm hover:bg-[#ffdad6]"
            title="Delete Hackathon"
            aria-label="Delete"
          >
            <span className="material-symbols-outlined text-base">delete</span>
          </button>
        </div>
      </div>
    </article>
  );
};
