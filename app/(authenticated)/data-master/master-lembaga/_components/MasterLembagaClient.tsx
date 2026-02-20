'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2, Landmark, Plus } from 'lucide-react';
import { FilterHeader } from '@/components/filter-header';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { fetchApi } from '@/lib/fetcher';
import { useConfirm } from '@/components/ui/confirm-dialog';
import { getTahunFromCookie } from '@/lib/cookie';
import { toast } from 'sonner';
import MasterLembagaTable from './MasterLembagaTable';
import AddMasterLembaga from './modals/AddMasterLembaga';
import EditMasterLembaga from './modals/EditMasterLembaga';

export interface MasterLembagaItem {
  id: string;
  id_lembaga: string;
  nama_lembaga: string;
  kode_lembaga: string;
  is_active?: boolean;
}

interface ApiResponse {
  code: number;
  status: string;
  data: {
    id: string;
    nama_lembaga: string;
    kode_lembaga: string;
    is_active?: boolean;
  }[];
}

export default function MasterLembagaClient() {
  const [tahun, setTahun] = useState(() => getTahunFromCookie());
  const [masterLembagaList, setMasterLembagaList] = useState<MasterLembagaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const fetchedRef = useRef<string | null>(null);
  const confirm = useConfirm();

  const fetchMasterLembaga = async () => {
    setLoading(true);

    const response = await fetchApi<ApiResponse>('/lembaga/findall');

    if (response.status >= 200 && response.status < 300) {
      const list = response.data?.data ?? [];

      const mapped: MasterLembagaItem[] = list.map((item) => ({
        id: item.id,
        id_lembaga: item.id, // ⬅️ untuk kolom tabel
        nama_lembaga: item.nama_lembaga,
        kode_lembaga: item.kode_lembaga,
        is_active: item.is_active,
      }));

      setMasterLembagaList(mapped);
    } else {
      const errorMessage = (response.data as { message?: string } | null)?.message;
      toast.error(errorMessage ?? 'Gagal memuat data master lembaga');
      setMasterLembagaList([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!tahun || fetchedRef.current === tahun) return;

    fetchedRef.current = tahun;
    fetchMasterLembaga();
  }, [tahun]);

  const handleDelete = async (idLembaga: string) => {
    const ok = await confirm({
      title: 'Hapus data lembaga?',
      message: `Data dengan ID ${idLembaga} akan dihapus permanen.`,
    });

    if (!ok) return;

    const response = await fetchApi(`/lembaga/delete/${idLembaga}`, {
      method: 'DELETE',
    });

    if (response.status >= 200 && response.status < 300) {
      toast.success('Data lembaga berhasil dihapus');
      setMasterLembagaList((prev) =>
        prev.filter((item) => item.id_lembaga !== idLembaga)
      );
    } else {
      const errorMessage = (response.data as { message?: string } | null)?.message;
      toast.error(errorMessage ?? 'Gagal menghapus data lembaga');
    }
  };

  const handleActivate = (newTahun: string) => {
    fetchedRef.current = null;
    if (!newTahun) setMasterLembagaList([]);
    setTahun(newTahun);
  };

  return (
    <div className="px-6 py-6 md:px-10">
      <FilterHeader onActivate={handleActivate} />
      <Breadcrumb />

      {!tahun && (
        <div className="mt-10 flex flex-col items-center justify-center py-20 text-center">
          <Landmark className="mb-4 size-14 text-muted-foreground/30" />
          <p className="font-display text-lg font-medium text-muted-foreground">
            PILIH TAHUN DI HEADER TERLEBIH DAHULU
          </p>
        </div>
      )}

      {tahun && (
        <>
          <div className="mt-6 mb-6 flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              Master Lembaga
            </h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md font-bold text-sm transition"
            >
              <Plus className="size-4" />
              Tambah Lembaga
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <MasterLembagaTable
              data={masterLembagaList}
              onEdit={setEditId}
              onDelete={handleDelete}
            />
          )}

          {showAddModal && (
            <AddMasterLembaga
              onCancel={() => setShowAddModal(false)}
              onSuccess={() => {
                setShowAddModal(false);
                fetchMasterLembaga();
              }}
            />
          )}

          {editId && (
            <EditMasterLembaga
              idLembaga={editId}
              onCancel={() => setEditId(null)}
              onSuccess={() => {
                setEditId(null);
                fetchMasterLembaga();
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
