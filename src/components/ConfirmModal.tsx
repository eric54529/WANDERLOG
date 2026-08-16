import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = '確認',
  cancelLabel = '取消',
  isDestructive = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div
      id="confirm-modal-backdrop"
      className="fixed inset-0 z-50 bg-[#121110]/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        id="confirm-modal-dialog"
        className="bg-[#FAF9F6] dark:bg-[#1C1C1A] border border-[#D5D2C8] dark:border-[#2C2C29] max-w-md w-full p-6 shadow-2xl space-y-5 text-[#242220] dark:text-[#E8E5DE] relative rounded-xs"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 text-[#88857E] hover:text-[#1F1E1D] dark:hover:text-[#FAF9F6] transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3.5">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              isDestructive
                ? 'bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800'
                : 'bg-[#F0EDE5] dark:bg-[#282825] text-[#2C2A28] dark:text-[#FAF9F6] border border-[#D5D2C8] dark:border-[#383834]'
            }`}
          >
            <AlertTriangle className="w-5 h-5 stroke-[1.75]" />
          </div>

          <div className="space-y-1.5 pt-0.5">
            <h3 className="font-serif text-lg text-[#1F1E1D] dark:text-[#FAF9F6] font-medium leading-snug">
              {title}
            </h3>
            <p className="text-xs text-[#6B6861] dark:text-[#A8A49B] font-light leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#EAE7DF] dark:border-[#2C2C29]">
          <button
            id="btn-confirm-cancel"
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-[#D5D2C8] dark:border-[#383834] hover:border-[#1F1E1D] dark:hover:border-[#FAF9F6] text-[#55524C] dark:text-[#A8A49B] hover:text-[#1F1E1D] dark:hover:text-[#FAF9F6] text-xs uppercase tracking-wider rounded-xs transition"
          >
            {cancelLabel}
          </button>
          <button
            id="btn-confirm-accept"
            type="button"
            onClick={onConfirm}
            className="px-5 py-2 text-xs uppercase tracking-wider rounded-xs transition shadow-sm font-sans bg-[#1F1E1D] hover:bg-[#383633] dark:bg-[#FAF9F6] dark:hover:bg-[#EAE7DF] text-[#FAF9F6] dark:text-[#171716] font-medium"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
