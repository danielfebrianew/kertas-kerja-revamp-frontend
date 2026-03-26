// app/(authenticated)/data-master/master-opd/_components/modals/EditMasterOpd.tsx

'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/fetcher';
import type { Lembaga } from '@/types/opd';
import { toast } from 'sonner';
import type { MasterOpdItem } from '../MasterOpdTable';

interface LembagaResponse {
  code: number;
  status: string;
  data: Lembaga[];
}

interface UpdateOpdResponse {
  code: number;
  status: string;
  data: any;
}

interface EditModalMasterOpdProps {
  item: MasterOpdItem;
  onCancel: () => void;
  onSuccess: () => void;
}

interface FormState {
  kode_opd: string;
  nama_opd: string;
  nama_kepala_opd: string;
  nip_kepala_opd: string;
  pangkat_kepala: string;
  id_lembaga: string;
}

export default function EditModalMasterOpd({
  item,
  onCancel,
  onSuccess,
}: EditModalMasterOpdProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [lembagaList, setLembagaList] = useState<Lembaga[]>([]);

  const [form, setForm] = useState<FormState>({
    kode_opd: '',
    nama_opd: '',
    nama_kepala_opd: '',
    nip_kepala_opd: '',
    pangkat_kepala: '',
    id_lembaga: '',
  });

  // Sync form ketika item berubah
  useEffect(() => {
    setForm({
      kode_opd: item.kode_perangkat_daerah,
      nama_opd: item.nama_perangkat_daerah,
      nama_kepala_opd: item.nama_kepala_perangkat_daerah,
      nip_kepala_opd: item.nip_kepala_perangkat_daerah,
      pangkat_kepala: item.pangkat_kepala_perangkat_daerah,
      id_lembaga: item.kode_lembaga ?? '',
    });
  }, [item]);

  // Fetch lembaga
  useEffect(() => {
    async function fetchLembaga() {
      try {
        const response = await fetchApi<LembagaResponse>({ type: 'auth',  method: 'GET', 
          url: '/lembaga/findall',
        });

        if (response.status >= 400) {
          throw new Error(response.message || 'Gagal memuat lembaga');
        }

        setLembagaList(response.data?.data ?? []);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Terjadi kesalahan';
        toast.error(message);
      }
    }

    void fetchLembaga();
  }, []);

  const updateField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const payload = {
        kode_opd: form.kode_opd,
        nama_opd: form.nama_opd,
        nama_kepala_opd: form.nama_kepala_opd,
        nip_kepala_opd: form.nip_kepala_opd,
        pangkat_kepala: form.pangkat_kepala,
        id_lembaga: form.id_lembaga,
      };

      const response = await fetchApi<UpdateOpdResponse>({ type: 'auth', 
        url: `/opd/update/${item.id}`,
        method: 'PUT',
        body: payload,
      });

      if (response.status >= 400) {
        throw new Error(response.message || 'Gagal mengubah Master OPD');
      }

      toast.success('Master OPD berhasil diubah');
      onSuccess();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Terjadi kesalahan';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="bg-card border-2 border-border rounded-lg p-6 shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto mx-4">
        <h2 className="font-display text-xl font-semibold tracking-tight mb-6">
          FORM EDIT OPD :
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-sm">

  {/* KODE OPD */}
  <div>
    <label className="font-bold block mb-2 uppercase">
      Kode Perangkat Daerah:
    </label>
    <input
      type="text"
      required
      placeholder="masukkan Kode Perangkat Daerah"
      value={form.kode_opd}
      onChange={(e) => updateField('kode_opd', e.target.value)}
      className="w-full border border-input rounded p-2 focus:ring-2 focus:ring-ring outline-none"
    />
    <p className="text-xs text-muted-foreground mt-1">
      *Kode Perangkat Daerah Harus Dipilih
    </p>
  </div>

  {/* NAMA OPD */}
  <div>
    <label className="font-bold block mb-2 uppercase">
      Nama Perangkat Daerah:
    </label>
    <input
      type="text"
      required
      placeholder="masukkan Nama Perangkat Daerah"
      value={form.nama_opd}
      onChange={(e) => updateField('nama_opd', e.target.value)}
      className="w-full border border-input rounded p-2 focus:ring-2 focus:ring-ring outline-none"
    />
    <p className="text-xs text-muted-foreground mt-1">
      *Nama OPD Harus Terisi
    </p>
  </div>

  {/* NAMA KEPALA */}
  <div>
    <label className="font-bold block mb-2 uppercase">
      Nama Kepala Perangkat Daerah:
    </label>
    <input
      type="text"
      required
      placeholder="masukkan Nama Kepala Perangkat Daerah"
      value={form.nama_kepala_opd}
      onChange={(e) => updateField('nama_kepala_opd', e.target.value)}
      className="w-full border border-input rounded p-2 focus:ring-2 focus:ring-ring outline-none"
    />
    <p className="text-xs text-muted-foreground mt-1">
      *Nama Kepala Perangkat Daerah Harus Terisi
    </p>
  </div>

  {/* NIP */}
  <div>
    <label className="font-bold block mb-2 uppercase">
      NIP Kepala Perangkat Daerah:
    </label>
    <input
      type="text"
      required
      placeholder="masukkan NIP Kepala"
      value={form.nip_kepala_opd}
      onChange={(e) => updateField('nip_kepala_opd', e.target.value)}
      className="w-full border border-input rounded p-2 focus:ring-2 focus:ring-ring outline-none"
    />
    <p className="text-xs text-muted-foreground mt-1">
      *NIP Kepala Perangkat Daerah Harus Terisi
    </p>
  </div>

  {/* PANGKAT */}
  <div>
    <label className="font-bold block mb-2 uppercase">
      Pangkat Kepala Perangkat Daerah:
    </label>
    <input
      type="text"
      required
      placeholder="masukkan Pangkat Kepala Perangkat Daerah"
      value={form.pangkat_kepala}
      onChange={(e) => updateField('pangkat_kepala', e.target.value)}
      className="w-full border border-input rounded p-2 focus:ring-2 focus:ring-ring outline-none"
    />
    <p className="text-xs text-muted-foreground mt-1">
      *Pangkat Kepala Perangkat Daerah Harus Terisi
    </p>
  </div>

  {/* LEMBAGA */}
  <div>
    <label className="font-bold block mb-2 uppercase">
      Lembaga:
    </label>
    <select
      required
      value={form.id_lembaga}
      onChange={(e) => updateField('id_lembaga', e.target.value)}
      className="w-full border border-input rounded p-2 focus:ring-2 focus:ring-ring outline-none"
    >
      <option value="">Masukkan Lembaga</option>
      {lembagaList.map((item) => (
        <option key={item.id} value={item.id}>
          {item.nama_lembaga}
        </option>
      ))}
    </select>
    <p className="text-xs text-muted-foreground mt-1">
      *Lembaga Harus Terisi
    </p>
  </div>

  {/* BUTTON */}
  <div className="flex flex-col gap-3 mt-3">
    <button
      type="submit"
      disabled={isLoading}
      className="w-full bg-[#22c55e] hover:bg-green-600 text-white py-2 rounded font-bold transition disabled:opacity-50"
    >
      {isLoading ? 'Menyimpan...' : 'Simpan'}
    </button>

    <button
      type="button"
      onClick={onCancel}
      disabled={isLoading}
      className="w-full bg-[#e11d48] hover:bg-rose-700 text-white py-2 rounded font-bold transition disabled:opacity-50"
    >
      Kembali
    </button>
  </div>

</form>
      </div>
    </div>
  );
}
