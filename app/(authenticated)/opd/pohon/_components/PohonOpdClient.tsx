'use client';

import React, { useCallback, useRef, useState, useEffect } from 'react';
import { fetchApi } from '@/lib/fetcher';
import { toast } from 'sonner';
import type { PohonOpdResponse, PohonOpdNode, TujuanOpd } from '@/types/PohonOpd';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Building2, Loader2 } from 'lucide-react';
import { FilterHeader } from '@/components/filter-header';
import PohonNode from './PohonNode';
import { FormAddChildModal } from './modals/AddModal';
import { AddTujuanOpdModal } from './modals/AddTujuanOpdModal';
import type { ChildInfo } from '../_utils';
import { IconAdd, IconCetak, IconEye, IconEyeOff } from '@/components/ui/icons';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { useConfirm } from '@/components/ui/confirm-dialog';
import { getCookieValue, getCookieLabel } from '@/lib/cookie';
import '../treeflex.css';

function mapPohonResponse(node: Record<string, unknown>): PohonOpdNode {
  const { tema, childs, ...rest } = node;
  return {
    ...rest,
    nama_pohon: (node.nama_pohon as string) ?? (tema as string) ?? '',
    childs: Array.isArray(childs)
      ? (childs as Record<string, unknown>[]).map(mapPohonResponse)
      : undefined,
  } as PohonOpdNode;
}

