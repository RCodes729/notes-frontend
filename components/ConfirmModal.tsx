'use client';

type Props = {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  open,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/20 bg-slate-900 p-5 shadow-2xl">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-slate-300 text-sm mt-2">{description}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white">
            {cancelText}
          </button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white">
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}