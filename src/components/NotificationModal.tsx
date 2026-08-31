import React from 'react';

interface NotificationModalProps {
  isOpen: boolean;
  onAllow: () => void;
  onDismiss: () => void;
  targetHackathonName?: string;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onAllow,
  onDismiss,
  targetHackathonName,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="notification-modal-backdrop"
      className="fixed inset-0 z-50 bg-[#1a1c1c]/80 flex items-center justify-center p-4 backdrop-blur-xs"
    >
      <div
        id="notification-modal-card"
        className="bg-[#ffffff] border-[3px] border-[#1a1c1c] neo-shadow-xl max-w-md w-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Modal Header (Matching Image 5) */}
        <div className="bg-[#ffd700] border-b-[3px] border-[#1a1c1c] px-4 py-2.5 flex justify-between items-center">
          <div className="flex items-center gap-2 text-[#1a1c1c]">
            <span className="material-symbols-outlined text-xl font-bold">
              notifications_active
            </span>
            <h3 className="font-mono font-black text-sm uppercase tracking-wider">
              ENABLE ALERTS
            </h3>
          </div>

          <button
            id="notification-modal-close"
            onClick={onDismiss}
            className="text-[#1a1c1c] hover:text-[#ba1a1a]"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 flex flex-col gap-3">
          <p className="font-extrabold text-base uppercase tracking-tight text-[#1a1c1c]">
            {targetHackathonName
              ? `SET REMINDER FOR ${targetHackathonName.toUpperCase()}`
              : 'NEVER MISS A REGISTRATION DEADLINE OR KICKOFF'}
          </p>

          <p className="text-xs font-mono text-[#4d4732] leading-relaxed">
            Allow system notifications to receive real-time deadline warnings, live countdown tickers, and submission milestone alerts.
          </p>

          {/* Action Buttons (Matching Image 5) */}
          <div className="flex flex-col sm:flex-row gap-2 mt-3">
            <button
              id="notification-dismiss-btn"
              onClick={onDismiss}
              className="flex-1 bg-[#ffffff] border-[2px] border-[#1a1c1c] py-2 px-3 font-mono text-xs font-bold uppercase text-[#1a1c1c] hover:bg-[#e2e2e2] neo-btn-sm"
            >
              DISMISS
            </button>

            <button
              id="notification-allow-btn"
              onClick={onAllow}
              className="flex-1 bg-[#ffd700] border-[2px] border-[#1a1c1c] py-2 px-3 font-mono text-xs font-black uppercase text-[#1a1c1c] neo-btn-sm flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">notifications_active</span>
              <span>ALLOW NOTIFICATIONS</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
