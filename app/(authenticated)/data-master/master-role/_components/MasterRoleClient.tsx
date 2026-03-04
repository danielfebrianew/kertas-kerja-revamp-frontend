'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { FilterHeader } from '@/components/filter-header';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { useConfirm } from '@/components/ui/confirm-dialog';
import { fetchApi } from '@/lib/fetcher';
import type { MasterRoleFindAllResponse, MasterRoleItem } from '@/types/master-role';
import MasterRoleTable from './MasterRoleTable';
import AddMasterRole from './modals/AddMasterRole';
import EditMasterRole from './modals/EditMasterRole';

export default function MasterRoleClient() {
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<MasterRoleItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<MasterRoleItem | null>(null);
  const confirm = useConfirm();

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await fetchApi<MasterRoleFindAllResponse>({ type: 'auth',  method: 'GET',  url: '/role/findall' });
      if (response.status >= 400) {
        throw new Error(response.data?.status || 'Gagal memuat data role');
      }
      setRoles(response.data.data ?? []);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Terjadi kesalahan';
      toast.error(message);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

const handleDelete = async (item: MasterRoleItem) => {
  const ok = await confirm({
    title: 'Hapus role?',
    message: `Data role ${item.role} akan dihapus permanen.`,
  });

  if (!ok) return;

  const response = await fetchApi({ type: 'auth',  url: `/role/delete/${item.id}`, method: 'DELETE' });

  if (response.status >= 200 && response.status < 300) {
    toast.success('Role berhasil dihapus');
    setRoles((prev) => prev.filter((role) => role.id !== item.id));
  } else {
    const errorMessage = (response.data as { message?: string } | null)?.message;
    toast.error(errorMessage ?? 'Gagal menghapus role');
  }
};

  return (
    <>
      <FilterHeader />
      <div className="px-2">
        <div className="px-2">
          <Breadcrumb />
        </div>

      <div className="mt-2 mb-3 flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold tracking-tight px-2">
              Master Role
            </h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md font-bold text-sm transition"
            >
              <Plus className="size-4" />
              Tambah Role
            </button>
          </div>

      {loading ? (
        <div className="rounded-lg border border-border bg-card px-4 py-8 text-center text-muted-foreground">
          Memuat data...
        </div>
      ) : (
        <MasterRoleTable data={roles} onEdit={setSelectedRole} onDelete={handleDelete} />
      )}

      {showAddModal && (
        <AddMasterRole
          onCancel={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchRoles();
          }}
        />
      )}

      {selectedRole && (
        <EditMasterRole
          selectedRole={selectedRole}
          onCancel={() => setSelectedRole(null)}
          onSuccess={() => {
            setSelectedRole(null);
            fetchRoles();
          }}
        />
      )}
      </div>
    </>
  );
}
