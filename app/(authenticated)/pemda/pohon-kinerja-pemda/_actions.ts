'use server';

import { fetchApi } from '@/lib/fetcher';

export async function deletePohonNode(nodeId: number) {
  const res = await fetchApi({ type: 'auth',  url: `/pohon_kinerja_admin/delete/${nodeId}`, method: 'DELETE' });

  if (res.status >= 400) {
    return { success: false, message: res.message || 'Gagal menghapus node' };
  }

  return { success: true, message: 'Node berhasil dihapus' };
}
