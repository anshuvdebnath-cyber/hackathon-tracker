import React from 'react';

interface PwaInstallBannerProps {
  show: boolean;
  onInstall: () => void;
  onDismiss: () => void;
}

export const PwaInstallBanner: React.FC<PwaInstallBannerProps> = ({
  show,
  onInstall,
  onDismiss,
}) => {
  if (!show) return null;

  return (
    <div
      id="pwa-install-banner"
      className="fixed bottom-16 md:bottom-0 left-0 w-full z-40 bg-[#ffd700] border-t-[3px] border-[#1a1c1c] p-3 md:p-4 shadow-[0px_-6px_0px_0px_rgba(0,0,0,1)]"
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Icon & Text (Matching Image 5) */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="bg-[#ffffff] border-[2px] border-[#1a1c1c] p-2 shrink-0 flex items-center justify-center neo-shadow-sm">
            <span className="material-symbols-outlined text-[#1a1c1c] text-2xl font-bold">
              download_for_offline
            </span>
          </div>

          <div>
            <h3 className="font-mono font-black text-sm md:text-base text-[#1a1c1c] leading-tight uppercase">
              INSTALL APP
            </h3>
            <p className="font-mono text-xs text-[#705e00] font-medium">
              Add HACK.TRACK to your home screen for offline &amp; native performance.
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <button
            id="pwa-banner-later-btn"
            onClick={onDismiss}
            className="flex-1 sm:flex-none bg-[#ffffff] border-[2px] border-[#1a1c1c] px-4 py-1.5 font-mono text-xs font-bold uppercase text-[#1a1c1c] hover:bg-[#e2e2e2] neo-btn-sm"
          >
            LATER
          </button>

          <button
            id="pwa-banner-install-btn"
            onClick={onInstall}
            className="flex-1 sm:flex-none bg-[#fd68b3] text-[#1a1c1c] border-[2px] border-[#1a1c1c] px-5 py-1.5 font-mono text-xs font-black uppercase tracking-wider neo-btn-sm flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">install_mobile</span>
            <span>INSTALL</span>
          </button>
        </div>
      </div>
    </div>
  );
};
