import React from 'react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  hackathonName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  hackathonName,
  onConfirm,
  onCancel,
  isDeleting,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="delete-modal-backdrop"
      className="fixed inset-0 z-50 bg-[#1a1c1c]/80 flex items-center justify-center p-4 backdrop-blur-xs"
    >
      <div
        id="delete-modal-card"
        className="bg-[#ffffff] border-[3px] border-[#1a1c1c] neo-shadow-xl max-w-sm w-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="bg-[#ffdad6] border-b-[3px] border-[#ba1a1a] px-4 py-2.5 flex items-center gap-2 text-[#93000a]">
          <span className="material-symbols-outlined text-xl">warning</span>
          <h3 className="font-mono font-black text-sm uppercase tracking-wider">
            CONFIRM DELETE
          </h3>
        </div>

        <div className="p-4 flex flex-col gap-3">
          <p className="font-mono text-xs font-bold text-[#1a1c1c]">
            Are you sure you want to permanently delete{' '}
            <span className="bg-[#ffe16d] px-1 py-0.5 border border-[#1a1c1c]">
              "{hackathonName}"
            </span>
            ?
          </p>
          <p className="text-[11px] font-mono text-[#7e775f]">
            This action will remove the event from your tracker and cannot be undone.
          </p>

          <div className="flex gap-2 mt-2">
            <button
              id="delete-cancel-btn"
              onClick={onCancel}
              disabled={isDeleting}
              className="flex-1 bg-[#ffffff] border-[2px] border-[#1a1c1c] py-2 px-3 font-mono text-xs font-bold uppercase text-[#1a1c1c] hover:bg-[#e2e2e2] neo-btn-sm"
            >
              CANCEL
            </button>

            <button
              id="delete-confirm-btn"
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 bg-[#ba1a1a] text-[#ffffff] border-[2px] border-[#1a1c1c] py-2 px-3 font-mono text-xs font-black uppercase tracking-wider neo-btn-sm flex items-center justify-center gap-1 hover:bg-[#93000a]"
            >
              <span className="material-symbols-outlined text-base">delete_forever</span>
              <span>{isDeleting ? 'DELETING...' : 'DELETE'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
