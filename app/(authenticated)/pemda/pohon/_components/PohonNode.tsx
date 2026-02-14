'use client';

import React, { useState } from 'react';
import type { PohonKinerja, PohonIndikator } from '@/types/pohon';
import { getChildInfo, getPohonStyle, getHeaderStyle } from '../_utils';
import { FormAddChildModal } from './modals/AddModal';
import { FormEditNode } from './modals/EditModal';

interface PohonNodeProps {
  node: PohonKinerja;
  onTreeRefresh?: () => void;
  onDeleteAction?: (nodeId: number) => void;
  isRoot?: boolean;
}

const getButtonColor = (jenisPohon: string) => {
  const jp = jenisPohon.toUpperCase().replace(/\s+/g, '_');
  if (jp === 'STRATEGIC_PEMDA')
    return 'border-primary text-primary hover:bg-primary hover:text-primary-foreground';
  if (jp === 'SUPER_SUB_TEMATIK')
    return 'border-destructive text-destructive hover:bg-destructive hover:text-white';
  return 'border-green-600 text-green-600 hover:bg-green-600 hover:text-white';
};

const IconAdd = () => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="mr-1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
    <path d="M9 12h6" />
    <path d="M12 9v6" />
  </svg>
);
const IconEdit = () => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="mr-1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
    <path d="M13.5 6.5l4 4" />
  </svg>
);
const IconDelete = () => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="mr-1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);
const IconCetak = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 w-3.5 h-3.5">
    <path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2" />
    <path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4" />
    <path d="M7 13m0 2a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-6a2 2 0 0 1 -2 -2z" />
  </svg>
);
const IconEye = () => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="mr-1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
    <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
  </svg>
);
const IconEyeOff = () => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="mr-1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.585 10.587a2 2 0 0 0 2.829 2.828" />
    <path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87" />
    <path d="M3 3l18 18" />
  </svg>
);

const PohonNode: React.FC<PohonNodeProps> = ({
  node,
  onTreeRefresh,
  onDeleteAction,
  isRoot = false,
}) => {
  const styles = getPohonStyle(node.level_pohon);
  const childInfo = getChildInfo(node.level_pohon);
  const hasChildren = node.childs && node.childs.length > 0;

  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleToggleExpand = () => setIsExpanded(!isExpanded);

  const getLabelTampilkan = () => {
    if (isExpanded) return isRoot ? 'Sembunyikan Anak' : 'Sembunyikan';
    return isRoot ? 'Tampilkan Anak' : 'Tampilkan';
  };

  return (
    <li>
      {isEditing ? (
        <div className="tf-nc" style={{ padding: 0, border: 'none', background: 'transparent' }}>
          <FormEditNode
            node={node}
            onCancel={() => setIsEditing(false)}
            onSuccess={() => {
              setIsEditing(false);
              if (onTreeRefresh) onTreeRefresh();
            }}
          />
        </div>
      ) : (
        <div
          className={`tf-nc tf flex flex-col rounded-lg shadow-lg ${styles.card} max-w-sm relative`}
        >
          {/* Header */}
          <div
            className={`flex flex-col rounded-lg shadow-sm mb-2 border p-3 ${styles.header} ${getHeaderStyle(node.jenis_pohon)}`}
          >
            <span className="text-xs text-center font-bold uppercase">
              {node.jenis_pohon} - {node.id}
            </span>
          </div>

          {/* Body */}
          <div className="bg-card p-2 rounded-b-lg">
            <table className="w-full border-collapse text-xs">
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold text-foreground w-24">Tema</td>
                  <td className="border p-2">{node.tema}</td>
                </tr>
                {node.indikator && node.indikator.length > 0 ? (
                  node.indikator.map((ind: PohonIndikator, idx: number) => (
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
                          {node.keterangan || (
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
                  onClick={() => setIsEditing(true)}
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
                  onClick={() => onDeleteAction && onDeleteAction(node.id)}
                  className="px-2 py-1 whitespace-nowrap flex justify-center items-center border-2 border-destructive hover:bg-destructive text-destructive hover:text-white rounded-md transition-colors"
                >
                  <IconDelete /> Hapus
                </button>
              </div>

              <div className="flex gap-3 justify-evenly my-4 hide-on-capture text-xs">
                {childInfo && (
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className={`px-2 py-1 whitespace-nowrap flex justify-center rounded-md items-center bg-card border-2 transition-colors hover:text-white ${getButtonColor(node.jenis_pohon)}`}
                  >
                    <IconAdd />
                    {childInfo.label}
                  </button>
                )}
                {node.level_pohon < 3 && (
                  <button
                    onClick={() => setIsAddModalOpen(true)}
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

      {/* Children & Add form */}
      {(isExpanded || isAddModalOpen) && (hasChildren || isAddModalOpen) && (
        <ul>
          {isExpanded &&
            hasChildren &&
            node.childs!.map((child) => (
              <PohonNode
                key={child.id}
                node={child}
                onTreeRefresh={onTreeRefresh}
                onDeleteAction={onDeleteAction}
                isRoot={false}
              />
            ))}

          {isAddModalOpen && childInfo && (
            <li>
              <div
                className="tf-nc"
                style={{ padding: 0, border: 'none', background: 'transparent' }}
              >
                <FormAddChildModal
                  parentId={node.id}
                  childInfo={childInfo}
                  onCancel={() => setIsAddModalOpen(false)}
                  onSuccess={() => {
                    setIsAddModalOpen(false);
                    if (onTreeRefresh) onTreeRefresh();
                    else window.location.reload();
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
