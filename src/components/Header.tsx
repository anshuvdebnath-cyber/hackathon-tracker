import React from 'react';
import { ActiveNavView } from '../types';

interface HeaderProps {
  currentView: ActiveNavView;
  setCurrentView: (v: ActiveNavView) => void;
  canInstallPwa: boolean;
  onInstallPwa: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  canInstallPwa,
  onInstallPwa,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header
      id="app-header"
      className="w-full sticky top-0 z-40 bg-[#f9f9f9] border-b-[3px] border-[#1a1c1c] shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] px-4 py-3 flex items-center justify-between"
    >
      {/* Brand logo & Terminal Title */}
      <div
        id="header-brand-btn"
        onClick={() => setCurrentView('dashboard')}
        className="flex items-center gap-2 cursor-pointer select-none group"
      >
        <div className="w-9 h-9 bg-[#ffd700] border-[2px] border-[#1a1c1c] neo-shadow-sm group-hover:-translate-y-0.5 transition-transform flex items-center justify-center overflow-hidden shrink-0">
          <img src="/icons/icon-192.png" alt="HACK.TRACK Logo" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col">
          <h1 className="font-extrabold text-xl md:text-2xl tracking-tighter uppercase leading-none text-[#1a1c1c]">
            HACK.TRACK
          </h1>
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#705e00] uppercase">
            PWA // V1.0.4
          </span>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Quick Sound Toggle */}
        <button
          id="sound-toggle-btn"
          onClick={onToggleSound}
          title={soundEnabled ? 'Sound Effects Enabled' : 'Sound Effects Muted'}
          className={`p-1.5 md:px-2.5 md:py-1 border-[2px] border-[#1a1c1c] neo-btn-sm text-xs font-mono font-bold uppercase flex items-center gap-1 ${
            soundEnabled ? 'bg-[#ffe16d] text-[#1a1c1c]' : 'bg-[#e2e2e2] text-[#7e775f]'
          }`}
        >
          <span className="material-symbols-outlined text-base">
            {soundEnabled ? 'volume_up' : 'volume_off'}
          </span>
          <span className="hidden sm:inline">{soundEnabled ? 'SFX ON' : 'MUTED'}</span>
        </button>

        {/* PWA Install Button in Header */}
        {canInstallPwa && (
          <button
            id="header-install-btn"
            onClick={onInstallPwa}
            className="bg-[#fd68b3] text-[#1a1c1c] px-3 py-1 border-[2px] border-[#1a1c1c] neo-btn-sm text-xs font-bold uppercase tracking-tight flex items-center gap-1.5 animate-pulse"
          >
            <span className="material-symbols-outlined text-base">download</span>
            <span className="hidden sm:inline">INSTALL APP</span>
          </button>
        )}

        {/* Add Hackathon CTA (Desktop Header) */}
        <button
          id="header-add-btn"
          onClick={() => setCurrentView('add')}
          className="bg-[#ffd700] text-[#1a1c1c] px-3 py-1.5 border-[2px] border-[#1a1c1c] neo-btn-sm text-xs md:text-sm font-bold uppercase tracking-wider flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-base font-black">add</span>
          <span>ADD EVENT</span>
        </button>

        {/* Settings button */}
        <button
          id="header-settings-btn"
          onClick={() => setCurrentView('settings')}
          className={`p-1.5 md:p-2 border-[2px] border-[#1a1c1c] neo-btn-sm flex items-center justify-center ${
            currentView === 'settings' ? 'bg-[#ffd700]' : 'bg-[#ffffff]'
          }`}
          aria-label="Settings"
        >
          <span className="material-symbols-outlined text-xl">settings</span>
        </button>
      </div>
    </header>
  );
};
