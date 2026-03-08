'use client';

import React, { useState, useEffect } from 'react';
import type { PohonKinerja, PohonIndikator } from '@/types/PohonPemda';
import { getChildInfo, getPohonStyle, getHeaderStyle, type ChildInfo } from '../_utils';
import { FormAddChildModal } from './modals/AddModal';
import { FormEditNode } from './modals/EditModal';
import { IconAdd, IconCetak, IconDelete, IconEdit, IconEye, IconEyeOff } from '@/components/ui/icons';
import { Loader2 } from 'lucide-react';

interface PohonNodeProps {
  node: PohonKinerja;
  onTreeRefresh?: () => void;
  onDeleteAction?: (nodeId: number) => void;
  isRoot?: boolean;
}

const getButtonColor = (jenisPohon: string) => {
  if (jenisPohon === 'Strategic Pemda')
    return 'border-primary text-primary hover:bg-primary hover:text-primary-foreground';
  if (jenisPohon === 'Super Sub Tematik')
    return 'border-destructive text-destructive hover:bg-destructive hover:text-white';
  return 'border-green-600 text-green-600 hover:bg-green-600 hover:text-white';
};

const PohonNode: React.FC<PohonNodeProps> = ({
  node,
  onTreeRefresh,
  onDeleteAction,
  isRoot = false,
}) => {
  const [nodeData, setNodeData] = useState(node);
  const styles = getPohonStyle(nodeData.level_pohon);
  const childInfo = getChildInfo(nodeData.level_pohon);
  const hasChildren = nodeData.childs && nodeData.childs.length > 0;

  const [isExpanded, setIsExpanded] = useState(false);
  const [addModalInfo, setAddModalInfo] = useState<ChildInfo | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [isAddingChild, setIsAddingChild] = useState(false);

  useEffect(() => {
    setNodeData(node);
  }, [node]);

  const handleToggleExpand = () => setIsExpanded(!isExpanded);

  const getLabelTampilkan = () => {
    if (isExpanded) return isRoot ? 'Sembunyikan Anak' : 'Sembunyikan';
    return isRoot ? 'Tampilkan Anak' : 'Tampilkan';
  };

  return (
    <li>
      {isEditLoading ? (
        <div className="tf-nc tf rounded-lg shadow-lg border-border max-w-sm min-w-[384px] relative" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Memuat form edit...</p>
          </div>
        </div>
      ) : isEditing ? (
        <div className="tf-nc" style={{ padding: 0, border: 'none', background: 'transparent' }}>
          <FormEditNode
            node={nodeData}
            onCancel={() => setIsEditing(false)}
            onSuccess={(updatedNode) => {
              setNodeData({ ...updatedNode, childs: nodeData.childs });
              setIsEditing(false);
            }}
          />
        </div>
      ) : (
        <div
          className={`tf-nc tf flex flex-col rounded-lg shadow-lg ${styles.card} min-w-[384px] max-w-sm relative`}
        >
          {/* Header */}
          <div
            className={`flex flex-col rounded-lg shadow-sm mb-2 border p-3 ${styles.header} ${getHeaderStyle(nodeData.jenis_pohon)}`}
          >
            <span className="text-xs text-center font-bold uppercase">
              {nodeData.jenis_pohon} - {nodeData.id}
            </span>
          </div>

          {/* Body */}
          <div className="bg-card p-2 rounded-b-lg">
            <table className="w-full border-collapse text-xs">
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold text-foreground w-24">Nama Pohon</td>
                  <td className="border p-2">{nodeData.nama_pohon}</td>
                </tr>
                {nodeData.indikator && nodeData.indikator.length > 0 ? (
                  nodeData.indikator.map((ind: PohonIndikator, idx: number) => (
                    <React.Fragment key={ind.id_indikator ?? idx}>
                      <tr>
                        <td className="border p-2 font-semibold text-foreground w-24">
                          Indikator {idx + 1}
                        </td>
                        <td className="border p-2">
                          <div
                            className={`${styles.badge} inline-block px-2 py-1 rounded text-[10px]`}
                          >
                            {ind.nama_indikator}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="border p-2 font-semibold text-foreground">Target/Satuan</td>
                        <td className="border p-2">
                          {ind.targets?.map((t, tIdx) => (
                            <div key={t.id_target ?? tIdx}>
                              {t.target}/{t.satuan}
                            </div>
                          ))}
                        </td>
                      </tr>
                      <tr>
                        <td className="border p-2 font-semibold text-foreground w-24">Keterangan</td>
                        <td className="border p-2">
                          {nodeData.keterangan || (
                            <span className="text-muted-foreground/50 italic">-</span>
                          )}
                        </td>
                      </tr>
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td className="border p-2 font-semibold text-muted-foreground">Indikator</td>
                    <td className="border p-2 text-muted-foreground/50 italic">-</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Action buttons */}
            <div className="flex-wrap">
              <div className="flex gap-3 justify-evenly my-4 hide-on-capture text-xs">
                {/* TOMBOL EDIT BARU */}
                <button
                  onClick={() => {
                    setIsEditLoading(true);
                    setTimeout(() => {
                      setIsEditLoading(false);
                      setIsEditing(true);
                    }, 300);
                  }}
                  className="px-3 py-1 flex justify-center items-center whitespace-nowrap border-2 border-[#3072D6] text-[#3072D6] hover:bg-[#3072D6] hover:text-white rounded-md transition-colors"
                >
                  <IconEdit /> Edit
                </button>

                {/* TOMBOL CETAK BARU */}
                <button className="px-3 py-1 flex justify-center items-center whitespace-nowrap bg-gradient-to-r from-[#08C2FF] to-[#006BFF] hover:from-[#0584AD] hover:to-[#014CB2] text-white rounded-md transition-all shadow-sm">
                  <IconCetak />
                  <span className="font-semibold">Cetak</span>
                </button>

                {/* Tombol Hapus tetap sama */}
                <button
                  onClick={() => onDeleteAction && onDeleteAction(nodeData.id)}
                  className="px-2 py-1 whitespace-nowrap flex justify-center items-center border-2 border-destructive hover:bg-destructive text-destructive hover:text-white rounded-md transition-colors"
                >
                  <IconDelete /> Hapus
                </button>
              </div>

              <div className="flex gap-3 justify-evenly my-4 hide-on-capture text-xs">
                {childInfo && (
                  <button
                    onClick={() => setAddModalInfo(childInfo)}
                    className={`px-2 py-1 whitespace-nowrap flex justify-center rounded-md items-center bg-card border-2 transition-colors hover:text-white ${getButtonColor(nodeData.jenis_pohon)}`}
                  >
                    <IconAdd />
                    {childInfo.label}
                  </button>
                )}
                {nodeData.level_pohon < 3 && (
                  <button
                    onClick={() => setAddModalInfo({ nextLevel: 4, nextJenis: 'Strategic Pemda', label: 'Strategic Pemda' })}
                    className="px-2 py-1 whitespace-nowrap flex justify-center rounded-md items-center bg-card border-2 border-destructive text-destructive hover:bg-destructive hover:text-white transition-colors"
                  >
                    <IconAdd />
                    Strategic Pemda
                  </button>
                )}
              </div>

              <div className="flex gap-3 justify-evenly my-4 hide-on-capture text-xs">
                {hasChildren && (
                  <button
                    onClick={handleToggleExpand}
                    className="px-2 py-1 whitespace-nowrap flex justify-center rounded-md items-center bg-card border-2 border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors"
                  >
                    {isExpanded ? <IconEyeOff /> : <IconEye />}
                    <span className="font-semibold">{getLabelTampilkan()}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spinner saat menambahkan child */}
      {isAddingChild && (
        <ul>
          <li>
            <div className="tf-nc tf rounded-lg shadow-lg border-border max-w-sm min-w-[320px] relative" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '120px' }}>
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="size-8 animate-spin text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Menambahkan data...</p>
              </div>
            </div>
          </li>
        </ul>
      )}

      {/* Children & Add form */}
      {!isAddingChild && (isExpanded || addModalInfo) && (hasChildren || addModalInfo) && (
        <ul>
          {isExpanded &&
            hasChildren &&
            nodeData.childs!.map((child) => (
              <PohonNode
                key={child.id}
                node={child}
                onTreeRefresh={onTreeRefresh}
                onDeleteAction={onDeleteAction}
                isRoot={false}
              />
            ))}

          {addModalInfo && (
            <li ref={(el) => {
              if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' }), 100);
            }}>
              <div
                className="tf-nc"
                style={{ padding: 0, border: 'none', background: 'transparent' }}
              >
                <FormAddChildModal
                  parentId={nodeData.id}
                  childInfo={addModalInfo}
                  onCancel={() => setAddModalInfo(null)}
                  onSuccess={(newNode) => {
                    setAddModalInfo(null);
                    setIsAddingChild(true);
                    setTimeout(() => {
                      setNodeData((prev) => ({
                        ...prev,
                        childs: [...(prev.childs || []), newNode],
                      }));
                      setIsExpanded(true);
                      setIsAddingChild(false);
                    }, 500);
                  }}
                />
              </div>
            </li>
          )}
        </ul>
      )}
    </li>
  );
};

export default PohonNode;
