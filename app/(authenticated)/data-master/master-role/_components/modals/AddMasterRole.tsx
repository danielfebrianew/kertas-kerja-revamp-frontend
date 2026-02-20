'use client';

import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { fetchApi } from '@/lib/fetcher';

interface AddMasterRoleProps {
  onCancel: () => void;
  onSuccess: () => void;
}

export default function AddMasterRole({ onCancel, onSuccess }: AddMasterRoleProps) {
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!role.trim()) {
      toast.error('Role harus terisi');
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetchApi('/role/create', {
        method: 'POST',
        body: { role: role.trim() },
      });

      if (res.status >= 400) {
        throw new Error(res.data?.status || 'Gagal menambahkan role');
      }

      toast.success('Role berhasil ditambahkan');
      onSuccess();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Terjadi kesalahan';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

return (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    onClick={(event) => {
      if (event.target === event.currentTarget) onCancel();
    }}
  >
    <div className="w-full max-w-2xl rounded-lg border border-border bg-card p-6 shadow-xl mx-4">
      <h2 className="text-2xl font-display font-semibold tracking-tight mb-6">
        FORM TAMBAH ROLE :
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-bold uppercase">
            ROLE :
          </label>
          <input
            type="text"
            value={role}
            onChange={(event) => setRole(event.target.value)}
            placeholder="masukkan Role"
            className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-lg outline-none focus:ring-2 focus:ring-ring"
          />
          <p className="mt-1 text-sm text-muted-foreground">
            *Role Harus Terisi
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-[#22c55e] py-2.5 text-2xl font-semibold text-white transition hover:bg-[#16a34a] disabled:opacity-50"
        >
          {isLoading ? 'Menyimpan...' : 'Simpan'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="w-full rounded-md bg-[#e11d48] py-2.5 text-2xl font-semibold text-white transition hover:bg-[#be123c]"
        >
          Kembali
        </button>
      </form>
    </div>
  </div>
);
}
