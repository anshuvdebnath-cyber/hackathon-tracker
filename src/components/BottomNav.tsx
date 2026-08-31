import React from 'react';
import { ActiveNavView } from '../types';

interface BottomNavProps {
  currentView: ActiveNavView;
  setCurrentView: (view: ActiveNavView) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, setCurrentView }) => {
  return (
    <nav
      id="mobile-bottom-nav"
      className="fixed bottom-0 left-0 w-full z-40 bg-[#f9f9f9] border-t-[3px] border-[#1a1c1c] shadow-[0px_-4px_0px_0px_rgba(0,0,0,1)] flex items-stretch h-[calc(3.75rem+env(safe-area-inset-bottom,0px))] pb-[env(safe-area-inset-bottom,0px)] md:hidden"
    >
      {/* Home Tab */}
      <button
        id="tab-home-btn"
        onClick={() => setCurrentView('dashboard')}
        className={`flex flex-col items-center justify-center flex-1 font-mono text-[11px] font-bold uppercase transition-colors border-r-[2px] border-[#1a1c1c] ${
          currentView === 'dashboard'
            ? 'bg-[#ffd700] text-[#1a1c1c]'
            : 'bg-[#f9f9f9] text-[#1a1c1c] active:bg-[#e2e2e2]'
        }`}
      >
        <span
          className="material-symbols-outlined text-2xl mb-0.5"
          style={{ fontVariationSettings: currentView === 'dashboard' ? "'FILL' 1" : "'FILL' 0" }}
        >
          home
        </span>
        <span>HOME</span>
      </button>

      {/* Add Tab (Center Highlight) */}
      <button
        id="tab-add-btn"
        onClick={() => setCurrentView('add')}
        className={`flex flex-col items-center justify-center flex-1 font-mono text-[11px] font-bold uppercase transition-colors border-r-[2px] border-[#1a1c1c] ${
          currentView === 'add'
            ? 'bg-[#ffd700] text-[#1a1c1c]'
            : 'bg-[#f9f9f9] text-[#1a1c1c] active:bg-[#e2e2e2]'
        }`}
      >
        <span
          className="material-symbols-outlined text-2xl mb-0.5"
          style={{ fontVariationSettings: currentView === 'add' ? "'FILL' 1" : "'FILL' 0" }}
        >
          add_box
        </span>
        <span>ADD EVENT</span>
      </button>

      {/* Settings Tab */}
      <button
        id="tab-settings-btn"
        onClick={() => setCurrentView('settings')}
        className={`flex flex-col items-center justify-center flex-1 font-mono text-[11px] font-bold uppercase transition-colors ${
          currentView === 'settings'
            ? 'bg-[#ffd700] text-[#1a1c1c]'
            : 'bg-[#f9f9f9] text-[#1a1c1c] active:bg-[#e2e2e2]'
        }`}
      >
        <span
          className="material-symbols-outlined text-2xl mb-0.5"
          style={{ fontVariationSettings: currentView === 'settings' ? "'FILL' 1" : "'FILL' 0" }}
        >
          settings
        </span>
        <span>SETTINGS</span>
      </button>
    </nav>
  );
};