export default function PohonOpdClient() {
  const [tahun, setTahun] = useState(() => getCookieValue('tahun'));
  const [kodeOpd, setKodeOpd] = useState(() => getCookieValue('opd'));
  const [namaOpd, setNamaOpd] = useState(() => getCookieLabel('opd'));

  const confirm = useConfirm();
  const [pohonData, setPohonData] = useState<PohonOpdNode[]>([]);
  const [tujuanOpd, setTujuanOpd] = useState<TujuanOpd[]>([]);
  const [loading, setLoading] = useState(!!tahun && !!kodeOpd);
  const [expandAll, setExpandAll] = useState(false);
  const [addModalInfo, setAddModalInfo] = useState<ChildInfo | null>(null);
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [showTujuanModal, setShowTujuanModal] = useState(false);
  const fetchedRef = useRef<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const rootNodeRef = useRef<HTMLDivElement>(null);

  const fetchKey = `${kodeOpd}/${tahun}`;

  const fetchPohonData = useCallback(async () => {
    if (!kodeOpd || !tahun) {
      setPohonData([]);
      setTujuanOpd([]);
      return;
    }
    try {
      setLoading(true);
      const res = await fetchApi<PohonOpdResponse>(
        `/pohon_kinerja_opd/findall/${kodeOpd}/${tahun}`
      );
      setNamaOpd(res.data?.data?.nama_opd || namaOpd);
      setTujuanOpd(res.data?.data?.tujuan_opd ?? []);
      const childs = res.data?.data?.childs ?? [];
      setPohonData(
        childs.map((c) => mapPohonResponse(c as unknown as Record<string, unknown>))
      );
    } catch (err) {
      console.error('Failed to fetch pohon OPD:', err);
      toast.error('Gagal memuat pohon kinerja OPD');
    } finally {
      setLoading(false);
    }
  }, [kodeOpd, tahun, namaOpd]);

  useEffect(() => {
    if (!kodeOpd || !tahun) return;
    if (fetchedRef.current === fetchKey) return;
    fetchedRef.current = fetchKey;
    fetchPohonData();
  }, [fetchKey, fetchPohonData, kodeOpd, tahun]);

  const handleActivate = (newTahun: string, newKodeOpd: string) => {
    fetchedRef.current = null;
    setTahun(newTahun);
    setKodeOpd(newKodeOpd);
    setNamaOpd(getCookieLabel('opd'));
  };

  const handleToggleExpandAll = () => {
    const container = scrollContainerRef.current;
    const rootNode = rootNodeRef.current;
    if (container && rootNode) {
      const rootRect = rootNode.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const rootVisualX = rootRect.left - containerRect.left;

      setExpandAll((prev) => !prev);

      requestAnimationFrame(() => {
        const newRootOffsetFromContainerLeft =
          rootNode.getBoundingClientRect().left -
          container.getBoundingClientRect().left +
          container.scrollLeft;
        container.scrollLeft = newRootOffsetFromContainerLeft - rootVisualX;
      });
    } else {
      setExpandAll((prev) => !prev);
    }
  };

  const handleDeleteNode = async (nodeId: number, namaPohon: string) => {
    const confirmed = await confirm({
      message: `Data Pohon "${namaPohon}" dan seluruh anaknya akan ikut terhapus. Anda Yakin?`,
    });
    if (!confirmed) return;
    try {
      await fetchApi(`/pohon_kinerja_admin/delete/${nodeId}`, { method: 'DELETE' });
      toast.success('Node berhasil dihapus');
      fetchPohonData();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal menghapus node';
      toast.error(message);
    }
  };

  return (
    <>
      <FilterHeader onActivate={handleActivate} />
      <div className="px-2">
        <div className="px-2">
          <Breadcrumb />
        </div>

        {(!tahun || !kodeOpd) && (
          <div className="mt-10 flex flex-col items-center justify-center py-20 text-center">
            <Building2 className="mb-4 size-14 text-muted-foreground/30" />
            <p className="font-display text-lg font-medium text-muted-foreground">
              PILIH OPD DAN TAHUN DI HEADER TERLEBIH DAHULU
            </p>
            <p className="mt-1 text-sm text-muted-foreground/60">
              Gunakan dropdown di atas untuk memilih OPD dan tahun, lalu klik Aktifkan.
            </p>
          </div>
        )}

        {tahun && kodeOpd && (
          <>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <Loader2 className="size-6 animate-spin" />
                  <p className="text-sm">Memuat pohon kinerja OPD...</p>
                </div>
              </div>
            ) : (
              <Card className="mt-6">
                <CardContent>
                  <div ref={scrollContainerRef} className="overflow-x-auto w-full">
                    <div className="tf-tree tf-gap-sm w-fit mx-auto">
                      <ul>
                        <li>
                          {/* Root OPD Node */}
                          <div ref={rootNodeRef} className="tf-nc tf flex flex-col rounded-lg shadow-lg border-primary min-w-[384px] max-w-sm relative">
                            {/* Header */}
                            <div className="flex flex-col rounded-lg shadow-sm mb-2 border p-3 border-primary bg-primary text-primary-foreground">
                              <span className="text-xs text-center font-bold uppercase">
                                Pohon Kinerja OPD
                              </span>
                            </div>

                            {/* Body */}
                            <div className="bg-card p-2 rounded-b-lg">
                              <table className="w-full border-collapse text-xs">
                                <tbody>
                                  <tr>
                                    <td className="border p-2 font-semibold text-foreground w-24">Perangkat Daerah</td>
                                    <td className="border p-2">{namaOpd}</td>
                                  </tr>
                                  <tr>
                                    <td className="border p-2 font-semibold text-foreground w-24">Kode OPD</td>
                                    <td className="border p-2">{kodeOpd}</td>
                                  </tr>
                                  {tujuanOpd.map((tujuan) => (
                                    <React.Fragment key={tujuan.id}>
                                      <tr>
                                        <td className="border p-2 font-semibold text-foreground w-24">Tujuan OPD</td>
                                        <td className="border p-2 font-medium">{tujuan.tujuan}</td>
                                      </tr>
                                      {tujuan.indikator.map((ind, iIdx) => (
                                        <React.Fragment key={iIdx}>
                                          <tr>
                                            <td className="border p-2 font-semibold text-foreground w-24">Indikator</td>
                                            <td className="border p-2">{ind.indikator}</td>
                                          </tr>
                                          <tr>
                                            <td className="border p-2 font-semibold text-foreground">Target/Satuan</td>
                                            <td className="border p-2">
                                              {ind.targets[0]?.target ?? '-'} / {ind.targets[0]?.satuan ?? '-'}
                                            </td>
                                          </tr>
                                        </React.Fragment>
                                      ))}
                                    </React.Fragment>
                                  ))}
                                  <tr>
                                    <td className="border p-2 font-semibold text-foreground w-24">Tahun</td>
                                    <td className="border p-2">{tahun}</td>
                                  </tr>
                                </tbody>
                              </table>

                              {/* Action Buttons */}
                              <div className="flex flex-col gap-3 my-4 hide-on-capture text-xs">
                                <button
                                  type="button"
                                  onClick={() => setShowTujuanModal(true)}
                                  className="w-full px-2 py-2 whitespace-nowrap flex justify-center rounded-md items-center bg-card border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                                >
                                  <IconAdd /> Tambah Tujuan OPD
                                </button>

                                <button
                                  type="button"
                                  className="w-full px-3 py-2 flex justify-center items-center whitespace-nowrap bg-gradient-to-r from-[#08C2FF] to-[#006BFF] hover:from-[#0584AD] hover:to-[#014CB2] text-white rounded-md transition-all shadow-sm"
                                >
                                  <IconCetak />
                                  <span className="font-semibold">Cetak Penuh Pohon Kinerja</span>
                                </button>

                                <div className="flex gap-3">
                                  <button
                                    type="button"
                                    onClick={handleToggleExpandAll}
                                    className="flex-1 px-2 py-2 whitespace-nowrap flex justify-center rounded-md items-center bg-card border-2 border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors"
                                  >
                                    {expandAll ? <IconEyeOff /> : <IconEye />}
                                    <span className="font-semibold">{expandAll ? 'Sembunyikan Semua' : 'Tampilkan'}</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setAddModalInfo({ nextLevel: 4, nextJenis: 'Strategic Pemda', label: 'Strategic Pemda' })}
                                    className="flex-1 px-2 py-2 whitespace-nowrap flex justify-center rounded-md items-center bg-card border-2 border-destructive text-destructive hover:bg-destructive hover:text-white transition-colors"
                                  >
                                    <IconAdd />
                                    <span className="font-semibold">Strategic</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Spinner saat menambahkan child */}
                          {isAddingChild && (
                            <ul>
                              <li>
                                <div className="tf-nc tf rounded-lg shadow-lg border-border min-w-[384px] max-w-sm relative" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '120px' }}>
                                  <div className="flex flex-col items-center gap-2">
                                    <Loader2 className="size-8 animate-spin text-muted-foreground" />
                                    <p className="text-xs text-muted-foreground">Menambahkan data...</p>
                                  </div>
                                </div>
                              </li>
                            </ul>
                          )}

                          {/* Tree Children & Add form */}
                          {!isAddingChild && (expandAll || addModalInfo) && (pohonData.length > 0 || addModalInfo) && (
                            <ul>
                              {expandAll && pohonData.map((node) => (
                                <PohonNode
                                  key={node.id}
                                  node={node}
                                  onTreeRefresh={fetchPohonData}
                                  onDeleteAction={handleDeleteNode}
                                  isRoot
                                />
                              ))}

                              {addModalInfo && (
                                <li ref={(el) => {
                                  if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' }), 100);
                                }}>
                                  <div className="tf-nc" style={{ padding: 0, border: 'none', background: 'transparent' }}>
                                    <FormAddChildModal
                                      parentId={0}
                                      childInfo={addModalInfo}
                                      onCancel={() => setAddModalInfo(null)}
                                      onSuccess={() => {
                                        setAddModalInfo(null);
                                        setIsAddingChild(true);
                                        setTimeout(() => {
                                          setIsAddingChild(false);
                                          setExpandAll(true);
                                          fetchPohonData();
                                        }, 500);
                                      }}
                                    />
                                  </div>
                                </li>
                              )}
                            </ul>
                          )}
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
        {showTujuanModal && (
          <AddTujuanOpdModal
            kodeOpd={kodeOpd}
            onCancel={() => setShowTujuanModal(false)}
            onSuccess={() => {
              setShowTujuanModal(false);
              fetchPohonData();
            }}
          />
        )}
      </div>
    </>
  );
}
