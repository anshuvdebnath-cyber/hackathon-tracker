import React from 'react';
import { ActiveTab, Hackathon } from '../types';

interface FilterTabsProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  hackathons: Hackathon[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({
  activeTab,
  setActiveTab,
  hackathons,
  searchQuery,
  setSearchQuery,
}) => {
  const counts = {
    all: hackathons.length,
    upcoming: hackathons.filter(h => h.status === 'upcoming').length,
    ongoing: hackathons.filter(h => h.status === 'ongoing').length,
    completed: hackathons.filter(h => h.status === 'completed').length,
  };

  const tabs: { key: ActiveTab; label: string; count: number; colorClass?: string }[] = [
    { key: 'all', label: 'ALL', count: counts.all },
    { key: 'upcoming', label: 'UPCOMING', count: counts.upcoming },
    { key: 'ongoing', label: 'ONGOING', count: counts.ongoing },
    { key: 'completed', label: 'COMPLETED', count: counts.completed },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
      {/* Neo-brutalist Filter Buttons */}
      <div className="flex flex-wrap gap-2 font-mono text-xs font-bold uppercase">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              id={`filter-tab-${tab.key}`}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 md:px-4 md:py-2 border-[3px] border-[#1a1c1c] uppercase font-bold tracking-wider transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#ffd700] text-[#1a1c1c] neo-shadow-sm translate-x-[-2px] translate-y-[-2px]'
                  : 'bg-[#ffffff] text-[#1a1c1c] hover:bg-[#eeeeee] active:translate-x-1 active:translate-y-1'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 border-[1.5px] border-[#1a1c1c] ${
                  isActive ? 'bg-[#1a1c1c] text-[#ffd700]' : 'bg-[#f3f3f3] text-[#1a1c1c]'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Input Box */}
      <div className="relative min-w-[240px] flex-1 max-w-md">
        <input
          id="hackathon-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="SEARCH BY NAME, TECH, VENUE..."
          className="neo-input w-full px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider pr-8"
        />
        {searchQuery ? (
          <button
            id="clear-search-btn"
            onClick={() => setSearchQuery('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[#1a1c1c] hover:text-[#ba1a1a]"
            aria-label="Clear Search"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        ) : (
          <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-sm text-[#7e775f] pointer-events-none">
            search
          </span>
        )}
      </div>
    </div>
  );
};
