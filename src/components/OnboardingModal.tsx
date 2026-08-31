import React from 'react';

interface OnboardingModalProps {
  isOpen: boolean;
  onGetStarted: () => void;
  onInstallPwa: () => void;
  canInstallPwa: boolean;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onGetStarted,
  onInstallPwa,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="onboarding-modal-backdrop"
      className="fixed inset-0 z-50 bg-[#1a1c1c]/90 overflow-y-auto flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs"
    >
      <div
        id="onboarding-modal-card"
        className="w-full max-w-md bg-[#f9f9f9] border-[4px] border-[#1a1c1c] neo-shadow-xl flex flex-col relative overflow-hidden p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Background Dot Pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'radial-gradient(#1a1c1c 2px, transparent 2px)',
            backgroundSize: '20px 20px',
          }}
        ></div>

        {/* Top Rotated Version Tag (Matching Image 7) */}
        <div className="absolute top-4 right-4 z-10 bg-[#ffd700] text-[#1a1c1c] border-[3px] border-[#1a1c1c] px-3 py-1 font-mono text-xs font-black shadow-[3px_3px_0px_0px_#1a1c1c] rotate-[-8deg] select-none">
          <span>v1.0.4</span>
        </div>

        {/* Big Emoji Trophy */}
        <div className="text-6xl sm:text-7xl select-none mb-2 z-10 filter drop-shadow-[3px_3px_0_#1a1c1c]">
          🏆
        </div>

        {/* Title */}
        <div className="z-10 mb-6">
          <h1 className="font-extrabold text-3xl sm:text-4xl uppercase text-[#1a1c1c] tracking-tight leading-none">
            HACKATHON<br />TRACKER
          </h1>
          <p className="font-mono text-xs font-bold text-[#705e00] mt-1.5 uppercase">
            PLAN, BUILD, SUBMIT &amp; CONQUER
          </p>
        </div>

        {/* Feature Bullets (Matching Image 7) */}
        <div className="flex flex-col gap-3 z-10 mb-8">
          <div className="flex items-center gap-3 p-3 bg-[#ffffff] border-[3px] border-[#1a1c1c] neo-shadow-sm">
            <span className="material-symbols-outlined text-2xl text-[#705e00] font-bold">
              timer
            </span>
            <span className="font-mono font-black text-sm uppercase text-[#1a1c1c]">
              TRACK DEADLINES
            </span>
          </div>

          <div className="flex items-center gap-3 p-3 bg-[#ffffff] border-[3px] border-[#1a1c1c] neo-shadow-sm">
            <span className="material-symbols-outlined text-2xl text-[#ac2471] font-bold">
              notifications_active
            </span>
            <span className="font-mono font-black text-sm uppercase text-[#1a1c1c]">
              GET NOTIFIED
            </span>
          </div>

          <div className="flex items-center gap-3 p-3 bg-[#ffffff] border-[3px] border-[#1a1c1c] neo-shadow-sm">
            <span className="material-symbols-outlined text-2xl text-[#006875] font-bold">
              install_mobile
            </span>
            <span className="font-mono font-black text-sm uppercase text-[#1a1c1c]">
              INSTALL ON PHONE
            </span>
          </div>
        </div>

        {/* CTAs (Matching Image 7) */}
        <div className="flex flex-col gap-2.5 z-10">
          <button
            id="onboarding-start-btn"
            onClick={onGetStarted}
            className="w-full py-3.5 px-4 bg-[#ffd700] text-[#1a1c1c] border-[3px] border-[#1a1c1c] neo-btn font-mono font-black text-base uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <span>GET STARTED</span>
            <span className="material-symbols-outlined text-xl font-bold">arrow_forward</span>
          </button>

          <button
            id="onboarding-install-btn"
            onClick={onInstallPwa}
            className="w-full py-2.5 px-4 bg-[#e2e2e2] text-[#1a1c1c] border-[3px] border-[#1a1c1c] neo-btn-sm font-mono font-bold text-xs uppercase tracking-wider"
          >
            INSTALL APP (PWA)
          </button>

          <button
            id="onboarding-skip-btn"
            onClick={onGetStarted}
            className="w-full py-1.5 text-center font-mono text-xs font-bold text-[#4d4732] hover:text-[#1a1c1c] underline uppercase tracking-wider mt-1"
          >
            SKIP INTRODUCTION
          </button>
        </div>
      </div>
    </div>
  );
};
