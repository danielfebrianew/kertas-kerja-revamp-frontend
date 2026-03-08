'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import type { TematikItem, PohonKinerja } from '@/types/PohonPemda';
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
} from '@/components/ui/card';
import { TreePine, ChevronDown, Loader2 } from 'lucide-react';
import { FilterHeader } from '@/components/filter-header';
import PohonNode from './PohonNode';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { useConfirm } from '@/components/ui/confirm-dialog';
import { deletePohonNode } from '../_actions';
import '../treeflex.css';

interface PohonPemdaClientProps {
  initialTematik: TematikItem[];
  initialPohon: PohonKinerja[];
  tahun: string;
  selectedId: string;
}

export default function PohonPemdaClient({
  initialTematik,
  initialPohon,
  tahun,
  selectedId,
}: PohonPemdaClientProps) {
  const router = useRouter();
  const confirm = useConfirm();
  const [loading, setLoading] = useState(false);

  const handleActivate = (_newTahun: string) => {
    // Cookie is set by FilterHeader; navigate without id to refresh server data
    router.push('?');
    router.refresh();
  };

  const handleSelect = (id: string) => {
    const params = new URLSearchParams();
    if (id) {
      params.set('id', id);
    }
    router.push(`?${params.toString()}`);
  };

  const handleDeleteNode = async (nodeId: number) => {
    const confirmed = await confirm();
    if (!confirmed) return;
    try {
      setLoading(true);
      const result = await deletePohonNode(nodeId);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal menghapus node';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleTreeRefresh = () => {
    router.refresh();
  };

  return (
    <>
      <FilterHeader onActivate={handleActivate} />
      <div className="px-2">

      <div className='px-2'>
        <Breadcrumb />
      </div>

      {/* No tahun selected */}
      {!tahun && (
        <div className="mt-10 flex flex-col items-center justify-center py-20 text-center">
          <TreePine className="mb-4 size-14 text-muted-foreground/30" />
          <p className="font-display text-lg font-medium text-muted-foreground">
            PILIH TAHUN DI HEADER TERLEBIH DAHULU
          </p>
          <p className="mt-1 text-sm text-muted-foreground/60">
            Gunakan dropdown di atas untuk memilih OPD dan tahun, lalu klik Aktifkan.
          </p>
        </div>
      )}

      {/* Content when tahun is active */}
      {tahun && (
        <>
          <div className="mt-3 mb-3 text-center">

          </div>

          <Card className="mb-6 bg-primary text-primary-foreground border-primary">
            <CardHeader className="text-center">
              <CardDescription className="text-background/80 flex justify-center w-full">
                Pilih tematik untuk menampilkan pohon kinerja.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative max-w-sm justify-center w-full mx-auto ">
                <div className="relative flex justify-center w-full">
                  <select
                    value={selectedId}
                    onChange={(e) => handleSelect(e.target.value)}
                    className="w-full appearance-none rounded-md border border-background/20 bg-background px-3 py-2 pr-10 text-sm text-primary font-medium focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="" className="bg-background text-primary">Pilih Tematik</option>
                    {initialTematik.map((item) => (
                      <option key={item.id} value={item.id} className="bg-background text-primary">
                        {item.nama_pohon}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          {selectedId && (
            <Card>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                      <Loader2 className="size-6 animate-spin" />
                      <p className="text-sm">Memuat pohon kinerja...</p>
                    </div>
                  </div>
                ) : initialPohon.length === 0 ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                      <TreePine className="size-10 opacity-40" />
                      <p className="text-sm">Tidak ada data pohon kinerja.</p>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto flex justify-center w-full">
                    <div className="tf-tree tf-gap-sm">
                      <ul>
                        {initialPohon.map((node, idx) => (
                          <PohonNode
                            key={node.id ?? idx}
                            node={node}
                            onTreeRefresh={handleTreeRefresh}
                            onDeleteAction={handleDeleteNode}
                            isRoot
                          />
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {!selectedId && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <TreePine className="mb-4 size-14 text-muted-foreground/30" />
              <p className="font-display text-lg font-medium text-muted-foreground">
                Pilih tematik untuk memulai
              </p>
              <p className="mt-1 text-sm text-muted-foreground/60">
                Gunakan dropdown di atas untuk memilih tematik yang ingin ditampilkan.
              </p>
            </div>
          )}
        </>
      )}
    </div>
    </>
  );
}
