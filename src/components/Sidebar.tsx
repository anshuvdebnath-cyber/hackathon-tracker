import React from 'react';
import { ActiveNavView } from '../types';

interface SidebarProps {
  currentView: ActiveNavView;
  setCurrentView: (view: ActiveNavView) => void;
  hackathonCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  hackathonCount,
}) => {
  return (
    <aside
      id="desktop-sidebar"
      className="hidden md:flex flex-col w-60 bg-[#1a1c1c] text-[#f9f9f9] sticky top-[61px] h-[calc(100vh-61px)] border-r-[3px] border-[#1a1c1c] p-4 gap-4 z-30 select-none"
    >
      {/* Brand Mini Header */}
      <div className="pb-3 border-b-[2px] border-[#4d4732] flex items-center justify-between">
        <span className="font-mono text-xs font-bold uppercase text-[#ffe16d] tracking-wider">
          NAVIGATION
        </span>
        <span className="bg-[#ffe16d] text-[#1a1c1c] px-1.5 py-0.5 text-[11px] font-mono font-black border border-[#1a1c1c]">
          {hackathonCount} TRACKED
        </span>
      </div>

      {/* Nav links with high contrast neo-brutalist styling */}
      <nav className="flex flex-col gap-2">
        <button
          id="nav-home-btn"
          onClick={() => setCurrentView('dashboard')}
          className={`flex items-center gap-3 px-3 py-2.5 font-mono text-sm font-bold uppercase tracking-wider border-[2px] transition-all text-left ${
            currentView === 'dashboard'
              ? 'bg-[#ffd700] text-[#1a1c1c] border-[#f9f9f9] shadow-[4px_4px_0px_0px_#f9f9f9] -translate-x-0.5 -translate-y-0.5'
              : 'text-[#f9f9f9] border-transparent hover:bg-[#2f3131] hover:border-[#ffe16d]'
          }`}
        >
          <span className="material-symbols-outlined text-xl">home</span>
          HOME
        </button>

        <button
          id="nav-add-btn"
          onClick={() => setCurrentView('add')}
          className={`flex items-center gap-3 px-3 py-2.5 font-mono text-sm font-bold uppercase tracking-wider border-[2px] transition-all text-left ${
            currentView === 'add'
              ? 'bg-[#ffd700] text-[#1a1c1c] border-[#f9f9f9] shadow-[4px_4px_0px_0px_#f9f9f9] -translate-x-0.5 -translate-y-0.5'
              : 'text-[#f9f9f9] border-transparent hover:bg-[#2f3131] hover:border-[#ffe16d]'
          }`}
        >
          <span className="material-symbols-outlined text-xl">add_box</span>
          ADD EVENT
        </button>

        <button
          id="nav-settings-btn"
          onClick={() => setCurrentView('settings')}
          className={`flex items-center gap-3 px-3 py-2.5 font-mono text-sm font-bold uppercase tracking-wider border-[2px] transition-all text-left ${
            currentView === 'settings'
              ? 'bg-[#ffd700] text-[#1a1c1c] border-[#f9f9f9] shadow-[4px_4px_0px_0px_#f9f9f9] -translate-x-0.5 -translate-y-0.5'
              : 'text-[#f9f9f9] border-transparent hover:bg-[#2f3131] hover:border-[#ffe16d]'
          }`}
        >
          <span className="material-symbols-outlined text-xl">settings</span>
          SETTINGS
        </button>
      </nav>

      {/* Terminal info footer badge */}
      <div className="mt-auto pt-4 border-t-[2px] border-[#4d4732] flex flex-col gap-2">
        <div className="p-2.5 bg-[#2f3131] border border-[#7e775f] text-xs font-mono">
          <div className="text-[#ffe16d] font-bold">● NODE / EXPRESS</div>
          <div className="text-[#d0c6ab] text-[11px]">Storage: Memory / JSON</div>
          <div className="text-[#72ebff] text-[10px] mt-1">Status: Operational</div>
        </div>

        <button
          id="nav-onboarding-btn"
          onClick={() => setCurrentView('onboarding')}
          className="text-xs font-mono text-[#d0c6ab] hover:text-[#ffd700] underline uppercase text-left py-1"
        >
          View Onboarding Tour
        </button>
      </div>
    </aside>
  );
};
