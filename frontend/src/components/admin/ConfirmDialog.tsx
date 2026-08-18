import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'DELETE',
  cancelText = 'CANCEL',
  isDestructive = true,
  loading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-xs shadow-2xl p-6 space-y-5 relative">
        <div className="flex items-start gap-4">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              isDestructive ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black text-unb-navy tracking-tight">{title}</h3>
            <p className="text-xs text-gray-600 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-3 border-t border-gray-100">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer disabled:opacity-50"
          >
            {cancelText}
          </button>
          <Button
            type="button"
            variant={isDestructive ? 'primary' : 'navy'}
            disabled={loading}
            onClick={onConfirm}
            className={isDestructive ? '!bg-red-600 hover:!bg-red-700' : ''}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                DELETING...
              </span>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
