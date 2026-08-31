import React, { useState } from 'react';
import { NotificationSettings, Hackathon } from '../types';

interface SettingsViewProps {
  settings: NotificationSettings;
  onUpdateSettings: (s: NotificationSettings) => void;
  canInstallPwa: boolean;
  onInstallPwa: () => void;
  hackathons: Hackathon[];
  onResetData: () => Promise<void>;
  onClearAllData: () => Promise<void>;
  onImportData: (items: Hackathon[]) => Promise<void>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  canInstallPwa,
  onInstallPwa,
  hackathons,
  onResetData,
  onClearAllData,
  onImportData,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Export JSON file
  const handleExportJson = () => {
    const dataStr = JSON.stringify(hackathons, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hackathons-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Exported hackathons to JSON');
  };

  // Import JSON file
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!Array.isArray(parsed)) {
          throw new Error('Imported JSON must be an array of hackathons.');
        }
        await onImportData(parsed);
        showToast(`Successfully imported ${parsed.length} hackathons`);
      } catch (err: any) {
        alert('Invalid JSON file format: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full pb-12">
      {/* Settings Title */}
      <div className="border-b-[3px] border-[#1a1c1c] pb-3 flex items-center justify-between">
        <div>
          <h2 className="font-mono font-black text-2xl md:text-3xl uppercase tracking-tight text-[#1a1c1c]">
            SETTINGS
          </h2>
          <p className="text-xs font-mono text-[#705e00] font-bold mt-0.5">
            PREFERENCES, PWA &amp; DATA MANAGEMENT
          </p>
        </div>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="bg-[#ffd700] text-[#1a1c1c] border-[3px] border-[#1a1c1c] p-3 neo-shadow-sm font-mono text-xs font-bold uppercase flex items-center gap-2 animate-in fade-in">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* SECTION 1: NOTIFICATIONS (Matching Image 11) */}
      <section className="bg-[#ffffff] border-[3px] border-[#1a1c1c] neo-shadow-lg flex flex-col overflow-hidden">
        <div className="bg-[#ffd8e6] border-b-[3px] border-[#1a1c1c] px-4 py-2.5">
          <h3 className="font-mono font-black text-sm uppercase text-[#1a1c1c] tracking-wider">
            NOTIFICATIONS
          </h3>
        </div>

        <div className="p-4 md:p-5 flex flex-col gap-4">
          {/* Push alerts toggle */}
          <div className="flex items-center justify-between py-1">
            <label htmlFor="push-toggle-setting" className="font-mono text-xs md:text-sm font-bold uppercase text-[#1a1c1c] cursor-pointer">
              Enable Push Alerts
            </label>

            <button
              id="push-toggle-setting"
              type="button"
              onClick={() =>
                onUpdateSettings({ ...settings, enabled: !settings.enabled })
              }
              className={`w-14 h-7 border-[3px] border-[#1a1c1c] rounded-full transition-colors relative flex items-center p-0.5 ${
                settings.enabled ? 'bg-[#ffd700]' : 'bg-[#dadada]'
              }`}
            >
              <div
                className={`w-5 h-5 bg-[#1a1c1c] rounded-full border border-[#ffffff] transition-transform ${
                  settings.enabled ? 'translate-x-7 bg-[#1a1c1c]' : 'translate-x-0'
                }`}
              ></div>
            </button>
          </div>

          <hr className="border-t-[2px] border-[#eeeeee]" />

          {/* Sound toggle */}
          <div className="flex items-center justify-between py-1">
            <label htmlFor="sound-toggle-setting" className="font-mono text-xs md:text-sm font-bold uppercase text-[#1a1c1c] cursor-pointer">
              Retro Sound Effects (Audio SFX)
            </label>

            <button
              id="sound-toggle-setting"
              type="button"
              onClick={() =>
                onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled })
              }
              className={`w-14 h-7 border-[3px] border-[#1a1c1c] rounded-full transition-colors relative flex items-center p-0.5 ${
                settings.soundEnabled ? 'bg-[#72ebff]' : 'bg-[#dadada]'
              }`}
            >
              <div
                className={`w-5 h-5 bg-[#1a1c1c] rounded-full border border-[#ffffff] transition-transform ${
                  settings.soundEnabled ? 'translate-x-7 bg-[#1a1c1c]' : 'translate-x-0'
                }`}
              ></div>
            </button>
          </div>

          <hr className="border-t-[2px] border-[#eeeeee]" />

          {/* Alert Before Reg Deadline */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs font-bold uppercase text-[#1a1c1c]">
              ALERT BEFORE REG DEADLINE
            </label>
            <select
              id="select-alert-deadline"
              value={settings.deadlineAlertHours}
              onChange={(e) =>
                onUpdateSettings({
                  ...settings,
                  deadlineAlertHours: parseInt(e.target.value, 10),
                })
              }
              className="neo-input w-full p-2.5 font-mono text-xs font-bold uppercase bg-[#ffffff]"
            >
              <option value="1">1 Hour Before</option>
              <option value="24">24 Hours Before</option>
              <option value="48">48 Hours Before</option>
              <option value="0">Never</option>
            </select>
          </div>

          {/* Alert Before Start Time */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs font-bold uppercase text-[#1a1c1c]">
              ALERT BEFORE START TIME
            </label>
            <select
              id="select-alert-starttime"
              value={settings.startTimeAlertHours}
              onChange={(e) =>
                onUpdateSettings({
                  ...settings,
                  startTimeAlertHours: parseInt(e.target.value, 10),
                })
              }
              className="neo-input w-full p-2.5 font-mono text-xs font-bold uppercase bg-[#ffffff]"
            >
              <option value="1">15 Mins / 1 Hour Before</option>
              <option value="24">24 Hours Before</option>
              <option value="48">48 Hours Before</option>
              <option value="0">Never</option>
            </select>
          </div>
        </div>
      </section>

      {/* SECTION 2: APP / PWA INSTALL (Matching Image 11) */}
      <section className="bg-[#ffffff] border-[3px] border-[#1a1c1c] neo-shadow-lg flex flex-col overflow-hidden">
        <div className="bg-[#9cf0ff] border-b-[3px] border-[#1a1c1c] px-4 py-2.5">
          <h3 className="font-mono font-black text-sm uppercase text-[#1a1c1c] tracking-wider">
            PROGRESSIVE WEB APP
          </h3>
        </div>

        <div className="p-4 md:p-5 flex flex-col gap-3">
          <p className="text-xs md:text-sm font-medium text-[#4d4732]">
            Install HACK.TRACK to your home screen for quick offline access, persistent local cache, and native device feel.
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              id="settings-install-pwa-btn"
              onClick={onInstallPwa}
              className="bg-[#ffd700] text-[#1a1c1c] border-[2px] border-[#1a1c1c] py-2.5 px-4 font-mono text-xs font-black uppercase neo-btn-sm flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">download</span>
              <span>INSTALL PWA</span>
            </button>

            <span className="px-3 py-2 bg-[#f3f3f3] border-[2px] border-[#1a1c1c] font-mono text-xs font-bold text-[#1a1c1c] flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-[#006875] rounded-full"></span>
              <span>OFFLINE READY (SERVICE WORKER ACTIVE)</span>
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 3: DATA MANAGEMENT (Matching Image 11) */}
      <section className="bg-[#ffffff] border-[3px] border-[#1a1c1c] neo-shadow-lg flex flex-col overflow-hidden">
        <div className="bg-[#e2e2e2] border-b-[3px] border-[#1a1c1c] px-4 py-2.5">
          <h3 className="font-mono font-black text-sm uppercase text-[#1a1c1c] tracking-wider">
            DATA MANAGEMENT
          </h3>
        </div>

        <div className="p-4 md:p-5 flex flex-col gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Export JSON */}
            <button
              id="settings-export-json-btn"
              onClick={handleExportJson}
              className="bg-[#ffffff] text-[#1a1c1c] border-[2px] border-[#1a1c1c] py-2.5 px-4 font-mono text-xs font-black uppercase neo-btn-sm flex items-center justify-center gap-2 hover:bg-[#ffe16d]"
            >
              <span className="material-symbols-outlined text-lg">code</span>
              <span>EXPORT DATA (JSON)</span>
            </button>

            {/* Import JSON */}
            <label
              htmlFor="settings-import-file-input"
              className="bg-[#ffffff] text-[#1a1c1c] border-[2px] border-[#1a1c1c] py-2.5 px-4 font-mono text-xs font-black uppercase neo-btn-sm flex items-center justify-center gap-2 hover:bg-[#72ebff] cursor-pointer text-center"
            >
              <span className="material-symbols-outlined text-lg">upload_file</span>
              <span>IMPORT DATA (JSON)</span>
              <input
                id="settings-import-file-input"
                type="file"
                accept=".json"
                onChange={handleImportJson}
                className="hidden"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Reset to Seed Sample */}
            <button
              id="settings-reset-sample-btn"
              onClick={onResetData}
              className="bg-[#ffe16d] text-[#1a1c1c] border-[2px] border-[#1a1c1c] py-2.5 px-4 font-mono text-xs font-black uppercase neo-btn-sm flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">restart_alt</span>
              <span>RESET DEMO DATA</span>
            </button>

            {/* Clear All Data */}
            <button
              id="settings-clear-all-btn"
              onClick={onClearAllData}
              className="bg-[#ba1a1a] text-[#ffffff] border-[2px] border-[#1a1c1c] py-2.5 px-4 font-mono text-xs font-black uppercase neo-btn-sm flex items-center justify-center gap-2 hover:bg-[#93000a]"
            >
              <span className="material-symbols-outlined text-lg">delete_forever</span>
              <span>CLEAR ALL DATA</span>
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 4: ABOUT (Matching Image 11) */}
      <section className="bg-[#ffffff] border-[3px] border-[#1a1c1c] neo-shadow-sm p-6 flex flex-col items-center justify-center text-center gap-1.5">
        <div className="font-extrabold text-2xl tracking-tighter uppercase text-[#1a1c1c]">
          HACK.TRACK
        </div>
        <p className="font-mono text-xs font-bold text-[#705e00]">
          v1.0.4-beta (Build 892)
        </p>
        <p className="text-xs text-[#4d4732] font-mono uppercase mt-1">
          Built for high-velocity hackathons. Powered by Express &amp; PWA architecture.
        </p>
      </section>
    </div>
  );
};
