import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Hackathon, ActiveTab, ActiveNavView, NotificationSettings } from './types';
import {
  apiFetchHackathons,
  apiCreateHackathon,
  apiUpdateHackathon,
  apiDeleteHackathon,
  apiResetHackathons,
  apiImportHackathons,
  calculateStatus,
  playSound,
  triggerCelebration,
} from './utils';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { FilterTabs } from './components/FilterTabs';
import { HackathonCard } from './components/HackathonCard';
import { HackathonModal } from './components/HackathonModal';
import { DetailModal } from './components/DetailModal';
import { SettingsView } from './components/SettingsView';
import { OnboardingModal } from './components/OnboardingModal';
import { PwaInstallBanner } from './components/PwaInstallBanner';
import { NotificationModal } from './components/NotificationModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';

export default function App() {
  // Application State - holds all tracked hackathons
  const [allHackathons, setAllHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Navigation and Views
  const [currentView, setCurrentView] = useState<ActiveNavView>('dashboard');
  const [activeTab, setActiveTab] = useState<ActiveTab>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals State
  const [selectedHackathon, setSelectedHackathon] = useState<Hackathon | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [isAddEditOpen, setIsAddEditOpen] = useState<boolean>(false);
  const [editItem, setEditItem] = useState<Hackathon | null>(null);

  // Delete Confirmation Modal State
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Notification / Alert Modal State
  const [notificationModal, setNotificationModal] = useState<{ isOpen: boolean; name?: string }>({
    isOpen: false,
  });

  // Settings State (stored in localStorage)
  const [settings, setSettings] = useState<NotificationSettings>(() => {
    try {
      const saved = localStorage.getItem('hacktrack_settings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      enabled: true,
      deadlineAlertHours: 24,
      startTimeAlertHours: 24,
      soundEnabled: true,
    };
  });

  // Save settings updates to localStorage
  const handleUpdateSettings = (newSettings: NotificationSettings) => {
    setSettings(newSettings);
    localStorage.setItem('hacktrack_settings', JSON.stringify(newSettings));
    if (newSettings.soundEnabled) playSound('click');
  };

  const handleToggleSound = () => {
    const updated = { ...settings, soundEnabled: !settings.soundEnabled };
    handleUpdateSettings(updated);
  };

  // Onboarding Tour State
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    return localStorage.getItem('hacktrack_onboarding_done') !== 'true';
  });

  const handleFinishOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('hacktrack_onboarding_done', 'true');
    if (settings.soundEnabled) playSound('click');
  };

  // PWA Install Prompt State
  const [pwaInstallPrompt, setPwaInstallPrompt] = useState<any>(null);
  const [showPwaBanner, setShowPwaBanner] = useState<boolean>(false);

  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setPwaInstallPrompt(e);
      // Show PWA banner after slight delay for high engagement
      setTimeout(() => setShowPwaBanner(true), 2500);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallPwa = async () => {
    if (settings.soundEnabled) playSound('click');
    if (pwaInstallPrompt) {
      pwaInstallPrompt.prompt();
      const choiceResult = await pwaInstallPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setShowPwaBanner(false);
      }
      setPwaInstallPrompt(null);
    } else {
      alert('To install HACK.TRACK on mobile/desktop, use your browser menu and select "Add to Home Screen" or "Install App".');
    }
  };

  // Fetch Hackathons from Express REST API
  const loadHackathons = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetchHackathons();
      const withStatus = data.map(h => ({
        ...h,
        status: calculateStatus(h),
      }));
      setAllHackathons(withStatus);
    } catch (err: any) {
      console.error('Error fetching hackathons:', err);
      setError(err.message || 'Failed to connect to backend server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHackathons();
  }, [loadHackathons]);

  // Periodic real-time update of hackathon statuses based on current clock
  useEffect(() => {
    const timer = setInterval(() => {
      setAllHackathons(prev =>
        prev.map(h => {
          const currentStatus = calculateStatus(h);
          return currentStatus !== h.status ? { ...h, status: currentStatus } : h;
        })
      );
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Filter hackathons by active search query
  const searchFilteredHackathons = useMemo(() => {
    if (!searchQuery.trim()) return allHackathons;
    const query = searchQuery.toLowerCase().trim();
    return allHackathons.filter(
      h =>
        h.name.toLowerCase().includes(query) ||
        (h.venue && h.venue.toLowerCase().includes(query)) ||
        (h.notes && h.notes.toLowerCase().includes(query)) ||
        (h.tags && h.tags.some(t => t.toLowerCase().includes(query)))
    );
  }, [allHackathons, searchQuery]);

  // Real-time live tab counts based on current items
  const tabCounts = useMemo(() => {
    return {
      all: searchFilteredHackathons.length,
      upcoming: searchFilteredHackathons.filter(h => h.status === 'upcoming').length,
      ongoing: searchFilteredHackathons.filter(h => h.status === 'ongoing').length,
      completed: searchFilteredHackathons.filter(h => h.status === 'completed').length,
    };
  }, [searchFilteredHackathons]);

  // Live boxes to display for the active section tab
  const displayedHackathons = useMemo(() => {
    if (activeTab === 'all') return searchFilteredHackathons;
    return searchFilteredHackathons.filter(h => h.status === activeTab);
  }, [searchFilteredHackathons, activeTab]);

  // Handle Create or Update
  const handleSaveHackathon = async (payload: Partial<Hackathon>) => {
    if (editItem) {
      const updated = await apiUpdateHackathon(editItem.id, payload);
      if (settings.soundEnabled) playSound('success');
      if (updated.outcome === 'won' || updated.outcome === 'finalist') {
        triggerCelebration(updated.outcome);
      }
      // If currently viewing details of this hackathon, update it
      if (selectedHackathon && selectedHackathon.id === editItem.id) {
        setSelectedHackathon(updated);
      }
    } else {
      const created = await apiCreateHackathon(payload);
      if (settings.soundEnabled) playSound('success');
      if (created.outcome === 'won' || created.outcome === 'finalist') {
        triggerCelebration(created.outcome);
      }
    }
    setEditItem(null);
    setIsAddEditOpen(false);
    if (currentView === 'add') setCurrentView('dashboard');
    await loadHackathons();
  };

  // Handle Delete
  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;
    setIsDeleting(true);
    try {
      await apiDeleteHackathon(deleteConfirm.id);
      if (settings.soundEnabled) playSound('delete');
      if (selectedHackathon && selectedHackathon.id === deleteConfirm.id) {
        setIsDetailOpen(false);
        setSelectedHackathon(null);
      }
      setDeleteConfirm(null);
      await loadHackathons();
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Open Detail View
  const handleViewDetails = (h: Hackathon) => {
    if (settings.soundEnabled) playSound('click');
    setSelectedHackathon(h);
    setIsDetailOpen(true);
  };

  // Open Add/Edit Modal
  const handleOpenAdd = () => {
    if (settings.soundEnabled) playSound('click');
    setEditItem(null);
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (h: Hackathon) => {
    if (settings.soundEnabled) playSound('click');
    setEditItem(h);
    setIsAddEditOpen(true);
  };

  // Prompt Notification / Reminder
  const handleSetReminder = (h: Hackathon) => {
    if (settings.soundEnabled) playSound('bell');
    setNotificationModal({ isOpen: true, name: h.name });
  };

  const handleAllowNotifications = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        if (settings.soundEnabled) playSound('success');
        new Notification('HACK.TRACK Alert Configured', {
          body: `Deadline reminders are active for ${notificationModal.name || 'your hackathon'}.`,
          icon: '/icons/icon.svg',
        });
      }
    }
    setNotificationModal({ isOpen: false });
  };

  // Reset Data to Seed
  const handleResetData = async () => {
    if (!confirm('Reset all hackathons to default sample dataset?')) return;
    setLoading(true);
    try {
      const resetList = await apiResetHackathons();
      const withStatus = resetList.map(h => ({
        ...h,
        status: calculateStatus(h),
      }));
      setAllHackathons(withStatus);
      if (settings.soundEnabled) playSound('success');
    } catch (err: any) {
      alert('Failed to reset data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Clear All Data
  const handleClearAllData = async () => {
    if (!confirm('⚠️ Are you sure you want to delete ALL hackathons? This cannot be undone.')) return;
    setLoading(true);
    try {
      await apiImportHackathons([]);
      setAllHackathons([]);
      if (settings.soundEnabled) playSound('delete');
    } catch (err: any) {
      alert('Failed to clear data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Bulk Import
  const handleImportData = async (items: Hackathon[]) => {
    setLoading(true);
    try {
      const imported = await apiImportHackathons(items);
      const withStatus = imported.map(h => ({
        ...h,
        status: calculateStatus(h),
      }));
      setAllHackathons(withStatus);
      if (settings.soundEnabled) playSound('success');
    } catch (err: any) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-[#1a1c1c] flex flex-col font-sans selection:bg-[#ffd700] selection:text-[#1a1c1c]">
      {/* Top Header */}
      <Header
        currentView={currentView}
        setCurrentView={(v) => {
          if (settings.soundEnabled) playSound('click');
          if (v === 'add') {
            handleOpenAdd();
          } else {
            setCurrentView(v);
          }
        }}
        canInstallPwa={Boolean(pwaInstallPrompt)}
        onInstallPwa={handleInstallPwa}
        soundEnabled={settings.soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Main Layout: Sidebar + Canvas */}
      <div className="flex-1 flex w-full">
        {/* Desktop Sidebar (Matching Image 3) */}
        <Sidebar
          currentView={currentView}
          setCurrentView={(v) => {
            if (settings.soundEnabled) playSound('click');
            if (v === 'add') {
              handleOpenAdd();
            } else {
              setCurrentView(v);
            }
          }}
          hackathonCount={allHackathons.length}
        />

        {/* Content Canvas */}
        <main className="flex-1 w-full max-w-[1280px] mx-auto px-3.5 py-4 sm:px-6 md:p-6 lg:p-8 flex flex-col gap-5 sm:gap-6 pb-24 md:pb-12">
          {/* VIEW: SETTINGS */}
          {currentView === 'settings' && (
            <SettingsView
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              canInstallPwa={Boolean(pwaInstallPrompt)}
              onInstallPwa={handleInstallPwa}
              hackathons={allHackathons}
              onResetData={handleResetData}
              onClearAllData={handleClearAllData}
              onImportData={handleImportData}
            />
          )}

          {/* VIEW: DASHBOARD */}
          {currentView === 'dashboard' && (
            <>
              {/* Dashboard Banner & Filters Section (Matching Image 3) */}
              <section className="flex flex-col gap-4 border-b-[3px] border-[#1a1c1c] pb-4">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                  <div>
                    <h2 className="font-extrabold text-3xl md:text-5xl uppercase tracking-tighter text-[#1a1c1c] leading-none">
                      DASHBOARD
                    </h2>
                    <p className="font-mono text-xs md:text-sm text-[#705e00] font-bold mt-1 uppercase">
                      Track, manage, and conquer your hackathons.
                    </p>
                  </div>

                  {/* Quick Add Button on mobile/tablet */}
                  <button
                    id="dashboard-quick-add-btn"
                    onClick={handleOpenAdd}
                    className="sm:hidden bg-[#ffd700] text-[#1a1c1c] px-4 py-2 border-[3px] border-[#1a1c1c] neo-btn font-mono text-xs font-black uppercase flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-lg font-black">add_circle</span>
                    <span>LOG HACKATHON</span>
                  </button>
                </div>

                {/* Filter Tabs & Search Bar */}
                <FilterTabs
                  activeTab={activeTab}
                  setActiveTab={(tab) => {
                    if (settings.soundEnabled) playSound('click');
                    setActiveTab(tab);
                  }}
                  hackathons={searchFilteredHackathons}
                  counts={tabCounts}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              </section>

              {/* Error banner if backend connection issue */}
              {error && (
                <div className="bg-[#ffdad6] border-[3px] border-[#ba1a1a] p-4 text-xs font-mono font-bold text-[#93000a] flex items-center justify-between gap-2 neo-shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-xl">cloud_off</span>
                    <span>{error}</span>
                  </div>
                  <button
                    onClick={loadHackathons}
                    className="bg-[#ffffff] px-3 py-1 border-[2px] border-[#ba1a1a] neo-btn-sm uppercase text-[11px]"
                  >
                    RETRY
                  </button>
                </div>
              )}

              {/* Loading Skeleton / State */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className="h-80 bg-[#eeeeee] border-[3px] border-[#1a1c1c] neo-shadow-lg p-4 flex flex-col justify-between"
                    >
                      <div className="h-6 bg-[#dadada] w-1/3"></div>
                      <div className="h-10 bg-[#dadada] w-3/4"></div>
                      <div className="h-20 bg-[#dadada] w-full"></div>
                    </div>
                  ))}
                </div>
              ) : displayedHackathons.length === 0 ? (
                /* Empty State */
                <div className="border-[3px] border-[#1a1c1c] bg-[#ffffff] neo-shadow-lg p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-4">
                  <div className="text-5xl">⚡</div>
                  <h3 className="font-extrabold text-2xl uppercase tracking-tight text-[#1a1c1c]">
                    NO HACKATHONS FOUND
                  </h3>
                  <p className="font-mono text-xs text-[#7e775f] max-w-md">
                    {searchQuery
                      ? `No results matching "${searchQuery}". Try clearing search or change filter.`
                      : `You don't have any ${activeTab !== 'all' ? activeTab : ''} hackathons tracked yet. Ready to build something epic?`}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-2">
                    <button
                      onClick={handleOpenAdd}
                      className="bg-[#ffd700] text-[#1a1c1c] px-6 py-2.5 border-[3px] border-[#1a1c1c] neo-btn font-mono text-xs font-black uppercase"
                    >
                      + ADD FIRST HACKATHON
                    </button>
                    {activeTab !== 'all' && (
                      <button
                        onClick={() => setActiveTab('all')}
                        className="bg-[#ffffff] text-[#1a1c1c] px-4 py-2.5 border-[3px] border-[#1a1c1c] neo-btn-sm font-mono text-xs font-bold uppercase"
                      >
                        VIEW ALL
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* Hackathon Grid (Matching Image 3 & 13) */
                <section
                  id="hackathons-grid"
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {displayedHackathons.map((hackathon) => (
                    <HackathonCard
                      key={hackathon.id}
                      hackathon={hackathon}
                      onViewDetails={handleViewDetails}
                      onEdit={handleOpenEdit}
                      onDelete={(id, name) => setDeleteConfirm({ id, name })}
                    />
                  ))}
                </section>
              )}
            </>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        currentView={currentView}
        setCurrentView={(v) => {
          if (settings.soundEnabled) playSound('click');
          if (v === 'add') {
            handleOpenAdd();
          } else {
            setCurrentView(v);
          }
        }}
      />

      {/* Modals */}
      {/* 1. Add/Edit Hackathon Modal */}
      <HackathonModal
        isOpen={isAddEditOpen}
        editItem={editItem}
        onClose={() => {
          setIsAddEditOpen(false);
          setEditItem(null);
        }}
        onSave={handleSaveHackathon}
      />

      {/* 2. Detail View Modal */}
      <DetailModal
        hackathon={selectedHackathon}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedHackathon(null);
        }}
        onEdit={(h) => {
          setIsDetailOpen(false);
          handleOpenEdit(h);
        }}
        onDelete={(id, name) => {
          setDeleteConfirm({ id, name });
        }}
        onSetReminder={handleSetReminder}
      />

      {/* 3. Delete Confirmation Dialog */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteConfirm)}
        hackathonName={deleteConfirm?.name || ''}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirm(null)}
      />

      {/* 4. Notification / Reminder Modal */}
      <NotificationModal
        isOpen={notificationModal.isOpen}
        targetHackathonName={notificationModal.name}
        onAllow={handleAllowNotifications}
        onDismiss={() => setNotificationModal({ isOpen: false })}
      />

      {/* 5. Onboarding Welcome Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onGetStarted={handleFinishOnboarding}
        onInstallPwa={handleInstallPwa}
        canInstallPwa={Boolean(pwaInstallPrompt)}
      />

      {/* 6. PWA Install Bottom Banner */}
      <PwaInstallBanner
        show={showPwaBanner && Boolean(pwaInstallPrompt)}
        onInstall={handleInstallPwa}
        onDismiss={() => setShowPwaBanner(false)}
      />
    </div>
  );
}
