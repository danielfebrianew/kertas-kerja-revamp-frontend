'use client';

import React, { useState, useCallback, createContext, useContext } from 'react';
import { CircleHelp, Loader2 } from 'lucide-react';

interface ConfirmOptions {
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

interface ConfirmContextType {
  confirm: (options?: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | null>(null);

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used within ConfirmDialogProvider');
  return ctx.confirm;
}

export function ConfirmDialogProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({});
  const resolveRef = React.useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback((opts?: ConfirmOptions) => {
    setOptions(opts || {});
    setOpen(true);
    setLoading(false);
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

  const handleConfirm = () => {
    setLoading(true);
    resolveRef.current?.(true);
    setOpen(false);
    setLoading(false);
  };

  const handleCancel = () => {
    resolveRef.current?.(false);
    setOpen(false);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={handleCancel} />
          <div className="relative bg-card rounded-xl shadow-2xl p-8 max-w-sm w-full mx-4 flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-center w-16 h-16 rounded-full border-4 border-muted text-muted-foreground">
              <CircleHelp className="size-10 stroke-[1.5]" />
            </div>
            <h2 className="text-xl font-bold text-foreground">
              {options.title || 'Hapus?'}
            </h2>
            <p className="text-sm text-muted-foreground text-center leading-relaxed">
              {options.message || 'DATA POHON yang terkait kebawah jika ada akan terhapus juga'}
            </p>
            <div className="flex gap-3 mt-2">
              <button
                onClick={handleCancel}
                disabled={loading}
                className="px-6 py-2.5 rounded-lg font-semibold text-sm text-white bg-teal-500 hover:bg-teal-600 transition-colors disabled:opacity-50"
              >
                {options.cancelLabel || 'Batal'}
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="px-6 py-2.5 rounded-lg font-semibold text-sm text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading && <Loader2 className="size-4 animate-spin" />}
                {options.confirmLabel || 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}
